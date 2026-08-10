import { Link } from 'react-router'
import { ShieldCheck, FlaskConical, FileCheck, Microscope, ArrowRight } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

const pillars = [
  {
    icon: FlaskConical,
    title: 'Synthesis & Purification',
    text: 'Every peptide is produced via solid-phase peptide synthesis (SPPS) and purified by preparative high-performance liquid chromatography. We do not release material below 99% purity — batches that fail are destroyed, not discounted.',
  },
  {
    icon: Microscope,
    title: 'Independent Analytical Verification',
    text: 'Purity is confirmed by HPLC and molecular identity by mass spectrometry at an independent analytical laboratory. Verification happens outside our own facility, so the results you see are results you can trust.',
  },
  {
    icon: FileCheck,
    title: 'Batch-Specific Certificates of Analysis',
    text: 'Every order ships with a COA tied to your exact batch number — HPLC trace, MS identity confirmation and appearance testing. Request the current batch COA for any product before you order and receive it within one working hour.',
  },
  {
    icon: ShieldCheck,
    title: 'Handling & Traceability',
    text: 'Lyophilised peptides are stored at -20°C, packed in sterile tamper-evident vials, and dispatched with full batch traceability from synthesis to your laboratory door.',
  },
]

export default function Quality() {
  useSeo({ pageKey: 'quality', ...coreSeo['/quality'] })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Quality & COAs</span>
      </nav>

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Quality You Can Verify, Not Just Believe
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The research peptide market has a documentation problem. Suppliers claim 99% purity; few
          prove it. Noxptide was founded on a simple principle:{' '}
          <strong className="text-foreground">
            if a batch cannot be independently verified, it does not ship.
          </strong>
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {pillars.map((p) => (
          <article key={p.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <p.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold">{p.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{p.text}</p>
          </article>
        ))}
      </div>

      {/* What a COA shows */}
      <section className="mt-14" aria-labelledby="coa-heading">
        <h2 id="coa-heading" className="text-2xl font-extrabold tracking-tight">
          What Your Certificate of Analysis Shows
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-5 py-3 font-bold">Test</th>
                <th className="px-5 py-3 font-bold">Method</th>
                <th className="px-5 py-3 font-bold">Acceptance Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['Purity', 'High-Performance Liquid Chromatography (HPLC)', '≥99%'],
                ['Identity', 'Mass Spectrometry (MS)', 'Matches theoretical molecular weight'],
                ['Appearance', 'Visual inspection', 'White/coloured lyophilised powder as specified'],
                ['Solubility', 'Solvent reconstitution test', 'Fully soluble in specified solvent'],
              ].map((row) => (
                <tr key={row[0]}>
                  <th className="px-5 py-3 font-semibold">{row[0]}</th>
                  <td className="px-5 py-3 text-muted-foreground">{row[1]}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-gradient-to-r from-secondary to-accent p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Request Any Batch COA Before You Order
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Email us the product and we will send the current batch Certificate of Analysis within one
          working hour. No account required, no obligation.
        </p>
        <Link
          to="/contact"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
        >
          Request a COA <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
