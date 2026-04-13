import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '&#9881;', title: 'Priority Queue', description: 'Tasks are processed based on priority levels: Critical, High, Normal, Low. Higher priority tasks are always dequeued first.' },
  { icon: '&#9879;', title: 'Multi-Worker Pool', description: '4 concurrent worker threads process tasks in parallel, simulating a distributed computing environment.' },
  { icon: '&#8635;', title: 'Auto Retry & Fault Tolerance', description: 'Failed tasks automatically retry up to 3 times with status tracking. Simulated 10% failure rate for testing.' },
  { icon: '&#9889;', title: 'Real-Time Dashboard', description: 'Live monitoring of task progress, worker status, throughput, and success rates.' },
  { icon: '&#128202;', title: 'Task Analytics', description: 'Track processing times, success rates, throughput, and worker utilization metrics.' },
  { icon: '&#128230;', title: 'Batch Processing', description: 'Submit multiple tasks at once for parallel processing across the worker pool.' },
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
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl mb-6">&#9881;</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-light via-accent to-primary-light bg-clip-text text-transparent">TaskForge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-4">Distributed Task Queue System</p>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto">
              A multi-worker distributed task processing system with priority queuing,
              fault tolerance, automatic retries, and real-time monitoring dashboard.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/dashboard" className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all no-underline">
                Open Dashboard
              </Link>
              <Link to="/workers" className="px-8 py-3 border border-surface-lighter rounded-xl text-gray-300 font-semibold hover:bg-surface-lighter/50 transition-all no-underline">
                View Workers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-6 bg-surface-light rounded-2xl border border-surface-lighter hover:border-primary/30 transition-all">
              <div className="text-3xl mb-4" dangerouslySetInnerHTML={{ __html: f.icon }} />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Architecture</h2>
        <div className="space-y-4">
          {architecture.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start p-4 bg-surface-light rounded-xl border border-surface-lighter">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold shrink-0">{item.step}</div>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-surface-lighter text-center text-gray-500 text-sm">
        <p>TaskForge - Distributed task processing with fault tolerance</p>
      </footer>
    </div>
  )
}
