import type { Colorway } from '../../types'
import { useAuction } from '../../store/auction'

export function FaceBar() {
  const color = useAuction((s) => s.color)
  const setColor = useAuction((s) => s.setColor)

  return (
    <div className="flex justify-center gap-6 text-[12px]">
      {(['night', 'star'] as Colorway[]).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setColor(c)}
          className={color === c ? 'text-ink' : 'text-muted'}
        >
          {c === 'night' ? 'Night Sky' : 'Star White'}
        </button>
      ))}
    </div>
  )
}
