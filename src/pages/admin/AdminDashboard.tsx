import { Link } from 'react-router'
import { trpc } from '../../providers/trpc'

function gbp(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

export default function AdminDashboard() {
  const { data: orders, isLoading } = trpc.orders.list.useQuery()

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  const all = orders ?? []
  const open = all.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const revenue = all.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPence, 0)

  const stats = [
    { label: 'Total orders', value: String(all.length) },
    { label: 'Open orders', value: String(open.length) },
    { label: 'Awaiting dispatch', value: String(all.filter((o) => ['paid', 'processing'].includes(o.status)).length) },
    { label: 'Revenue', value: gbp(revenue) },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">Latest orders</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {all.slice(0, 8).map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                <td className="px-5 py-3 font-semibold">
                  <Link to={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3">{o.customerName}</td>
                <td className="px-5 py-3 font-semibold">{gbp(o.totalPence)}</td>
                <td className="px-5 py-3 capitalize">{o.status}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleString('en-GB')}</td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No orders yet — they will appear here the moment a customer checks out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
