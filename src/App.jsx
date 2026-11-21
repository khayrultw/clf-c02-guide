import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const DocumentPage = lazy(() => import('./pages/DocumentPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const PracticeIndexPage = lazy(() => import('./pages/PracticeIndexPage'))
const PracticeSetPage = lazy(() => import('./pages/PracticeSetPage'))
const MockExamPage = lazy(() => import('./pages/MockExamPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const EmailVerifiedPage = lazy(() => import('./pages/EmailVerifiedPage'))
import { useAuth } from './lib/AuthContext'
import { usePracticeNavigation } from './lib/PracticeNavigationContext'
import LoadingIndicator from './components/LoadingIndicator'

// Start each new page at the top; links with a #hash scroll to their heading instead.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PracticeRoute({ children }) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()
  if (loading) return <div className="loading-page"><LoadingIndicator /></div>
  if (isConfigured && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

function DashboardRoute({ children, adminOnly = false }) {
  const { user, loading, isConfigured, role } = useAuth()
  const location = useLocation()
  if (loading) return <div className="loading-page"><LoadingIndicator /></div>
  if (isConfigured && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const { user, signOut, isConfigured, role } = useAuth()
  const { practiceActive, guardedNavigate } = usePracticeNavigation()

  useEffect(() => {
    if (!practiceActive) return undefined

    function handleBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [practiceActive])

  function guardedLinkClick(event, destination) {
    if (!practiceActive) return
    event.preventDefault()
    guardedNavigate(destination)
  }

  useEffect(() => {
    if (!practiceActive) return undefined

    function handleInternalLink(event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest?.('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) return
      event.preventDefault()
      guardedNavigate(href)
    }

    document.addEventListener('click', handleInternalLink)
    return () => document.removeEventListener('click', handleInternalLink)
  }, [practiceActive, guardedNavigate])
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <NavLink
          className="brand"
          to="/"
          onClick={(event) => guardedLinkClick(event, '/')}
        >
          CLF-C02 Study Guide
        </NavLink>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/learn" onClick={(event) => guardedLinkClick(event, '/learn')}>Learn</NavLink>
          <NavLink to="/review" onClick={(event) => guardedLinkClick(event, '/review')}>Review</NavLink>
          <NavLink to="/reference" onClick={(event) => guardedLinkClick(event, '/reference')}>Reference</NavLink>
          <NavLink to="/practice" onClick={(event) => guardedLinkClick(event, '/practice')}>Practice</NavLink>
          {user && <NavLink to="/dashboard" onClick={(event) => guardedLinkClick(event, '/dashboard')}>Dashboard</NavLink>}
          {user && role === 'admin' && <NavLink to="/admin" onClick={(event) => guardedLinkClick(event, '/admin')}>Admin</NavLink>}
        </nav>
        {isConfigured && (
          user
            ? <button
                className="auth-button"
                type="button"
                onClick={() => guardedNavigate('/login', signOut)}
              >
                Sign out
              </button>
            : <NavLink className="auth-button" to="/login">Sign in</NavLink>
        )}
      </header>
      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={<div className="loading-page"><LoadingIndicator /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<CollectionPage collection="learn" />} />
            <Route path="/learn/:slug" element={<DocumentPage collection="learn" />} />
            <Route path="/review" element={<CollectionPage collection="review" />} />
            <Route path="/review/:slug" element={<DocumentPage collection="review" />} />
            <Route path="/reference" element={<CollectionPage collection="reference" />} />
            <Route path="/reference/:slug" element={<DocumentPage collection="reference" />} />
            <Route path="/practice" element={
              <PracticeRoute><PracticeIndexPage /></PracticeRoute>
            } />
            <Route path="/mock-exam" element={
              <PracticeRoute><MockExamPage /></PracticeRoute>
            } />
            <Route path="/practice/:setId" element={
              <PracticeRoute><PracticeSetPage /></PracticeRoute>
            } />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />
            <Route path="/dashboard" element={
              <DashboardRoute><DashboardPage /></DashboardRoute>
            } />
            <Route path="/admin" element={
              <DashboardRoute adminOnly><AdminDashboardPage /></DashboardRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}
