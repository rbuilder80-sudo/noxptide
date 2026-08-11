import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { CheckCircle2, Landmark, LoaderCircle, Lock, ShieldCheck, Truck } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { useCart } from '../context/CartContext'
import { formatGBP, getProduct } from '../data/products'
import { trpc } from '../providers/trpc'

const inputCls =
  'mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function Checkout() {
  useSeo({ ...coreSeo['/checkout'] })
  const { items, subtotal, discountRate, discountAmount, discountedSubtotal, clear, priceOf } = useCart()
  const [searchParams] = useSearchParams()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'next-day'>('standard')
  const checkoutReadiness = trpc.orders.checkoutReadiness.useQuery()
  const createOrder = trpc.orders.create.useMutation()
  const confirmPayment = trpc.orders.confirmPayment.useMutation()
  const paymentResult = searchParams.get('payment')
  const returnedOrder = searchParams.get('order') ?? ''
  const returnToken = searchParams.get('token') ?? ''
  const validReturn = Boolean(paymentResult && returnedOrder && returnToken.length === 48)
  const paymentQuery = trpc.orders.paymentStatus.useQuery(
    { orderNumber: returnedOrder, token: returnToken },
    {
      enabled: validReturn,
      refetchInterval: (query) => (query.state.data?.status === 'pending' ? 2000 : false),
    },
  )
  const confirmationStarted = useRef(false)
  const cartCleared = useRef(false)
  const shipping = shippingMethod === 'next-day' ? 8.99 : subtotal >= 25 ? 0 : 4.99
  const payByBankReady = checkoutReadiness.data?.payByBankReady ?? false
  const checkoutDisabled = createOrder.isPending || checkoutReadiness.isLoading || !payByBankReady

  useEffect(() => {
    if (paymentResult !== 'success' || !validReturn || confirmationStarted.current) return
    confirmationStarted.current = true
    void confirmPayment
      .mutateAsync({ orderNumber: returnedOrder, token: returnToken })
      .catch(() => undefined)
      .finally(() => paymentQuery.refetch())
  }, [confirmPayment, paymentQuery, paymentResult, returnToken, returnedOrder, validReturn])

  useEffect(() => {
    if (paymentQuery.data?.status !== 'paid' || cartCleared.current) return
    cartCleared.current = true
    clear()
  }, [clear, paymentQuery.data?.status])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    if (!payByBankReady) {
      setSubmitError('Pay by Bank is being connected right now. Please contact support@noxptide.co.uk before placing an order.')
      return
    }
    const fd = new FormData(e.currentTarget)
    try {
      const res = await createOrder.mutateAsync({
        customerName: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        phone: String(fd.get('phone') || ''),
        organisation: String(fd.get('org') || ''),
        addressLine1: String(fd.get('address1') || ''),
        addressLine2: String(fd.get('address2') || ''),
        city: String(fd.get('city') || ''),
        postcode: String(fd.get('postcode') || ''),
        country: 'United Kingdom',
        shippingMethod,
        items: items.map((it) => ({
          productSlug: it.slug,
          sizeLabel: it.sizeLabel,
          qty: it.qty,
        })),
      })
      window.location.assign(res.paymentLink)
    } catch {
      setSubmitError('Pay by Bank is temporarily unavailable. Please try again, or contact support@noxptide.co.uk.')
    }
  }

  if (validReturn && paymentQuery.data?.status === 'paid') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Payment received</h1>
        <p className="mt-4 text-lg font-semibold">Order reference: {returnedOrder}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Your bank confirmed the payment and your order is now being prepared. Tracking details
          and batch Certificates of Analysis will follow by email.
        </p>
        <Link to="/shop" className="mt-8 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground hover:opacity-90">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (validReturn && paymentResult === 'success') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <LoaderCircle className="h-16 w-16 animate-spin text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Confirming your bank payment</h1>
        <p className="mt-4 text-lg font-semibold">Order reference: {returnedOrder}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Please keep this page open while Wallid and your bank confirm the payment. This normally
          takes only a few seconds.
        </p>
      </div>
    )
  }

  if (validReturn && paymentResult === 'failed') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <Landmark className="h-16 w-16 text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Payment not completed</h1>
        <p className="mt-4 text-lg font-semibold">Order reference: {returnedOrder}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          No payment was taken. Your basket is still available, so you can return to checkout and
          try another bank.
        </p>
        <Link to="/checkout" className="mt-8 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground hover:opacity-90">
          Try Pay by Bank again
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
                    <input
                      type="radio"
                      name="ship"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-primary"
                    />
                    <span className="font-medium">Standard tracked (1–2 working days)</span>
                  </span>
                  <span className="font-semibold">{shipping === 0 ? 'Free' : formatGBP(4.99)}</span>
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ship"
                      value="next-day"
                      checked={shippingMethod === 'next-day'}
                      onChange={() => setShippingMethod('next-day')}
                      className="accent-primary"
                    />
                    <span className="font-medium">Next working day</span>
                  </span>
                  <span className="font-semibold">{formatGBP(8.99)}</span>
                </label>
              </div>
            </fieldset>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm" aria-labelledby="co-pay">
            <h2 id="co-pay" className="text-lg font-bold">3. Pay by Bank</h2>
            <div className="mt-4 flex gap-4 rounded-xl border border-primary/25 bg-secondary p-4">
              <Landmark className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-bold">Secure bank payment with Wallid</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Continue to Wallid, choose your bank, and approve the payment in your banking app.
                  Noxptide never sees or stores your bank login details.
                </p>
              </div>
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
                  <span className="font-semibold">{formatGBP(priceOf(it.slug, it.sizeLabel) * it.qty)}</span>
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
            disabled={checkoutDisabled}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {createOrder.isPending
              ? 'Opening Wallid…'
              : checkoutReadiness.isLoading
                ? 'Checking secure payment…'
                : payByBankReady
                  ? `Pay by Bank — ${formatGBP(discountedSubtotal + shipping)}`
                  : 'Pay by Bank being connected'}
          </button>
          {!checkoutReadiness.isLoading && !payByBankReady && !submitError && (
            <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              Pay by Bank is being connected right now. Email support@noxptide.co.uk and we will help complete the order.
            </p>
          )}
          {submitError && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>
          )}
          <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Batch COA included with every vial</li>
            <li className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Same-day dispatch before 4pm</li>
            <li className="flex items-center gap-2"><Landmark className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Secure Wallid Pay-by-Bank checkout</li>
          </ul>
        </aside>
      </form>
    </div>
  )
}
