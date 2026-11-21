// Copies the canonical study package content into src/content.
// The markdown at the package root is the source of truth; files under
// src/content are generated and are overwritten on every dev/build.
import fs from 'node:fs'
import path from 'node:path'
import { appDir, packageDir, questionSetDir, listSetFiles, parseQuestionSet } from './lib/content.mjs'

const contentDir = path.join(appDir, 'src/content')
const markdownSources = [
  { from: 'study-material', files: (name) => name.endsWith('.md') },
  { from: 'service-reference', files: (name) => name.endsWith('.md') }
]

if (!fs.existsSync(questionSetDir)) {
  console.log(`Study package not found at ${packageDir}; using existing ${path.relative(appDir, contentDir)}.`)
  process.exit(0)
}

for (const source of markdownSources) {
  const sourceDir = path.join(packageDir, source.from)
  const targetDir = path.join(contentDir, source.from)
  fs.mkdirSync(targetDir, { recursive: true })
  for (const file of fs.readdirSync(sourceDir).filter(source.files)) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file))
  }
}

// Question sets are written without answers; answers only live in Supabase.
const targetDir = path.join(contentDir, 'question-sets')
fs.mkdirSync(targetDir, { recursive: true })
for (const file of listSetFiles(questionSetDir)) {
  const set = parseQuestionSet(fs.readFileSync(path.join(questionSetDir, file), 'utf8'), file)
  fs.writeFileSync(
    path.join(targetDir, file.replace(/\.md$/, '.json')),
    `${JSON.stringify(set, null, 2)}\n`
  )
}

console.log(`Synced study content and question sets to ${path.relative(appDir, contentDir)}.`)
