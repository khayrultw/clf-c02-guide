import { useEffect } from 'react'

const siteTitle = 'CLF-C02 Study Guide'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${siteTitle}` : siteTitle
  }, [title])
}
