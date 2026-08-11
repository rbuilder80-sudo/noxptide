import { Link } from 'react-router'
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { useCart } from '../context/CartContext'
import { formatGBP, getProduct } from '../data/products'
import { ProductImage } from '../components/ProductCard'

export default function Cart() {
  useSeo({ ...coreSeo['/cart'] })
  const { items, setQty, removeItem, subtotal, discountRate, discountAmount, discountedSubtotal, priceOf } = useCart()
  const shipping = subtotal >= 25 || subtotal === 0 ? 0 : 4.99

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-14 text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Every peptide ships with its batch Certificate of Analysis.
          </p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground hover:opacity-90">
            Shop Peptides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card lg:col-span-2">
            {items.map((it) => {
              const p = getProduct(it.slug)
              if (!p) return null
              const price = priceOf(it.slug, it.sizeLabel)
              return (
                <li key={`${it.slug}-${it.sizeLabel}`} className="flex gap-4 p-5">
                  <ProductImage product={p} className="h-20 w-20 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/product/${p.slug}`} className="font-bold hover:text-primary">
                          {p.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {it.sizeLabel} · {p.purity} · COA included
                        </p>
                      </div>
                      <button onClick={() => removeItem(it.slug, it.sizeLabel)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-lg border border-border px-2 py-1">
                        <button onClick={() => setQty(it.slug, it.sizeLabel, it.qty - 1)} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                        <span className="w-6 text-center font-semibold">{it.qty}</span>
                        <button onClick={() => setQty(it.slug, it.sizeLabel, it.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                      </div>
                      <span className="font-extrabold">{formatGBP(price * it.qty)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatGBP(subtotal)}</dd>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between font-semibold text-emerald-600">
                  <dt>Volume discount ({discountRate * 100}% off)</dt>
                  <dd>−{formatGBP(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tracked UK delivery</dt>
                <dd className="font-semibold">{shipping === 0 ? 'Free' : formatGBP(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
                <dt>Total</dt>
                <dd>{formatGBP(discountedSubtotal + shipping)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground hover:opacity-90">
              Proceed to Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Batch COA with every vial · Research use only
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
