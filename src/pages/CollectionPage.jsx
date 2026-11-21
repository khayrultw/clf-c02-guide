import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learnPages, referencePages, reviewPages } from '../content/catalog'
import useDocumentTitle from '../lib/useDocumentTitle'

const collections = {
  learn: { title: 'Learn', subtitle: 'Read the required material in order.', pages: learnPages, base: '/learn' },
  review: { title: 'Revision', subtitle: 'Check scope, comparisons, traps, and readiness.', pages: reviewPages, base: '/review' },
  reference: { title: 'AWS Service Reference', subtitle: 'Optional lookup after studying the lessons.', pages: referencePages, base: '/reference' }
}

export default function CollectionPage({ collection }) {
  const config = collections[collection]
  const [filter, setFilter] = useState('')
  useDocumentTitle(collection === 'reference' ? 'Service Reference' : config.title)
  const filtered = useMemo(() => config.pages.filter((page) =>
    `${page.title} ${page.category || ''}`.toLowerCase().includes(filter.toLowerCase())
  ), [config, filter])

  return (
    <div className="collection-page">
      <header className="page-heading">
        <p className="eyebrow">{config.title}</p>
        <h1>{collection === 'reference' ? 'Service Reference' : config.title}</h1>
        <p>{config.subtitle}</p>
      </header>
      {collection === 'reference' && (
        <label className="filter">
          <span>Filter categories or services</span>
          <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search AWS services" />
        </label>
      )}
      <div className="collection-grid">
        {filtered.map((page) => (
          <Link className="card" key={page.slug} to={`${config.base}/${page.slug}`}>
            {page.weight && <span className="domain-weight">{page.weight}%</span>}
            {page.category && <span className="card-category">{page.category}</span>}
            <h2>{page.title}</h2>
            {collection === 'learn' && <span className="card-action">Read lesson →</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
