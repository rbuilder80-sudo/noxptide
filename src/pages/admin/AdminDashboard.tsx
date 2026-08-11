import { Link } from 'react-router'
import { trpc } from '../../providers/trpc'
import { products } from '../../data/products'

export default function AdminDashboard() {
  const { data: overrides, isLoading } = trpc.products.overrides.useQuery()
  const { data: cmsRows } = trpc.cms.all.useQuery()

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>

  const variants = overrides?.variants ?? []
  const hidden = (overrides?.statuses ?? []).filter((s) => s.status === 'hidden').length
  const outOfStock = variants.filter((v) => v.stock === 0).length
  const lowStock = variants.filter((v) => v.stock > 0 && v.stock <= 10).length
  const seoEdits = (cmsRows ?? []).filter((r) => r.metaTitle || r.metaDescription).length

  const stats = [
    { label: 'Products live', value: String(products.length - hidden), to: '/admin/products' },
    { label: 'Hidden products', value: String(hidden), to: '/admin/products' },
    { label: 'Out of stock sizes', value: String(outOfStock), to: '/admin/products' },
    { label: 'Low stock sizes (≤10)', value: String(lowStock), to: '/admin/products' },
    { label: 'Pages with SEO edits', value: String(seoEdits), to: '/admin/cms' },
  ]

  const recentSeo = [...(cmsRows ?? [])]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Catalogue at a glance — stock, pricing and SEO. Orders and sales are handled in HubSpot.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">Recent SEO edits</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Page</th>
              <th className="px-5 py-3">Meta title</th>
              <th className="px-5 py-3">Edited by</th>
              <th className="px-5 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {recentSeo.map((r) => (
              <tr key={r.pageKey} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                <td className="px-5 py-3 font-semibold">
                  <Link to="/admin/cms" className="text-primary hover:underline">
                    {r.pageKey}
                  </Link>
                </td>
                <td className="max-w-xs truncate px-5 py-3 text-muted-foreground">
                  {r.metaTitle ?? '—'}
                </td>
                <td className="px-5 py-3">{r.updatedBy ?? '—'}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(r.updatedAt).toLocaleString('en-GB')}
                </td>
              </tr>
            ))}
            {recentSeo.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                  No SEO overrides yet — set meta titles and descriptions under SEO & Pages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
