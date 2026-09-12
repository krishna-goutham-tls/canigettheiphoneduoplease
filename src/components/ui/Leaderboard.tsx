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

function BoardColumn({
  rows,
  start,
}: {
  rows: Slot[]
  start: number
}) {
  const inspect = useAuction((s) => s.inspect)
  const hover = useAuction((s) => s.hover)
  const hoveredId = useAuction((s) => s.hoveredId)

  return (
    <ol className="w-full max-w-[200px]">
      {rows.map((slot, i) => {
        const occupied = Boolean(slot.holder)
        const on = hoveredId === slot.id
        const price = occupied ? slot.bidUsd : minBidUsd(slot.id, slot.bidUsd, false)
        return (
          <li key={slot.id}>
            <button
              type="button"
              onClick={() => inspect(slot.id)}
              onMouseEnter={() => hover(slot.id)}
              onMouseLeave={() => hover(null)}
              className={`flex w-full items-center gap-2 rounded-xl px-1.5 py-1.5 text-left ${
                on ? 'bg-paper' : ''
              }`}
            >
              <span className="w-4 shrink-0 text-[11px] text-muted">{start + i}</span>
              {occupied ? (
                <img
                  src={slot.holder!.logoDataUrl}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-paper text-[13px] text-muted">
                  +
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                {occupied ? slot.holder!.name : slotShort(slot.id)}
              </span>
              <span className="shrink-0 text-[12px] text-muted">{formatUsd(price)}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export function Leaderboard({ side }: { side: 'left' | 'right' }) {
  const slots = useAuction((s) => s.slots)
  const ranked = rankSlots(slots)
  const rows = side === 'left' ? ranked.slice(0, 5) : ranked.slice(5, 10)
  const start = side === 'left' ? 1 : 6

  return (
    <aside className="hidden w-[200px] shrink-0 lg:block">
      <BoardColumn rows={rows} start={start} />
    </aside>
  )
}

export function LeaderboardMobile() {
  const slots = useAuction((s) => s.slots)
  const ranked = rankSlots(slots)

  return (
    <div className="flex w-full justify-center gap-3 lg:hidden">
      <BoardColumn rows={ranked.slice(0, 5)} start={1} />
      <BoardColumn rows={ranked.slice(5, 10)} start={6} />
    </div>
  )
}
