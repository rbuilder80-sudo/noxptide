import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '../../providers/trpc'

const STATUSES = ['pending', 'paid', 'processing', 'dispatched', 'completed', 'cancelled'] as const

const statusCls: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-sky-100 text-sky-800',
  processing: 'bg-violet-100 text-violet-800',
  dispatched: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-600',
}

function gbp(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

export default function AdminOrders() {
  const [filter, setFilter] = useState<string>('open')
  const utils = trpc.useUtils()
  const { data: orders, isLoading } = trpc.orders.list.useQuery()
  const update = trpc.orders.updateStatus.useMutation({
    onSuccess: () => utils.orders.list.invalidate(),
  })

  const all = orders ?? []
  const shown =
    filter === 'open'
      ? all.filter((o) => !['completed', 'cancelled'].includes(o.status))
      : filter === 'all'
        ? all
        : all.filter((o) => o.status === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Orders</h1>
        <div className="flex gap-1.5 rounded-xl border border-border bg-card p-1 text-xs font-semibold shadow-sm">
          {['open', 'all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 capitalize transition ${
                filter === s ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Placed</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                  <td className="px-5 py-3 font-semibold">
                    <Link to={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{o.customerName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.email}</td>
                  <td className="px-5 py-3 font-semibold">{gbp(o.totalPence)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      disabled={update.isPending}
                      onChange={(e) =>
                        update.mutate({ id: o.id, status: e.target.value as (typeof STATUSES)[number] })
                      }
                      className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize outline-none ${statusCls[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-card text-foreground">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleString('en-GB')}</td>
                  <td className="px-5 py-3">
                    {o.status !== 'completed' && o.status !== 'cancelled' && (
                      <button
                        onClick={() => update.mutate({ id: o.id, status: 'completed' })}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No orders in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
