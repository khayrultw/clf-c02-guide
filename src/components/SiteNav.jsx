import { NavLink } from 'react-router-dom'
import { learnPages, referencePages, reviewPages } from '../content/catalog'

export default function SiteNav({ collection, currentSlug }) {
  const pages = collection === 'learn'
    ? learnPages
    : collection === 'review'
      ? reviewPages
      : referencePages
  const base = `/${collection}`

  return (
    <nav className="side-nav" aria-label={`${collection} navigation`}>
      {pages.map((page) => (
        <NavLink
          key={page.slug}
          to={`${base}/${page.slug}`}
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-current={page.slug === currentSlug ? 'page' : undefined}
        >
          {page.title}
        </NavLink>
      ))}
    </nav>
  )
}
