import { useEffect, useId, useRef, useState } from 'react'

const PROFILE = 'https://x.com/nkgoutham'

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.822L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      />
    </svg>
  )
}

function Pointer() {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" className="text-muted" aria-hidden="true">
      <path
        d="M30 16C22 16 14 14 4 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M9 3.5 3.5 6.2 8 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WhoIsThis() {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const popupId = useId()

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div
      ref={wrap}
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-paper"
        aria-expanded={open}
        aria-controls={popupId}
        aria-label="who is this guy"
        onClick={() => setOpen((v) => !v)}
      >
        <XMark className="h-[15px] w-[15px]" />
      </button>
      <Pointer />
      <p className="max-w-[7.5rem] text-left font-hand text-[18px] leading-none text-muted sm:max-w-none sm:text-[20px]">
        who is this guy?
      </p>
      {open ? (
        <a
          id={popupId}
          href={PROFILE}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-[calc(100%+10px)] left-0 z-40 w-[260px] rounded-2xl border border-line bg-white p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
        >
          <span className="flex items-center gap-3">
            <img
              src="/nkgoutham.jpg"
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate text-[14px] text-ink">Krishna Goutham</span>
              <span className="block truncate text-[12px] text-muted">@nkgoutham</span>
            </span>
          </span>
          <span className="mt-2 block text-[13px] leading-snug text-muted">
            teacher turned indie hacker.
          </span>
        </a>
      ) : null}
    </div>
  )
}
