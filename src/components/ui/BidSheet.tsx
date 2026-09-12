import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { dodoIsLive, dodoIsTest, stashPendingBid, startCheckout } from '../../lib/dodo'
import { formatUsd, minBidUsd, slotShort, STEP_USD } from '../../lib/money'
import { useAuction } from '../../store/auction'
import type { BidDraft } from '../../types'

function compactImage(dataUrl: string) {
  return new Promise<string>((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, 512 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      void compactImage(String(reader.result)).then(resolve)
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

export function BidSheet() {
  const open = useAuction((s) => s.sheetOpen)
  const activeId = useAuction((s) => s.activeId)
  const slots = useAuction((s) => s.slots)
  const closeSheet = useAuction((s) => s.closeSheet)
  const placeBid = useMutation(api.auction.placeBid)
  const slot = slots.find((s) => s.id === activeId)
  const occupied = Boolean(slot?.holder)
  const min = slot ? minBidUsd(slot.id, slot.bidUsd, occupied) : 11

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [logo, setLogo] = useState('')
  const [amount, setAmount] = useState(min)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open || !slot) return
    setName(occupied ? '' : (slot.holder?.name ?? ''))
    setUrl(occupied ? '' : (slot.holder?.url ?? ''))
    setLogo(occupied ? '' : (slot.holder?.logoDataUrl ?? ''))
    setAmount(min)
    setError('')
  }, [open, slot?.id, min, slot, occupied])

  const draft: BidDraft = useMemo(
    () => ({
      name,
      url,
      logoDataUrl: logo,
      amountUsd: amount,
    }),
    [name, url, logo, amount],
  )

  const slotId = slot?.id

  async function onPay() {
    if (!slotId) return
    setError('')
    if (!draft.name.trim()) {
      setError('Name the brand.')
      return
    }
    if (!draft.url.trim()) {
      setError('Add a URL.')
      return
    }
    if (!draft.logoDataUrl) {
      setError('Add a square logo.')
      return
    }
    if (draft.amountUsd < min || (draft.amountUsd - min) % STEP_USD !== 0) {
      setError(`Bid $${min} or more, in $${STEP_USD} steps.`)
      return
    }
    setBusy(true)
    try {
      if (dodoIsLive()) await stashPendingBid(slotId, draft)
      const checkout = startCheckout(amount, slotId)
      if (checkout.redirected) {
        window.setTimeout(() => {
          setBusy(false)
          setError('Checkout did not open. Refresh and try again.')
        }, 2500)
        return
      }
      const result = await placeBid({
        slotId,
        name: draft.name,
        url: draft.url,
        logoDataUrl: draft.logoDataUrl,
        amountUsd: draft.amountUsd,
      })
      setBusy(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      closeSheet()
    } catch {
      setBusy(false)
      setError('Could not start checkout.')
    }
  }

  if (!slot) return null

  const field =
    'mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-[17px] text-ink outline-none'
  const label = 'text-[12px] text-muted'
  const holderUrl = slot.holder?.url

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSheet}
        >
          <motion.form
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.42, 0, 0.58, 1] }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              void onPay()
            }}
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white text-ink md:rounded-[28px]"
          >
            <div className="flex flex-col gap-3 p-6">
              <p className="text-[12px] text-muted">{slotShort(slot.id)}</p>
              <p className="text-[28px] font-semibold tracking-[-0.02em]">
                {occupied ? `Take this from ${slot.holder?.name}` : 'Put your logo here'}
              </p>
              <p className="text-[15px] text-muted">
                {occupied
                  ? `They’re in for ${formatUsd(slot.bidUsd)}. ${formatUsd(min)} takes it. Then +$${STEP_USD}. No refunds.`
                  : `${formatUsd(min)} to start. Then +$${STEP_USD} if someone wants it more. No refunds.`}
              </p>
              {occupied && holderUrl ? (
                <a
                  href={holderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] text-link-dark underline"
                >
                  Visit {slot.holder?.name}
                </a>
              ) : null}
              <div className="mx-auto mt-2 aspect-square w-28 overflow-hidden rounded-[24px] bg-paper">
                {logo ? (
                  <img src={logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[12px] text-muted">Logo</div>
                )}
              </div>
              <label className={label}>
                Brand
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                  placeholder="Acme"
                />
              </label>
              <label className={label}>
                URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={field}
                  placeholder="https://"
                />
              </label>
              <label className={label}>
                Logo
                <span className="mt-1 flex cursor-pointer items-center justify-center rounded-xl border border-line bg-paper py-2 text-[13px] text-ink">
                  {logo ? 'Logo added' : 'Upload square'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) setLogo(await readFile(file))
                  }}
                />
              </label>
              <label className={label}>
                Bid (USD)
                <input
                  type="number"
                  min={min}
                  step={STEP_USD}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={field}
                />
                <span className="mt-1 block text-[11px] text-muted">
                  {formatUsd(min)} minimum. Then +${STEP_USD} steps.
                </span>
              </label>
              {!dodoIsLive() ? (
                <p className="text-[12px] text-muted">Dodo is not wired yet. This bid stays on this browser.</p>
              ) : dodoIsTest() ? (
                <p className="text-[12px] text-muted">Test checkout. No real charge.</p>
              ) : null}
              {error ? <p className="text-[14px] text-red-600">{error}</p> : null}
              <button type="submit" disabled={busy} className="btn-apple mt-1 w-full !py-3">
                Pay {formatUsd(amount)} · yours until someone wants it more
              </button>
              <button type="button" onClick={closeSheet} className="btn-apple-text !text-link-dark">
                Cancel
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
