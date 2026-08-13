import { Link } from 'react-router'
import { ArrowRight, ShieldCheck, FlaskConical, Truck, FileCheck, Star, Quote, BadgePercent } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Enter, Reveal, RevealGroup, RevealItem } from '../components/motion'

const steps = [
  {
    icon: FlaskConical,
    title: 'Synthesised & Purified',
    text: 'Every peptide is produced by solid-phase synthesis and purified by preparative HPLC to ≥99%.',
  },
  {
    icon: ShieldCheck,
    title: 'Independently Verified',
    text: 'Third-party HPLC purity analysis and mass spectrometry identity confirmation on every batch.',
  },
  {
    icon: FileCheck,
    title: 'COA Before You Buy',
    text: 'Batch-specific Certificates of Analysis available on request before you place an order.',
  },
  {
    icon: Truck,
    title: 'Tracked UK Delivery',
    text: 'Same-day dispatch before 4pm, discreet tamper-evident packaging, free over £25.',
  },
]

const testimonials = [
  {
    quote:
      'The documentation standard is the best we have seen from any UK supplier. COAs match independent retesting every time.',
    author: 'Postdoctoral Researcher, Russell Group University',
  },
  {
    quote:
      'Consistent purity across twelve months of orders. Noxptide is now our sole peptide supplier for assay work.',
    author: 'Laboratory Manager, Cambridge Biotech',
  },
  {
    quote:
      'Ordered before 4pm, arrived next morning with full batch paperwork. Exactly what a research lab needs.',
    author: 'R&D Scientist, London',
  },
]

