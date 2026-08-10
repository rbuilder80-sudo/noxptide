import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { trpc } from '../providers/trpc'

type CmsMap = Record<string, { metaTitle: string | null; metaDescription: string | null; content: string | null }>

const CmsContext = createContext<CmsMap>({})

/** Fetches all CMS page overrides once for the storefront. */
export function CmsProvider({ children }: { children: ReactNode }) {
  const { data } = trpc.cms.all.useQuery(undefined, {
    staleTime: 1000 * 30,
    retry: false,
  })
  const map: CmsMap = {}
  for (const row of data ?? []) {
    map[row.pageKey] = { metaTitle: row.metaTitle, metaDescription: row.metaDescription, content: row.content }
  }
  return <CmsContext.Provider value={map}>{children}</CmsContext.Provider>
}

/** Returns the saved CMS override for a page key, if any. */
export function useCmsPage(pageKey: string) {
  const map = useContext(CmsContext)
  return map[pageKey] ?? null
}
