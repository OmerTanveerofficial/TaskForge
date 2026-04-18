import { useEffect } from 'react'

function matches(event, combo) {
  const parts = combo.toLowerCase().split('+').map(p => p.trim())
  const key = parts.pop()

  const wantMeta = parts.includes('mod') || parts.includes('cmd') || parts.includes('meta')
  const wantCtrl = parts.includes('ctrl') || (parts.includes('mod') && !isMac())
  const wantShift = parts.includes('shift')
  const wantAlt = parts.includes('alt') || parts.includes('option')

  return (
    event.key.toLowerCase() === key &&
    !!event.metaKey === (wantMeta && isMac()) &&
    !!event.ctrlKey === (wantCtrl && !isMac()) &&
    !!event.shiftKey === wantShift &&
    !!event.altKey === wantAlt
  )
}

function isMac() {
  if (typeof navigator === 'undefined') return false
  return /mac/i.test(navigator.platform)
}

export function useHotkey(combo, handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      if (matches(e, combo)) {
        e.preventDefault()
        handler(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [combo, handler, enabled])
}
