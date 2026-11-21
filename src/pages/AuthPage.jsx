import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { minimumPasswordLength } from '../lib/authLinks'
import useDocumentTitle from '../lib/useDocumentTitle'

export default function AuthPage({ mode }) {
  const { user, isConfigured, signIn, signUp, signOut } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [confirmationPending, setConfirmationPending] = useState(false)
  const registration = mode === 'register'
  useDocumentTitle(registration ? 'Register' : 'Sign in')

  if (user && !registration) {
    return <Navigate to={location.state?.from || '/practice'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const result = registration
        ? await signUp(email.trim(), password, fullName.trim())
        : await signIn(email.trim(), password)

      if (result.error) throw result.error

      if (registration) {
        if (result.data?.session) {
          await signOut()
          setConfirmationPending(false)
          setMessage('Registration complete. Go to the login page to sign in.')
        } else {
          setConfirmationPending(true)
          setMessage('Check your email to confirm your account.')
        }
        setRegistrationComplete(true)
      }
    } catch (caught) {
      setError(caught.message || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      {registration && confirmationPending && (
        <div className="modal-backdrop">
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-email-title">
            <p className="eyebrow">Almost there</p>
            <h2 id="confirm-email-title">Confirm your email</h2>
            <p>
              We sent a confirmation link to <strong>{email}</strong>.
              Confirm it before signing in.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel-button" type="button" onClick={() => setConfirmationPending(false)}>
                Close
              </button>
              <Link className="button primary" to="/login">Go to sign in</Link>
            </div>
          </div>
        </div>
      )}
      <div className="auth-card">
        {registration && registrationComplete ? (
          <>
            <p className="eyebrow">Registration submitted</p>
            <h1>Check your email</h1>
            <p className="form-message success" role="status">
              {message}
            </p>
            {confirmationPending && (
              <p>
                We sent a confirmation link to <strong>{email}</strong>.
                Confirm it before signing in.
              </p>
            )}
            <Link className="button primary" to="/login">Go to login</Link>
          </>
        ) : (
          <>
        <p className="eyebrow">{registration ? 'Create account' : 'Welcome back'}</p>
        <h1>{registration ? 'Register for practice' : 'Sign in'}</h1>
        {error && <p className="form-message error" role="alert">{error}</p>}
        {message && <p className="form-message success" role="status">{message}</p>}
        <form onSubmit={handleSubmit}>
          {registration && (
            <label>
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}
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
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={registration ? 'new-password' : 'current-password'}
              minLength={registration ? minimumPasswordLength : undefined}
              required
            />
          </label>
          <button className="button primary full" type="submit" disabled={submitting || !isConfigured}>
            {submitting ? 'Please wait...' : registration ? 'Create account' : 'Sign in'}
          </button>
        </form>
        {!registration && (
          <p className="auth-switch">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        )}
        <p className="auth-switch">
          {registration ? 'Already have an account?' : 'New student?'}
          {' '}
          <Link to={registration ? '/login' : '/register'}>
            {registration ? 'Sign in' : 'Register'}
          </Link>
        </p>
          </>
        )}
      </div>
    </section>
  )
}
