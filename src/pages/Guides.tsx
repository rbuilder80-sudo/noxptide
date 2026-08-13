import { Link } from 'react-router'
import { BookOpen, ArrowRight } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { guides } from '../data/guides'

export default function Guides() {
  useSeo({ pageKey: 'guides', ...coreSeo['/guides'] })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Research Guides</span>
      </nav>

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Research Peptide Guides &amp; Laboratory Resources
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Written for laboratories, not search engines — though both will find what they need.
          Mechanism coverage from the published literature, correct handling protocols, honest
          comparisons, and the documentation standards your research deserves.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
              {g.keyword}
            </p>
            <h2 className="mt-1.5 text-lg font-bold leading-snug group-hover:text-primary">
              {g.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {g.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">{g.readingTime} · Updated {g.updated}</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial standards */}
      <section className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-2" aria-labelledby="editorial-heading">
        <div>
          <h2 id="editorial-heading" className="text-2xl font-extrabold tracking-tight">
            How These Guides Are Written
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Each guide starts from the published scientific literature, not from marketing copy.
            Drafts are checked against the sources they cite before publication, reviewed for
            accuracy and clarity, and revisited when the literature or our product range changes —
            every guide shows its last-updated date. Where we describe handling procedures, they
            reflect standard laboratory practice for lyophilised research peptides.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We do not publish dosing, human-use or therapeutic content. Guides describe mechanisms
            as reported in preclinical research and are written for qualified researchers working
            in-vitro.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Citation Policy</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every guide links directly to its sources — primarily PubMed-indexed literature — so you
            can read the underlying evidence yourself rather than take our word for it. We cite
            primary research and review articles; we do not cite supplier websites, forums or
            anecdotal reports.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Ready to put the reading into practice? Browse our{' '}
            <Link to="/shop" className="font-semibold text-primary hover:underline">
              research peptide catalogue
            </Link>{' '}
            — as a UK research peptide supplier, every compound we list ships with batch-matched
            documentation for laboratory research use only. See also our{' '}
            <Link to="/quality" className="font-semibold text-primary hover:underline">quality standards</Link>{' '}
            and <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
