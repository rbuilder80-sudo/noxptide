import { Link } from 'react-router'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { trpc } from '../../providers/trpc'
import { products } from '../../data/products'

export default function AdminDashboard() {
  const { data: overrides, isLoading } = trpc.products.overrides.useQuery()
  const { data: cmsRows } = trpc.cms.all.useQuery()
  const { data: integrationStatus } = trpc.integrations.status.useQuery()

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

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Ecommerce integrations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live checkout needs Wallid payment keys and HubSpot needs a private app token before
              orders can sync into CRM.
            </p>
          </div>
          {integrationStatus?.ecommerceReady ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Needs setup
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <IntegrationTile
            label="HubSpot CRM"
            ready={integrationStatus?.hubspot.ready}
            detail={
              integrationStatus?.hubspot.verified
                ? `Verified: ${integrationStatus.hubspot.checkedObjects.join(', ')}`
                : integrationStatus?.hubspot.error
                  ? `Token found, but verification failed: ${integrationStatus.hubspot.error}`
                  : 'Contacts, deals, line items and product catalogue sync'
            }
          />
          <IntegrationTile
            label="Wallid Pay-by-Bank"
            ready={integrationStatus?.wallid.ready}
            detail="Checkout payment session and webhook secrets"
          />
          <IntegrationTile
            label="Public site URL"
            ready={integrationStatus?.site.publicSiteUrlConfigured}
            detail={integrationStatus?.site.publicSiteUrl ?? 'https://www.noxptide.co.uk'}
          />
        </div>

        {integrationStatus && integrationStatus.missingVariables.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-bold">Missing Railway variables:</p>
            <p className="mt-1 font-mono text-xs">
              {integrationStatus.missingVariables.join(', ')}
            </p>
          </div>
        )}
      </section>

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

function IntegrationTile({
  label,
  ready,
  detail,
}: {
  label: string
  ready?: boolean
  detail: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">{label}</p>
        {ready ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  )
}
