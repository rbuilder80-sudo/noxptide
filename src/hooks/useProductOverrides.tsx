import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface VariantOverride {
  productSlug: string
  sizeLabel: string
  pricePence: number
  stock: number
}

export interface ListingOverride {
  productSlug: string
  name: string | null
  tagline: string | null
  description: string | null
  categorySlug: string | null
  imageUrl: string | null
  detailsJson: string | null
}

interface OverridesMap {
  /** Keyed by `${productSlug}::${sizeLabel}`. */
  variants: Record<string, VariantOverride>
  /** Products hidden from the storefront by the admin. */
  hidden: Record<string, true>
  /** Listing-level overrides (name/description/category/image), keyed by product slug. */
  listings: Record<string, ListingOverride>
}

const EMPTY: OverridesMap = { variants: {}, hidden: {}, listings: {} }
const OverridesContext = createContext<OverridesMap>(EMPTY)

const key = (slug: string, sizeLabel: string) => `${slug}::${sizeLabel}`

/**
 * Fetches live price/stock and listing overrides once for the storefront.
 * Uses a plain fetch (not the tRPC client) so the heavy @trpc/react-query
 * stack stays out of the storefront's critical-path JavaScript — same
 * pattern as the CMS provider. On any failure the static catalogue
 * defaults apply, so the shop never breaks.
 */
export function ProductOverridesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<OverridesMap>(EMPTY)
  useEffect(() => {
    let active = true
    const fetchJson = (proc: string) =>
      fetch(`/api/trpc/${proc}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.result?.data?.json ?? null)
        .catch(() => null)
    Promise.all([fetchJson('products.overrides'), fetchJson('products.listingOverrides')]).then(
      ([overrides, listings]) => {
        if (!active) return
        const variants: OverridesMap['variants'] = {}
        for (const v of overrides?.variants ?? []) {
          variants[key(v.productSlug, v.sizeLabel)] = v
        }
        const hidden: OverridesMap['hidden'] = {}
        for (const s of overrides?.statuses ?? []) {
          if (s.status === 'hidden') hidden[s.productSlug] = true
        }
        const listingMap: OverridesMap['listings'] = {}
        for (const row of listings ?? []) {
          if (row?.productSlug) listingMap[row.productSlug] = row
        }
        setMap({ variants, hidden, listings: listingMap })
      },
    )
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

/** Listing-level override row for a product, or undefined when unmanaged. */
export function listingOverride(map: OverridesMap, slug: string): ListingOverride | undefined {
  return map.listings[slug]
}

/** Live listing name, falling back to the static catalogue value. */
export function liveName(map: OverridesMap, slug: string, fallback: string): string {
  return map.listings[slug]?.name ?? fallback
}

/** Live listing description, falling back to the static catalogue value. */
export function liveDescription(map: OverridesMap, slug: string, fallback: string): string {
  return map.listings[slug]?.description ?? fallback
}

/** Live listing image URL, or null when unmanaged (use static catalogue image). */
export function liveImage(map: OverridesMap, slug: string): string | null {
  return map.listings[slug]?.imageUrl ?? null
}

/** Live category slug, falling back to the static catalogue value. */
export function liveCategory(map: OverridesMap, slug: string, fallback: string): string {
  return map.listings[slug]?.categorySlug ?? fallback
}
