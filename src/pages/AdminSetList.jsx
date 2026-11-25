import { Link } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'
import useAdminQuery from '../lib/useAdminQuery'
import { loadSetOverview } from '../lib/adminTracking'
import AccuracyBar from '../components/AccuracyBar'
import LoadingIndicator from '../components/LoadingIndicator'

export default function AdminSetList() {
  useDocumentTitle('Admin sets')
  const { data: sets, error, loading } = useAdminQuery(loadSetOverview, [])

  if (loading) return <div className="loading-page"><LoadingIndicator label="Loading sets..." /></div>
  if (error) return <p className="form-message error" role="alert">Sets could not be loaded. {error}</p>
  if (!sets.length) return <p className="empty-state">No question sets yet.</p>

  return (
    <section className="progress-section">
      <h2>Sets</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Set</th><th>Accuracy</th></tr></thead>
          <tbody>
            {sets.map((set) => (
              <tr key={set.set_id}>
                <td><Link to={`/admin/sets/${set.set_id}`}>{set.title}</Link></td>
                <td><AccuracyBar value={set.accuracy} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
