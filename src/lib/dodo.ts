import type { BidDraft } from '../types'

const PENDING_KEY = 'buy-my-duo-pending-bid'
const DB_NAME = 'buy-my-duo'
const STORE = 'pending'

export function dodoCheckoutUrl() {
  return import.meta.env.VITE_DODO_CHECKOUT_URL as string | undefined
}

export function dodoIsLive() {
  return Boolean(dodoCheckoutUrl())
}

export function dodoIsTest() {
  return (dodoCheckoutUrl() ?? '').includes('test.checkout')
}

type PendingBid = {
  slotId: string
  draft: BidDraft
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function stashPendingBid(slotId: string, draft: BidDraft) {
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.objectStore(STORE).put({ slotId, draft }, PENDING_KEY)
    })
  } finally {
    db.close()
  }
}

function takeSessionPending(): PendingBid | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    sessionStorage.removeItem(PENDING_KEY)
    return JSON.parse(raw) as PendingBid
  } catch {
    return null
  }
}

export async function takePendingBid(): Promise<PendingBid | null> {
  try {
    const db = await openDb()
    try {
      const pending = await new Promise<PendingBid | null>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite')
        const store = tx.objectStore(STORE)
        const get = store.get(PENDING_KEY)
        get.onsuccess = () => resolve((get.result as PendingBid | undefined) ?? null)
        get.onerror = () => reject(get.error)
        store.delete(PENDING_KEY)
      })
      if (pending) return pending
    } finally {
      db.close()
    }
  } catch {
    // fall through to sessionStorage from the first Pay click
  }
  return takeSessionPending()
}

export function checkoutHref(amountUsd: number, slotId: string) {
  const url = dodoCheckoutUrl()
  if (!url) return null
  const target = new URL(url)
  target.searchParams.set('quantity', '1')
  target.searchParams.set('paymentAmount', String(amountUsd))
  target.searchParams.set('paymentCurrency', 'USD')
  target.searchParams.set('metadata_slot', slotId)
  target.searchParams.set('redirect_url', `${window.location.origin}/`)
  return target.toString()
}

export function startCheckout(amountUsd: number, slotId: string) {
  const href = checkoutHref(amountUsd, slotId)
  if (!href) {
    return { ok: true, demo: true, redirected: false, href: null }
  }
  window.location.assign(href)
  return { ok: false, demo: false, redirected: true, href }
}
