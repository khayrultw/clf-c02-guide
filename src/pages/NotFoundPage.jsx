import { Link } from 'react-router-dom'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>The study page you requested does not exist.</p>
      <Link className="button primary" to="/learn">Back to Learn</Link>
    </section>
  )
}
