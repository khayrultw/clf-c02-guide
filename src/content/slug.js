// Heading ids follow GitHub's anchor rules so links that work in the markdown
// repository also work on the site. "1.2 Topic" headings get task-1-2 ids.
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-')
}

export function getHeadingId(text) {
  const taskMatch = String(text).match(/^(\d+)\.(\d+)\b/)
  return taskMatch ? `task-${taskMatch[1]}-${taskMatch[2]}` : slugify(text)
}

// Plain text of a markdown heading line, as react-markdown renders it.
export function headingText(markdownText) {
  return markdownText
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|`)/g, '')
    .replace(/\\(.)/g, '$1')
    .trim()
}

export function getHeadings(markdown) {
  const headings = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) continue
    const match = line.match(/^(#{2,4})\s+(.+?)\s*#*\s*$/)
    if (!match) continue
    const text = headingText(match[2])
    headings.push({ level: match[1].length, text, id: getHeadingId(text) })
  }
  return headings
}
