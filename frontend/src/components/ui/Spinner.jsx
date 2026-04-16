export function Spinner({ size = 'md', label }) {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
      className="inline-flex items-center gap-2 text-muted"
    >
      <svg
        className={`${dim} animate-spin`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" />
      </svg>
      {label && <span className="text-xs font-mono">{label}</span>}
    </span>
  )
}
