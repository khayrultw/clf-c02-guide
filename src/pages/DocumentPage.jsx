import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { learnPages, referencePages, reviewPages } from '../content/catalog'
import { loadMarkdownSource } from '../content/loadMarkdown'
import MarkdownArticle from '../components/MarkdownArticle'
import SiteNav from '../components/SiteNav'
import NotFoundPage from './NotFoundPage'
import LoadingIndicator from '../components/LoadingIndicator'
import useDocumentTitle from '../lib/useDocumentTitle'

const collections = {
  learn: learnPages,
  review: reviewPages,
  reference: referencePages
}

export default function DocumentPage({ collection }) {
  const { slug } = useParams()
  const location = useLocation()
  const entry = collections[collection].find((page) => page.slug === slug)
  const [loaded, setLoaded] = useState({ source: null, markdown: '' })
  const markdown = loaded.source === entry?.source ? loaded.markdown : null
  useDocumentTitle(entry?.title || 'Page not found')

  useEffect(() => {
    if (!entry) return undefined
    let active = true
    loadMarkdownSource(entry).then((source) => {
      if (active) setLoaded({ source: entry.source, markdown: source })
    })
    return () => {
      active = false
    }
  }, [entry])

  useEffect(() => {
    if (!location.hash || markdown == null) return undefined
    const timer = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
    }, 30)
    return () => window.clearTimeout(timer)
  }, [location.hash, markdown])

  if (!entry) return <NotFoundPage />

  const pages = collections[collection]
  const index = pages.findIndex((page) => page.slug === slug)
  const previous = pages[index - 1]
  const next = pages[index + 1]
  const title = entry.title

  return (
    <div className="document-layout">
      <aside className="left-sidebar">
        <div className="sidebar-heading">
          {collection === 'learn' ? 'Learning path' : collection === 'review' ? 'Revision' : 'Service Reference'}
        </div>
        <div className="desktop-side-nav">
          <SiteNav collection={collection} currentSlug={slug} />
        </div>
        <details className="mobile-side-nav">
          <summary>Choose a {collection === 'learn' ? 'lesson' : collection === 'review' ? 'revision page' : 'service'}</summary>
          <SiteNav collection={collection} currentSlug={slug} />
        </details>
      </aside>

      <div className="document-main">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={`/${collection}`}>{collection === 'learn' ? 'Learn' : collection === 'review' ? 'Revision' : 'Reference'}</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>
        <header className="document-heading">
          <h1>{title}</h1>
          {entry.weight && <p>{entry.weight}% of scored exam content</p>}
        </header>
        {markdown == null
          ? <LoadingIndicator inline />

          : <MarkdownArticle markdown={markdown} collection={collection} slug={slug} />}
        <nav className="document-pagination" aria-label="Document pagination">
          {previous
            ? <Link to={`/${collection}/${previous.slug}`}>← {previous.title}</Link>
            : <span />}
          {next
            ? <Link to={`/${collection}/${next.slug}`}>{next.title} →</Link>
            : <span />}
        </nav>
      </div>
    </div>
  )
}
