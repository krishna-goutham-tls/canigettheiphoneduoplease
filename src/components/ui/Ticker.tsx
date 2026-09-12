import { formatUsd, slotShort } from '../../lib/money'
import { useAuction } from '../../store/auction'

export function Ticker() {
  const events = useAuction((s) => s.events)
  const line =
    events.length === 0
      ? 'Sixteen empty slots. First claim is $11.'
      : events
          .slice(0, 12)
          .map((e) => {
            const verb = e.kind === 'outbid' ? 'took' : e.kind === 'raise' ? 'raised' : 'claimed'
            return `${e.name} ${verb} ${slotShort(e.slotId)} · ${formatUsd(e.amountUsd)}`
          })
          .join('     ·     ')

  return (
    <div className="relative z-20 overflow-hidden border-b border-paper/10 bg-void/80 text-[11px] tracking-[0.18em] text-fog uppercase">
      <div className="ticker-track flex w-max gap-16 py-2.5 pl-8">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}
