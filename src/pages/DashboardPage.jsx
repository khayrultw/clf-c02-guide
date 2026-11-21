import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured, fetchAllRows } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { percent, weakestDomain } from '../lib/progress'
import useDocumentTitle from '../lib/useDocumentTitle'
import DomainPerformance from '../components/DomainPerformance'

async function loadProgress() {
  const [attempts, domains, setResult] = await Promise.all([
    fetchAllRows(() => supabase.rpc('attempt_summaries', { p_all: false })),
    fetchAllRows(() => supabase.rpc('domain_performance', { p_all: false })),
    supabase.from('question_sets').select('id,title,set_number,question_count').order('set_number')
  ])
  if (setResult.error) throw setResult.error
  return { attempts, domains, sets: setResult.data || [] }
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const userId = user?.id
  const [progress, setProgress] = useState({ attempts: [], domains: [], sets: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useDocumentTitle('Dashboard')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !userId) {
      setLoading(false)
      return undefined
    }
    let active = true
    setError('')
    loadProgress()
      .then((loaded) => {
        if (active) setProgress(loaded)
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
  }, [userId])

  const { attempts, domains, sets } = progress
  const summary = useMemo(() => {
    const completed = attempts.filter((attempt) => attempt.status === 'completed')
    const totalQuestions = completed.reduce((sum, attempt) => sum + attempt.total, 0)
    const totalCorrect = completed.reduce((sum, attempt) => sum + attempt.score, 0)
    const scored = completed.filter((attempt) => attempt.total > 0)
    return {
      attempts: completed.length,
      inProgress: attempts.filter((attempt) => attempt.status === 'in_progress').length,
      completedSets: new Set(completed.filter((attempt) => attempt.set_id).map((attempt) => attempt.set_id)).size,
      bestMock: Math.max(0, ...completed
        .filter((attempt) => attempt.kind === 'mock')
        .map((attempt) => percent(attempt.score, attempt.total))),
      mockTaken: completed.some((attempt) => attempt.kind === 'mock'),
      average: percent(totalCorrect, totalQuestions),
      best: scored.length
        ? Math.max(...scored.map((attempt) => percent(attempt.score, attempt.total)))
        : 0
    }
  }, [attempts])
  const focus = useMemo(() => weakestDomain(domains), [domains])
  const setTitles = useMemo(() => new Map(sets.map((set) => [set.id, set.title])), [sets])

  if (loading) return <div className="loading-page">Loading progress...</div>

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1>Welcome, {profile?.full_name || user?.email || 'Student'}</h1>
        </div>
        <Link className="button primary" to="/practice">Continue practice</Link>
      </header>

      {error && <p className="form-message error" role="alert">Progress could not be loaded. {error}</p>}

      <div className="stat-grid">
        <article className="stat-card"><strong>{summary.attempts}</strong><span>Completed attempts</span></article>
        <article className="stat-card"><strong>{summary.completedSets}</strong><span>Sets completed</span></article>
        <article className="stat-card"><strong>{summary.inProgress}</strong><span>In-progress sets</span></article>
        <article className="stat-card"><strong>{summary.average}%</strong><span>Overall accuracy</span></article>
        <article className="stat-card"><strong>{summary.best}%</strong><span>Best score</span></article>
        <article className="stat-card"><strong>{summary.mockTaken ? `${summary.bestMock}%` : '—'}</strong><span>Best mock exam</span></article>
      </div>

      {focus && (
        <p className="warning">
          Focus next: <strong>{focus.title}</strong> ({focus.accuracy}% correct).{' '}
          <Link to={`/learn/${focus.slug}`}>Review the lesson</Link>
        </p>
      )}

      <DomainPerformance rows={domains} />

      <section className="progress-section">
        <h2>Recent practice</h2>
        {attempts.length === 0 ? (
          <div className="empty-state">
            <p>You have not started any practice sets yet.</p>
            <Link className="button secondary" to="/practice">Start a practice set</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Set</th><th>Score</th><th>Accuracy</th><th>Status</th><th>Activity</th></tr></thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <td>{attempt.kind === 'mock' ? 'Mock exam' : setTitles.get(attempt.set_id) || attempt.set_id}</td>
                    <td>{attempt.status === 'completed'
                      ? `${attempt.score} / ${attempt.total}`
                      : attempt.kind === 'mock'
                        ? `${attempt.answered_count} answered (scored on submit)`
                        : `${attempt.score} correct / ${attempt.answered_count} answered`}</td>
                    <td>{attempt.status === 'completed' ? `${percent(attempt.score, attempt.total)}%` : '—'}</td>
                    <td>
                      {attempt.status === 'completed'
                        ? 'Completed'
                        : <Link to={attempt.kind === 'mock' ? '/mock-exam' : `/practice/${attempt.set_id}`}>In progress — resume</Link>}
                    </td>
                    <td>{new Date(attempt.completed_at || attempt.started_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
