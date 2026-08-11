import { useMemo, useState } from 'react'
import { trpc } from '../../providers/trpc'
import { products, formatGBP, type Product } from '../../data/products'

type RowState = { price: string; stock: string }
const rowKey = (slug: string, sizeLabel: string) => `${slug}::${sizeLabel}`

/** One editable size row: price + stock, saved independently. */
function SizeRow({
  product,
  sizeLabel,
  defaultPrice,
  edit,
  setEdit,
  override,
  onChanged,
}: {
  product: Product
  sizeLabel: string
  defaultPrice: number
  edit: RowState
  setEdit: (v: RowState) => void
  override?: { pricePence: number; stock: number; updatedBy: string | null; updatedAt: Date }
  onChanged: () => void
}) {
  const upsert = trpc.products.upsertVariant.useMutation({ onSuccess: onChanged })
  const remove = trpc.products.removeVariant.useMutation({ onSuccess: onChanged })

  const priceNum = parseFloat(edit.price)
  const stockNum = parseInt(edit.stock, 10)
  const valid =
    !Number.isNaN(priceNum) && priceNum >= 0 && !Number.isNaN(stockNum) && stockNum >= 0
  const dirty =
    override &&
    (Math.round(priceNum * 100) !== override.pricePence || stockNum !== override.stock)

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-5 py-3 font-semibold">{sizeLabel}</td>
      <td className="px-5 py-3 text-muted-foreground">{formatGBP(defaultPrice)}</td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">£</span>
          <input
            value={edit.price}
            onChange={(e) => setEdit({ ...edit, price: e.target.value })}
            inputMode="decimal"
            className="w-24 rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm outline-none focus:border-primary"
            aria-label={`Price for ${product.name} ${sizeLabel}`}
          />
        </div>
      </td>
      <td className="px-5 py-3">
        <input
          value={edit.stock}
          onChange={(e) => setEdit({ ...edit, stock: e.target.value })}
          inputMode="numeric"
          className="w-20 rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm outline-none focus:border-primary"
          aria-label={`Stock for ${product.name} ${sizeLabel}`}
        />
      </td>
      <td className="px-5 py-3">
        {override ? (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              override.stock === 0
                ? 'bg-red-100 text-red-700'
                : override.stock <= 10
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {override.stock === 0 ? 'Out of stock' : override.stock <= 10 ? 'Low stock' : 'In stock'}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
            Default
          </span>
        )}
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              upsert.mutate({
                productSlug: product.slug,
                sizeLabel,
                pricePence: Math.round(priceNum * 100),
                stock: stockNum,
              })
            }
            disabled={!valid || upsert.isPending}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {upsert.isPending ? 'Saving…' : dirty || !override ? 'Save' : 'Saved'}
          </button>
          {override && (
            <button
              onClick={() => remove.mutate({ productSlug: product.slug, sizeLabel })}
              disabled={remove.isPending}
              title="Revert to catalogue default price and unmanaged stock"
              className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              Reset
            </button>
          )}
        </div>
        {(upsert.error || remove.error) && (
          <p className="mt-1 text-xs font-semibold text-red-600">
            {(upsert.error ?? remove.error)?.message}
          </p>
        )}
        {override?.updatedBy && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {override.updatedBy} · {new Date(override.updatedAt).toLocaleString('en-GB')}
          </p>
        )}
      </td>
    </tr>
  )
}

export default function AdminProducts() {
  const [q, setQ] = useState('')
  const utils = trpc.useUtils()
  const { data: variantRows, isLoading } = trpc.products.variants.useQuery()
  const { data: overrides } = trpc.products.overrides.useQuery()
  const setStatus = trpc.products.setStatus.useMutation({
    onSuccess: () => utils.products.overrides.invalidate(),
  })

  const variantMap = useMemo(() => {
    const m = new Map<string, NonNullable<typeof variantRows>[number]>()
    for (const v of variantRows ?? []) m.set(rowKey(v.productSlug, v.sizeLabel), v)
    return m
  }, [variantRows])

  const hiddenMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const s of overrides?.statuses ?? []) m.set(s.productSlug, s.status)
    return m
  }, [overrides])

  /** Local edit state, initialised lazily from DB override or catalogue default. */
  const [edits, setEdits] = useState<Record<string, RowState>>({})
  const editFor = (slug: string, sizeLabel: string, defaultPrice: number): RowState => {
    const k = rowKey(slug, sizeLabel)
    if (edits[k]) return edits[k]
    const v = variantMap.get(k)
    return v
      ? { price: (v.pricePence / 100).toFixed(2), stock: String(v.stock) }
      : { price: defaultPrice.toFixed(2), stock: '' }
  }
  const setEditFor = (slug: string, sizeLabel: string) => (v: RowState) =>
    setEdits((prev) => ({ ...prev, [rowKey(slug, sizeLabel)]: v }))

  const onChanged = () => {
    utils.products.variants.invalidate()
    utils.products.overrides.invalidate()
  }

  const shown = products.filter((p) =>
    (p.name + p.slug + p.category).toLowerCase().includes(q.toLowerCase()),
  )

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Stock & Pricing</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Set the live price and stock level for every vial size. Changes apply to the storefront
        immediately — no redeploy. Setting stock to 0 marks the size as out of stock; hiding a
        product removes it from the shop entirely. Orders themselves are handled in HubSpot.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        className="mt-5 w-full max-w-sm rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
      />

      <div className="mt-4 space-y-4">
        {shown.map((p) => {
          const hidden = hiddenMap.get(p.slug) === 'hidden'
          return (
            <div
              key={p.slug}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/60 px-5 py-3">
                <div>
                  <span className="text-sm font-bold">{p.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">/product/{p.slug}</span>
                  {hidden && (
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                      Hidden from shop
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setStatus.mutate({
                        productSlug: p.slug,
                        status: hidden ? 'active' : 'hidden',
                      })
                    }
                    disabled={setStatus.isPending}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold disabled:opacity-50 ${
                      hidden
                        ? 'bg-emerald-600 text-white hover:opacity-90'
                        : 'border border-border text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {hidden ? 'Show in shop' : 'Hide from shop'}
                  </button>
                </div>
              </div>
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5">Size</th>
                    <th className="px-5 py-2.5">Catalogue price</th>
                    <th className="px-5 py-2.5">Live price</th>
                    <th className="px-5 py-2.5">Stock</th>
                    <th className="px-5 py-2.5">Status</th>
                    <th className="px-5 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {p.sizes.map((s) => (
                    <SizeRow
                      key={s.label}
                      product={p}
                      sizeLabel={s.label}
                      defaultPrice={s.price}
                      edit={editFor(p.slug, s.label, s.price)}
                      setEdit={setEditFor(p.slug, s.label)}
                      override={variantMap.get(rowKey(p.slug, s.label))}
                      onChanged={onChanged}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: per-product SEO (meta title & description) lives under{' '}
        <a href="/admin/cms" className="font-semibold text-primary hover:underline">
          SEO & Pages
        </a>
        .
      </p>
    </div>
  )
}
