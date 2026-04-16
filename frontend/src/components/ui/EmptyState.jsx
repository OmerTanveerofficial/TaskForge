export function EmptyState({ title, hint, code, action }) {
  return (
    <div className="px-5 py-16 text-center">
      {title && <p className="text-muted text-sm">{title}</p>}
      {hint && (
        <p className="text-subtle text-xs mt-1 font-mono">
          {hint}
          {code && <> <code className="text-muted">{code}</code></>}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
