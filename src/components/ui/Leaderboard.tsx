import { formatUsd, minBidUsd, slotShort } from '../../lib/money'
import { useAuction } from '../../store/auction'
import type { Slot } from '../../types'

function rankSlots(slots: Slot[]) {
  return [...slots].sort((a, b) => {
    const aOn = a.holder ? 1 : 0
    const bOn = b.holder ? 1 : 0
    if (aOn !== bOn) return bOn - aOn
    if (a.holder && b.holder) return b.bidUsd - a.bidUsd
    return minBidUsd(b.id, 0, false) - minBidUsd(a.id, 0, false)
  })
}

function Row({
  slot,
  rank,
}: {
  slot: Slot
  rank: number
}) {
  const inspect = useAuction((s) => s.inspect)
  const hover = useAuction((s) => s.hover)
  const hoveredId = useAuction((s) => s.hoveredId)
  const occupied = Boolean(slot.holder)
  const on = hoveredId === slot.id
  const price = occupied ? slot.bidUsd : minBidUsd(slot.id, slot.bidUsd, false)

  return (
    <button
      type="button"
      onClick={() => inspect(slot.id)}
      onMouseEnter={() => hover(slot.id)}
      onMouseLeave={() => hover(null)}
      className={`flex w-full items-center gap-1.5 rounded-lg px-1 py-1 text-left ${
        on ? 'bg-paper' : ''
      }`}
    >
      <span className="w-3.5 shrink-0 text-[10px] text-muted">{rank}</span>
      {occupied ? (
        <img src={slot.holder!.logoDataUrl} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-paper text-[12px] text-muted">
          +
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-[12px] text-ink">
        {occupied ? slot.holder!.name : slotShort(slot.id)}
      </span>
      <span className="shrink-0 text-[11px] text-muted">{formatUsd(price)}</span>
    </button>
  )
}

export function Leaderboard({ side }: { side: 'left' | 'right' }) {
  const slots = useAuction((s) => s.slots)
  const ranked = rankSlots(slots)
  const rows = side === 'left' ? ranked.slice(0, 5) : ranked.slice(5, 10)
  const start = side === 'left' ? 1 : 6

  return (
    <aside className="hidden w-[148px] shrink-0 lg:block">
      <ol>
        {rows.map((slot, i) => (
          <li key={slot.id}>
            <Row slot={slot} rank={start + i} />
          </li>
        ))}
      </ol>
    </aside>
  )
}

export function LeaderboardMobile() {
  const slots = useAuction((s) => s.slots)
  const ranked = rankSlots(slots).slice(0, 10)

  return (
    <div className="overflow-x-auto">
      <ol className="flex w-max gap-2">
        {ranked.map((slot, i) => (
          <li key={slot.id} className="w-[148px] shrink-0">
            <Row slot={slot} rank={i + 1} />
          </li>
        ))}
      </ol>
    </div>
  )
}
