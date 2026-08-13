import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { trpc } from '../../providers/trpc'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const STATUSES = ['pending', 'paid', 'processing', 'dispatched', 'completed', 'cancelled'] as const

function gbp(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)
  const utils = trpc.useUtils()
  const { data: order, isLoading } = trpc.orders.get.useQuery({ id: orderId }, { enabled: Number.isFinite(orderId) })
  const [notes, setNotes] = useState('')
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  useEffect(() => {
    if (order?.notes) setNotes(order.notes)
  }, [order?.notes])
  const update = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.get.invalidate({ id: orderId })
      utils.orders.list.invalidate()
    },
  })
  const { data: refunds } = trpc.orders.listRefunds.useQuery(
    { orderId },
    { enabled: Number.isFinite(orderId) },
  )
  const [courier, setCourier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [refundOpen, setRefundOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  useEffect(() => {
    if (order) {
      setCourier(order.courier ?? '')
      setTrackingNumber(order.trackingNumber ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id])
  const updateTracking = trpc.orders.updateTracking.useMutation({
    onSuccess: () => {
      utils.orders.get.invalidate({ id: orderId })
      utils.orders.list.invalidate()
    },
  })
  const addRefund = trpc.orders.addRefund.useMutation({
    onSuccess: () => {
      utils.orders.get.invalidate({ id: orderId })
      utils.orders.list.invalidate()
      utils.orders.listRefunds.invalidate({ orderId })
      setRefundOpen(false)
      setRefundAmount('')
      setRefundReason('')
    },
  })
  const syncHubSpot = trpc.orders.syncHubSpot.useMutation({
    onSuccess: (result) => {
      utils.orders.get.invalidate({ id: orderId })
      utils.orders.list.invalidate()
      if (result.status === 'disabled') {
        setSyncMessage('HubSpot sync is disabled because HUBSPOT_ACCESS_TOKEN is missing in Railway.')
        return
      }
      setSyncMessage(`Synced to HubSpot: contact ${result.contactId}, company ${result.companyId ?? '—'}, deal ${result.dealId}.`)
    },
    onError: (error) => {
      setSyncMessage(`HubSpot sync failed: ${error.message}`)
    },
  })

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!order) return <p className="text-sm text-muted-foreground">Order not found.</p>

  const refundedPence = order.refundedPence

  return (
    <div className="max-w-5xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All orders
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString('en-GB')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={syncHubSpot.isPending}
            onClick={() => {
              setSyncMessage(null)
              syncHubSpot.mutate({ id: order.id })
            }}
            className="rounded-lg border border-primary bg-card px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-secondary disabled:opacity-60"
          >
            {syncHubSpot.isPending ? 'Syncing HubSpot…' : 'Sync HubSpot'}
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={update.isPending}
              onClick={() => update.mutate({ id: order.id, status: s, notes })}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold capitalize transition ${
                order.status === s
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground/70 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {syncMessage && (
        <p className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">
          {syncMessage}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-bold">Customer & Delivery</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd className="font-semibold">{order.customerName}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd>{order.email}</dd></div>
            {order.phone && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd>{order.phone}</dd></div>}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-right">
                {order.addressLine1}
                {order.addressLine2 ? `, ${order.addressLine2}` : ''}, {order.city}, {order.postcode}, {order.country}
              </dd>
            </div>
          </dl>
          <label className="mt-6 block">
            <span className="text-sm font-semibold">Internal notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            onClick={() => update.mutate({ id: order.id, status: order.status, notes })}
            disabled={update.isPending}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            Save notes
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-bold">Items</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-4 border-b border-border/50 pb-2.5 last:border-0">
                <span>
                  {it.productName} <span className="text-muted-foreground">{it.sizeLabel}</span> × {it.qty}
                </span>
                <span className="font-semibold">{gbp(it.unitPricePence * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{gbp(order.subtotalPence)}</dd></div>
            {order.discountPence > 0 && (
              <div className="flex justify-between text-emerald-600"><dt>Volume discount</dt><dd>−{gbp(order.discountPence)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{order.shippingPence === 0 ? 'Free' : gbp(order.shippingPence)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold"><dt>Total</dt><dd>{gbp(order.totalPence)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-bold">Fulfilment & tracking</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">Courier</span>
              <input
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="Royal Mail"
                className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Tracking number</span>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="AB123456789GB"
                className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <button
            onClick={() =>
              updateTracking.mutate({
                orderId: order.id,
                courier: courier || undefined,
                trackingNumber: trackingNumber || undefined,
              })
            }
            disabled={updateTracking.isPending}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {updateTracking.isPending ? 'Saving…' : 'Save tracking'}
          </button>
          {updateTracking.isSuccess && !updateTracking.isPending && (
            <p className="mt-2 text-xs font-semibold text-emerald-700">Tracking saved.</p>
          )}
          {updateTracking.error && (
            <p className="mt-2 text-xs font-semibold text-red-700">{updateTracking.error.message}</p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">Refunds</h2>
            <button
              onClick={() => setRefundOpen(true)}
              disabled={refundedPence >= order.totalPence}
              className="rounded-lg border border-primary bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-secondary disabled:opacity-50"
            >
              Add refund
            </button>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Order total</dt>
              <dd>{gbp(order.totalPence)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total refunded</dt>
              <dd className={refundedPence > 0 ? 'font-bold text-red-700' : ''}>
                {gbp(refundedPence)}
              </dd>
            </div>
            {refundedPence >= order.totalPence && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-bold text-red-700">Fully refunded</dd>
              </div>
            )}
          </dl>
          <ul className="mt-4 space-y-2.5 text-sm">
            {(refunds ?? []).map((r) => (
              <li
                key={r.id}
                className="flex justify-between gap-4 border-b border-border/50 pb-2.5 last:border-0"
              >
                <span>
                  <span className="font-semibold">{gbp(r.amountPence)}</span>
                  {r.reason && <span className="text-muted-foreground"> — {r.reason}</span>}
                  <span className="block text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString('en-GB')}
                    {r.createdBy ? ` · ${r.createdBy}` : ''}
                  </span>
                </span>
              </li>
            ))}
            {(refunds ?? []).length === 0 && (
              <li className="text-muted-foreground">No refunds recorded.</li>
            )}
          </ul>
        </section>
      </div>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add refund — {order.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Up to {gbp(order.totalPence - refundedPence)} remaining of the {gbp(order.totalPence)}{' '}
              order total. Record refunds here after refunding the payment externally.
            </p>
            <div>
              <Label htmlFor="refund-amount">Amount (£)</Label>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-sm text-muted-foreground">£</span>
                <input
                  id="refund-amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="refund-reason">Reason</Label>
              <textarea
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            {addRefund.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                {addRefund.error.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setRefundOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const amount = Math.round(parseFloat(refundAmount) * 100)
                if (!Number.isFinite(amount) || amount <= 0) return
                addRefund.mutate({
                  orderId: order.id,
                  amountPence: amount,
                  reason: refundReason || undefined,
                })
              }}
              disabled={
                addRefund.isPending ||
                !Number.isFinite(parseFloat(refundAmount)) ||
                parseFloat(refundAmount) <= 0
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {addRefund.isPending ? 'Recording…' : 'Record refund'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-bold">HubSpot sync</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Contact ID</dt>
            <dd className="font-semibold">
              {order.hubspotContactUrl ? (
                <a
                  href={order.hubspotContactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Open contact {order.hubspotContactId}
                </a>
              ) : (
                order.hubspotContactId ?? '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Deal ID</dt>
            <dd className="font-semibold">
              {order.hubspotDealUrl ? (
                <a
                  href={order.hubspotDealUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Open deal {order.hubspotDealId}
                </a>
              ) : (
                order.hubspotDealId ?? '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Company ID</dt>
            <dd className="font-semibold">
              {order.hubspotCompanyUrl ? (
                <a
                  href={order.hubspotCompanyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Open company {order.hubspotCompanyId}
                </a>
              ) : (
                order.hubspotCompanyId ?? '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last synced</dt>
            <dd className="font-semibold">
              {order.hubspotSyncedAt ? new Date(order.hubspotSyncedAt).toLocaleString('en-GB') : 'Not synced yet'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last error</dt>
            <dd className="font-semibold text-amber-700">{order.hubspotSyncError ?? '—'}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
