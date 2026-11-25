import { useEffect, useState } from 'react'

export default function useAdminQuery(load, deps) {
  const [state, setState] = useState({ data: null, error: '', loading: true })

  useEffect(() => {
    let active = true
    setState({ data: null, error: '', loading: true })
    load()
      .then((data) => {
        if (active) setState({ data, error: '', loading: false })
      })
      .catch((caught) => {
        if (active) setState({ data: null, error: caught.message || 'Progress could not be loaded.', loading: false })
      })
    return () => {
      active = false
    }
  }, deps)

  return state
}
