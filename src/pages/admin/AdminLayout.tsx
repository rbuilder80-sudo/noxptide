import { NavLink, Navigate, Outlet } from 'react-router'
import { LayoutDashboard, PackageSearch, Users, FileEdit, FlaskConical, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <p className="text-sm font-medium text-muted-foreground">Loading admin…</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!['admin', 'manager', 'support'].includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary px-4 text-center">
        <FlaskConical className="h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="text-xl font-bold">No admin access</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account ({user.email ?? user.name ?? 'unknown'}) does not have an admin, manager or
          support role. Ask the main admin to set your access level from the Team page.
        </p>
      </div>
    )
  }

  const links = [
    { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'support'] },
    { to: '/admin/orders', end: false, icon: PackageSearch, label: 'Orders', roles: ['admin', 'manager', 'support'] },
    { to: '/admin/cms', end: false, icon: FileEdit, label: 'SEO & Pages', roles: ['admin', 'manager'] },
    { to: '/admin/users', end: false, icon: Users, label: 'Team & Access', roles: ['admin'] },
  ].filter((l) => l.roles.includes(user.role))

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="flex w-16 flex-col border-r border-border bg-card md:w-60">
        <div className="flex items-center gap-2 border-b border-border px-3 py-4 md:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight md:block">
            Nox<span className="text-primary">ptide</span>
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
              {user.role}
            </span>
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2 md:p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-slate-100'
                }`
              }
            >
              <l.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              <span className="hidden md:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-2 md:p-3">
          <a href="/" className="mb-1 block rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-slate-100">
            ← Back to store
          </a>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
