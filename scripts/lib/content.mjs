// Parses the study package markdown (the canonical content) into the
// structures used by the website and the Supabase seed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
export const appDir = path.resolve(scriptDir, '../..')
export const packageDir = path.resolve(appDir, '..')
export const questionSetDir = path.join(packageDir, 'question-sets')
export const answerKeyDir = path.join(packageDir, 'answer-keys')
export const coverageFile = path.join(packageDir, 'question-reports/question-coverage.csv')

function unescapeMarkdown(text) {
  return text.replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1')
}

function parseLinks(text) {
  return [...text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)]
    .map(([, label, url]) => ({ label, url }))
}

export function listSetFiles(dir) {
  return fs.readdirSync(dir).filter((file) => /^set-\d+\.md$/.test(file)).sort()
}

export function parseQuestionSet(markdown, fileName) {
  const title = markdown.match(/^# (.+)$/m)?.[1]?.trim()
  const setNumber = fileName.match(/set-(\d+)/)[1]
  const blocks = markdown.split(/^### /m).slice(1)
  const questions = blocks.map((block) => {
    const header = block.match(/^Question (\d+) of \d+ - (\S+)\s*\n/)
    if (!header) throw new Error(`${fileName}: unreadable question header: ${block.slice(0, 60)}`)
    const body = block.slice(header[0].length)
    const modeMatch = body.match(/^Choose (ONE|TWO|THREE)\.$/m)
    if (!modeMatch) throw new Error(`${fileName} ${header[2]}: missing "Choose ..." line`)
    const prompt = body.slice(0, modeMatch.index).trim()
    const options = [...body.slice(modeMatch.index).matchAll(/^([A-Z])\\?\.\s+(.+?)\s*$/gm)]
      .map(([, key, text]) => ({ key, text: unescapeMarkdown(text) }))
    const required = { ONE: 1, TWO: 2, THREE: 3 }[modeMatch[1]]
    return {
      id: header[2],
      number: Number(header[1]),
      prompt: unescapeMarkdown(prompt.replace(/\s*\n\s*/g, ' ')),
      response_mode: required === 1 ? 'choose_one' : 'choose_multiple',
      required_answers: required,
      options
    }
  })
  return { set: setNumber, title, question_count: questions.length, questions }
}

export function parseAnswerKey(markdown, resolveLessonUrl = (url) => url) {
  return markdown.split(/^## /m).slice(1)
    .filter((block) => block.startsWith('Q-'))
    .map((block) => {
      const id = block.match(/^(\S+)/)[1]
      const line = (label) => block.match(new RegExp(`^${label}: (.+)$`, 'm'))?.[1]?.trim() || null
      const conceptLine = line('Concept tested') || ''
      const lessonLinks = parseLinks(conceptLine)
        .map((link) => ({ label: link.label, url: resolveLessonUrl(link.url) }))
      const rationaleSection = block.split(/^Option-by-option rationale:$/m)[1] || ''
      const optionRationales = [...rationaleSection.matchAll(/^- ([A-Z]): (.+)$/gm)]
        .map(([, key, text]) => ({ key, text: text.trim() }))
      return {
        id,
        correct_answers: (line('Correct answers?') || '').split(',').map((key) => key.trim()).filter(Boolean),
        concept_tested: conceptLine.replace(/\s*\[[^\]]+\]\([^)]*\)/g, '').trim() || null,
        why_these_selections_fit: line('Why these selections fit'),
        lesson_links: lessonLinks,
        option_rationales: optionRationales,
        common_trap: line('Common trap'),
        official_documentation: parseLinks(line('Official documentation') || '')
      }
    })
}

function parseCsvLine(text) {
  const values = []
  let current = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quoted && char === '"' && text[index + 1] === '"') {
      current += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

export function readCoverage() {
  if (!fs.existsSync(coverageFile)) return new Map()
  const [header, ...rows] = fs.readFileSync(coverageFile, 'utf8').trim().split(/\r?\n/)
  const columns = parseCsvLine(header)
  return new Map(rows.map((row) => {
    const values = parseCsvLine(row)
    const record = Object.fromEntries(columns.map((column, index) => [column, values[index]]))
    return [record.question_id, { domain: record.domain || null, task_id: record.task_id || null }]
  }))
}
