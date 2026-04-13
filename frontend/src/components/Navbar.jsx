import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workers', label: 'Workers' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-surface-light/80 backdrop-blur-md border-b border-surface-lighter sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white no-underline">
            <span className="text-2xl">&#9881;</span>
            <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              TaskForge
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  location.pathname === link.to
                    ? 'bg-primary/20 text-primary-light'
                    : 'text-gray-400 hover:text-white hover:bg-surface-lighter/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium no-underline ${
                  location.pathname === link.to ? 'bg-primary/20 text-primary-light' : 'text-gray-400 hover:text-white'
                }`}>{link.label}</Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
