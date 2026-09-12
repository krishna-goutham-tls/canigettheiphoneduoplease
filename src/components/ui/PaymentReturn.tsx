import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { takePendingBid } from '../../lib/dodo'

export function PaymentReturn() {
  const placeBid = useMutation(api.auction.placeBid)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const paymentId = params.get('payment_id')
    if (!status && !paymentId) return

    const next = new URL(window.location.href)
    next.searchParams.delete('status')
    next.searchParams.delete('payment_id')
    next.searchParams.delete('email')
    window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`)

    if (status !== 'succeeded') return

    void (async () => {
      const pending = await takePendingBid()
      if (!pending) return
      await placeBid({
        slotId: pending.slotId,
        name: pending.draft.name,
        url: pending.draft.url,
        logoDataUrl: pending.draft.logoDataUrl,
        amountUsd: pending.draft.amountUsd,
      })
    })()
  }, [placeBid])

  return null
}
