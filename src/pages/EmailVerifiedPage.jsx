import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getAuthLinkResult } from '../lib/authLinks'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function EmailVerifiedPage() {
  const [linkResult] = useState(getAuthLinkResult)
  const [loading, setLoading] = useState(linkResult.fromEmailLink && !linkResult.error)
  useDocumentTitle('Email confirmation')

  useEffect(() => {
    if (!loading) return
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }
    // The confirmation link signs the user in; sign out so they log in deliberately.
    supabase.auth.signOut().finally(() => setLoading(false))
  }, [loading])

  let content
  if (loading) {
    content = <h1>Verifying email...</h1>
  } else if (linkResult.error) {
    content = (
      <>
        <p className="eyebrow">Email confirmation</p>
        <h1>Link not valid</h1>
        <p className="form-message error" role="alert">{linkResult.error}</p>
        <p>The confirmation link may have expired or already been used. Try signing in, or register again to receive a new link.</p>
        <Link className="button primary" to="/login">Go to login</Link>
      </>
    )
  } else if (linkResult.fromEmailLink) {
    content = (
      <>
        <p className="eyebrow">Email confirmation</p>
        <h1>Email verified</h1>
        <p>Your email address has been verified. Sign in to continue to the study website.</p>
        <Link className="button primary" to="/login">Go to login</Link>
      </>
    )
  } else {
    content = (
      <>
        <p className="eyebrow">Email confirmation</p>
        <h1>Check your email</h1>
        <p>Open the confirmation link from your registration email to verify your address.</p>
        <Link className="button primary" to="/login">Go to login</Link>
      </>
    )
  }

  return (
    <section className="auth-page">
      <div className="auth-card email-verified-card">{content}</div>
    </section>
  )
}
