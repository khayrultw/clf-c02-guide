import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadPracticeSet, setIdFor } from '../content/loadPracticeSets'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { usePracticeNavigation } from '../lib/PracticeNavigationContext'
import useDocumentTitle from '../lib/useDocumentTitle'
import AnswerExplanation from '../components/AnswerExplanation'
import OptionList from '../components/OptionList'
import NotFoundPage from './NotFoundPage'
import LoadingIndicator from '../components/LoadingIndicator'

const attemptFields = 'id,set_id,status,score,total,started_at,completed_at,current_question_index,current_selected_answers'

function errorText(caught, fallback) {
  return caught?.message ? `${fallback} ${caught.message}` : fallback
}

// Results are keyed by question id so their order never depends on the database.
function toResultMap(rows) {
  return new Map((rows || []).map((row) => [row.question_id, {
    selected: row.selected_answers || [],
    isCorrect: Boolean(row.is_correct),
    answer: row.answer || null
  }]))
}

async function loadAttemptState(attempt, questions) {
  const { data, error } = await supabase.rpc('get_attempt_review', { p_attempt_id: attempt.id })
  if (error) throw error
  const results = toResultMap(data)
  const index = Math.min(Math.max(attempt.current_question_index || 0, 0), questions.length - 1)
  const saved = results.get(questions[index].id)
  return {
    attempt,
    results,
    index,
    selected: saved ? saved.selected : (attempt.current_selected_answers || [])
  }
}

