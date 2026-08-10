import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ChevronDown, CheckCircle2, BookOpen, FlaskConical, ArrowRight } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { guideSeo, notFoundSeo } from '../data/seo'
import { getGuide, guides } from '../data/guides'
import { getProduct } from '../data/products'
import ProductCard from '../components/ProductCard'

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div hidden={!open} className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</div>
    </div>
  )
}

export default function GuideArticle() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  const related = guide ? guide.relatedProducts.map(getProduct).filter(Boolean) : []
  const moreGuides = guides.filter((g) => g.slug !== slug).slice(0, 3)

  useSeo({
    pageKey: `guide:${guide?.slug ?? ""}`,
    ...(guide ? guideSeo(guide) : notFoundSeo),
  })

  if (!guide) return <Navigate to="/guides" replace />

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Article */}
        <article className="lg:col-span-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">Home</Link> /{' '}
            <Link to="/guides" className="hover:text-primary">Guides</Link> /{' '}
            <span className="text-foreground">{guide.title}</span>
          </nav>

          <header className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Research Guide · {guide.readingTime} · Updated {guide.updated}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {guide.title}
            </h1>
          </header>

          {/* Direct-answer intro: the paragraph AI engines cite */}
          <p className="mt-6 rounded-2xl border-l-4 border-primary bg-secondary p-6 leading-relaxed text-foreground">
            {guide.intro}
          </p>

          {/* TOC */}
          <nav className="mt-8 rounded-xl border border-border bg-card p-5" aria-label="Table of contents">
            <p className="text-sm font-bold">In this guide</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              {guide.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${s.heading.replace(/\W+/g, '-').toLowerCase()}`} className="hover:text-primary">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {guide.sections.map((s) => (
            <section
              key={s.heading}
              id={s.heading.replace(/\W+/g, '-').toLowerCase()}
              className="mt-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>
              ))}
            </section>
          ))}

          {/* Key points */}
          <aside className="mt-10 rounded-2xl bg-accent p-7" aria-labelledby="key-points">
            <h2 id="key-points" className="text-lg font-extrabold">Key Points</h2>
            <ul className="mt-4 space-y-2.5">
              {guide.keyPoints.map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {k}
                </li>
              ))}
            </ul>
          </aside>

          {/* References */}
          <section className="mt-10" aria-labelledby="references">
            <h2 id="references" className="text-xl font-extrabold">Scientific References</h2>
            <ul className="mt-4 space-y-2">
              {guide.references.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" /> {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs */}
          <section className="mt-12" aria-labelledby="guide-faqs">
            <h2 id="guide-faqs" className="text-2xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="mt-5 space-y-3">
              {guide.faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar: products — every article links to products */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <FlaskConical className="h-5 w-5 text-primary" aria-hidden="true" />
                Compounds in This Guide
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((p) =>
                  p ? (
                    <li key={p.slug}>
                      <Link
                        to={`/product/${p.slug}`}
                        className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:border-primary/40 hover:bg-secondary"
                      >
                        <div>
                          <p className="text-sm font-bold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.purity} · from £{p.sizes[0].price}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                All compounds ship with batch-specific Certificates of Analysis. Research use only.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-secondary to-accent p-6">
              <h2 className="font-extrabold">Verify Before You Buy</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Request any current batch COA and receive it within one working hour.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                Request a COA
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-products">
          <h2 id="related-products" className="text-2xl font-extrabold tracking-tight">
            Research-Grade Compounds, ≥99% Purity
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (p ? <ProductCard key={p.slug} product={p} /> : null))}
          </div>
        </section>
      )}

      {/* More guides */}
      <section className="mt-16" aria-labelledby="more-guides">
        <h2 id="more-guides" className="text-2xl font-extrabold tracking-tight">More Research Guides</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {moreGuides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-bold leading-snug hover:text-primary">{g.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{g.readingTime}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
