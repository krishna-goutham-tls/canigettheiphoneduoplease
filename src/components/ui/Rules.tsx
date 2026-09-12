const RULES = [
  {
    n: '01',
    t: 'Pick a spot on the home screen.',
    d: 'The big widget, two mediums, or a little icon.',
  },
  {
    n: '02',
    t: 'Pay a little more than whoever is there.',
    d: 'Icons $11. Medium $55. The big one $110. Then it goes up $10 at a time.',
  },
  {
    n: '03',
    t: 'Logo and a link. That’s the whole thing.',
    d: 'No manifesto. No 1:1 post. Just your mark on the home screen.',
  },
  {
    n: '04',
    t: 'If someone outbids you, you paid for the time you had.',
    d: 'No refunds. You’re still in the yearbook.',
  },
]

export function Rules() {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-[980px] px-5 py-20 md:px-8 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
          How this works
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {RULES.map((r) => (
            <div key={r.n}>
              <p className="text-[12px] text-muted">{r.n}</p>
              <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.01em] text-ink">{r.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
