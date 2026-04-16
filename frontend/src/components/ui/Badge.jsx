const TONE = {
  neutral: 'bg-panel text-muted border-border',
  info:    'bg-panel text-info border-border',
  ok:      'bg-panel text-ok border-border',
  warn:    'bg-panel text-warn border-border',
  danger:  'bg-panel text-danger border-border',
  accent:  'bg-panel text-accent border-border',
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  const palette = TONE[tone] || TONE.neutral
  return (
    <span
      className={`inline-flex items-center px-1.5 h-5 rounded text-[10px] font-mono uppercase tracking-wider border ${palette} ${className}`}
    >
      {children}
    </span>
  )
}
