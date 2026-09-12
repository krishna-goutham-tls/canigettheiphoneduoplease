import { PhotoPhone } from './components/phone/PhotoPhone'
import { Alumni } from './components/ui/Alumni'
import { BidSheet } from './components/ui/BidSheet'
import { HeroPlaque } from './components/ui/HeroPlaque'
import { Leaderboard, LeaderboardMobile } from './components/ui/Leaderboard'
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
      <LocalNav />

      <section className="flex flex-col bg-white">
        <div className="px-5 pb-3 pt-4 text-center sm:pt-6 md:px-8">
          <HeroPlaque />
        </div>
        <div
          id="slots"
          className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-4 px-4 pb-10 pt-1 sm:px-5 lg:grid-cols-[200px_minmax(0,1fr)_200px] lg:gap-6 lg:pb-16"
        >
          <Leaderboard side="left" />
          <div className="min-w-0">
            <PhotoPhone />
          </div>
          <Leaderboard side="right" />
          <div className="lg:hidden">
            <LeaderboardMobile />
          </div>
        </div>
      </section>

      <div className="bg-paper text-ink">
        <SlotMap />
        <Rules />
        <Alumni />
        <footer className="border-t border-line px-5 py-8 text-[12px] text-muted md:px-10">
          A small internet stunt for a large Apple bill. {formatUsd(GOAL_USD)}. Not affiliated with
          Apple. iPhone Duo is a trademark of Apple Inc.
        </footer>
      </div>
      <BidSheet />
    </div>
  )
}
