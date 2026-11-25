import { Link } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'
import useAdminQuery from '../lib/useAdminQuery'
import { domainLabel, loadStudentOverview } from '../lib/adminTracking'
import AccuracyBar from '../components/AccuracyBar'
import LoadingIndicator from '../components/LoadingIndicator'

export default function AdminStudentList() {
  useDocumentTitle('Admin students')
  const { data: students, error, loading } = useAdminQuery(loadStudentOverview, [])

  if (loading) return <div className="loading-page"><LoadingIndicator label="Loading students..." /></div>
  if (error) return <p className="form-message error" role="alert">Students could not be loaded. {error}</p>
  if (!students.length) return <p className="empty-state">No students yet.</p>

  return (
    <section className="progress-section">
      <h2>Students</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Student</th><th>Email</th><th>Overall accuracy</th><th>Weakest module</th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.user_id}>
                <td><Link to={`/admin/students/${student.user_id}`}>{student.full_name || 'Student'}</Link></td>
                <td>{student.email || '—'}</td>
                <td><AccuracyBar value={student.accuracy} /></td>
                <td>
                  {student.weakest_domain
                    ? `${domainLabel(student.weakest_domain)} (${student.weakest_accuracy}%)`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
