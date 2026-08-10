import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'

const groups: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: 'Quality & Testing',
    items: [
      {
        q: 'What purity are your peptides?',
        a: 'Every peptide we sell is independently verified to ≥99% purity by HPLC, with molecular identity confirmed by mass spectrometry. Batches that do not meet this standard are never released for sale.',
      },
      {
        q: 'Can I see a Certificate of Analysis before ordering?',
        a: 'Yes. Contact us with the product name and we will send the current batch COA within one working hour — no account or purchase required. Every order also ships with its batch-specific COA in the box.',
      },
      {
        q: 'Who performs your analytical testing?',
        a: 'HPLC purity analysis and MS identity confirmation are performed by an independent analytical laboratory, separate from our synthesis and fulfilment operations.',
      },
    ],
  },
  {
    heading: 'Ordering & Delivery',
    items: [
      {
        q: 'How fast is UK delivery?',
        a: 'Orders placed before 4pm Monday–Friday are dispatched the same day. Standard tracked delivery takes 1–2 working days; next-working-day options are available at checkout. Delivery is free on orders over £25.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to most European countries with tracked international delivery. Customers are responsible for ensuring import compliance in their jurisdiction.',
      },
      {
        q: 'Is packaging discreet?',
        a: 'Yes. All orders ship in plain, tamper-evident packaging with no external indication of contents.',
      },
      {
        q: 'Do you offer volume discounts?',
        a: 'Yes — applied automatically at checkout: 20% off orders over £150 and 30% off orders over £500. For wholesale and institutional pricing, contact our team.',
      },
      {
        q: 'What is your money-back guarantee?',
        a: 'Every order is covered by a 7-day money-back guarantee. If anything arrives damaged or incorrect, contact us within 7 days of receipt and we will replace it or refund you in full.',
      },
      {
        q: 'Do you price match?',
        a: 'Yes. Find the same compound and batch documentation standard cheaper from another UK supplier and we will match it — contact us before ordering.',
      },
    ],
  },
  {
    heading: 'Storage & Handling',
    items: [
      {
        q: 'How should I store lyophilised peptides?',
        a: 'Store lyophilised peptides at -20°C for long-term stability (24+ months). Protect light-sensitive compounds such as GHK-Cu, Semax and Melanotan II from light.',
      },
      {
        q: 'How long do peptides last after reconstitution?',
        a: 'Reconstituted peptides should be refrigerated at 2–8°C. Typical guidance is 14–28 days depending on the compound — see each product page for compound-specific storage guidance.',
      },
    ],
  },
  {
    heading: 'Legal & Compliance',
    items: [
      {
        q: 'Are your peptides for human use?',
        a: 'No. All Noxptide products are supplied strictly for in-vitro laboratory research purposes only. They are not medicines, supplements or cosmetics, and are not for human or veterinary use under any circumstances.',
      },
      {
        q: 'Who can purchase from Noxptide?',
        a: 'We supply laboratories, research institutions and qualified researchers. By ordering, you confirm the products will be used solely for lawful laboratory research in accordance with our Research Use Terms.',
      },
    ],
  },
]

function Item({ q, a }: { q: string; a: string }) {
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
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  )
}

export default function Faq() {
  const allFaqs = groups.flatMap((g) => g.items)
  useSeo({
    pageKey: 'faq',
    title: 'Frequently Asked Questions | Noxptide UK',
    description:
      'Answers on peptide purity, Certificates of Analysis, UK delivery times, storage guidance and research-use compliance from Noxptide.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">FAQ</span>
      </nav>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 text-muted-foreground">
        Everything researchers ask us before their first order. Can't find your answer?{' '}
        <Link to="/contact" className="font-semibold text-primary hover:underline">Contact us</Link>.
      </p>

      {groups.map((g) => (
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
