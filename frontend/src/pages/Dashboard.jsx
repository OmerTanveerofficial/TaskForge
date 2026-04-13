import { useState, useEffect, useCallback } from 'react'

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

const statusColors = {
  pending: 'bg-gray-500/20 text-gray-400',
  queued: 'bg-blue-500/20 text-blue-400',
  running: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
  retrying: 'bg-orange-500/20 text-orange-400',
  cancelled: 'bg-gray-500/20 text-gray-500',
}

const priorityColors = {
  LOW: 'text-gray-400',
  NORMAL: 'text-blue-400',
  HIGH: 'text-orange-400',
  CRITICAL: 'text-red-400',
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [taskType, setTaskType] = useState('compute_fibonacci')
  const [priority, setPriority] = useState('NORMAL')
  const [loading, setLoading] = useState(false)
  const [backendOnline, setBackendOnline] = useState(null)

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

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total_tasks, color: 'text-white' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400' },
            { label: 'Running', value: stats.running, color: 'text-yellow-400' },
            { label: 'Queued', value: stats.queued, color: 'text-blue-400' },
            { label: 'Failed', value: stats.failed, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-3xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-3xl p-4 text-center">
            <div className="text-xl font-bold text-cyan-400">{stats.avg_processing_time}s</div>
            <div className="text-xs text-gray-500 mt-1">Avg Processing</div>
          </div>
          <div className="glass rounded-3xl p-4 text-center">
            <div className="text-xl font-bold text-purple-400">{stats.throughput}/s</div>
            <div className="text-xs text-gray-500 mt-1">Throughput</div>
          </div>
          <div className="glass rounded-3xl p-4 text-center">
            <div className="text-xl font-bold text-green-400">{stats.success_rate}%</div>
            <div className="text-xs text-gray-500 mt-1">Success Rate</div>
          </div>
          <div className="glass rounded-3xl p-4 text-center">
            <div className="text-xl font-bold text-orange-400">{stats.busy_workers}/{stats.total_workers}</div>
            <div className="text-xs text-gray-500 mt-1">Workers Busy</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="glass rounded-3xl p-8 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <select value={taskType} onChange={e => setTaskType(e.target.value)}
            className="bg-white/5 text-white px-4 py-2 rounded-xl border border-white/10 focus:border-primary outline-none">
            {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <select value={priority} onChange={e => setPriority(e.target.value)}
            className="bg-white/5 text-white px-4 py-2 rounded-xl border border-white/10 focus:border-primary outline-none">
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <button onClick={submitTask} disabled={loading || !backendOnline}
            className="btn-glow px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50">
            Submit Task
          </button>

          <button onClick={submitBatch} disabled={loading || !backendOnline}
            className="btn-glow px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50">
            Submit Batch (8)
          </button>

          <button onClick={clearCompleted}
            className="glass px-6 py-2 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/5 transition-all ml-auto">
            Clear Done
          </button>

          <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Task List */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
          <span className="text-sm text-gray-500">{tasks.length} total</span>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No tasks yet. Submit a task to get started.</div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {tasks.map(task => (
              <div key={task.id} className="px-8 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-24">
                  <span className="text-xs font-mono text-gray-400">{task.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {task.type_info?.name || task.type}
                  </div>
                  <div className="text-xs text-gray-500">{task.type_info?.category}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <div className="w-20 text-right">
                  {task.processing_time != null && (
                    <span className="text-xs text-gray-400 font-mono">{task.processing_time}s</span>
                  )}
                </div>
                <div className="w-16 text-right">
                  {task.retries > 0 && (
                    <span className="text-xs text-orange-400">retry {task.retries}</span>
                  )}
                </div>
                {task.worker_id && (
                  <span className="text-xs text-gray-500 w-20">{task.worker_id}</span>
                )}
                {task.status === 'queued' && (
                  <button onClick={() => cancelTask(task.id)} className="text-xs text-red-400 hover:text-red-300">Cancel</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
