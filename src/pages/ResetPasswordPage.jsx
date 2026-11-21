import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getAuthLinkResult, minimumPasswordLength } from '../lib/authLinks'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [ready, setReady] = useState(null)
  const [linkResult] = useState(getAuthLinkResult)
  useDocumentTitle('Set new password')

  useEffect(() => {
    if (!supabase) return undefined
    if (linkResult.error) {
      setReady(false)
      return undefined
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true)
      else if (active) setReady((current) => current ?? false)
    })
    // The recovery session can arrive after the first check while the link is processed.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) setReady(true)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [linkResult])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setMessage('Password updated successfully. You can continue studying.')
      setPassword('')
      setConfirmPassword('')
    } catch (caught) {
      setError(caught.message || 'Could not update password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1>Set new password</h1>
        {ready === false && (
          <p className="warning">
            {linkResult.error || 'This reset link is invalid or expired.'}{' '}
            <Link to="/forgot-password">Request a new link.</Link>
          </p>
        )}
        {error && <p className="form-message error" role="alert">{error}</p>}
        {message && <p className="form-message success" role="status">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={minimumPasswordLength}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={minimumPasswordLength}
              required
            />
          </label>
          <button
            className="button primary full"
            type="submit"
            disabled={submitting || !isSupabaseConfigured || !ready}
          >
            {submitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
        <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
      </div>
    </section>
  )
}
