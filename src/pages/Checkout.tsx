import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { CheckCircle2, Lock, ShieldCheck, Truck } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { useCart, unitPrice } from '../context/CartContext'
import { formatGBP, getProduct } from '../data/products'
import { trpc } from '../providers/trpc'

const inputCls =
  'mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function Checkout() {
  useSeo({ ...coreSeo['/checkout'] })
  const { items, subtotal, discountRate, discountAmount, discountedSubtotal, clear } = useCart()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const createOrder = trpc.orders.create.useMutation()
  const shipping = subtotal >= 25 ? 0 : 4.99

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    const fd = new FormData(e.currentTarget)
    const totalPence = Math.round((discountedSubtotal + shipping) * 100)
    try {
      const res = await createOrder.mutateAsync({
        customerName: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        phone: String(fd.get('phone') || ''),
        addressLine1: String(fd.get('address1') || ''),
        addressLine2: String(fd.get('address2') || ''),
        city: String(fd.get('city') || ''),
        postcode: String(fd.get('postcode') || ''),
        country: 'United Kingdom',
        subtotalPence: Math.round(subtotal * 100),
        discountPence: Math.round(discountAmount * 100),
        shippingPence: Math.round(shipping * 100),
        totalPence,
        notes: `Organisation: ${String(fd.get('org') || '')}`,
        items: items.map((it) => {
          const p = getProduct(it.slug)
          return {
            productSlug: it.slug,
            productName: p?.name ?? it.slug,
            sizeLabel: it.sizeLabel,
            unitPricePence: Math.round(unitPrice(it.slug, it.sizeLabel) * 100),
            qty: it.qty,
          }
        }),
      })
      setOrderNumber(res.orderNumber)
      clear()
    } catch {
      setSubmitError('We could not place your order just now. Please check your details and try again, or contact support@noxptide.co.uk.')
    }
  }

  if (orderNumber) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Order Confirmed</h1>
        <p className="mt-4 text-lg font-semibold">Order reference: {orderNumber}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Thank you for your order. A confirmation email with your tracking details and batch
          Certificates of Analysis reference will follow shortly. Orders placed before 4pm are
          dispatched the same working day.
        </p>
        <Link to="/shop" className="mt-8 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground hover:opacity-90">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) return <Navigate to="/cart" replace />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Secure Checkout</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
        Your details are encrypted and never shared.
      </p>

      <form className="mt-8 grid gap-8 lg:grid-cols-3" onSubmit={handleSubmit}>
        <div className="space-y-8 lg:col-span-2">
          {/* Contact */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm" aria-labelledby="co-contact">
            <h2 id="co-contact" className="text-lg font-bold">1. Contact Details</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Full name</span>
                <input required name="name" type="text" autoComplete="name" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Email</span>
                <input required name="email" type="email" autoComplete="email" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Phone (optional)</span>
                <input name="phone" type="tel" autoComplete="tel" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Organisation / Laboratory</span>
                <input required name="org" type="text" autoComplete="organization" className={inputCls} />
              </label>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm" aria-labelledby="co-ship">
            <h2 id="co-ship" className="text-lg font-bold">2. Delivery Address</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">Address line 1</span>
                <input required name="address1" type="text" autoComplete="address-line1" className={inputCls} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">Address line 2 (optional)</span>
                <input name="address2" type="text" autoComplete="address-line2" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">City</span>
                <input required name="city" type="text" autoComplete="address-level2" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Postcode</span>
                <input required name="postcode" type="text" autoComplete="postal-code" className={inputCls} />
              </label>
            </div>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Delivery speed</legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary">
                  <span className="flex items-center gap-2">
                    <input type="radio" name="ship" defaultChecked className="accent-primary" />
                    <span className="font-medium">Standard tracked (1–2 working days)</span>
                  </span>
                  <span className="font-semibold">{shipping === 0 ? 'Free' : formatGBP(4.99)}</span>
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary">
                  <span className="flex items-center gap-2">
                    <input type="radio" name="ship" className="accent-primary" />
                    <span className="font-medium">Next working day</span>
                  </span>
                  <span className="font-semibold">{formatGBP(8.99)}</span>
                </label>
              </div>
            </fieldset>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm" aria-labelledby="co-pay">
            <h2 id="co-pay" className="text-lg font-bold">3. Payment</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">Card number</span>
                <input required type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Expiry (MM/YY)</span>
                <input required type="text" placeholder="MM/YY" autoComplete="cc-exp" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">CVC</span>
                <input required type="text" inputMode="numeric" placeholder="123" autoComplete="cc-csc" className={inputCls} />
              </label>
            </div>
            <div className="mt-5 space-y-3">
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input required type="checkbox" className="mt-1 accent-primary" />
                <span>
                  I confirm that I am at least 18 years old, that I am purchasing all products
                  strictly for in-vitro laboratory research use only, and that I have the knowledge
                  and facilities to handle research compounds safely, in accordance with the{' '}
                  <Link to="/legal" className="font-semibold text-primary hover:underline">
                    Research Use Only Policy
                  </Link>.
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input required type="checkbox" className="mt-1 accent-primary" />
                <span>
                  I have read and agree to the{' '}
                  <Link to="/terms" className="font-semibold text-primary hover:underline">
                    Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-semibold text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  . For delivery outside the United Kingdom, I confirm the products are lawful to
                  import into the destination country.
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((it) => {
              const p = getProduct(it.slug)
              if (!p) return null
              return (
                <li key={`${it.slug}-${it.sizeLabel}`} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {p.name} {it.sizeLabel} × {it.qty}
                  </span>
                  <span className="font-semibold">{formatGBP(unitPrice(it.slug, it.sizeLabel) * it.qty)}</span>
                </li>
              )
            })}
          </ul>
          <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
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
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-semibold">{shipping === 0 ? 'Free' : formatGBP(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
              <dt>Total</dt>
              <dd>{formatGBP(discountedSubtotal + shipping)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={createOrder.isPending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {createOrder.isPending ? 'Placing Order…' : `Place Order — ${formatGBP(discountedSubtotal + shipping)}`}
          </button>
          {submitError && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>
          )}
          <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Batch COA included with every vial</li>
            <li className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Same-day dispatch before 4pm</li>
            <li className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Secure encrypted checkout</li>
          </ul>
        </aside>
      </form>
    </div>
  )
}
