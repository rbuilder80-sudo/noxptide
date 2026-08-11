import { Link } from 'react-router'
import { X, Minus, Plus, Trash2, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatGBP, getProduct } from '../data/products'

export default function CartDrawer() {
  const { items, isOpen, setOpen, setQty, removeItem, subtotal, discountRate, discountAmount, discountedSubtotal, priceOf } = useCart()
  const freeShipThreshold = 25

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="rounded-lg p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our range of ≥99% purity research peptides.
              </p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Shop Peptides
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((it) => {
                const p = getProduct(it.slug)
                if (!p) return null
                const price = priceOf(it.slug, it.sizeLabel)
                return (
                  <li key={`${it.slug}-${it.sizeLabel}`} className="flex gap-4 py-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary"
                      aria-hidden="true"
                    >
                      {p.name.slice(0, 4)}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm font-semibold hover:text-primary"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{it.sizeLabel} · {p.purity}</p>
                        </div>
                        <button
                          onClick={() => removeItem(it.slug, it.sizeLabel)}
                          aria-label={`Remove ${p.name}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1">
                          <button onClick={() => setQty(it.slug, it.sizeLabel, it.qty - 1)} aria-label="Decrease quantity">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{it.qty}</span>
                          <button onClick={() => setQty(it.slug, it.sizeLabel, it.qty + 1)} aria-label="Increase quantity">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{formatGBP(price * it.qty)}</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            {subtotal < freeShipThreshold ? (
              <p className="mb-3 rounded-lg bg-secondary px-3 py-2 text-center text-xs font-medium text-secondary-foreground">
                Add {formatGBP(freeShipThreshold - subtotal)} more for free tracked UK delivery
              </p>
            ) : (
              <p className="mb-3 rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-accent-foreground">
                You've unlocked free tracked UK delivery
              </p>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatGBP(subtotal)}</span>
            </div>
            {discountRate > 0 ? (
              <div className="mt-1 flex items-center justify-between text-sm font-semibold text-emerald-600">
                <span>Volume discount ({discountRate * 100}% off)</span>
                <span>−{formatGBP(discountAmount)}</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Volume pricing: 20% off over £150 · 30% off over £500
              </p>
            )}
            <div className="mt-2 flex items-center justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatGBP(discountedSubtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Shipping calculated at checkout.</p>
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-lg bg-primary px-6 py-3.5 text-center text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Secure Checkout
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Batch COA supplied with every vial
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
