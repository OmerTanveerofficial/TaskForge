import { Tooltip } from './Tooltip'

const STATUS = {
  pending:   { dot: 'bg-subtle', text: 'text-muted',  label: 'pending',   help: 'Task registered, awaiting scheduler' },
  queued:    { dot: 'bg-info',   text: 'text-info',   label: 'queued',    help: 'Scheduled, waiting for a free worker' },
  running:   { dot: 'bg-warn',   text: 'text-warn',   label: 'running',   help: 'Being processed by a worker' },
  completed: { dot: 'bg-ok',     text: 'text-ok',     label: 'completed', help: 'Finished successfully' },
  failed:    { dot: 'bg-danger', text: 'text-danger', label: 'failed',    help: 'Worker raised an error — retries exhausted' },
  retrying:  { dot: 'bg-accent', text: 'text-accent', label: 'retrying',  help: 'Scheduled for another attempt' },
  cancelled: { dot: 'bg-subtle', text: 'text-subtle', label: 'cancelled', help: 'Cancelled before it ran' },
  busy:      { dot: 'bg-warn',   text: 'text-warn',   label: 'busy',      help: 'Worker processing a task' },
  idle:      { dot: 'bg-ok',     text: 'text-ok',     label: 'idle',      help: 'Worker waiting for a task' },
}

export function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.pending
  const pill = (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-surface text-[0.6875rem] font-mono uppercase tracking-wider">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className={s.text}>{s.label}</span>
    </span>
  )
  return s.help ? <Tooltip label={s.help}>{pill}</Tooltip> : pill
}
