import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface VariantOverride {
  productSlug: string
  sizeLabel: string
  pricePence: number
  stock: number
}

interface OverridesMap {
  /** Keyed by `${productSlug}::${sizeLabel}`. */
  variants: Record<string, VariantOverride>
  /** Products hidden from the storefront by the admin. */
  hidden: Record<string, true>
}

const EMPTY: OverridesMap = { variants: {}, hidden: {} }
const OverridesContext = createContext<OverridesMap>(EMPTY)

const key = (slug: string, sizeLabel: string) => `${slug}::${sizeLabel}`

/**
 * Fetches live price/stock overrides once for the storefront.
 * Uses a plain fetch (not the tRPC client) so the heavy @trpc/react-query
 * stack stays out of the storefront's critical-path JavaScript — same
 * pattern as the CMS provider. On any failure the static catalogue
 * defaults apply, so the shop never breaks.
 */
export function ProductOverridesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<OverridesMap>(EMPTY)
  useEffect(() => {
    let active = true
    fetch('/api/trpc/products.overrides')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active || !d) return
        const data = d?.result?.data?.json
        if (!data) return
        const variants: OverridesMap['variants'] = {}
        for (const v of data.variants ?? []) {
          variants[key(v.productSlug, v.sizeLabel)] = v
        }
        const hidden: OverridesMap['hidden'] = {}
        for (const s of data.statuses ?? []) {
          if (s.status === 'hidden') hidden[s.productSlug] = true
        }
        setMap({ variants, hidden })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return <OverridesContext.Provider value={map}>{children}</OverridesContext.Provider>
}

export function useProductOverrides() {
  return useContext(OverridesContext)
}

/** Live price in pounds for a product size, or null when unmanaged (use static default). */
export function livePrice(map: OverridesMap, slug: string, sizeLabel: string): number | null {
  const v = map.variants[key(slug, sizeLabel)]
  return v ? v.pricePence / 100 : null
}

/** Live stock for a product size, or null when unmanaged (treated as in stock). */
export function liveStock(map: OverridesMap, slug: string, sizeLabel: string): number | null {
  const v = map.variants[key(slug, sizeLabel)]
  return v ? v.stock : null
}

/** True when the admin has hidden the product from the storefront. */
export function isProductHidden(map: OverridesMap, slug: string): boolean {
  return !!map.hidden[slug]
}
