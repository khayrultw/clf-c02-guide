import { Link } from 'react-router-dom'
import { learnPages, reviewPages } from '../content/catalog'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function HomePage() {
  useDocumentTitle(null)
  return (
    <div className="home-page">
      <section className="hero">
        <p className="eyebrow">AWS Certified Cloud Practitioner</p>
        <h1>Prepare for CLF-C02 one clear lesson at a time.</h1>
        <p>Read the required learning path, use service references only when you need a quick lookup, and finish with concise revision.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/learn/exam-overview">Start with Exam Overview</Link>
          <Link className="button secondary" to="/learn/student-study-plan">Open Study Plan</Link>
        </div>
      </section>

      <section>
        <h2>Your learning path</h2>
        <div className="domain-grid">
          {learnPages.filter((page) => page.weight != null).map((page, index) => (
            <Link className="card" key={page.slug} to={`/learn/${page.slug}`}>
              <span className="card-number">{index + 1}</span>
              <h3>{page.title}</h3>
              {page.weight && <p>{page.weight}% of scored exam content</p>}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Quick review</h2>
        <div className="review-grid">
          {reviewPages.map((page) => (
            <Link className="card compact" key={page.slug} to={`/review/${page.slug}`}>
              <h3>{page.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
