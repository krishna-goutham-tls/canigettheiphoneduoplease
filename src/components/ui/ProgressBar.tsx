import { formatUsd, GOAL_USD } from '../../lib/money'
import { useAuction } from '../../store/auction'

export function ProgressBar() {
  const raisedUsd = useAuction((s) => s.raisedUsd)
  const pct = Math.min(100, (raisedUsd / GOAL_USD) * 100)

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="h-[3px] overflow-hidden rounded-full bg-fill">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-[12px] text-muted">
        {formatUsd(raisedUsd)} of {formatUsd(GOAL_USD)}
      </p>
    </div>
  )
}
