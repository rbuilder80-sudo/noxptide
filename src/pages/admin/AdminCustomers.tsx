import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, Search } from 'lucide-react'
import { trpc } from '../../providers/trpc'

function gbp(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

const statusCls: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-sky-100 text-sky-800',
  processing: 'bg-violet-100 text-violet-800',
  dispatched: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-600',
}

const PAGE_SIZE = 50

function CustomerDetail({ email }: { email: string }) {
  const { data: customer, isLoading } = trpc.customers.detail.useQuery({ email })

  if (isLoading) return <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
  if (!customer) return <p className="mt-8 text-sm text-muted-foreground">Customer not found.</p>

  const aovPence =
    customer.ordersCount > 0 ? Math.round(customer.totalSpentPence / customer.ordersCount) : 0

  return (
    <div>
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All customers
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{customer.customerName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total spent', value: gbp(customer.totalSpentPence) },
          { label: 'Orders', value: String(customer.ordersCount) },
          { label: 'Avg order value', value: gbp(aovPence) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-bold">Order history</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                <td className="px-5 py-3 font-semibold">
                  <Link to={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString('en-GB')}
                </td>
                <td className="max-w-xs truncate px-5 py-3 text-muted-foreground">
                  {o.items.map((it) => `${it.productName} ${it.sizeLabel} ×${it.qty}`).join(', ')}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusCls[o.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold">{gbp(o.totalPence)}</td>
              </tr>
            ))}
            {customer.orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No orders for this customer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminCustomers() {
  const [params, setParams] = useSearchParams()
  const email = params.get('email')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim())
      setOffset(0)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const { data: customers, isLoading } = trpc.customers.list.useQuery({
    q: debouncedQ || undefined,
    limit: PAGE_SIZE,
    offset,
  })

  if (email) return <CustomerDetail email={email} />

  const rows = customers ?? []

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Aggregated from order history — click a row for the full order history and spend breakdown.
      </p>

      <div className="relative mt-5 w-full max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Total spent</th>
                  <th className="px-5 py-3">Last order</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr
                    key={c.email}
                    onClick={() => setParams({ email: c.email })}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary"
                  >
                    <td className="px-5 py-3 font-semibold">{c.customerName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3">{c.ordersCount}</td>
                    <td className="px-5 py-3 font-semibold">{gbp(c.totalSpentPence)}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(c.lastOrderAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing {offset + 1}–{offset + rows.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                disabled={offset === 0}
                className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground/70 hover:bg-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setOffset(offset + PAGE_SIZE)}
                disabled={rows.length < PAGE_SIZE}
                className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground/70 hover:bg-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
