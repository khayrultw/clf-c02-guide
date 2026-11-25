import { Link } from 'react-router-dom'
import { summarizeDomains } from '../lib/progress'

export default function DomainPerformance({ rows, title = 'Accuracy by exam domain', showCorrectAnswered = false }) {
  const domains = summarizeDomains(rows)
  return (
    <section className="progress-section">
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>{showCorrectAnswered ? 'Correct / Answered' : 'Answered'}</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.id}>
                <td><Link to={`/learn/${domain.slug}`}>{domain.id}. {domain.title}</Link></td>
                <td>{showCorrectAnswered ? `${domain.correct} / ${domain.answered}` : domain.answered}</td>
                <td>
                  {domain.answered ? `${domain.accuracy}%` : '—'}
                  {domain.answered > 0 && (
                    <div className="domain-bar" aria-hidden="true"><span style={{ width: `${domain.accuracy}%` }} /></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
