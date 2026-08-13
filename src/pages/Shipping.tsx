import { Link } from 'react-router'
import { Truck, Package, Clock, Globe } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

export default function Shipping() {
  useSeo({ pageKey: 'shipping', ...coreSeo['/shipping'] })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Shipping</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Research Peptide Shipping &amp; Delivery</h1>
      <p className="mt-3 text-muted-foreground">
        Fast, tracked and discreet — because research timelines do not wait. This page covers
        research peptide delivery UK-wide and across Europe: dispatch times, delivery estimates,
        weekend and bank-holiday handling, what happens if a parcel goes missing, and how
        temperature is managed in transit.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {[
          {
            icon: Clock,
            title: 'Same-Day Dispatch',
            text: 'Orders placed before 4pm Monday–Friday leave our UK facility the same day. Orders after 4pm or at weekends dispatch the next working day.',
          },
          {
            icon: Truck,
            title: 'UK Delivery Options',
            text: 'Standard tracked (1–2 working days) — £4.99, or free over £25. Next-working-day tracked — £8.99. All UK orders are fully tracked from dispatch to door.',
          },
          {
            icon: Package,
            title: 'Discreet, Secure Packaging',
            text: 'Every order ships in plain, tamper-evident packaging. Vials are sterile-sealed, cushioned and protected from light where required. No external indication of contents.',
          },
          {
            icon: Globe,
            title: 'European Delivery',
            text: 'Tracked international shipping to most European countries, typically 3–7 working days. Customers are responsible for import compliance in their jurisdiction.',
          },
        ].map((c) => (
          <article key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <c.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl bg-secondary p-6" aria-labelledby="coldchain">
        <h2 id="coldchain" className="text-lg font-bold">Temperature Control: What We Do and Don't Promise</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Lyophilised peptides are stable at ambient temperature for the duration of standard
          transit — independent stability data supports this for the compounds we supply. For added
          assurance, insulated cold-pack shipping is available on request: add a note at checkout
          or{' '}
          <Link to="/contact" className="font-semibold text-primary hover:underline">contact us</Link>{' '}
          before ordering. We do not operate refrigerated courier services, so once your parcel
          arrives, prompt peptide storage at -20°C matters more than the journey itself — see our{' '}
          <Link to="/guides/peptide-reconstitution-storage-guide" className="font-semibold text-primary hover:underline">
            storage and reconstitution guide
          </Link>{' '}
          for best practice.
        </p>
      </section>

      {/* Dispatch vs delivery, weekends, lost parcels */}
      <section className="mt-10 grid gap-6 sm:grid-cols-2" aria-label="Delivery detail">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Dispatch Estimates vs Delivery Estimates</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Dispatch is when your order leaves our facility; delivery is when the carrier reaches
            you. Our 4pm same-day promise covers dispatch. Delivery estimates (1–2 working days
            standard, next working day at checkout) are carrier estimates, not guarantees —
            tracking is provided on every order so you always know where your parcel is.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Weekends &amp; Bank Holidays</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We dispatch Monday–Friday, excluding UK bank holidays. Orders placed after 4pm on
            Friday, over a weekend or on a bank holiday dispatch the next working day, and carrier
            delivery estimates count working days only.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Lost or Delayed Parcels</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            If tracking has not updated for several days, or your order has passed its estimated
            delivery window, contact us with your order number. We will open an investigation with
            the carrier the same working day; once a parcel is confirmed lost, we reship or refund
            in full — your choice. Delayed UK peptide delivery is rare, but when it happens you
            will not be left chasing a carrier alone.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Documentation in Every Box</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every order ships with its batch-specific Certificate of Analysis, so the peptide
            purity verified by independent HPLC peptide testing travels with the material. All
            products are supplied for laboratory research use only. Ordering research peptides UK
            labs can rely on starts with paperwork you can check — see{' '}
            <Link to="/quality" className="font-semibold text-primary hover:underline">our quality standards</Link>{' '}
            and <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>.
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-3xl bg-gradient-to-r from-secondary to-accent p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Order Before 4pm for Same-Day Dispatch</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Browse the catalogue of peptides UK laboratories reorder batch after batch — tracked,
          discreet and documented, for laboratory research use only.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
        >
          Shop Research Peptides
        </Link>
      </section>
    </div>
  )
}
