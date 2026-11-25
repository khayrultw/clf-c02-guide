import { formatPercent } from '../lib/adminTracking'

export default function AccuracyBar({ value }) {
  const hasValue = value !== null && value !== undefined
  return (
    <>
      {formatPercent(value)}
      {hasValue && (
        <div className="domain-bar" aria-hidden="true"><span style={{ width: `${value}%` }} /></div>
      )}
    </>
  )
}
