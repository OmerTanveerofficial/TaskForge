import { useState } from 'react'
import { useHotkey } from '../hooks/useHotkey'

const SHORTCUTS = [
  { keys: ['R'],      label: 'Refresh dashboard' },
  { keys: ['?'],      label: 'Toggle this help' },
  { keys: ['Esc'],    label: 'Close this help' },
]

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false)

  useHotkey('?', () => setOpen(v => !v))
  useHotkey('escape', () => setOpen(false), { enabled: open })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="panel w-full max-w-sm p-5"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <h2 className="text-sm font-semibold text-fg mb-3">Keyboard shortcuts</h2>
        <ul className="space-y-2">
          {SHORTCUTS.map(s => (
            <li key={s.label} className="flex items-center justify-between text-sm">
              <span className="text-muted">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map(k => (
                  <kbd
                    key={k}
                    className="min-w-[24px] h-6 inline-flex items-center justify-center px-1.5 rounded border border-border bg-bg text-[11px] font-mono text-fg"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
