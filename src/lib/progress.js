import { examDomains } from '../content/catalog'

export function percent(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0
}

// Combines domain_performance rows (optionally for many users) into one row per exam domain.
export function summarizeDomains(rows) {
  return examDomains.map((domain) => {
    const matching = rows.filter((row) => String(row.domain) === domain.id)
    const answered = matching.reduce((sum, row) => sum + row.answered, 0)
    const correct = matching.reduce((sum, row) => sum + row.correct, 0)
    return { ...domain, answered, correct, accuracy: percent(correct, answered) }
  })
}

export function weakestDomain(rows, minimumAnswered = 5) {
  const candidates = summarizeDomains(rows).filter((domain) => domain.answered >= minimumAnswered)
  return candidates.sort((a, b) => a.accuracy - b.accuracy)[0] || null
}
