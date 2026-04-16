import { useState } from 'react'

export function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false)

  const position =
    side === 'bottom' ? 'top-full mt-1.5' :
    side === 'left'   ? 'right-full mr-1.5 top-1/2 -translate-y-1/2' :
    side === 'right'  ? 'left-full ml-1.5 top-1/2 -translate-y-1/2' :
                        'bottom-full mb-1.5'

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute ${position} left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md bg-panel border border-border text-[11px] font-mono text-muted shadow-sm z-50`}
        >
          {label}
        </span>
      )}
    </span>
  )
}
