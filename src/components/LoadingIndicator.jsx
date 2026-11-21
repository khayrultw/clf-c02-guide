export default function LoadingIndicator({ label = 'Loading...', inline = false }) {
  return (
    <div className={inline ? 'loading-indicator inline' : 'loading-indicator'} role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
