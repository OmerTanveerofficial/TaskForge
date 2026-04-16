export function formatRelative(input, now = Date.now()) {
  if (input == null) return '—'
  const ts = typeof input === 'number' ? input : Date.parse(input)
  if (Number.isNaN(ts)) return '—'

  const diff = Math.round((ts - now) / 1000)
  const abs = Math.abs(diff)

  if (abs < 45) return diff < 0 ? `${abs}s ago` : `in ${abs}s`
  if (abs < 3600) return diff < 0 ? `${Math.round(abs / 60)}m ago` : `in ${Math.round(abs / 60)}m`
  if (abs < 86400) return diff < 0 ? `${Math.round(abs / 3600)}h ago` : `in ${Math.round(abs / 3600)}h`
  return new Date(ts).toISOString().slice(0, 10)
}

export function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}
