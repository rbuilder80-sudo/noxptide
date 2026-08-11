import { useEffect } from 'react'
import { useCmsPage } from './useCms'
import { DEFAULT_OG_IMAGE, INDEX_ROBOTS, SITE_URL } from '../data/seo'

interface SeoOptions {
  title: string
  description: string
  /** Absolute canonical URL — one self-referential www canonical per indexable URL. */
  canonical?: string
  /** Robots directive, e.g. noindex for system/legal routes. */
  robots?: string
  ogType?: 'website' | 'article' | 'product'
  ogImage?: string
  jsonLd?: object | object[]
  /** CMS page key — a saved admin override replaces title/description live. */
  pageKey?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Keeps title, description, canonical, robots, Open Graph/Twitter fields and
 * JSON-LD correct after client-side navigation. Values come from
 * src/data/seo.ts so client metadata can never contradict the prerendered
 * initial HTML (audit P0-3).
 */
export function useSeo({
  title,
  description,
  canonical,
  robots = INDEX_ROBOTS,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  pageKey,
}: SeoOptions) {
  const override = useCmsPage(pageKey ?? '')
  if (pageKey && override) {
    if (override.metaTitle) title = override.metaTitle
    if (override.metaDescription) description = override.metaDescription
  }
  useEffect(() => {
    const url = canonical ?? `${SITE_URL}${window.location.pathname}`
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    upsertCanonical(url)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    const scripts: HTMLScriptElement[] = []
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      for (const item of items) {
        const s = document.createElement('script')
        s.type = 'application/ld+json'
        s.dataset.pageSeo = 'true'
        s.textContent = JSON.stringify(item)
        document.head.appendChild(s)
        scripts.push(s)
      }
    }
    return () => {
      scripts.forEach((s) => s.remove())
    }
  }, [title, description, canonical, robots, ogType, ogImage, JSON.stringify(jsonLd ?? null)])
}
