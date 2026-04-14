import { useState, useEffect, useCallback } from 'react'
import { Stat, StatGrid } from '../components/ui/StatGrid'
import { StatusPill } from '../components/ui/StatusPill'
import { CopyableId } from '../components/ui/CopyableId'

const API = '/api'

function currentTaskId(task) {
  if (!task) return null
  return typeof task === 'object' ? task.id : task
}

function WorkerCard({ worker, utilization }) {
  const currentId = currentTaskId(worker.current_task)
  const isBusy = worker.status === 'busy'

  return (
    <div className="panel panel-hover p-5">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'bg-warn animate-pulse' : 'bg-ok'}`} />
          <h3 className="text-sm font-semibold text-fg font-mono">{worker.id}</h3>
        </div>
        <StatusPill status={worker.status} />
      </header>

      <div className="mb-4 h-9 flex items-center px-3 bg-bg border border-border rounded-lg">
        {currentId ? (
          <>
            <span className="eyebrow">processing</span>
            <div className="flex-1" />
            <CopyableId id={currentId} />
          </>
        ) : (
          <span className="eyebrow text-subtle">idle · waiting</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border mb-4">
        <div className="bg-panel p-3">
          <div className="eyebrow mb-1">Done</div>
          <div className="text-base font-semibold font-mono text-ok tabular-nums">{worker.tasks_completed}</div>
        </div>
        <div className="bg-panel p-3">
          <div className="eyebrow mb-1">Fail</div>
          <div className="text-base font-semibold font-mono text-danger tabular-nums">{worker.tasks_failed}</div>
        </div>
        <div className="bg-panel p-3">
          <div className="eyebrow mb-1">Total</div>
          <div className="text-base font-semibold font-mono text-fg tabular-nums">{worker.total_processing_time}s</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="eyebrow">Utilization</span>
          <span className="text-muted tabular-nums">{utilization}%</span>
        </div>
        <div className="w-full bg-bg border border-border rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-accent h-full transition-[width] duration-500 ease-out"
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>
    </div>
  )
}

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
    if (!stats) return 0
    const denom = Math.max(1, stats.completed + stats.failed)
    const total = worker.tasks_completed + worker.tasks_failed
    return Math.min(100, Math.round((total / denom) * 100))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="eyebrow mb-2">/workers</p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Worker pool</h1>
        <p className="text-muted text-sm mt-1">Live status, task distribution, and utilization per worker.</p>
      </div>

      <div className="mb-6">
        <StatGrid cols={4}>
          <Stat label="Total"    value={stats?.total_workers} />
          <Stat label="Idle"     value={stats?.idle_workers} accent="text-ok" />
          <Stat label="Busy"     value={stats?.busy_workers} accent="text-warn" />
          <Stat label="Avg time" value={stats ? `${stats.avg_processing_time}s` : null} />
        </StatGrid>
      </div>

      {workers.length === 0 ? (
        <div className="panel p-16 text-center">
          <p className="text-muted text-sm">No workers reporting.</p>
          <p className="text-subtle text-xs mt-1 font-mono">start the backend to see worker status</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} utilization={getUtilization(worker)} />
          ))}
        </div>
      )}
    </div>
  )
}
