import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

const TONE_BAR = {
  info:    'bg-info',
  ok:      'bg-ok',
  warn:    'bg-warn',
  danger:  'bg-danger',
  neutral: 'bg-subtle',
}

let nextId = 1

export function ToastProvider({ children, duration = 3200 }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((message, tone = 'neutral') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, tone }])
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-60 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} duration={duration} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, duration, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), duration)
    return () => clearTimeout(id)
  }, [toast.id, duration, onDismiss])

  const bar = TONE_BAR[toast.tone] || TONE_BAR.neutral

  return (
    <div className="pointer-events-auto flex items-stretch min-w-60 max-w-sm panel shadow-sm overflow-hidden">
      <div className={`w-1 ${bar}`} />
      <div className="flex-1 px-3 py-2 text-sm text-fg">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="px-2 text-subtle hover:text-fg text-xs"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
