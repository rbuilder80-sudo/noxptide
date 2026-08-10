import { useEffect } from 'react'
import { useCmsPage } from './useCms'

interface SeoOptions {
  title: string
  description: string
  jsonLd?: object | object[]
  /** CMS page key — a saved admin override replaces title/description live. */
  pageKey?: string
}

/** Sets document title, meta description and optional JSON-LD structured data per page. */
export function useSeo({ title, description, jsonLd, pageKey }: SeoOptions) {
  const override = useCmsPage(pageKey ?? '')
  if (pageKey && override) {
    if (override.metaTitle) title = override.metaTitle
    if (override.metaDescription) description = override.metaDescription
  }
  useEffect(() => {
    document.title = title
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description

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
  }, [title, description, JSON.stringify(jsonLd ?? null)])
}
