import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Question-only JSON used when Supabase is not configured. Answer keys only
// exist in Supabase, so local sets can be browsed but not checked.
const questionModules = import.meta.glob('./question-sets/*.json', { import: 'default' })

export function setIdFor(setNumber) {
  return `set-${String(setNumber).padStart(2, '0')}`
}

async function loadLocalPracticeSet(setNumber) {
  const key = Object.keys(questionModules).find((path) => path.endsWith(`/${setIdFor(setNumber)}.json`))
  if (!key) return null
  const questions = await questionModules[key]()
  return {
    set: questions.set,
    title: questions.title,
    questionCount: questions.question_count,
    questions: questions.questions
  }
}

async function loadLocalPracticeSets() {
  const sets = await Promise.all(Object.values(questionModules).map((load) => load()))
  return sets
    .map((questions) => ({
      set: questions.set,
      title: questions.title,
      questionCount: questions.question_count
    }))
    .sort((a, b) => a.set.localeCompare(b.set))
}

async function loadSupabasePracticeSets() {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('question_sets')
    .select('set_number,title,question_count')
    .order('set_number')
  if (error || !data?.length) return null
  return data.map((set) => ({
    set: set.set_number,
    title: set.title,
    questionCount: set.question_count
  }))
}

async function loadSupabasePracticeSet(setNumber) {
  if (!isSupabaseConfigured || !supabase) return null
  const setId = setIdFor(setNumber)

  const { data: setData, error: setError } = await supabase
    .from('question_sets')
    .select('set_number,title,question_count')
    .eq('id', setId)
    .maybeSingle()
  if (setError || !setData) return null

  const { data: questions, error: questionError } = await supabase
    .from('questions')
    .select('id,number,prompt,response_mode,required_answers,options')
    .eq('set_id', setId)
    .order('number')
  if (questionError || !questions?.length) return null

  return {
    set: setData.set_number,
    title: setData.title,
    questionCount: questions.length,
    questions,
    remote: true
  }
}

export async function loadPracticeSets() {
  return (await loadSupabasePracticeSets()) || loadLocalPracticeSets()
}

export async function loadPracticeSet(setNumber) {
  if (!/^\d+$/.test(String(setNumber || ''))) return null
  return (await loadSupabasePracticeSet(setNumber)) || loadLocalPracticeSet(setNumber)
}
