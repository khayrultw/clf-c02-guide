import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadPracticeSets } from '../content/loadPracticeSets'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function PracticeIndexPage() {
  const [sets, setSets] = useState(null)
  useDocumentTitle('Practice')

  useEffect(() => {
    let active = true
    loadPracticeSets().then((loaded) => {
      if (active) setSets(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="collection-page">
      <header className="page-heading">
        <p className="eyebrow">Practice</p>
        <h1>Question Sets</h1>
        <p>Choose a set, answer every question, and review your explanations afterward.</p>
      </header>
      {!sets ? (
        <p className="muted">Loading practice sets...</p>
      ) : (
        <div className="collection-grid">
          <Link className="card mock-card" to="/mock-exam">
            <span className="card-category">Full-length practice</span>
            <h2>Mock exam</h2>
            <p>65 questions · 90 minutes · weighted like the real exam</p>
            <span className="card-action">Take the mock exam →</span>
          </Link>
          {sets.map((set) => (
            <Link className="card" key={set.set} to={`/practice/set-${set.set}`}>
              <span className="card-category">Practice Set {set.set}</span>
              <h2>{set.title}</h2>
              <p>{set.questionCount} questions</p>
              <span className="card-action">Start set →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