export default function Home() {
  useSeo({ pageKey: 'home', ...coreSeo['/'] })

  // Best sellers shown below the full-range grid — deliberately disjoint from
  // the first eight products so the two sections never repeat the same cards.
  const featured = products.filter((p) =>
    ['melanotan-2', 'aod-9604', 'mots-c', 'kpv'].includes(p.slug),
  )

  return (
    <div>
      {/* Hero — one message, one visual, one action: verifiable purity */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(27,19,60,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.05),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:pt-32 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#1B133C]/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Every batch independently verified to ≥99% purity
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                UK research peptides with{' '}
                <em className="italic text-accent">verifiable ≥99% purity</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                The UK's quality-first research peptide supplier — synthesis-grade compounds,
                batch-specific Certificates of Analysis, and same-day dispatch from UK stock.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
                >
                  Shop Research Peptides <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/quality"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1B133C]/10 bg-white/70 px-7 py-4 text-base font-bold text-foreground backdrop-blur-sm transition hover:border-[#1B133C]/30"
                >
                  Verify Our Quality
                </Link>
              </div>

              {/* Trust row — the four facts that close a peptide buyer */}
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#1B133C]/10 pt-6 sm:grid-cols-4">
                {[
                  { icon: ShieldCheck, text: '≥99% purity — HPLC-verified, every batch' },
                  { icon: FileCheck, text: 'Batch COA with every order' },
                  { icon: Truck, text: 'Same-day dispatch before 4pm' },
                  { icon: BadgePercent, text: 'Volume pricing — up to 30% off' },
                ].map((t) => (
                  <li key={t.text} className="flex items-start gap-2.5">
                    <t.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-xs font-semibold leading-snug text-foreground/80">
                      {t.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Single product visual with two proof badges — no card clutter */}
            <div className="relative hidden lg:block">
              <Enter>
                <div className="overflow-hidden rounded-3xl border border-[#1B133C]/10 shadow-2xl shadow-[#1B133C]/15">
                  {/* CSS background: not downloaded on mobile where this column is hidden */}
                  <div
                    role="img"
                    aria-label="Noxptide research peptide vials with batch Certificates of Analysis"
                    className="h-[26rem] w-full bg-cover bg-center"
                    style={{ backgroundImage: "url(/images/hero-vials.webp)" }}
                  />
                </div>
              </Enter>
              <Enter delay={0.15} className="absolute left-5 top-8">
                <div className="glass-card p-4 shadow-xl shadow-[#1B133C]/10">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Current batch purity
                  </p>
                  <p className="mt-0.5 font-display text-3xl text-foreground">
                    ≥99<span className="text-lg text-accent">%</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    HPLC + MS verified
                  </p>
                </div>
              </Enter>
              <Enter delay={0.3} className="absolute -right-4 bottom-10">
                <div className="glass-card flex items-center gap-3 p-4 shadow-xl shadow-[#1B133C]/10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FileCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Batch COA</p>
                    <p className="text-[11px] text-muted-foreground">Certificate with every vial</p>
                  </div>
                </div>
              </Enter>
            </div>
          </div>
        </div>
      </section>

      {/* Quality statement */}
      <section className="relative overflow-hidden border-y border-border bg-white" aria-label="Our quality promise">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,19,60,0.04),transparent_60%)]"
          aria-hidden="true"
        />
        <Reveal className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The Noxptide Standard
          </p>
          <p className="mt-6 font-display text-2xl leading-snug tracking-tight text-foreground sm:text-3xl md:text-[2.5rem] md:leading-[1.2]">
            High purity peptides for UK laboratories — every batch verified by independent HPLC
            and mass spectrometry, every vial shipped with its Certificate of Analysis.
          </p>
          <p className="mt-6 font-display text-lg italic tracking-tight text-muted-foreground sm:text-xl">
            No guesswork. No compromises. Just verifiable quality.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-accent" aria-hidden="true" />
        </Reveal>
      </section>

      {/* All peptides */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="peptides-heading">
        <div className="flex items-end justify-between">
          <div>
            <h2 id="peptides-heading" className="text-3xl font-extrabold tracking-tight">
              Peptides
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              The complete research peptide range — every batch independently verified, every vial
              shipped with its Certificate of Analysis. If you are looking to buy peptides in the
              UK for laboratory research, this is a peptide shop UK laboratories can verify before
              they spend a penny: documented peptide purity, not promises.
            </p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            View all peptides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) =>
            i < 4 ? (
              // First row: visible immediately (no JS-gated reveal) so Speed Index
              // doesn't wait for idle hydration; first two images load eager.
              <ProductCard key={p.slug} product={p} eager={i < 2} />
            ) : (
              <RevealItem key={p.slug}><ProductCard product={p} /></RevealItem>
            ),
          )}
        </RevealGroup>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all peptides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-secondary py-16 sm:py-20" aria-labelledby="bestsellers-heading">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 id="bestsellers-heading" className="text-3xl font-extrabold tracking-tight">
                Most Ordered by UK Laboratories
              </h2>
              <p className="mt-2 text-muted-foreground">
                The peptides researchers reorder — batch after verified batch.
              </p>
            </div>
            <Link to="/shop" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              Shop all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <RevealItem key={p.slug}><ProductCard product={p} /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Quality process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="quality-heading">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="quality-heading" className="text-3xl font-extrabold tracking-tight">
            Why Researchers Choose Noxptide
          </h2>
          <p className="mt-3 text-muted-foreground">
            Because in research, undocumented purity is no purity at all. We built our entire
            operation around verifiable quality.
          </p>
        </Reveal>
        <div className="mt-12 overflow-hidden rounded-3xl border border-border shadow-lg">
          <img
            src="/images/quality-lab.webp"
            alt="Noxptide analyst inspecting a research peptide vial beside HPLC instrumentation"
            width={1600}
            height={859}
            loading="lazy"
            decoding="async"
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/quality" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            Read our full quality commitment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Us vs them */}
      <section className="bg-secondary py-16 sm:py-20" aria-labelledby="compare-heading">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="compare-heading" className="text-3xl font-extrabold tracking-tight">
              Noxptide vs the Typical UK Supplier
            </h2>
            <p className="mt-3 text-muted-foreground">
              We built Noxptide by listing everything that frustrated us as peptide buyers — then
              fixing every one of them.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-5 py-4 font-bold">What matters to your lab</th>
                  <th className="px-5 py-4 font-bold text-primary">Noxptide</th>
                  <th className="px-5 py-4 font-bold text-foreground/70">Typical supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Purity verification', 'Independent lab, every batch', 'Often in-house or unverified'],
                  ['Certificate of Analysis', 'Batch-specific, available before you buy', 'Generic, or only after purchase'],
                  ['Purity standard', '≥99% — failed batches destroyed', '"Up to 99%" claims'],
                  ['Dispatch', 'Same day, before 4pm', '2–5 days is common'],
                  ['Volume pricing', 'Automatic: 20% off £150+, 30% off £500+', 'Rare, or negotiation required'],
                  ['If it goes wrong', '7-day money-back guarantee + price match', 'Store credit at best'],
                ].map(([what, us, them]) => (
                  <tr key={what}>
                    <th className="px-5 py-3.5 font-semibold">{what}</th>
                    <td className="px-5 py-3.5 font-medium text-emerald-800">✓ {us}</td>
                    <td className="px-5 py-3.5 text-foreground/70">✗ {them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-20" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4">
          <h2 id="testimonials-heading" className="text-center text-3xl font-extrabold tracking-tight">
            Trusted by Research Teams Across the UK
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author} className="rounded-2xl bg-card/10 p-6 backdrop-blur">
                <Quote className="h-6 w-6 opacity-60" aria-hidden="true" />
                <blockquote className="mt-4 leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-4 text-sm opacity-80">{t.author}</figcaption>
                <div className="mt-3 flex gap-1" role="img" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & company */}
      <section className="border-t border-border bg-white py-16 sm:py-20" aria-labelledby="resources-heading">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 id="resources-heading" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                A UK Research Peptide Supplier You Can Check
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Noxptide is a UK-based supplier of research-use-only peptides. We hold stock in the
                UK, dispatch from the UK, and back every claim we make with batch documentation you
                can request before ordering. All compounds are supplied strictly for in-vitro
                laboratory research — never for human or veterinary use.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Beyond the catalogue, we publish practical laboratory resources: how to approach{' '}
                <Link to="/guides/peptide-reconstitution-storage-guide" className="font-semibold text-primary hover:underline">
                  peptide reconstitution and peptide storage
                </Link>{' '}
                correctly, and{' '}
                <Link to="/guides/how-to-read-peptide-coa" className="font-semibold text-primary hover:underline">
                  how to read a Certificate of Analysis
                </Link>{' '}
                so you can verify any supplier's claims — ours included.
              </p>
            </div>
            <nav className="grid gap-3 sm:grid-cols-2" aria-label="Key pages">
              {[
                { to: '/shop', label: 'Shop peptides UK', desc: 'Browse the full batch-verified catalogue.' },
                { to: '/quality', label: 'Quality & COAs', desc: 'Our testing standards and release workflow.' },
                { to: '/guides', label: 'Research Guides', desc: 'Handling, storage and COA reading guides.' },
                { to: '/shipping', label: 'Shipping & Delivery', desc: 'Dispatch times and tracked UK delivery.' },
                { to: '/about', label: 'About Noxptide', desc: 'Who we are and how we work.' },
                { to: '/contact', label: 'Contact', desc: 'COA requests and order support.' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <p className="flex items-center justify-between font-bold text-foreground group-hover:text-primary">
                    {l.label}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-r from-secondary to-accent p-8 text-center sm:p-14">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Order With Confidence Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Batch-verified purity, full documentation, tracked UK delivery. Your research deserves
            peptides you never have to second-guess.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            Browse the Full Catalogue <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="mt-6 text-xs text-muted-foreground">
            All products are supplied strictly for laboratory research use only.
          </p>
        </div>
      </section>
    </div>
  )
}