export default function PracticeSetPage() {
  const { setId } = useParams()
  const setNumber = setId?.match(/^set-(\d+)$/)?.[1]
  const { user } = useAuth()
  const userId = user?.id || null
  const { setPracticeActive, guardedNavigate } = usePracticeNavigation()
  const [set, setPracticeSet] = useState(null)
  const [phase, setPhase] = useState('loading')
  const [attempt, setAttempt] = useState(null)
  const [previousAttempt, setPreviousAttempt] = useState(null)
  const [results, setResults] = useState(() => new Map())
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saveWarning, setSaveWarning] = useState('')
  useDocumentTitle(set ? `Practice Set ${set.set}` : 'Practice')

  function applyState(state) {
    setAttempt(state.attempt)
    setResults(state.results)
    setIndex(state.index)
    setSelected(state.selected)
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      setPhase('loading')
      setError('')
      setSaveWarning('')
      setPreviousAttempt(null)
      applyState({ attempt: null, results: new Map(), index: 0, selected: [] })

      const loaded = await loadPracticeSet(setNumber)
      if (cancelled) return
      setPracticeSet(loaded)
      if (!loaded) {
        setPhase('missing')
        return
      }
      if (!(isSupabaseConfigured && supabase && userId && loaded.remote)) {
        setPhase('practice')
        return
      }

      try {
        const setIdValue = setIdFor(loaded.set)
        const { data: inProgress, error: inProgressError } = await supabase
          .from('quiz_attempts')
          .select(attemptFields)
          .eq('user_id', userId)
          .eq('set_id', setIdValue)
          .eq('status', 'in_progress')
          .maybeSingle()
        if (inProgressError) throw inProgressError

        let state
        if (inProgress) {
          state = await loadAttemptState(inProgress, loaded.questions)
        } else {
          const { data: completed, error: completedError } = await supabase
            .from('quiz_attempts')
            .select(attemptFields)
            .eq('user_id', userId)
            .eq('set_id', setIdValue)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (completedError) throw completedError
          if (completed) {
            if (!cancelled) {
              setPreviousAttempt(completed)
              setPhase('completed')
            }
            return
          }

          const { data: started, error: startError } = await supabase
            .rpc('start_attempt', { p_set_id: setIdValue })
          if (startError) throw startError
          state = { attempt: started, results: new Map(), index: 0, selected: [] }
        }

        if (cancelled) return
        applyState(state)
        setPhase('practice')
      } catch (caught) {
        if (cancelled) return
        setError(errorText(caught, 'This practice set could not be loaded.'))
        setPhase('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [setNumber, userId])

  useEffect(() => {
    setPracticeActive(phase === 'practice' && Boolean(attempt))
    return () => setPracticeActive(false)
  }, [phase, attempt, setPracticeActive])

  if (phase === 'missing') return <NotFoundPage />
  if (phase === 'loading' || !set) return <div className="loading-page"><LoadingIndicator label="Loading practice set..." /></div>

  if (phase === 'error') {
    return (
      <div className="practice-page">
        <section className="question-card">
          <p className="form-message error" role="alert">{error}</p>
          <Link className="button secondary" to="/practice">Back to practice sets</Link>
        </section>
      </div>
    )
  }

  const canGrade = Boolean(attempt)

  function persistPosition(nextIndex, nextSelected) {
    if (!attempt) return
    supabase
      .from('quiz_attempts')
      .update({ current_question_index: nextIndex, current_selected_answers: nextSelected })
      .eq('id', attempt.id)
      .then(({ error: saveError }) => {
        setSaveWarning(saveError
          ? 'Your place in this set could not be saved. Answers you have already checked are recorded.'
          : '')
      })
  }

  async function startNewAttempt() {
    setBusy(true)
    setError('')
    const { data, error: startError } = await supabase.rpc('start_attempt', { p_set_id: setIdFor(set.set) })
    setBusy(false)
    if (startError) {
      setError(errorText(startError, 'A new attempt could not be started.'))
      return
    }
    applyState({ attempt: data, results: new Map(), index: 0, selected: [] })
    setPreviousAttempt(null)
    setPhase('practice')
    window.scrollTo(0, 0)
  }

  async function reviewPreviousAttempt() {
    setBusy(true)
    setError('')
    try {
      applyState(await loadAttemptState(previousAttempt, set.questions))
      setPhase('results')
    } catch (caught) {
      setError(errorText(caught, 'Your previous result could not be loaded.'))
    } finally {
      setBusy(false)
    }
  }

  if (phase === 'completed') {
    return (
      <div className="practice-page">
        <div className="modal-backdrop reset-modal-backdrop" role="presentation">
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="retake-set-title">
            <p className="eyebrow">Set already completed</p>
            <h2 id="retake-set-title">Retake Practice Set {set.set}?</h2>
            <p>
              Your latest score: <strong>{previousAttempt.score} / {previousAttempt.total}</strong>.
              Starting again keeps this result in your history.
            </p>
            {error && <p className="form-message error" role="alert">{error}</p>}
            <div className="modal-actions">
              <button className="modal-cancel-button" type="button" onClick={reviewPreviousAttempt} disabled={busy}>
                Review result
              </button>
              <button className="button primary" type="button" onClick={startNewAttempt} disabled={busy}>
                Start new attempt
              </button>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    return (
      <div className="practice-page">
        <header className="practice-result">
          <p className="eyebrow">Set complete</p>
          <h1>{attempt.score} / {attempt.total}</h1>
          <p>{Math.round((attempt.score / attempt.total) * 100)}% correct · saved to your dashboard</p>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <div className="hero-actions">
            <Link className="button secondary" to="/practice">Choose another set</Link>
            <button className="button primary" type="button" onClick={startNewAttempt} disabled={busy}>
              Retake this set
            </button>
          </div>
        </header>
        <div className="answer-review">
          {set.questions.map((item) => {
            const result = results.get(item.id)
            return (
              <section className="review-card" key={item.id}>
                <span className={result?.isCorrect ? 'result-correct' : 'result-wrong'}>
                  {result ? (result.isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}
                </span>
                <h2>{item.number}. {item.prompt}</h2>
                <OptionList question={item} selected={result?.selected || []} result={result} />
                <AnswerExplanation answer={result?.answer} options={item.options} isCorrect={result?.isCorrect} />
              </section>
            )
          })}
        </div>
      </div>
    )
  }

  const question = set.questions[index]
  const requiredCount = question.required_answers || 1
  const result = results.get(question.id)
  const isLast = index === set.questions.length - 1
  const canCheck = canGrade && !result && selected.length === requiredCount

  function goToQuestion(nextIndex) {
    const saved = results.get(set.questions[nextIndex].id)
    setIndex(nextIndex)
    setSelected(saved ? saved.selected : [])
    setError('')
    persistPosition(nextIndex, [])
    window.scrollTo(0, 0)
  }

  function toggleOption(key) {
    if (result || busy) return
    let next
    if (question.response_mode === 'choose_one') {
      next = [key]
    } else if (selected.includes(key)) {
      next = selected.filter((value) => value !== key)
    } else if (selected.length >= requiredCount) {
      return
    } else {
      next = [...selected, key]
    }
    setSelected(next)
    persistPosition(index, next)
  }

  async function checkAnswer() {
    if (!canCheck || busy) return
    setBusy(true)
    setError('')
    const { data, error: submitError } = await supabase.rpc('submit_answer', {
      p_attempt_id: attempt.id,
      p_question_id: question.id,
      p_selected: selected
    })
    setBusy(false)
    if (submitError) {
      setError(errorText(submitError, 'Your answer could not be checked.'))
      return
    }
    setResults((current) => new Map(current).set(question.id, {
      selected: data.selected_answers,
      isCorrect: data.is_correct,
      answer: data.answer
    }))
    setSelected(data.selected_answers)
  }

  async function finishSet() {
    const firstUnanswered = set.questions.findIndex((item) => !results.has(item.id))
    if (firstUnanswered !== -1) {
      goToQuestion(firstUnanswered)
      setError(`Question ${firstUnanswered + 1} has not been answered yet.`)
      return
    }
    setBusy(true)
    setError('')
    const { data, error: finishError } = await supabase.rpc('complete_attempt', { p_attempt_id: attempt.id })
    setBusy(false)
    if (finishError) {
      setError(errorText(finishError, 'Your result could not be saved.'))
      return
    }
    setAttempt(data)
    setPhase('results')
    window.scrollTo(0, 0)
  }

  let primaryAction
  if (!canGrade) {
    primaryAction = !isLast && (
      <button type="button" className="button primary practice-action" onClick={() => goToQuestion(index + 1)}>
        Next question
      </button>
    )
  } else if (!result) {
    primaryAction = (
      <button type="button" className="button primary practice-action" onClick={checkAnswer} disabled={!canCheck || busy}>
        {busy ? 'Checking...' : 'Check answer'}
      </button>
    )
  } else {
    primaryAction = (
      <button
        type="button"
        className="button primary practice-action"
        onClick={isLast ? finishSet : () => goToQuestion(index + 1)}
        disabled={busy}
      >
        {isLast ? (busy ? 'Saving...' : 'Finish set') : 'Next question'}
      </button>
    )
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <Link
          to="/practice"
          onClick={(event) => {
            event.preventDefault()
            guardedNavigate('/practice')
          }}
        >
          ← Practice sets
        </Link>
        <span>
          Question {index + 1} of {set.questions.length}
          {canGrade && ` · ${results.size} answered`}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Answered questions"
        aria-valuemin={0}
        aria-valuemax={set.questions.length}
        aria-valuenow={results.size}
      >
        <span style={{ width: `${((canGrade ? results.size : index + 1) / set.questions.length) * 100}%` }} />
      </div>
      <section className="question-card">
        <p className="eyebrow">{set.title}</p>
        <h1>{question.prompt}</h1>
        <p className="response-mode">
          {question.response_mode === 'choose_multiple'
            ? `Choose ${question.required_answers} answers`
            : 'Choose one answer'}
        </p>
        <OptionList question={question} selected={selected} result={result} onToggle={toggleOption} />

        {result && (
          <section className={result.isCorrect ? 'answer-feedback correct-feedback' : 'answer-feedback wrong-feedback'} aria-live="polite">
            <h2>{result.isCorrect ? 'Correct!' : 'Not quite.'}</h2>
            <AnswerExplanation answer={result.answer} options={question.options} isCorrect={result.isCorrect} />
          </section>
        )}

        {error && <p className="form-message error" role="alert">{error}</p>}
        {saveWarning && <p className="warning" role="status">{saveWarning}</p>}

        <div className="practice-actions">
          {index > 0 && (
            <button type="button" className="button secondary practice-action" onClick={() => goToQuestion(index - 1)} disabled={busy}>
              Previous
            </button>
          )}
          {primaryAction}
        </div>
        {!canGrade && (
          <p className="muted">
            {isSupabaseConfigured
              ? 'Answer checking is unavailable because the question database could not be reached.'
              : 'Answer checking requires the database connection. You can still read through the questions.'}
          </p>
        )}
      </section>
    </div>
  )
}
