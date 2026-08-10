import { Link } from 'react-router'
import { Truck, Package, Clock, Globe } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'

export default function Shipping() {
  useSeo({
    pageKey: 'shipping',
    title: 'Shipping & Delivery | Noxptide UK — Same-Day Dispatch Before 4pm',
    description:
      'UK peptide delivery from Noxptide: same-day dispatch before 4pm Mon–Fri, tracked Royal Mail & DHL options, free over £25, discreet tamper-evident packaging, European shipping available.',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Shipping</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Shipping & Delivery</h1>
      <p className="mt-3 text-muted-foreground">
        Fast, tracked and discreet — because research timelines do not wait.
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
        <h2 id="coldchain" className="text-lg font-bold">Cold-Chain Options</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Lyophilised peptides are stable at ambient temperature for the duration of standard
          transit. For added assurance, insulated cold-pack shipping is available on request — just
          add a note at checkout or{' '}
          <Link to="/contact" className="font-semibold text-primary hover:underline">contact us</Link>{' '}
          before ordering.
        </p>
      </section>
    </div>
  )
}
