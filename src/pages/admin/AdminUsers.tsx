import { trpc } from '../../providers/trpc'
import { useAuth } from '../../hooks/useAuth'

const ROLES = ['user', 'support', 'manager', 'admin'] as const

const roleHelp: Record<string, string> = {
  user: 'No admin access',
  support: 'View & process orders',
  manager: 'Orders + SEO & page content',
  admin: 'Full control incl. team access',
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const utils = trpc.useUtils()
  const { data: users, isLoading } = trpc.users.list.useQuery()
  const setRole = trpc.users.setRole.useMutation({
    onSuccess: () => utils.users.list.invalidate(),
  })

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Team & Access</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Anyone who signs in with Kimi appears here. Set each person's access level — changes apply
        on their next request. Only admins can open this page.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 text-xs shadow-sm sm:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r}>
            <p className="font-bold capitalize text-primary">{r}</p>
            <p className="mt-1 text-muted-foreground">{roleHelp[r]}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Last sign-in</th>
                <th className="px-5 py-3">Access level</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                  <td className="px-5 py-3 font-semibold">
                    {u.name ?? '—'}
                    {u.id === me?.id && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">you</span>}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email ?? '—'}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString('en-GB') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      disabled={setRole.isPending || u.id === me?.id}
                      onChange={(e) => setRole.mutate({ id: u.id, role: e.target.value as (typeof ROLES)[number] })}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold capitalize outline-none focus:border-primary disabled:opacity-60"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {setRole.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{setRole.error.message}</p>
      )}
    </div>
  )
}
