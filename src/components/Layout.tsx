import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, X, ShoppingCart, FlaskConical, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setOpen } = useCart()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Star sprite — Rating stars reference via <use>, saving ~650B inline SVG per star */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id="nox-star" viewBox="0 0 24 24">
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </symbol>
      </svg>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      {/* Header — Axon glass pill nav */}
      <header className="absolute inset-x-0 top-0 z-40 pt-4 md:pt-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md md:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="Noxptide home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B133C] text-white">
              <FlaskConical className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-[#1B133C]">
              Noxptide
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <NavLink to="/shop" className={navClass}>
              Peptides
            </NavLink>
            <NavLink to="/guides" className={navClass}>
              Research Guides
            </NavLink>
            <NavLink to="/quality" className={navClass}>
              Quality & COAs
            </NavLink>
            <NavLink to="/faq" className={navClass}>
              FAQ
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-[#1B133C] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              className="rounded-lg p-2 text-[#1B133C] lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            className="mx-4 mt-2 rounded-xl bg-white/90 px-4 py-4 shadow-sm backdrop-blur-md lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-secondary">
                Peptides
              </Link>
              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company
              </p>
              {[
                ['Research Guides', '/guides'],
                ['Quality & COAs', '/quality'],
                ['FAQ', '/faq'],
                ['About Us', '/about'],
                ['Shipping', '/shipping'],
                ['Contact', '/contact'],
                ['Research Use Terms', '/legal'],
              ].map(([label, to]) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm hover:bg-secondary">
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className={isHome ? 'flex-1' : 'flex-1 pt-28 md:pt-32'}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link to="/" className="flex items-center gap-2" aria-label="Noxptide home">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-primary">Noxptide</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The UK's quality-first research peptide supplier. Independently verified ≥99% purity,
              batch-specific Certificates of Analysis, and tracked delivery on every order.
            </p>
          </div>
          <nav aria-label="Shop peptides">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Peptides</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link className="hover:text-primary" to="/shop">All Peptides</Link></li>
              <li><Link className="hover:text-primary" to="/product/bpc-157">BPC-157</Link></li>
              <li><Link className="hover:text-primary" to="/product/tb-500">TB-500</Link></li>
              <li><Link className="hover:text-primary" to="/product/ipamorelin">Ipamorelin</Link></li>
              <li><Link className="hover:text-primary" to="/product/ghk-cu">GHK-Cu</Link></li>
            </ul>
          </nav>
          <nav aria-label="Support">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link className="hover:text-primary" to="/guides">Research Guides</Link></li>
              <li><Link className="hover:text-primary" to="/quality">Quality & COAs</Link></li>
              <li><Link className="hover:text-primary" to="/faq">FAQ</Link></li>
              <li><Link className="hover:text-primary" to="/shipping">Shipping & Delivery</Link></li>
              <li><Link className="hover:text-primary" to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link className="hover:text-primary" to="/legal">Research Use Only Policy</Link></li>
              <li><Link className="hover:text-primary" to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className="hover:text-primary" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary" to="/data-retention">Data Retention Policy</Link></li>
              <li><Link className="hover:text-primary" to="/admin">Staff Login</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Trust Signals</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Independent lab verification</li>
              <li className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-primary" aria-hidden="true" /> HPLC + MS on every batch</li>
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" aria-hidden="true" /> Same-day dispatch before 4pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Research Use Only.</strong> All products sold by
              Noxptide are intended strictly for in-vitro laboratory research and development. They
              are not medicines, supplements or cosmetics, and are not intended for human or
              veterinary use, consumption, or diagnostic purposes. By purchasing, you confirm you are
              a qualified researcher or institution and agree to our{' '}
              <Link to="/legal" className="underline hover:text-primary">Research Use Terms</Link>.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Noxptide Ltd · United Kingdom · All prices include VAT where applicable.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  )
}
