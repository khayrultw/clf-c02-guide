import { NavLink, Outlet } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'
import useAdminQuery from '../lib/useAdminQuery'
import { formatPercent, loadAdminSummary } from '../lib/adminTracking'

export default function AdminDashboardPage() {
  useDocumentTitle('Admin dashboard')
  const { data: summary, error } = useAdminQuery(loadAdminSummary, [])

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Student progress overview</h1>
        </div>
      </header>

      {error && <p className="form-message error" role="alert">Dashboard data could not be loaded. {error}</p>}

      <div className="stat-grid">
        <article className="stat-card"><strong>{summary?.students ?? '—'}</strong><span>Students</span></article>
        <article className="stat-card"><strong>{summary?.active_students ?? '—'}</strong><span>Active students</span></article>
        <article className="stat-card"><strong>{summary?.completed_attempts ?? '—'}</strong><span>Completed attempts</span></article>
        <article className="stat-card"><strong>{formatPercent(summary?.accuracy)}</strong><span>Overall accuracy</span></article>
      </div>

      <nav className="admin-tabs" aria-label="Admin sections">
        <NavLink to="/admin/students">Students</NavLink>
        <NavLink to="/admin/sets">Sets</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}
