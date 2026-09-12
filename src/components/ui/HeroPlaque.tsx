import { useAuction } from '../../store/auction'
import { ProgressBar } from './ProgressBar'

export function HeroPlaque() {
  const openClaim = useAuction((s) => s.openClaim)
  const slots = useAuction((s) => s.slots)
  const firstEmpty = slots.find((s) => !s.holder)

  return (
    <div className="mx-auto max-w-[640px] text-center">
      <h1 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.022em] text-ink sm:text-[34px] md:text-[44px]">
        help me buy the iPhone Duo.
      </h1>
      <p className="mx-auto mt-3 max-w-[34ch] text-[15px] leading-relaxed text-muted md:mt-4 md:text-[17px]">
        a tiny ad on a very expensive phone.
      </p>
      <div className="mt-6 md:mt-7">
        <ProgressBar />
      </div>
      <div className="mt-6 flex justify-center md:mt-7">
        <button
          type="button"
          className="btn-apple"
          onClick={() => openClaim(firstEmpty?.id ?? 'grid-0')}
        >
          put your logo on it
        </button>
      </div>
    </div>
  )
}
