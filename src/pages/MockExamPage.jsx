import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { usePracticeNavigation } from '../lib/PracticeNavigationContext'
import useDocumentTitle from '../lib/useDocumentTitle'
import { examDomains } from '../content/catalog'
import { percent } from '../lib/progress'
import OptionList from '../components/OptionList'
import AnswerExplanation from '../components/AnswerExplanation'

const attemptFields = 'id,kind,status,score,total,started_at,expires_at,completed_at,question_ids,current_question_index,flagged_question_ids'
// A rule of thumb only: the real exam reports a scaled score (pass mark 700 of 1,000).
const practiceTarget = 70

function errorText(caught, fallback) {
  return caught?.message ? `${fallback} ${caught.message}` : fallback
}

function formatDuration(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

async function loadQuestions(ids) {
  const { data, error } = await supabase
    .from('questions')
    .select('id,number,set_id,prompt,response_mode,required_answers,options,domain')
    .in('id', ids)
  if (error) throw error
  const byId = new Map(data.map((question) => [question.id, question]))
  return ids.map((id) => byId.get(id)).filter(Boolean)
}

// While the exam is running this returns only the student's own selections.
async function loadAnswers(attemptId) {
  const { data, error } = await supabase.rpc('get_attempt_review', { p_attempt_id: attemptId })
  if (error) throw error
  return new Map((data || []).map((row) => [row.question_id, {
    selected: row.selected_answers || [],
    isCorrect: Boolean(row.is_correct),
    answer: row.answer || null
  }]))
}

export default function MockExamPage() {
  const { user } = useAuth()
  const userId = user?.id || null
  const { setPracticeActive } = usePracticeNavigation()
  const [phase, setPhase] = useState('loading')
  const [attempt, setAttempt] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState(() => new Map())
  const [flagged, setFlagged] = useState(() => new Set())
  const [index, setIndex] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')
  const [saveWarning, setSaveWarning] = useState('')
  const saveQueue = useRef(Promise.resolve())
  const finishing = useRef(false)
  useDocumentTitle('Mock exam')

  const remaining = attempt?.expires_at ? new Date(attempt.expires_at).getTime() - now : 0
  const timeUp = phase === 'exam' && remaining <= 0

  async function finishExam(current = attempt, examQuestions = questions) {
    if (finishing.current) return
    finishing.current = true
    setBusy(true)
    setConfirming(false)
    setError('')
    try {
      // Let any answer that is still being saved land before scoring.
      await saveQueue.current
      const { data, error: finishError } = await supabase.rpc('finish_mock_exam', { p_attempt_id: current.id })
      if (finishError) throw finishError
      const review = await loadAnswers(current.id)
      setAttempt(data)
      setLastResult(data)
      setQuestions(examQuestions)
      setAnswers(review)
      setPhase('results')
      window.scrollTo(0, 0)
    } catch (caught) {
      setError(errorText(caught, 'Your exam could not be submitted.'))
    } finally {
      finishing.current = false
      setBusy(false)
    }
  }

  async function openExam(existing) {
    setBusy(true)
    setError('')
    try {
      let current = existing
      if (!current) {
        const { data, error: startError } = await supabase.rpc('start_mock_exam')
        if (startError) throw startError
        current = data
      }
      const [examQuestions, saved] = await Promise.all([
        loadQuestions(current.question_ids),
        loadAnswers(current.id)
      ])
      setAttempt(current)
      setQuestions(examQuestions)
      setAnswers(saved)
      setFlagged(new Set(current.flagged_question_ids || []))
      setIndex(Math.min(Math.max(current.current_question_index || 0, 0), examQuestions.length - 1))
      setNow(Date.now())
      if (new Date(current.expires_at).getTime() <= Date.now()) {
        await finishExam(current, examQuestions)
      } else {
        setPhase('exam')
        window.scrollTo(0, 0)
      }
    } catch (caught) {
      setError(errorText(caught, 'The mock exam could not be opened.'))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !userId) {
      setPhase('unavailable')
      return undefined
    }
    let cancelled = false
    supabase
      .from('quiz_attempts')
      .select(attemptFields)
      .eq('user_id', userId)
      .eq('kind', 'mock')
      .order('started_at', { ascending: false })
      .limit(10)
      .then(({ data, error: loadError }) => {
        if (cancelled) return
        if (loadError) {
          setError(errorText(loadError, 'Mock exam history could not be loaded.'))
          setPhase('error')
          return
        }
        setAttempt(data.find((row) => row.status === 'in_progress') || null)
        setLastResult(data.find((row) => row.status === 'completed') || null)
        setPhase('intro')
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (phase !== 'exam') return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (timeUp) finishExam()
  }, [timeUp])

  useEffect(() => {
    setPracticeActive(phase === 'exam')
    return () => setPracticeActive(false)
  }, [phase, setPracticeActive])

  if (phase === 'loading') return <div className="loading-page">Loading mock exam...</div>

  if (phase === 'unavailable' || phase === 'error') {
    return (
      <div className="practice-page">
        <section className="question-card">
          <h1>Mock exam</h1>
          {phase === 'error'
            ? <p className="form-message error" role="alert">{error}</p>
            : <p>The mock exam needs the question database. Sign in on a site connected to Supabase to take it.</p>}
          <Link className="button secondary" to="/practice">Back to practice sets</Link>
        </section>
      </div>
    )
  }

  if (phase === 'intro') {
    const inProgress = attempt?.status === 'in_progress' ? attempt : null
    const expired = inProgress && new Date(inProgress.expires_at).getTime() <= Date.now()
    return (
      <div className="practice-page">
        <section className="question-card mock-intro">
          <p className="eyebrow">Full-length practice</p>
          <h1>Mock exam</h1>
          <ul>
            <li>65 questions drawn from every practice set, weighted like the exam: 16 Cloud Concepts, 19 Security and Compliance, 22 Cloud Technology and Services, 8 Billing, Pricing, and Support.</li>
            <li>90 minutes. The timer keeps running if you leave, and the exam is submitted automatically when time runs out.</li>
            <li>No feedback until you submit. You can change answers and flag questions to revisit.</li>
            <li>Questions you have not answered before are chosen first.</li>
          </ul>
          {lastResult && (
            <p className="muted">
              Last result: {lastResult.score} / {lastResult.total} ({percent(lastResult.score, lastResult.total)}%)
              on {new Date(lastResult.completed_at).toLocaleDateString()}.
            </p>
          )}
          {error && <p className="form-message error" role="alert">{error}</p>}
          <div className="hero-actions">
            {inProgress ? (
              <button className="button primary" type="button" onClick={() => openExam(inProgress)} disabled={busy}>
                {expired ? 'Time is up: see your result' : `Resume exam (${formatDuration(new Date(inProgress.expires_at).getTime() - Date.now())} left)`}
              </button>
            ) : (
              <button className="button primary" type="button" onClick={() => openExam(null)} disabled={busy}>
                {busy ? 'Preparing...' : 'Start mock exam'}
              </button>
            )}
            <Link className="button secondary" to="/practice">Back to practice sets</Link>
          </div>
        </section>
      </div>
    )
  }

  if (phase === 'results') {
    const score = attempt.score
    const total = attempt.total
    const scorePercent = percent(score, total)
    const domainRows = examDomains.map((domain) => {
      const items = questions.filter((question) => String(question.domain) === domain.id)
      const correct = items.filter((question) => answers.get(question.id)?.isCorrect).length
      return { ...domain, total: items.length, correct }
    })
    const used = new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()
    return (
      <div className="practice-page">
        <header className="practice-result">
          <p className="eyebrow">Mock exam result</p>
          <h1>{score} / {total}</h1>
          <p>
            {scorePercent}% correct in {formatDuration(used)}.{' '}
            {scorePercent >= practiceTarget
              ? `At or above the ${practiceTarget}% practice target.`
              : `Below the ${practiceTarget}% practice target; review the weakest domain below.`}
          </p>
          <p className="muted">
            The real exam reports a scaled score from 100 to 1,000 with a passing score of 700, so this percentage is only a practice guide.
          </p>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => openExam(null)} disabled={busy}>
              Start a new mock exam
            </button>
            <Link className="button secondary" to="/dashboard">Go to dashboard</Link>
          </div>
        </header>

        <section className="progress-section">
          <h2>Score by exam domain</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Domain</th><th>Correct</th><th>Accuracy</th></tr></thead>
              <tbody>
                {domainRows.map((domain) => (
                  <tr key={domain.id}>
                    <td><Link to={`/learn/${domain.slug}`}>{domain.id}. {domain.title}</Link></td>
                    <td>{domain.correct} / {domain.total}</td>
                    <td>{domain.total ? `${percent(domain.correct, domain.total)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="answer-review">
          {questions.map((question, questionIndex) => {
            const result = answers.get(question.id)
            const answered = (result?.selected || []).length > 0
            return (
              <section className="review-card" key={question.id}>
                <span className={result?.isCorrect ? 'result-correct' : 'result-wrong'}>
                  {result?.isCorrect ? 'Correct' : answered ? 'Incorrect' : 'Not answered'}
                </span>
                <h2>{questionIndex + 1}. {question.prompt}</h2>
                <OptionList question={question} selected={result?.selected || []} result={result} />
                <AnswerExplanation answer={result?.answer} options={question.options} isCorrect={result?.isCorrect} />
              </section>
            )
          })}
        </div>
      </div>
    )
  }

  const question = questions[index]
  const selected = answers.get(question.id)?.selected || []
  const isFlagged = flagged.has(question.id)
  const answeredCount = questions.filter((item) => (answers.get(item.id)?.selected || []).length === item.required_answers).length
  const unanswered = questions.length - answeredCount
  const lowTime = remaining < 5 * 60 * 1000

  function persistPlace(changes) {
    supabase
      .from('quiz_attempts')
      .update(changes)
      .eq('id', attempt.id)
      .then(({ error: placeError }) => {
        if (placeError) setSaveWarning('Your place in the exam could not be saved. Your answers are still saved.')
      })
  }

  function saveAnswer(questionId, nextSelected) {
    // Saves run one at a time so a slower request cannot overwrite a newer answer.
    saveQueue.current = saveQueue.current.then(async () => {
      const { error: saveError } = await supabase.rpc('save_mock_answer', {
        p_attempt_id: attempt.id,
        p_question_id: questionId,
        p_selected: nextSelected
      })
      setSaveWarning(saveError ? errorText(saveError, 'Your last answer could not be saved.') : '')
    })
  }

  function toggleOption(key) {
    if (busy) return
    let next
    if (question.response_mode === 'choose_one') {
      next = [key]
    } else if (selected.includes(key)) {
      next = selected.filter((value) => value !== key)
    } else if (selected.length >= question.required_answers) {
      return
    } else {
      next = [...selected, key]
    }
    setAnswers((current) => {
      const copy = new Map(current)
      if (next.length) copy.set(question.id, { selected: next })
      else copy.delete(question.id)
      return copy
    })
    saveAnswer(question.id, next)
  }

  function goTo(nextIndex) {
    setIndex(nextIndex)
    persistPlace({ current_question_index: nextIndex })
    window.scrollTo(0, 0)
  }

  function toggleFlag() {
    const next = new Set(flagged)
    if (next.has(question.id)) next.delete(question.id)
    else next.add(question.id)
    setFlagged(next)
    persistPlace({ flagged_question_ids: [...next] })
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <span>Mock exam · Question {index + 1} of {questions.length} · {answeredCount} answered</span>
        <span className={lowTime ? 'mock-timer low' : 'mock-timer'} role="timer" aria-live={lowTime ? 'polite' : 'off'}>
          {formatDuration(remaining)} left
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-label="Answered questions" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}>
        <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>

      <section className="question-card">
        <h1>{question.prompt}</h1>
        <p className="response-mode">
          {question.response_mode === 'choose_multiple' ? `Choose ${question.required_answers} answers` : 'Choose one answer'}
        </p>
        <OptionList question={question} selected={selected} onToggle={toggleOption} />

        {error && <p className="form-message error" role="alert">{error}</p>}
        {saveWarning && <p className="warning" role="status">{saveWarning}</p>}

        <div className="practice-actions">
          <button type="button" className="button secondary" onClick={toggleFlag} aria-pressed={isFlagged}>
            {isFlagged ? 'Unflag' : 'Flag for review'}
          </button>
          {index > 0 && (
            <button type="button" className="button secondary practice-action" onClick={() => goTo(index - 1)}>
              Previous
            </button>
          )}
          {index < questions.length - 1 ? (
            <button type="button" className="button primary practice-action" onClick={() => goTo(index + 1)}>
              Next question
            </button>
          ) : (
            <button type="button" className="button primary practice-action" onClick={() => setConfirming(true)} disabled={busy}>
              Review and submit
            </button>
          )}
        </div>
      </section>

      <section className="progress-section">
        <div className="mock-nav-heading">
          <h2>Questions</h2>
          <button type="button" className="button secondary" onClick={() => setConfirming(true)} disabled={busy}>
            Submit exam
          </button>
        </div>
        <nav className="mock-nav" aria-label="Exam questions">
          {questions.map((item, itemIndex) => {
            const count = (answers.get(item.id)?.selected || []).length
            const state = count === item.required_answers ? 'answered' : count > 0 ? 'partial' : 'unanswered'
            return (
              <button
                key={item.id}
                type="button"
                className={`mock-nav-item ${state}${flagged.has(item.id) ? ' flagged' : ''}${itemIndex === index ? ' current' : ''}`}
                onClick={() => goTo(itemIndex)}
                aria-current={itemIndex === index ? 'step' : undefined}
                aria-label={`Question ${itemIndex + 1}, ${state}${flagged.has(item.id) ? ', flagged' : ''}`}
              >
                {itemIndex + 1}
              </button>
            )
          })}
        </nav>
        <p className="muted">Filled: answered · Outlined: not answered · Dashed: partly answered · Marker: flagged</p>
      </section>

      {confirming && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="submit-exam-title">
            <p className="eyebrow">{formatDuration(remaining)} left</p>
            <h2 id="submit-exam-title">Submit your exam?</h2>
            <p>
              {unanswered === 0 ? 'Every question has an answer.' : `${unanswered} question${unanswered === 1 ? ' is' : 's are'} not fully answered and will count as incorrect.`}
              {flagged.size > 0 && ` ${flagged.size} question${flagged.size === 1 ? ' is' : 's are'} flagged for review.`}
            </p>
            <div className="modal-actions">
              <button className="modal-cancel-button" type="button" onClick={() => setConfirming(false)}>
                Keep working
              </button>
              <button className="button primary" type="button" onClick={() => finishExam()} disabled={busy}>
                {busy ? 'Submitting...' : 'Submit exam'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
