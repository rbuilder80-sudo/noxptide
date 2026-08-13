import { Link } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { faqGroups } from '../data/faqs'

function Item({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card">
      <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown
          className="h-4 w-4 shrink-0 transition group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  )
}

export default function Faq() {
  useSeo({ pageKey: 'faq', ...coreSeo['/faq'] })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">FAQ</span>
      </nav>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Research Peptide Frequently Asked Questions
      </h1>
      <p className="mt-3 text-muted-foreground">
        Everything researchers ask us before their first order — from how to store peptides and
        how to reconstitute peptides correctly, to how to read a COA before you commit to a batch.
        Can't find your answer?{' '}
        <Link to="/contact" className="font-semibold text-primary hover:underline">Contact us</Link>.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Looking for a peptide supplier UK laboratories can hold to account? Our{' '}
        <Link to="/quality" className="font-semibold text-primary hover:underline">quality page</Link>{' '}
        documents how every batch is tested, and the{' '}
        <Link to="/shop" className="font-semibold text-primary hover:underline">peptide shop</Link>{' '}
        lists all research peptides UK stock with batch documentation — supplied strictly for
        laboratory research use only.
      </p>

      {faqGroups.map((g) => (
        <section key={g.heading} className="mt-10" aria-labelledby={g.heading.replace(/\W+/g, '-')}>
          <h2 id={g.heading.replace(/\W+/g, '-')} className="text-xl font-bold">{g.heading}</h2>
          <div className="mt-4 space-y-3">
            {g.items.map((f) => (
              <Item key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
