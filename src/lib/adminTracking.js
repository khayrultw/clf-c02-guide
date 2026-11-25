import { examDomains } from '../content/catalog'
import { supabase, isSupabaseConfigured, fetchAllRows } from './supabase'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function requireClient() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured.')
  return supabase
}

async function callRpc(name, args) {
  const { data, error } = await requireClient().rpc(name, args)
  if (error) throw error
  return data
}

export async function loadAdminSummary() {
  const rows = await callRpc('admin_summary')
  return rows?.[0] ?? null
}

export function loadStudentOverview() {
  return fetchAllRows(() => requireClient().rpc('admin_student_overview'))
}

export async function loadStudentDetail(studentId) {
  if (!UUID_PATTERN.test(studentId)) return null
  return callRpc('admin_student_detail', { p_user_id: studentId })
}

export async function loadStudentPage(studentId) {
  const [students, detail] = await Promise.all([loadStudentOverview(), loadStudentDetail(studentId)])
  const student = students.find((row) => row.user_id === studentId) || null
  return { student, detail: student ? detail : null }
}

export function loadSetOverview() {
  return fetchAllRows(() => requireClient().rpc('admin_set_overview'))
}

export async function loadSetQuestions(setId) {
  return (await callRpc('admin_set_questions', { p_set_id: setId })) ?? []
}

export async function loadSetQuestionChoices(setId) {
  const { data, error } = await requireClient()
    .from('questions')
    .select('id,options,answer_keys(correct_answers)')
    .eq('set_id', setId)
  if (error) throw error
  return new Map((data || []).map((row) => {
    const key = Array.isArray(row.answer_keys) ? row.answer_keys[0] : row.answer_keys
    return [row.id, { options: row.options || [], correctAnswers: key?.correct_answers || [] }]
  }))
}

export async function loadSetPage(setId) {
  const [sets, questions, choices] = await Promise.all([
    loadSetOverview(),
    loadSetQuestions(setId),
    loadSetQuestionChoices(setId)
  ])
  const set = sets.find((row) => row.set_id === setId) || null
  const merged = questions.map((question) => ({
    ...question,
    ...(choices.get(question.question_id) || { options: [], correctAnswers: [] })
  }))
  return { set, questions: set ? merged : [] }
}

export function formatPercent(value) {
  return value === null || value === undefined ? '—' : `${value}%`
}

export function formatCorrectAnswered(correct, answered) {
  return `${correct ?? 0} / ${answered ?? 0}`
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : '—'
}

export function domainLabel(domainId) {
  const domain = examDomains.find((item) => item.id === String(domainId))
  return domain ? domain.title : `Domain ${domainId}`
}
