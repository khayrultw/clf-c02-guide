const markdownModules = import.meta.glob(['./study-material/*.md', './service-reference/*.md'], {
  query: '?raw',
  import: 'default'
})

export async function loadMarkdownSource(entry) {
  const key = Object.keys(markdownModules).find((path) => path.endsWith(`/${entry.source}`))
  return key ? markdownModules[key]() : ''
}
