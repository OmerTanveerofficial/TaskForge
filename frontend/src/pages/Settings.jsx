import { useTheme } from '../hooks/useTheme'
import { useLocalStorage } from '../hooks/useLocalStorage'

const REFRESH_OPTIONS = [1000, 2000, 5000, 10000]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [refreshMs, setRefreshMs] = useLocalStorage('taskforge-refresh-ms', 2000)
  const [compactRows, setCompactRows] = useLocalStorage('taskforge-compact', false)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="eyebrow mb-2">/settings</p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Settings</h1>
        <p className="text-muted text-sm mt-1">Local preferences — stored in your browser only.</p>
      </div>

      <div className="panel p-5 mb-4">
        <h2 className="text-sm font-semibold text-fg mb-1">Theme</h2>
        <p className="text-xs text-muted mb-3">Appearance for the dashboard and workers views.</p>
        <div className="flex gap-2">
          {['dark', 'light'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                theme === t
                  ? 'bg-panel text-fg border-border-strong'
                  : 'text-muted border-border hover:text-fg'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-4">
        <h2 className="text-sm font-semibold text-fg mb-1">Refresh interval</h2>
        <p className="text-xs text-muted mb-3">How often the dashboard polls the API.</p>
        <div className="flex gap-2 flex-wrap">
          {REFRESH_OPTIONS.map(ms => (
            <button
              key={ms}
              onClick={() => setRefreshMs(ms)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                refreshMs === ms
                  ? 'bg-panel text-fg border-border-strong'
                  : 'text-muted border-border hover:text-fg'
              }`}
            >
              {ms / 1000}s
            </button>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <h2 className="text-sm font-semibold text-fg mb-1">Compact rows</h2>
            <p className="text-xs text-muted">Tighter spacing in the task list.</p>
          </div>
          <input
            type="checkbox"
            checked={compactRows}
            onChange={e => setCompactRows(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
        </label>
      </div>
    </div>
  )
}
