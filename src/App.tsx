import { PhotoPhone } from './components/phone/PhotoPhone'
import { Alumni } from './components/ui/Alumni'
import { BidSheet } from './components/ui/BidSheet'
import { HeroPlaque } from './components/ui/HeroPlaque'
import { Leaderboard, LeaderboardMobile } from './components/ui/Leaderboard'
import { WhoIsThis } from './components/ui/WhoIsThis'
import { LocalNav } from './components/ui/LocalNav'
import { PaymentReturn } from './components/ui/PaymentReturn'
import { Rules } from './components/ui/Rules'
import { AuctionSync } from './store/AuctionSync'
import { SlotMap } from './components/ui/SlotMap'
import { formatUsd, GOAL_USD } from './lib/money'

export default function App() {
  return (
    <div id="top" className="min-h-dvh bg-white text-ink">
      <AuctionSync />
      <PaymentReturn />
      <div className="flex min-h-dvh flex-col bg-white">
        <LocalNav />
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="px-5 pb-5 pt-6 text-center sm:px-8 sm:pb-6 sm:pt-8 lg:hidden">
            <HeroPlaque />
          </div>
          <div className="min-w-0 lg:hidden">
            <PhotoPhone />
          </div>
          <div className="flex flex-col gap-6 px-5 pb-8 pt-5 lg:hidden">
            <div className="flex justify-center">
              <WhoIsThis showNote />
            </div>
            <LeaderboardMobile />
          </div>

          <div
            id="slots"
            className="mx-auto hidden w-full max-w-[1280px] flex-1 grid-cols-[200px_minmax(0,1fr)_240px] items-start gap-x-6 px-8 pt-8 pb-10 lg:grid"
          >
            <Leaderboard />
            <div className="min-w-0">
              <HeroPlaque />
              <div className="mt-8">
                <PhotoPhone />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <WhoIsThis showNote />
            </div>
          </div>
        </section>
      </div>

      <div className="bg-paper text-ink">
        <SlotMap />
        <Rules />
        <Alumni />
        <footer className="border-t border-line px-5 py-8 text-[12px] text-muted md:px-10">
          a small internet stunt for a large apple bill. {formatUsd(GOAL_USD)}. not affiliated with
          Apple. iPhone Duo is a trademark of Apple Inc.
        </footer>
      </div>
      <BidSheet />
    </div>
  )
}
