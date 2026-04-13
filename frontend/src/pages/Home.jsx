import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const GearIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
  </svg>
)

const NetworkIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <path strokeLinecap="round" d="M12 8v3M9.5 13.5L6.5 16.5M14.5 13.5l3 3" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M23 20v-6h-6" />
    <path strokeLinecap="round" d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
  </svg>
)

const LightningIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="12" width="4" height="9" rx="1" strokeLinejoin="round" />
    <rect x="10" y="6" width="4" height="15" rx="1" strokeLinejoin="round" />
    <rect x="17" y="3" width="4" height="18" rx="1" strokeLinejoin="round" />
  </svg>
)

const PackageIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
    <path strokeLinecap="round" d="M3 8l9 5 9-5M12 13v8" />
  </svg>
)

const HeroGearIcon = () => (
  <svg className="w-16 h-16 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
  </svg>
)

const featureIcons = [GearIcon, NetworkIcon, RefreshIcon, LightningIcon, ChartIcon, PackageIcon]

const features = [
  { title: 'Priority Queue', description: 'Tasks are processed based on priority levels: Critical, High, Normal, Low. Higher priority tasks are always dequeued first.' },
  { title: 'Multi-Worker Pool', description: '4 concurrent worker threads process tasks in parallel, simulating a distributed computing environment.' },
  { title: 'Auto Retry & Fault Tolerance', description: 'Failed tasks automatically retry up to 3 times with status tracking. Simulated 10% failure rate for testing.' },
  { title: 'Real-Time Dashboard', description: 'Live monitoring of task progress, worker status, throughput, and success rates.' },
  { title: 'Task Analytics', description: 'Track processing times, success rates, throughput, and worker utilization metrics.' },
  { title: 'Batch Processing', description: 'Submit multiple tasks at once for parallel processing across the worker pool.' },
]

const architecture = [
  { step: '1', title: 'Client submits task via REST API', desc: 'Tasks include type, parameters, and priority level.' },
  { step: '2', title: 'Master enqueues to priority queue', desc: 'Tasks are sorted by priority (Critical > High > Normal > Low).' },
  { step: '3', title: 'Workers dequeue and execute', desc: 'Idle workers pick the highest-priority task from the queue.' },
  { step: '4', title: 'Results returned with metrics', desc: 'Processing time, retries, and results are tracked per task.' },
  { step: '5', title: 'Failed tasks auto-retry', desc: 'Up to 3 retries with exponential backoff before marking as failed.' },
]

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />

      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-8">
              <HeroGearIcon />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="gradient-text">TaskForge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-4">Distributed Task Queue System</p>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto">
              A multi-worker distributed task processing system with priority queuing,
              fault tolerance, automatic retries, and real-time monitoring dashboard.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/dashboard" className="btn-glow px-8 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all no-underline">
                Open Dashboard
              </Link>
              <Link to="/workers" className="glass px-8 py-3 border border-white/10 rounded-xl text-gray-300 font-semibold hover:bg-white/5 transition-all no-underline">
                View Workers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const IconComponent = featureIcons[i]
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass card-hover p-8 rounded-3xl">
                <div className="text-primary-light mb-4"><IconComponent /></div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Architecture</h2>
        <div className="space-y-4">
          {architecture.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="glass flex gap-4 items-start p-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold shrink-0">{item.step}</div>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>TaskForge - Distributed task processing with fault tolerance</p>
      </footer>
    </div>
  )
}
