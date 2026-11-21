import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Supabase removes auth tokens and errors from the URL once it has read them,
// so the original values are captured before the client is created.
const initialAuthParams = new URLSearchParams(window.location.search)
new URLSearchParams(window.location.hash.replace(/^#/, ''))
  .forEach((value, key) => initialAuthParams.set(key, value))

export function getInitialAuthParams() {
  return initialAuthParams
}

export const isSupabaseConfigured = Boolean(url && anonKey)
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null

// Supabase returns at most 1000 rows per request by default, so long lists are
// read page by page. buildQuery must return a fresh, consistently ordered query.
export async function fetchAllRows(buildQuery, pageSize = 1000) {
  const rows = []
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1)
    if (error) throw error
    rows.push(...(data || []))
    if (!data || data.length < pageSize) return rows
  }
}
