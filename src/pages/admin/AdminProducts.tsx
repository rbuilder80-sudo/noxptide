import { useMemo, useState } from 'react'
import { trpc } from '../../providers/trpc'
import { products, categories, formatGBP, type Product } from '../../data/products'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

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

type ListingOverrideRow = {
  productSlug: string
  name: string | null
  tagline: string | null
  description: string | null
  categorySlug: string | null
  imageUrl: string | null
}

/** Dialog to edit storefront listing copy (name/tagline/description/category/image) for one product. */
function ListingDialog({
  product,
  override,
  onClose,
  onChanged,
}: {
  product: Product
  override?: ListingOverrideRow
  onClose: () => void
  onChanged: () => void
}) {
  const [name, setName] = useState(override?.name ?? product.name)
  const [tagline, setTagline] = useState(override?.tagline ?? product.subtitle ?? '')
  const [description, setDescription] = useState(
    override?.description ?? product.description.join('\n\n'),
  )
  const [categorySlug, setCategorySlug] = useState(override?.categorySlug ?? product.category)
  const [imageUrl, setImageUrl] = useState(override?.imageUrl ?? '')

  const upsert = trpc.products.upsertListing.useMutation({
    onSuccess: () => {
      onChanged()
      onClose()
    },
  })
  const remove = trpc.products.removeListing.useMutation({
    onSuccess: () => {
      onChanged()
      onClose()
    },
  })

  const inputCls =
    'mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary'

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit listing — {product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
          <div>
            <Label htmlFor="li-name">Name</Label>
            <input id="li-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label htmlFor="li-tagline">Tagline</Label>
            <input
              id="li-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label htmlFor="li-description">Description</Label>
            <textarea
              id="li-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={inputCls}
            />
          </div>
          <div>
            <Label htmlFor="li-category">Category</Label>
            <select
              id="li-category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="li-image">Image URL (optional)</Label>
            <input
              id="li-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/products/example.webp"
              className={inputCls}
            />
          </div>
          {(upsert.error || remove.error) && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {(upsert.error ?? remove.error)?.message}
            </p>
          )}
        </div>
        <DialogFooter className="flex-wrap gap-2">
          {override && (
            <button
              onClick={() => remove.mutate({ productSlug: product.slug })}
              disabled={remove.isPending || upsert.isPending}
              className="mr-auto rounded-lg border border-border px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {remove.isPending ? 'Reverting…' : 'Revert to catalogue'}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              upsert.mutate({
                productSlug: product.slug,
                name: name.trim() || undefined,
                tagline: tagline.trim() || null,
                description: description.trim() || null,
                categorySlug: categorySlug || null,
                imageUrl: imageUrl.trim() || null,
              })
            }
            disabled={!name.trim() || upsert.isPending || remove.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {upsert.isPending ? 'Saving…' : 'Save listing'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminProducts() {
  const [q, setQ] = useState('')
  const utils = trpc.useUtils()
  const { data: variantRows, isLoading } = trpc.products.variants.useQuery()
  const { data: overrides } = trpc.products.overrides.useQuery()
  const { data: listingRows } = trpc.products.listingOverrides.useQuery()
  const [editingListing, setEditingListing] = useState<string | null>(null)

  const listingMap = useMemo(() => {
    const m = new Map<string, ListingOverrideRow>()
    for (const r of listingRows ?? []) m.set(r.productSlug, r)
    return m
  }, [listingRows])
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
    utils.products.listingOverrides.invalidate()
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
        product removes it from the shop entirely. Use the dashboard to push this catalogue into
        HubSpot Products or import HubSpot Product edits back into the live shop.
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
                  {listingMap.has(p.slug) && (
                    <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-700">
                      Listing edited
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingListing(p.slug)}
                    className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary"
                  >
                    Edit listing
                  </button>
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
      {editingListing &&
        (() => {
          const p = products.find((x) => x.slug === editingListing)
          if (!p) return null
          return (
            <ListingDialog
              product={p}
              override={listingMap.get(p.slug)}
              onClose={() => setEditingListing(null)}
              onChanged={onChanged}
            />
          )
        })()}
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
