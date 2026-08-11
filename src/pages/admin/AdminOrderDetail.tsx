import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { trpc } from '../../providers/trpc'

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
  const syncHubSpot = trpc.orders.syncHubSpot.useMutation({
    onSuccess: (result) => {
      utils.orders.get.invalidate({ id: orderId })
      utils.orders.list.invalidate()
      if (result.status === 'disabled') {
        setSyncMessage('HubSpot sync is disabled because HUBSPOT_ACCESS_TOKEN is missing in Railway.')
        return
      }
      setSyncMessage(`Synced to HubSpot: contact ${result.contactId}, deal ${result.dealId}.`)
    },
    onError: (error) => {
      setSyncMessage(`HubSpot sync failed: ${error.message}`)
    },
  })

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!order) return <p className="text-sm text-muted-foreground">Order not found.</p>

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

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-bold">HubSpot sync</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Contact ID</dt>
            <dd className="font-semibold">{order.hubspotContactId ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Deal ID</dt>
            <dd className="font-semibold">{order.hubspotDealId ?? '—'}</dd>
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
