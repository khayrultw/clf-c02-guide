export default function TableOfContents({ headings }) {
  if (!headings.length) return null
  return (
    <aside className="toc" aria-label="On this page">
      <details open>
        <summary>On this page</summary>
        <nav>
          {headings.map((heading) => (
            <a
              key={heading.id}
              className={`toc-level-${heading.level}`}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </details>
    </aside>
  )
}
