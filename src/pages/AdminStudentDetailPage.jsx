import { Link, useParams } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'
import useAdminQuery from '../lib/useAdminQuery'
import {
  domainLabel,
  formatCorrectAnswered,
  formatDateTime,
  formatPercent,
  loadStudentPage
} from '../lib/adminTracking'
import AccuracyBar from '../components/AccuracyBar'
import DomainPerformance from '../components/DomainPerformance'
import LoadingIndicator from '../components/LoadingIndicator'

export default function AdminStudentDetailPage() {
  const { studentId } = useParams()
  const { data, error, loading } = useAdminQuery(() => loadStudentPage(studentId), [studentId])
  useDocumentTitle(data?.student ? `Admin · ${data.student.full_name || data.student.email || 'Student'}` : 'Admin student')

  if (loading) return <div className="loading-page"><LoadingIndicator label="Loading student..." /></div>
  if (error) {
    return (
      <>
        <Link className="back-link" to="/admin/students">← Students</Link>
        <p className="form-message error" role="alert">Student progress could not be loaded. {error}</p>
      </>
    )
  }
  if (!data.student) {
    return (
      <>
        <Link className="back-link" to="/admin/students">← Students</Link>
        <p className="empty-state">Student not found.</p>
      </>
    )
  }

  const { student, detail } = data
  const sets = detail?.sets ?? []
  const hasCompleted = Boolean(detail?.mock) || sets.some((set) => set.completed_at)

  return (
    <section className="progress-section">
      <Link className="back-link" to="/admin/students">← Students</Link>
      <div className="admin-detail-heading">
        <h2>{student.full_name || 'Student'}</h2>
        <p className="muted">{student.email || '—'}</p>
      </div>

      <div className="stat-grid stat-grid-two">
        <article className="stat-card"><strong>{formatPercent(student.accuracy)}</strong><span>Overall accuracy</span></article>
        <article className="stat-card">
          <span>Weakest module</span>
          <strong className="stat-text">
            {student.weakest_domain
              ? `${domainLabel(student.weakest_domain)} (${student.weakest_accuracy}%)`
              : '—'}
          </strong>
        </article>
      </div>

      {!hasCompleted && <p className="muted">No completed attempts yet.</p>}

      <DomainPerformance rows={detail?.domains ?? []} title="Accuracy by domain" showCorrectAnswered />

      <section className="progress-section">
        <h2>Accuracy by set</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Set</th><th>Correct / Answered</th><th>Accuracy</th><th>Completed</th></tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.set_id}>
                  <td>{set.title}</td>
                  <td>{set.completed_at ? formatCorrectAnswered(set.correct, set.answered) : '—'}</td>
                  <td><AccuracyBar value={set.accuracy} /></td>
                  <td>{set.completed_at ? formatDateTime(set.completed_at) : 'Not completed'}</td>
                </tr>
              ))}
              {detail?.mock && (
                <tr>
                  <td>Mock exam</td>
                  <td>{formatCorrectAnswered(detail.mock.correct, detail.mock.answered)}</td>
                  <td><AccuracyBar value={detail.mock.accuracy} /></td>
                  <td>{formatDateTime(detail.mock.completed_at)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
