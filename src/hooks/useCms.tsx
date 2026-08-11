import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type CmsMap = Record<string, { metaTitle: string | null; metaDescription: string | null; content: string | null }>

const CmsContext = createContext<CmsMap>({})

/**
 * Fetches all CMS page overrides once for the storefront.
 * Uses a plain fetch (not the tRPC client) so the heavy @trpc/react-query
 * stack stays out of the storefront's critical-path JavaScript.
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<CmsMap>({})
  useEffect(() => {
    let active = true
    fetch('/api/trpc/cms.all')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active || !d) return
        const rows = d?.result?.data?.json ?? []
        const next: CmsMap = {}
        for (const row of rows) {
          next[row.pageKey] = { metaTitle: row.metaTitle, metaDescription: row.metaDescription, content: row.content }
        }
        setMap(next)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return <CmsContext.Provider value={map}>{children}</CmsContext.Provider>
}

/** Returns the saved CMS override for a page key, if any. */
export function useCmsPage(pageKey: string) {
  const map = useContext(CmsContext)
  return map[pageKey] ?? null
}
