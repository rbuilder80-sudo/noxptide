import { useMemo, useState } from 'react'
import { trpc } from '../../providers/trpc'
import { products } from '../../data/products'
import { guides } from '../../data/guides'

const STATIC_PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'shop', label: 'Peptides (shop)', path: '/shop' },
  { key: 'guides', label: 'Research Guides', path: '/guides' },
  { key: 'quality', label: 'Quality & COAs', path: '/quality' },
  { key: 'faq', label: 'FAQ', path: '/faq' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'shipping', label: 'Shipping', path: '/shipping' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'legal', label: 'Research Use Policy', path: '/legal' },
]

type PageDef = { key: string; label: string; path: string }

function Editor({ page, onSaved }: { page: PageDef; onSaved: () => void }) {
  const utils = trpc.useUtils()
  const { data } = trpc.cms.get.useQuery({ pageKey: page.key })
  const upsert = trpc.cms.upsert.useMutation({
    onSuccess: () => {
      utils.cms.get.invalidate({ pageKey: page.key })
      utils.cms.all.invalidate()
      onSaved()
    },
  })
  const [title, setTitle] = useState<string | null>(null)
  const [desc, setDesc] = useState<string | null>(null)
  const [content, setContent] = useState<string | null>(null)

  const t = title ?? data?.metaTitle ?? ''
  const d = desc ?? data?.metaDescription ?? ''
  const c = content ?? data?.content ?? ''

  return (
    <div className="space-y-4 border-t border-border/60 px-5 py-5">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta title (50–60 chars ideal)</span>
        <input
          value={t}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <span className={`mt-1 block text-xs ${t.length > 60 ? 'font-bold text-red-600' : 'text-muted-foreground'}`}>{t.length} chars</span>
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta description (140–160 chars ideal)</span>
        <textarea
          value={d}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <span className={`mt-1 block text-xs ${d.length > 160 ? 'font-bold text-red-600' : 'text-muted-foreground'}`}>{d.length} chars</span>
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content overrides (JSON, optional)</span>
        <textarea
          value={c}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder='{"heroHeading": "...", "announcement": "..."}'
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 font-mono text-xs outline-none focus:border-primary"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            upsert.mutate({ pageKey: page.key, metaTitle: t || null, metaDescription: d || null, content: c || null })
          }
          disabled={upsert.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {upsert.isPending ? 'Saving…' : 'Save changes'}
        </button>
        {upsert.isSuccess && <span className="text-sm font-semibold text-emerald-600">Saved — live on the site now.</span>}
        {upsert.error && <span className="text-sm font-semibold text-red-600">{upsert.error.message}</span>}
        {data?.updatedBy && (
          <span className="ml-auto text-xs text-muted-foreground">
            Last edited by {data.updatedBy} · {new Date(data.updatedAt).toLocaleString('en-GB')}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AdminCms() {
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const { data: rows } = trpc.cms.all.useQuery()

  const pages = useMemo<PageDef[]>(() => {
    const productPages = products.map((p) => ({ key: `product:${p.slug}`, label: p.name, path: `/product/${p.slug}` }))
    const guidePages = guides.map((g) => ({ key: `guide:${g.slug}`, label: `Guide: ${g.title}`, path: `/guides/${g.slug}` }))
    return [...STATIC_PAGES, ...productPages, ...guidePages]
  }, [])

  const overridden = new Set((rows ?? []).map((r) => r.pageKey))
  const shown = pages.filter((p) => (p.label + p.key).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">SEO & Pages</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Edit the meta title and description of any page — changes go live immediately, no redeploy
        needed. Pages with a saved override are marked.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pages…"
        className="mt-5 w-full max-w-sm rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border bg-card shadow-sm">
        {shown.map((p) => (
          <div key={p.key}>
            <button
              onClick={() => setOpen(open === p.key ? null : p.key)}
              className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left hover:bg-secondary"
            >
              <span className="text-sm font-semibold">
                {p.label}
                <span className="ml-2 text-xs font-normal text-muted-foreground">{p.path}</span>
              </span>
              <span className="flex items-center gap-2">
                {overridden.has(p.key) && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">edited</span>
                )}
                <span className="text-xs font-semibold text-primary">{open === p.key ? 'Close' : 'Edit'}</span>
              </span>
            </button>
            {open === p.key && <Editor page={p} onSaved={() => {}} />}
          </div>
        ))}
      </div>
    </div>
  )
}
