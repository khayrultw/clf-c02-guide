import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({
  user: null,
  loading: true,
  isConfigured: false,
  profile: null,
  role: 'student',
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const latestSession = useRef(0)
  const loadedUserId = useRef(undefined)

  async function fetchProfile(sessionUser) {
    if (!sessionUser || !supabase) return null
    try {
      const { data: existing, error } = await supabase
        .from('profiles')
        .select('id,email,full_name,role')
        .eq('id', sessionUser.id)
        .maybeSingle()
      if (error) throw error
      if (existing) return existing

      // Profiles are normally created by the signup trigger; this covers older accounts.
      const { data: created, error: createError } = await supabase.rpc('ensure_profile')
      if (createError) throw createError
      return created
    } catch (error) {
      console.error('Could not load profile', error)
      return null
    }
  }

  async function applySession(sessionUser) {
    const requestId = ++latestSession.current
    if (sessionUser && sessionUser.id === loadedUserId.current) {
      // Token refreshes keep the same user; avoid refetching the profile.
      setUser(sessionUser)
      setLoading(false)
      return
    }
    const loadedProfile = await fetchProfile(sessionUser)
    if (requestId !== latestSession.current) return
    loadedUserId.current = sessionUser?.id || null
    setUser(sessionUser)
    setProfile(loadedProfile)
    setLoading(false)
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session?.user ?? null))

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Supabase queries inside this callback can deadlock the auth client, so defer them.
      setTimeout(() => applySession(session?.user ?? null), 0)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/email-verified`,
        ...(fullName ? { data: { full_name: fullName } } : {})
      }
    })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        profile,
        role: profile?.role || 'student',
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
