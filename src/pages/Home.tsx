import { Link } from 'react-router'
import { ArrowRight, ShieldCheck, FlaskConical, Truck, FileCheck, Star, Quote } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
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
  const homeFaqs = [
    {
      q: 'What are research peptides?',
      a: 'Research peptides are short chains of amino acids synthesised for laboratory study. They are used by universities, contract research organisations and private laboratories to investigate biological pathways in controlled, in-vitro settings. Noxptide supplies research peptides strictly for laboratory use — never for human or veterinary administration.',
    },
    {
      q: 'Where can I buy high-purity research peptides in the UK?',
      a: 'Noxptide supplies UK laboratories with ≥99% purity research peptides, independently verified by HPLC and mass spectrometry. Every order includes a batch-specific Certificate of Analysis, ships from within the UK with tracked delivery (free over £25), and is dispatched the same day when ordered before 4pm Monday–Friday.',
    },
    {
      q: 'How do I verify a peptide supplier is legitimate?',
      a: 'Ask three questions: Is purity verified by an independent laboratory rather than in-house? Can you see the batch-specific Certificate of Analysis before ordering? Does the supplier operate clear research-use-only compliance? Noxptide answers yes to all three — and will send any current batch COA within one working hour of your request.',
    },
    {
      q: 'Which research peptides do UK laboratories order most?',
      a: 'The most-ordered compounds at Noxptide are BPC-157 and TB-500 for tissue-repair research, Ipamorelin and CJC-1295 for endocrine research, and Semax and Selank for neuroscience research. All are stocked in the UK at ≥99% purity with full analytical documentation.',
    },
  ]

  useSeo({
    pageKey: 'home',
    title: 'Noxptide | Buy UK Research Peptides — ≥99% Purity, COA With Every Batch',
    description:
      "The UK's quality-first research peptide supplier. BPC-157, TB-500, Ipamorelin and more — independently HPLC & MS verified to ≥99% purity, batch COAs, tracked UK delivery. Research use only.",
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  })

  const featured = products.filter((p) => ['bpc-157', 'tb-500', 'ipamorelin', 'ghk-cu'].includes(p.slug))

  return (
    <div>
      {/* Hero — MotionSites style: light, typography-led, floating stat cards */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(27,19,60,0.07),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.06),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-32 sm:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Enter>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#1B133C]/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Every batch independently verified to ≥99% purity
              </p>
              </Enter>
              <Enter>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Research peptides{' '}
                <em className="italic text-accent">your lab can trust</em>
              </h1>
              </Enter>
              <Enter>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                The UK's quality-first research peptide supplier — synthesis-grade compounds,
                batch-specific Certificates of Analysis, and same-day dispatch from UK stock.
              </p>
              </Enter>
              <Enter>
              <div className="mt-8 flex flex-wrap gap-4">
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
                  Our Quality Standard
                </Link>
              </div>
              </Enter>
            </div>

            {/* Floating stat cards over hero visual */}
            <div className="relative hidden flex-col items-end gap-4 lg:flex">
              <Enter>
              <div className="glass-card mb-2 w-full max-w-md overflow-hidden p-2 shadow-xl shadow-[#1B133C]/10">
                {/* CSS background: not downloaded on mobile where this column is hidden */}
                <div
                  role="img"
                  aria-label="Noxptide research peptide vials with batch Certificates of Analysis"
                  className="h-44 w-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: "url(/images/hero-vials.webp)" }}
                />
              </div>
              </Enter>
              <Enter>
              <div className="glass-card w-72 p-5 shadow-xl shadow-[#1B133C]/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Batch Purity
                </p>
                <p className="mt-1 font-display text-6xl text-foreground">
                  ≥99<span className="text-3xl text-accent">%</span>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  HPLC verified — current batch
                </p>
              </div>
              </Enter>
              <Enter>
              <div className="glass-card w-64 p-5 shadow-xl shadow-[#1B133C]/10 lg:mr-16">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Your Insights</p>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    32 peptides
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  In stock, dispatching today before 4pm
                </p>
              </div>
              </Enter>
              <Enter>
              <div className="glass-card flex w-72 items-center justify-between p-5 shadow-xl shadow-[#1B133C]/10">
                <div>
                  <p className="text-sm font-semibold text-foreground">Batch COA</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Certificate of Analysis with every vial
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              </Enter>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-[#1B133C]/10 pt-8">
            <div>
              <dt className="font-display text-2xl text-foreground sm:text-3xl">≥99%</dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">HPLC purity, every batch</dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-foreground sm:text-3xl">100%</dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">Orders with batch COA</dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-foreground sm:text-3xl">4pm</dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">Same-day dispatch cut-off</dd>
            </div>
          </dl>
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
            Synthesis-grade peptides for UK laboratories — every batch verified by independent HPLC
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
            <p className="mt-2 text-muted-foreground">
              The complete research peptide range — every batch independently verified, every vial
              shipped with its Certificate of Analysis.
            </p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            View all peptides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <RevealItem key={p.slug}><ProductCard product={p} /></RevealItem>
          ))}
        </RevealGroup>
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
