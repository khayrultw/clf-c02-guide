import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  useDocumentTitle('Forgot password')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (resetError) throw resetError
      setMessage('Check your email for a password reset link.')
    } catch (caught) {
      setError(caught.message || 'Could not send the reset email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1>Forgot password</h1>
        <p>Enter your account email to receive a secure reset link.</p>
        {error && <p className="form-message error" role="alert">{error}</p>}
        {message && <p className="form-message success" role="status">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <button className="button primary full" type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
      </div>
    </section>
  )
}
