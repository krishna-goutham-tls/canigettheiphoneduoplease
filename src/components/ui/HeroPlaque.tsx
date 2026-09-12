import { useAuction } from '../../store/auction'
import { ProgressBar } from './ProgressBar'
import { WhoIsThis } from './WhoIsThis'

export function HeroPlaque() {
  const openClaim = useAuction((s) => s.openClaim)
  const slots = useAuction((s) => s.slots)
  const firstEmpty = slots.find((s) => !s.holder)

  return (
    <div className="mx-auto max-w-[640px]">
      <h1 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.022em] text-ink sm:text-[34px] md:text-[44px]">
        help me buy the iPhone Duo.
      </h1>
      <p className="mx-auto mt-3 max-w-[34ch] text-[15px] leading-relaxed text-muted md:text-[17px]">
        a tiny ad on a very expensive phone.
      </p>
      <div className="mt-5">
        <ProgressBar />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <button
          type="button"
          className="btn-apple"
          onClick={() => openClaim(firstEmpty?.id ?? 'grid-0')}
        >
          put your logo on it
        </button>
        <WhoIsThis />
      </div>
    </div>
  )
}
