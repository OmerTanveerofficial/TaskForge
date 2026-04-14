import { Link } from 'react-router-dom'

const curlSnippet = `curl -X POST http://localhost:5000/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "compute_fibonacci",
    "params": { "n": 30 },
    "priority": "HIGH"
  }'`

const capabilities = [
  { k: 'priority',  v: 'Critical > High > Normal > Low, strict ordering' },
  { k: 'workers',   v: '4 concurrent workers, parallel execution' },
  { k: 'retries',   v: 'Up to 3 attempts with exponential backoff' },
  { k: 'telemetry', v: 'Live throughput, success rate, utilization' },
  { k: 'batching',  v: 'Submit up to N tasks in a single request' },
]

const lifecycle = [
  { step: '01', title: 'POST /api/tasks', desc: 'Client submits with type, params, and priority.' },
  { step: '02', title: 'Enqueue to priority heap', desc: 'Tasks sorted — higher priority always dequeued first.' },
  { step: '03', title: 'Worker picks up task', desc: 'Idle worker dequeues and begins execution.' },
  { step: '04', title: 'Record metrics', desc: 'Processing time, retries, result persisted on the task record.' },
  { step: '05', title: 'Retry on failure', desc: 'Up to 3 retries before the task is marked failed.' },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <section className="pt-16 md:pt-24 pb-14">
        <p className="eyebrow mb-4">Task queue · v1.0</p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-fg mb-4 max-w-2xl leading-tight">
          A small, boring task queue — with the parts you actually want.
        </h1>
        <p className="text-muted text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Priorities, retries, a worker pool, and a live dashboard. Nothing more.
          Submit work over HTTP, watch it run.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/dashboard" className="btn-primary no-underline">
            Open dashboard
          </Link>
          <Link to="/workers" className="btn-secondary no-underline">
            Workers
          </Link>
          <span className="text-subtle text-xs font-mono ml-1 hidden sm:inline">
            ↳ or <code className="text-muted">POST /api/tasks</code>
          </span>
        </div>
      </section>

      <section className="pb-16 grid md:grid-cols-[1.1fr_1fr] gap-6">
        <div className="panel overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 h-9 border-b border-border bg-bg/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
            </div>
            <span className="eyebrow">submit a task</span>
          </div>
          <pre className="flex-1 p-5 font-mono text-[12.5px] leading-relaxed text-fg overflow-x-auto">
<span className="text-subtle"># POST a task with HIGH priority</span>
{'\n'}{curlSnippet}
          </pre>
        </div>

        <div className="panel p-5">
          <div className="eyebrow mb-4">what's inside</div>
          <dl className="space-y-3">
            {capabilities.map(c => (
              <div key={c.k} className="flex gap-4 text-sm">
                <dt className="font-mono text-xs text-accent w-20 shrink-0 pt-0.5 uppercase tracking-wider">
                  {c.k}
                </dt>
                <dd className="text-muted leading-relaxed">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-fg">Lifecycle</h2>
          <span className="eyebrow">per task</span>
        </div>
        <div className="panel divide-y divide-border">
          {lifecycle.map(item => (
            <div key={item.step} className="flex gap-5 items-start px-5 py-4">
              <span className="font-mono text-sm text-accent w-7 shrink-0 tabular-nums">{item.step}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-fg font-medium text-sm">{item.title}</h3>
                <p className="text-muted text-sm mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pb-10 pt-6 border-t border-border flex items-center justify-between text-xs font-mono text-subtle">
        <span>TaskForge</span>
        <span>built for learning · Flask · React</span>
      </footer>
    </div>
  )
}
