import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import {
  appDir,
  answerKeyDir,
  questionSetDir,
  listSetFiles,
  parseAnswerKey,
  parseQuestionSet,
  readCoverage
} from './lib/content.mjs'

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in website/.env')
  process.exit(1)
}
if (!fs.existsSync(questionSetDir) || !fs.existsSync(answerKeyDir)) {
  console.error(`Question sets or answer keys not found next to ${appDir}`)
  process.exit(1)
}

const catalogUrl = pathToFileURL(path.join(appDir, 'src/content/catalog.js'))
const { routeForSource } = await import(catalogUrl.href)
const coverage = readCoverage()
const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } })

// Answer keys link to lessons as "../study-material/x.md#task"; store site routes instead.
function lessonUrl(href) {
  const [file, hash] = href.split('#')
  const route = routeForSource(file.replace(/^(\.\.\/)+/, ''))
  return route ? `${route}${hash ? `#${hash}` : ''}` : href
}

for (const file of listSetFiles(questionSetDir)) {
  const set = parseQuestionSet(fs.readFileSync(path.join(questionSetDir, file), 'utf8'), file)
  const setId = `set-${set.set}`
  const answerFile = path.join(answerKeyDir, file)
  const answers = fs.existsSync(answerFile)
    ? parseAnswerKey(fs.readFileSync(answerFile, 'utf8'), lessonUrl)
    : []
  const answerMap = new Map(answers.map((answer) => [answer.id, answer]))

  const { error: setError } = await supabase.from('question_sets').upsert({
    id: setId,
    title: set.title,
    set_number: set.set,
    question_count: set.question_count
  })
  if (setError) throw setError

  const questions = set.questions.map((question) => ({
    id: question.id,
    set_id: setId,
    number: question.number,
    prompt: question.prompt,
    response_mode: question.response_mode,
    required_answers: question.required_answers,
    options: question.options,
    domain: coverage.get(question.id)?.domain || null,
    task_id: coverage.get(question.id)?.task_id || null
  }))
  const { error: questionsError } = await supabase.from('questions').upsert(questions)
  if (questionsError) throw questionsError

  const missing = set.questions.filter((question) => !answerMap.has(question.id))
  if (missing.length) {
    console.warn(`${setId}: no answer key for ${missing.map((question) => question.id).join(', ')}`)
  }
  const answerRows = set.questions
    .map((question) => answerMap.get(question.id))
    .filter(Boolean)
    .map((answer) => ({
      question_id: answer.id,
      correct_answers: answer.correct_answers,
      concept_tested: answer.concept_tested,
      why_these_selections_fit: answer.why_these_selections_fit,
      lesson_links: answer.lesson_links,
      option_rationales: answer.option_rationales,
      common_trap: answer.common_trap,
      official_documentation: answer.official_documentation
    }))
  if (answerRows.length) {
    const { error: answersError } = await supabase.from('answer_keys').upsert(answerRows)
    if (answersError) throw answersError
  }

  console.log(`Seeded ${setId}: ${questions.length} questions, ${answerRows.length} answer keys`)
}
