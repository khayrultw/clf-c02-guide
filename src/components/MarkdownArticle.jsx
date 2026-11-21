import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { allPages, routeForSource } from '../content/catalog'
import { getHeadingId } from '../content/slug'

function prepareMarkdown(markdown) {
  return markdown.replace(/^# .+\n/, '')
}

function resolveSourcePath(fromSource, relativePath) {
  const parts = fromSource.split('/').slice(0, -1)
  for (const part of relativePath.split('/')) {
    if (part === '..') parts.pop()
    else if (part && part !== '.') parts.push(part)
  }
  return parts.join('/')
}

function rewriteHref(href, currentPage) {
  if (!href || !currentPage) return href
  if (/^(https?:|mailto:)/.test(href)) return href
  if (href.startsWith('#')) return href

  const [relativePath, hash = ''] = href.split('#')
  const suffix = hash ? `#${hash}` : ''
  if (!relativePath) return href

  if (relativePath.endsWith('.md')) {
    const route = routeForSource(resolveSourcePath(currentPage.source, relativePath))
    return route ? `${route}${suffix}` : null
  }

  return `/${currentPage.base}/${currentPage.slug}${suffix}`
}

function textOf(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  return textOf(node.props?.children)
}

function createHeading(Tag) {
  return function Heading({ children }) {
    return <Tag id={getHeadingId(textOf(children))}>{children}</Tag>
  }
}

const headingComponents = {
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4')
}

export default function MarkdownArticle({ markdown, collection, slug }) {
  const prepared = prepareMarkdown(markdown)
  const currentPage = useMemo(
    () => allPages.find((page) => page.base === collection && page.slug === slug) || null,
    [collection, slug]
  )
  const components = useMemo(() => ({
    ...headingComponents,
    a: ({ href, children }) => {
      const rewritten = rewriteHref(href, currentPage)
      if (!rewritten) return <span>{children}</span>
      if (/^(https?:|mailto:)/.test(rewritten)) {
        return <a href={rewritten} target="_blank" rel="noreferrer">{children}</a>
      }
      if (rewritten.startsWith('#')) return <a href={rewritten}>{children}</a>
      return <Link to={rewritten}>{children}</Link>
    }
  }), [currentPage])

  return (
    <article className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {prepared}
      </ReactMarkdown>
    </article>
  )
}
