import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PracticeNavigationContext = createContext({
  practiceActive: false,
  setPracticeActive: () => {},
  guardedNavigate: () => {}
})

export function PracticeNavigationProvider({ children }) {
  const navigate = useNavigate()
  const [practiceActive, setPracticeActive] = useState(false)
  const [pendingDestination, setPendingDestination] = useState(null)

  function guardedNavigate(destination, onConfirm) {
    if (!practiceActive) {
      if (onConfirm) onConfirm()
      navigate(destination)
      return
    }
    setPendingDestination({ destination, onConfirm })
  }

  function leavePractice() {
    const pending = pendingDestination
    setPendingDestination(null)
    setPracticeActive(false)
    if (pending) {
      if (pending.onConfirm) pending.onConfirm()
      if (pending.destination) navigate(pending.destination)
    }
  }

  function stayHere() {
    setPendingDestination(null)
  }

  const modalVisible = Boolean(pendingDestination)
  const stayButton = useRef(null)

  useEffect(() => {
    if (!modalVisible) return undefined
    const previousFocus = document.activeElement
    stayButton.current?.focus()
    function handleKeyDown(event) {
      if (event.key === 'Escape') setPendingDestination(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [modalVisible])

  return (
    <PracticeNavigationContext.Provider value={{ practiceActive, setPracticeActive, guardedNavigate }}>
      {children}
      {modalVisible && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="leave-practice-title">
            <p className="eyebrow">Practice in progress</p>
            <h2 id="leave-practice-title">Leave this practice set?</h2>
            <p>Your answers are saved and you can resume later.</p>
            <div className="modal-actions">
              <button className="modal-cancel-button" type="button" onClick={stayHere} ref={stayButton}>
                Stay here
              </button>
              <button className="button primary" type="button" onClick={leavePractice}>
                Leave set
              </button>
            </div>
          </section>
        </div>
      )}
    </PracticeNavigationContext.Provider>
  )
}

export function usePracticeNavigation() {
  return useContext(PracticeNavigationContext)
}
