const STATUS = {
  pending:   { dot: 'bg-subtle', text: 'text-muted',  label: 'pending' },
  queued:    { dot: 'bg-info',   text: 'text-info',   label: 'queued' },
  running:   { dot: 'bg-warn',   text: 'text-warn',   label: 'running' },
  completed: { dot: 'bg-ok',     text: 'text-ok',     label: 'completed' },
  failed:    { dot: 'bg-danger', text: 'text-danger', label: 'failed' },
  retrying:  { dot: 'bg-accent', text: 'text-accent', label: 'retrying' },
  cancelled: { dot: 'bg-subtle', text: 'text-subtle', label: 'cancelled' },
  busy:      { dot: 'bg-warn',   text: 'text-warn',   label: 'busy' },
  idle:      { dot: 'bg-ok',     text: 'text-ok',     label: 'idle' },
}

export function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-surface text-[0.6875rem] font-mono uppercase tracking-wider">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className={s.text}>{s.label}</span>
    </span>
  )
}
