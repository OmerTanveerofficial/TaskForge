import { useState, useEffect, useCallback, useMemo } from 'react'
import { Stat, StatGrid } from '../components/ui/StatGrid'
import { StatusPill } from '../components/ui/StatusPill'
import { CopyableId } from '../components/ui/CopyableId'
import { Spinner } from '../components/ui/Spinner'
import { useDebounce } from '../hooks/useDebounce'

const API = '/api'

const TASK_TYPES = [
  { value: 'compute_fibonacci', label: 'Fibonacci', params: { n: 30 } },
  { value: 'matrix_multiply', label: 'Matrix Multiply', params: { size: 50 } },
  { value: 'prime_sieve', label: 'Prime Sieve', params: { n: 10000 } },
  { value: 'sort_dataset', label: 'Sort Dataset', params: { size: 10000 } },
  { value: 'text_analysis', label: 'Text Analysis', params: {} },
  { value: 'simulate_io', label: 'Simulate I/O', params: { duration: 3 } },
  { value: 'hash_computation', label: 'Hash Computation', params: { iterations: 50000 } },
  { value: 'data_aggregation', label: 'Data Aggregation', params: { size: 50000 } },
]

const PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL']

const priorityTextStyle = {
  LOW:      'text-subtle',
  NORMAL:   'text-info',
  HIGH:     'text-accent',
  CRITICAL: 'text-danger',
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [taskType, setTaskType] = useState('compute_fibonacci')
  const [priority, setPriority] = useState('NORMAL')
  const [loading, setLoading] = useState(false)
  const [backendOnline, setBackendOnline] = useState(null)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 180)

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/stats`),
      ])
      const tasksData = await tasksRes.json()
      const statsData = await statsRes.json()
      setTasks(tasksData.tasks)
      setStats(statsData)
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [fetchData])

  const submitTask = async () => {
    setLoading(true)
    const typeInfo = TASK_TYPES.find(t => t.value === taskType)
    try {
      await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: taskType, params: typeInfo.params, priority }),
      })
      fetchData()
    } catch {}
    setLoading(false)
  }

  const submitBatch = async () => {
    setLoading(true)
    const batchTasks = TASK_TYPES.map(t => ({
      type: t.value,
      params: t.params,
      priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
    }))
    try {
      await fetch(`${API}/tasks/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: batchTasks }),
      })
      fetchData()
    } catch {}
    setLoading(false)
  }

  const clearCompleted = async () => {
    await fetch(`${API}/tasks/clear`, { method: 'POST' })
    fetchData()
  }

  const cancelTask = async (taskId) => {
    await fetch(`${API}/tasks/${taskId}/cancel`, { method: 'POST' })
    fetchData()
  }

  const statusLabel =
    backendOnline === null ? 'connecting' :
    backendOnline ? 'api online' : 'api offline'

  const visibleTasks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(t =>
      t.id.toLowerCase().includes(q) ||
      (t.type_info?.name || t.type || '').toLowerCase().includes(q) ||
      (t.type_info?.category || '').toLowerCase().includes(q)
    )
  }, [tasks, debouncedQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-2">/dashboard</p>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Task control</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-ok' : backendOnline === false ? 'bg-danger' : 'bg-subtle animate-pulse'}`} />
          <span className="text-muted">{statusLabel}</span>
        </div>
      </div>

      <div className="mb-4">
        <StatGrid cols={5}>
          <Stat label="Total"     value={stats?.total_tasks} />
          <Stat label="Completed" value={stats?.completed}   accent="text-ok" />
          <Stat label="Running"   value={stats?.running}     accent="text-warn" />
          <Stat label="Queued"    value={stats?.queued}      accent="text-info" />
          <Stat label="Failed"    value={stats?.failed}      accent="text-danger" />
        </StatGrid>
      </div>

      <div className="mb-6">
        <StatGrid cols={4}>
          <Stat label="Avg processing" value={stats ? `${stats.avg_processing_time}s` : null} />
          <Stat label="Throughput"     value={stats ? `${stats.throughput}/s` : null} />
          <Stat label="Success rate"   value={stats ? `${stats.success_rate}%` : null} />
          <Stat label="Workers busy"   value={stats ? `${stats.busy_workers}/${stats.total_workers}` : null} />
        </StatGrid>
      </div>

      <div className="panel p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="eyebrow">type</span>
            <select value={taskType} onChange={e => setTaskType(e.target.value)} className="input font-mono text-xs">
              {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="eyebrow">priority</span>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="input font-mono text-xs">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <div className="flex-1" />

          <button onClick={submitTask} disabled={loading || !backendOnline} className="btn-primary inline-flex items-center gap-2">
            {loading ? <Spinner size="sm" /> : null}
            Submit
          </button>
          <button onClick={submitBatch} disabled={loading || !backendOnline} className="btn-secondary">
            Batch × 8
          </button>
          <button onClick={clearCompleted} className="btn-secondary" disabled={!backendOnline}>
            Clear done
          </button>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="px-5 h-11 border-b border-border flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg">Tasks</h2>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="filter id / type…"
            className="input font-mono text-xs flex-1 max-w-60"
          />
          <span className="text-xs font-mono text-muted flex items-center gap-2 shrink-0">
            {backendOnline === null && <Spinner size="sm" />}
            {visibleTasks.length}
            {debouncedQuery && <span className="text-subtle">/ {tasks.length}</span>}
            {!debouncedQuery && <span className="text-subtle">total</span>}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <p className="text-muted text-sm">No tasks yet.</p>
            <p className="text-subtle text-xs mt-1 font-mono">
              submit one above or <code className="text-muted">POST /api/tasks</code>
            </p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-muted text-sm">No tasks match that filter.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border max-h-[560px] overflow-y-auto">
            {visibleTasks.map(task => (
              <li key={task.id} className="px-5 py-3 flex items-center gap-4 hover:bg-bg/60 transition-colors">
                <div className="w-24 shrink-0">
                  <CopyableId id={task.id} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-fg font-medium truncate">
                    {task.type_info?.name || task.type}
                  </div>
                  {task.type_info?.category && (
                    <div className="text-xs text-subtle font-mono">{task.type_info.category}</div>
                  )}
                </div>

                <span className={`font-mono text-xs w-20 text-right ${priorityTextStyle[task.priority]}`}>
                  {task.priority}
                </span>

                <StatusPill status={task.status} />

                <span className="w-16 text-right font-mono text-xs text-muted tabular-nums">
                  {task.processing_time != null ? `${task.processing_time}s` : '—'}
                </span>

                <span className="w-14 text-right font-mono text-xs tabular-nums">
                  {task.retries > 0
                    ? <span className="text-accent">×{task.retries}</span>
                    : <span className="text-subtle">—</span>}
                </span>

                <span className="w-20 text-right font-mono text-xs text-subtle truncate">
                  {task.worker_id || '—'}
                </span>

                <div className="w-16 text-right">
                  {task.status === 'queued' && (
                    <button onClick={() => cancelTask(task.id)} className="text-xs text-danger hover:underline">
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
