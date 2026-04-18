import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ErrorBoundary } from './components/ErrorBoundary'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Workers from './pages/Workers'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
