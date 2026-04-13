import { useState, useEffect, useCallback } from 'react'

const API = '/api'

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [stats, setStats] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const [workersRes, statsRes] = await Promise.all([
        fetch(`${API}/workers`),
        fetch(`${API}/stats`),
      ])
      const workersData = await workersRes.json()
      const statsData = await statsRes.json()
      setWorkers(workersData.workers)
      setStats(statsData)
    } catch {}
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [fetchData])

  const getUtilization = (worker) => {
    if (!stats || stats.total_tasks === 0) return 0
    const total = worker.tasks_completed + worker.tasks_failed
    return Math.min(100, Math.round((total / Math.max(1, stats.completed + stats.failed)) * 100))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Worker Pool</h1>
        <p className="text-gray-400">Monitor worker status, task distribution, and performance</p>
      </div>

      {/* Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-light rounded-xl border border-surface-lighter p-5 text-center">
            <div className="text-3xl font-bold text-white">{stats.total_workers}</div>
            <div className="text-sm text-gray-500 mt-1">Total Workers</div>
          </div>
          <div className="bg-surface-light rounded-xl border border-surface-lighter p-5 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.idle_workers}</div>
            <div className="text-sm text-gray-500 mt-1">Idle</div>
          </div>
          <div className="bg-surface-light rounded-xl border border-surface-lighter p-5 text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.busy_workers}</div>
            <div className="text-sm text-gray-500 mt-1">Busy</div>
          </div>
          <div className="bg-surface-light rounded-xl border border-surface-lighter p-5 text-center">
            <div className="text-3xl font-bold text-cyan-400">{stats.avg_processing_time}s</div>
            <div className="text-sm text-gray-500 mt-1">Avg Time</div>
          </div>
        </div>
      )}

      {/* Worker Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {workers.map(worker => {
          const utilization = getUtilization(worker)
          return (
            <div key={worker.id} className="bg-surface-light rounded-2xl border border-surface-lighter p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${worker.status === 'busy' ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
                  <h3 className="text-lg font-semibold text-white capitalize">{worker.id}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  worker.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {worker.status}
                </span>
              </div>

              {worker.current_task && (
                <div className="mb-4 px-3 py-2 bg-surface rounded-lg border border-yellow-500/30">
                  <span className="text-xs text-yellow-400">Processing: </span>
                  <span className="text-xs text-white font-mono">{worker.current_task}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-surface rounded-lg">
                  <div className="text-lg font-bold text-green-400">{worker.tasks_completed}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center p-2 bg-surface rounded-lg">
                  <div className="text-lg font-bold text-red-400">{worker.tasks_failed}</div>
                  <div className="text-xs text-gray-500">Failed</div>
                </div>
                <div className="text-center p-2 bg-surface rounded-lg">
                  <div className="text-lg font-bold text-cyan-400">{worker.total_processing_time}s</div>
                  <div className="text-xs text-gray-500">Total Time</div>
                </div>
              </div>

              {/* Utilization bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Utilization</span>
                  <span>{utilization}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-light rounded-full h-2 transition-all"
                    style={{ width: `${utilization}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
