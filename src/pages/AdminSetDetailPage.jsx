import { Link, useParams } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'
import useAdminQuery from '../lib/useAdminQuery'
import { formatCorrectAnswered, formatPercent, loadSetPage } from '../lib/adminTracking'
import LoadingIndicator from '../components/LoadingIndicator'

const PROMPT_PREVIEW_LENGTH = 80

function promptPreview(prompt) {
  return prompt.length <= PROMPT_PREVIEW_LENGTH ? prompt : `${prompt.slice(0, PROMPT_PREVIEW_LENGTH).trimEnd()}…`
}

function QuestionDetails({ question }) {
  const options = question.options ?? []
  const correctAnswers = question.correctAnswers ?? []
  return (
    <details className="question-details">
      <summary>
        <span className="question-preview">{promptPreview(question.prompt)}</span>
        <span className="question-toggle question-toggle-show">Show full question</span>
        <span className="question-toggle question-toggle-hide">Hide</span>
      </summary>
      <p className="question-full">{question.prompt}</p>
      <ol className="question-options">
        {options.map((option) => {
          const isCorrect = correctAnswers.includes(option.key)
          return (
            <li key={option.key}>
              <strong>{option.key}.</strong> {option.text}
              {isCorrect && <span className="correct-label"> (correct)</span>}
            </li>
          )
        })}
      </ol>
    </details>
  )
}

export default function AdminSetDetailPage() {
  const { setId } = useParams()
  const { data, error, loading } = useAdminQuery(() => loadSetPage(setId), [setId])
  useDocumentTitle(data?.set ? `Admin · ${data.set.title}` : 'Admin set')

  if (loading) return <div className="loading-page"><LoadingIndicator label="Loading set..." /></div>
  if (error) {
    return (
      <>
        <Link className="back-link" to="/admin/sets">← Sets</Link>
        <p className="form-message error" role="alert">Set progress could not be loaded. {error}</p>
      </>
    )
  }
  if (!data.set) {
    return (
      <>
        <Link className="back-link" to="/admin/sets">← Sets</Link>
        <p className="empty-state">Set not found.</p>
      </>
    )
  }

  const { set, questions } = data

  return (
    <section className="progress-section">
      <Link className="back-link" to="/admin/sets">← Sets</Link>
      <div className="admin-detail-heading">
        <h2>{set.title}</h2>
      </div>

      <div className="stat-grid stat-grid-two">
        <article className="stat-card"><strong>{formatPercent(set.accuracy)}</strong><span>Set accuracy</span></article>
        <article className="stat-card"><strong>{set.students}</strong><span>Students completed</span></article>
      </div>

      <section className="progress-section">
        <h2>Questions</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>No.</th><th>Title</th><th>Correct / Answered</th></tr></thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.question_id}>
                  <td>{question.number}</td>
                  <td><QuestionDetails question={question} /></td>
                  <td>{formatCorrectAnswered(question.correct, question.answered)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
