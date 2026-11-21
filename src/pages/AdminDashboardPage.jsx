import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured, fetchAllRows } from '../lib/supabase'
import { percent, weakestDomain } from '../lib/progress'
import useDocumentTitle from '../lib/useDocumentTitle'
import DomainPerformance from '../components/DomainPerformance'
import LoadingIndicator from '../components/LoadingIndicator'

async function loadOverview() {
  const [profiles, attempts, domains, setResult] = await Promise.all([
    fetchAllRows(() => supabase
      .from('profiles')
      .select('id,email,full_name,role,created_at')
      .order('created_at')
      .order('id')),
    fetchAllRows(() => supabase.rpc('attempt_summaries', { p_all: true })),
    fetchAllRows(() => supabase.rpc('domain_performance', { p_all: true })),
    supabase.from('question_sets').select('id,title,set_number,question_count').order('set_number')
  ])
  if (setResult.error) throw setResult.error
  return { profiles, attempts, domains, sets: setResult.data || [] }
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState({ profiles: [], attempts: [], domains: [], sets: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useDocumentTitle('Admin dashboard')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return undefined
    }
    let active = true
    loadOverview()
      .then((loaded) => {
        if (active) setOverview(loaded)
      })
      .catch((caught) => {
        if (active) setError(caught.message || 'Progress could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const { profiles, attempts, domains, sets } = overview
  const students = useMemo(() => profiles.filter((profile) => profile.role === 'student'), [profiles])
  const studentsById = useMemo(() => new Map(students.map((profile) => [profile.id, profile])), [students])
  const setTitles = useMemo(() => new Map(sets.map((set) => [set.id, set.title])), [sets])
  const studentAttempts = useMemo(
    () => attempts.filter((attempt) => studentsById.has(attempt.user_id)),
    [attempts, studentsById]
  )
  const studentDomains = useMemo(
    () => domains.filter((row) => studentsById.has(row.user_id)),
    [domains, studentsById]
  )

  const summary = useMemo(() => {
    const completed = studentAttempts.filter((attempt) => attempt.status === 'completed')
    const questions = completed.reduce((sum, attempt) => sum + attempt.total, 0)
    const correct = completed.reduce((sum, attempt) => sum + attempt.score, 0)
    return {
      users: students.length,
      activeUsers: new Set(studentAttempts.map((attempt) => attempt.user_id)).size,
      attempts: completed.length,
      overall: percent(correct, questions)
    }
  }, [students, studentAttempts])

  const userRows = useMemo(() => students.map((profile) => {
    const userAttempts = studentAttempts.filter((attempt) => attempt.user_id === profile.id)
    const completed = userAttempts.filter((attempt) => attempt.status === 'completed')
    const questions = completed.reduce((sum, attempt) => sum + attempt.total, 0)
    const correct = completed.reduce((sum, attempt) => sum + attempt.score, 0)
    const latest = userAttempts.reduce((newest, attempt) => {
      const time = attempt.completed_at || attempt.started_at
      return !newest || time > newest ? time : newest
    }, null)
    return {
      ...profile,
      attempts: completed.length,
      accuracy: questions ? `${percent(correct, questions)}%` : '—',
      weakest: weakestDomain(studentDomains.filter((row) => row.user_id === profile.id)),
      latest
    }
  }), [students, studentAttempts, studentDomains])

  if (loading) return <div className="loading-page"><LoadingIndicator label="Loading all progress..." /></div>

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
        <article className="stat-card"><strong>{summary.users}</strong><span>Students</span></article>
        <article className="stat-card"><strong>{summary.activeUsers}</strong><span>Active students</span></article>
        <article className="stat-card"><strong>{summary.attempts}</strong><span>Completed attempts</span></article>
        <article className="stat-card"><strong>{summary.overall}%</strong><span>Overall accuracy</span></article>
      </div>

      <DomainPerformance rows={studentDomains} title="Class accuracy by exam domain" />

      <section className="progress-section">
        <h2>Students</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Email</th><th>Completed</th><th>Accuracy</th><th>Weakest domain</th><th>Last activity</th></tr></thead>
            <tbody>
              {userRows.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.full_name || 'Student'}</td>
                  <td>{profile.email || '—'}</td>
                  <td>{profile.attempts}</td>
                  <td>{profile.accuracy}</td>
                  <td>{profile.weakest ? `${profile.weakest.title} (${profile.weakest.accuracy}%)` : '—'}</td>
                  <td>{profile.latest ? new Date(profile.latest).toLocaleString() : 'No attempts'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="progress-section">
        <h2>Set attempts</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Set</th><th>Score</th><th>Accuracy</th><th>Status</th></tr></thead>
            <tbody>
              {studentAttempts.map((attempt) => {
                const profile = studentsById.get(attempt.user_id)
                return (
                  <tr key={attempt.id}>
                    <td>{profile?.full_name || profile?.email || attempt.user_id}</td>
                    <td>{attempt.kind === 'mock' ? 'Mock exam' : setTitles.get(attempt.set_id) || attempt.set_id}</td>
                    <td>{attempt.status === 'completed'
                      ? `${attempt.score} / ${attempt.total}`
                      : attempt.kind === 'mock'
                        ? `${attempt.answered_count} answered (scored on submit)`
                        : `${attempt.score} correct / ${attempt.answered_count} answered`}</td>
                    <td>{attempt.status === 'completed' ? `${percent(attempt.score, attempt.total)}%` : '—'}</td>
                    <td>
                      {attempt.status === 'completed'
                        ? `Completed ${new Date(attempt.completed_at).toLocaleString()}`
                        : `In progress — started ${new Date(attempt.started_at).toLocaleString()}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
