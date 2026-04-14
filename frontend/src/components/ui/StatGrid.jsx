export function StatGrid({ children, cols = 4 }) {
  const colClass = {
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
  }[cols]
  return (
    <div className={`grid grid-cols-2 ${colClass} gap-px bg-border rounded-xl overflow-hidden border border-border`}>
      {children}
    </div>
  )
}

export function Stat({ label, value, accent }) {
  return (
    <div className="bg-panel p-5">
      <div className="eyebrow mb-2">{label}</div>
      <div className={`text-2xl font-semibold font-mono tracking-tight ${accent || 'text-fg'}`}>
        {value ?? '—'}
      </div>
    </div>
  )
}
