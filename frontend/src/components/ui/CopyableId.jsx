import { useState } from 'react'

export function CopyableId({ id, className = '' }) {
  const [copied, setCopied] = useState(false)

  const copy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <button
      onClick={copy}
      title={copied ? 'Copied' : 'Click to copy'}
      className={`font-mono text-xs text-subtle hover:text-fg transition-colors truncate text-left ${className}`}
    >
      {copied ? '✓ copied' : id}
    </button>
  )
}
