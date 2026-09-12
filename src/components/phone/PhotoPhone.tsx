import { formatUsd, minBidUsd } from '../../lib/money'
import { useAuction } from '../../store/auction'
import { HERO_SPOTS } from './hotspots'

export function PhotoPhone() {
  const slots = useAuction((s) => s.slots)
  const inspect = useAuction((s) => s.inspect)
  const hover = useAuction((s) => s.hover)
  const hoveredId = useAuction((s) => s.hoveredId)

  return (
    <div className="flex justify-center px-2 lg:px-0">
      <div className="relative w-full max-w-[920px]">
        <img
          src="/hero-image.png"
          alt="Open Duo"
          className="block h-auto w-full select-none"
          draggable={false}
        />
        <div className="absolute inset-0">
          {HERO_SPOTS.map((spot) => {
            const slot = slots.find((s) => s.id === spot.id)
            if (!slot) return null
            const occupied = Boolean(slot.holder)
            const on = hoveredId === spot.id
            const next = minBidUsd(slot.id, slot.bidUsd, occupied)
            const label = occupied
              ? `${slot.holder?.name} · ${formatUsd(slot.bidUsd)} · outbid ${formatUsd(next)}`
              : `Claim ${spot.id} · ${formatUsd(next)}`
            return (
              <button
                key={spot.id}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => inspect(spot.id)}
                onMouseEnter={() => hover(spot.id)}
                onMouseLeave={() => hover(null)}
                className={`absolute overflow-hidden transition-[box-shadow] duration-150 ${
                  on ? 'z-10 ring-2 ring-white' : ''
                }`}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${spot.w}%`,
                  height: `${spot.h}%`,
                  borderRadius: spot.r,
                }}
              >
                {occupied ? (
                  <img
                    src={slot.holder!.logoDataUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
