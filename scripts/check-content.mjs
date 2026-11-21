import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(scriptDir, '..')
const contentDir = path.resolve(packageDir, 'src/content')
const { allPages } = await import(pathToFileURL(path.join(contentDir, 'catalog.js')).href)
const { getHeadings } = await import(pathToFileURL(path.join(contentDir, 'slug.js')).href)

let failed = false
function fail(message) {
  console.error(message)
  failed = true
}

const headingIds = new Map()
for (const entry of allPages) {
  const file = path.join(contentDir, entry.source)
  if (!fs.existsSync(file)) {
    fail(`Missing: ${entry.title} -> ${entry.source}`)
    continue
  }
  // The page's H1 is replaced by the catalog title, so only H2-H4 get ids.
  const markdown = fs.readFileSync(file, 'utf8').replace(/^# .+\n/, '')
  const ids = getHeadings(markdown).map((heading) => heading.id)
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
  if (duplicates.length) fail(`Duplicate heading ids in ${entry.source}: ${duplicates.join(', ')}`)
  headingIds.set(entry.source, new Set(ids))
}

let links = 0
for (const entry of allPages) {
  if (!headingIds.has(entry.source)) continue
  const markdown = fs.readFileSync(path.join(contentDir, entry.source), 'utf8')
  for (const [, href] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue
    links += 1
    const [file, hash] = href.split('#')
    const target = file
      ? path.posix.normalize(path.posix.join(path.posix.dirname(entry.source), file))
      : entry.source
    if (!headingIds.has(target)) {
      // Rendered as plain text on the site (for example instructor-only reports).
      console.warn(`Note: ${entry.source} links to unpublished ${target}; shown as text.`)
    } else if (hash && !headingIds.get(target).has(hash)) {
      fail(`${entry.source}: broken anchor: ${href}`)
    }
  }
}

// Question sets must agree with their answer keys and the coverage CSV.
const { answerKeyDir, questionSetDir, listSetFiles, parseAnswerKey, parseQuestionSet, readCoverage } =
  await import(pathToFileURL(path.join(scriptDir, 'lib/content.mjs')).href)
let questionCount = 0
if (fs.existsSync(questionSetDir)) {
  const coverage = readCoverage()
  const seenPrompts = new Map()
  for (const file of listSetFiles(questionSetDir)) {
    const set = parseQuestionSet(fs.readFileSync(path.join(questionSetDir, file), 'utf8'), file)
    const keyFile = path.join(answerKeyDir, file)
    const answers = fs.existsSync(keyFile)
      ? new Map(parseAnswerKey(fs.readFileSync(keyFile, 'utf8')).map((answer) => [answer.id, answer]))
      : new Map()
    set.questions.forEach((question, index) => {
      questionCount += 1
      const where = `${file} ${question.id}`
      const keys = question.options.map((option) => option.key)
      if (question.number !== index + 1) fail(`${where}: numbered ${question.number}, expected ${index + 1}`)
      if (new Set(keys).size !== keys.length) fail(`${where}: duplicate option keys`)
      const prompt = question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
      if (seenPrompts.has(prompt)) fail(`${where}: same prompt as ${seenPrompts.get(prompt)}`)
      seenPrompts.set(prompt, question.id)
      if (!coverage.get(question.id)?.domain) fail(`${where}: missing from question-coverage.csv`)
      const answer = answers.get(question.id)
      if (!answer) return fail(`${where}: no answer key`)
      if (answer.correct_answers.length !== question.required_answers) {
        fail(`${where}: ${answer.correct_answers.length} correct answers for a choose-${question.required_answers} question`)
      }
      if (answer.correct_answers.some((key) => !keys.includes(key))) fail(`${where}: answer is not an option`)
      const rationaleKeys = answer.option_rationales.map((rationale) => rationale.key).sort().join()
      if (rationaleKeys !== [...keys].sort().join()) fail(`${where}: rationales do not match the options`)
      const markedCorrect = answer.option_rationales
        .filter((rationale) => rationale.text.startsWith('Correct'))
        .map((rationale) => rationale.key).sort().join()
      if (markedCorrect !== [...answer.correct_answers].sort().join()) fail(`${where}: rationale marks disagree with the key`)
    })
    const extra = [...answers.keys()].filter((id) => !set.questions.some((question) => question.id === id))
    if (extra.length) fail(`${file}: answer key has entries without questions: ${extra.join(', ')}`)
  }
}

if (failed) process.exit(1)
console.log(`Validated ${allPages.length} pages, ${links} internal links, and ${questionCount} questions with their answer keys.`)
