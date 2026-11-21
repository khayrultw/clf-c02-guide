import { Link } from 'react-router-dom'
import { routeForSource } from '../content/catalog'

// Links may be stored as site routes, package-relative markdown paths, or URLs.
function normalizeLink(link) {
  const href = typeof link === 'string' ? link : link?.url || link?.href || link?.path
  if (!href) return null
  const label = (typeof link === 'object' && (link.label || link.title || link.text)) || href
  if (/^https?:/.test(href)) return { label, href, external: true }
  if (href.startsWith('/')) return { label, href }
  const [file, hash] = href.split('#')
  const route = routeForSource(file.replace(/^(\.\.\/)+/, ''))
  return route ? { label, href: `${route}${hash ? `#${hash}` : ''}` } : null
}

function LinkList({ title, links }) {
  const items = (Array.isArray(links) ? links : []).map(normalizeLink).filter(Boolean)
  if (!items.length) return null
  return (
    <p className="explanation-links">
      <strong>{title}:</strong>{' '}
      {items.map((item, index) => (
        <span key={`${item.href}-${index}`}>
          {index > 0 && ' · '}
          {item.external
            ? <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
            : <Link to={item.href}>{item.label === 'Lesson' ? 'Review the lesson' : item.label}</Link>}
        </span>
      ))}
    </p>
  )
}

export default function AnswerExplanation({ answer, options = [], isCorrect }) {
  if (!answer) return null
  const optionText = new Map(options.map((option) => [option.key, option.text]))
  const correctAnswers = answer.correct_answers || []

  return (
    <>
      {!isCorrect && correctAnswers.length > 0 && (
        <p>
          <strong>Correct answer{correctAnswers.length > 1 ? 's' : ''}:</strong>{' '}
          {correctAnswers.map((key) => `${key}. ${optionText.get(key) || ''}`.trim()).join('; ')}
        </p>
      )}
      {answer.why_these_selections_fit && <p>{answer.why_these_selections_fit}</p>}
      {answer.concept_tested && (
        <p><strong>Concept tested:</strong> {answer.concept_tested}</p>
      )}
      {answer.option_rationales?.length > 0 && (
        <div className="explanation-list">
          <h3>Explanation</h3>
          {answer.option_rationales.map((rationale) => (
            <p key={rationale.key} className="rationale">
              <strong>{rationale.key}{optionText.has(rationale.key) ? `. ${optionText.get(rationale.key)}` : ''}</strong>
              {' — '}{rationale.text}
            </p>
          ))}
        </div>
      )}
      {answer.common_trap && (
        <p className="common-trap"><strong>Common trap:</strong> {answer.common_trap}</p>
      )}
      <LinkList title="Study" links={answer.lesson_links} />
      <LinkList title="AWS docs" links={answer.official_documentation} />
    </>
  )
}
