const PARTS: { t: string; c: string }[] = [
  { t: 'can', c: '#6e6e73' },
  { t: 'i', c: '#0071e3' },
  { t: 'get', c: '#1d1d1f' },
  { t: 'the', c: '#8e8e93' },
  { t: 'iPhone', c: '#1d1d1f' },
  { t: 'Duo', c: '#0071e3' },
  { t: 'please', c: '#5a5a5e' },
  { t: '.online', c: '#aeaeb2' },
]

export function Wordmark() {
  return (
    <a
      href="#top"
      aria-label="canigettheiphoneduoplease.online"
      className="min-w-0 truncate text-[12px] font-semibold leading-[1.2] tracking-tight sm:text-[14px] md:text-[16px]"
    >
      {PARTS.map((w) => (
        <span key={w.t} style={{ color: w.c }}>
          {w.t}
        </span>
      ))}
    </a>
  )
}
