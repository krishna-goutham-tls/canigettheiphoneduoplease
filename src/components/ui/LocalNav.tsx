import { formatUsd, GOAL_USD } from '../../lib/money'
import { useAuction } from '../../store/auction'

export function LocalNav() {
  const raisedUsd = useAuction((s) => s.raisedUsd)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[48px] max-w-[980px] items-center justify-between px-5">
        <a href="#top" className="text-[17px] font-semibold tracking-tight text-ink">
          Plusfold
        </a>
        <p className="text-[12px] text-muted">
          {formatUsd(raisedUsd)} of {formatUsd(GOAL_USD)}
        </p>
      </div>
    </header>
  )
}
