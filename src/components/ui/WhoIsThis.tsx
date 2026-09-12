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
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-paper"
        aria-expanded={open}
        aria-controls={popupId}
        aria-label="Who is asking"
        onClick={() => setOpen((v) => !v)}
      >
        <XMark className="h-[15px] w-[15px]" />
      </button>
      {open ? (
        <div
          id={popupId}
          role="dialog"
          className="absolute left-1/2 top-[calc(100%+8px)] z-40 w-[220px] -translate-x-1/2 rounded-2xl border border-line bg-white p-3.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          <p className="text-[13px] leading-snug text-muted">Teacher turned indie hacker.</p>
          <a
            href={PROFILE}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block truncate text-[13px] text-ink underline decoration-line underline-offset-2"
          >
            x.com/nkgoutham
          </a>
        </div>
      ) : null}
    </div>
  )
}
