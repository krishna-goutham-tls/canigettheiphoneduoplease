import { formatUsd, slotShort } from '../../lib/money'
import { useAuction } from '../../store/auction'

export function Alumni() {
  const events = useAuction((s) => s.events)
  return (
    <section className="mx-auto max-w-[980px] px-5 py-20 md:px-8 md:py-28">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">Alumni</p>
      <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-ink md:text-[40px]">
        Everyone who chipped in stays in the yearbook.
      </h2>
      <ol className="mt-10 divide-y divide-line border-y border-line">
        {events.map((e) => (
          <li key={e.id} className="flex items-baseline justify-between gap-4 py-4">
            <div>
              <p className="text-[17px] text-ink">{e.name}</p>
              <p className="text-[12px] text-muted">
                {e.kind} · {slotShort(e.slotId)}
              </p>
            </div>
            <p className="text-[17px] text-ink">{formatUsd(e.amountUsd)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
