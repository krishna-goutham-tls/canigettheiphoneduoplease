import { formatUsd, GOAL_USD } from '../../lib/money'
import { useAuction } from '../../store/auction'
import { Wordmark } from './Wordmark'

export function LocalNav() {
  const raisedUsd = useAuction((s) => s.raisedUsd)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[48px] max-w-[980px] items-center justify-between gap-3 px-5 py-2">
        <Wordmark />
        <div className="flex items-center gap-3">
          <p className="text-[12px] text-muted">
            {formatUsd(raisedUsd)} of {formatUsd(GOAL_USD)}
          </p>
        </div>
      </div>
    </header>
  )
}
