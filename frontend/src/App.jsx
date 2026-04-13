import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Workers from './pages/Workers'

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workers" element={<Workers />} />
      </Routes>
    </div>
  )
}

export default App
