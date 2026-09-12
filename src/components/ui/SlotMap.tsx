import { faceLabel, formatUsd, minBidUsd } from '../../lib/money'
import { useAuction } from '../../store/auction'
import type { FaceId } from '../../types'

const FACES: FaceId[] = ['widget', 'grid']

export function SlotMap() {
  const slots = useAuction((s) => s.slots)
  const inspect = useAuction((s) => s.inspect)
  const hover = useAuction((s) => s.hover)

  return (
    <section className="mx-auto max-w-[980px] px-5 py-20 md:px-8 md:py-28">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-muted">every spot</p>
      <h2 className="mt-3 max-w-xl text-[32px] font-semibold tracking-[-0.02em] text-ink md:text-[40px]">
        the whole home screen.
      </h2>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {FACES.map((face) => (
          <div key={face}>
            <p className="mb-3 text-[12px] text-muted">{faceLabel(face)}</p>
            <div className="grid grid-cols-3 gap-3">
              {slots
                .filter((s) => s.face === face)
                .map((slot) => {
                  const min = minBidUsd(slot.id, slot.bidUsd, Boolean(slot.holder))
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onMouseEnter={() => hover(slot.id)}
                      onMouseLeave={() => hover(null)}
                      onClick={() => inspect(slot.id)}
                      className="aspect-square overflow-hidden rounded-[22px] bg-white text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                    >
                      {slot.holder ? (
                        <div className="relative h-full">
                          <img
                            src={slot.holder.logoDataUrl}
                            alt={slot.holder.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] text-white">
                            {formatUsd(slot.bidUsd)} · outbid {formatUsd(min)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1 text-link-dark">
                          <span className="text-2xl leading-none">+</span>
                          <span className="text-[11px]">{formatUsd(min)}</span>
                        </div>
                      )}
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
