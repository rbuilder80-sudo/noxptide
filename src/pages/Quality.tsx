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
          Peptide Quality Testing You Can Verify
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The research peptide market has a documentation problem. Suppliers claim 99% purity; few
          prove it. Noxptide was founded on a simple principle:{' '}
          <strong className="text-foreground">
            if a batch cannot be independently verified, it does not ship.
          </strong>
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This page explains exactly how we test: the methodology behind every peptide certificate
          of analysis we issue, what those tests can and cannot tell you, how to match your vial to
          its batch paperwork, and the release workflow a batch must pass before it reaches our
          shelf. As a peptide supplier UK researchers can audit, we would rather show you the
          process than ask you to trust it.
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

      {/* Methodology */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2" aria-labelledby="methodology-heading">
        <div>
          <h2 id="methodology-heading" className="text-2xl font-extrabold tracking-tight">
            How HPLC Purity Testing Works
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            High-performance liquid chromatography separates a dissolved sample into its component
            peaks as it passes through a packed column. The main peptide peak's share of total peak
            area — its HPLC purity — is the industry-standard measure of peptide purity. A reading
            of ≥99% means impurities such as truncated or deletion sequences make up less than 1%
            of the detected material.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Mass spectrometry answers a different question: not how pure the material is, but what
            it is. By confirming the molecular weight matches the target sequence, MS identity
            testing catches the failure mode HPLC alone can miss — a pure sample of the wrong
            peptide. Every batch we release passes both.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">What These Tests Cannot Tell You</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Honest testing means honest limitations. HPLC purity measures the sample tested, at the
            time it was tested — it cannot guarantee stability after poor peptide storage or
            incorrect peptide reconstitution in your own laboratory, which is why we publish
            handling guidance alongside every product. MS confirms molecular weight, not full
            amino-acid sequence. And a COA is only meaningful when its batch number matches the
            vial in your hand: a generic, undated certificate proves nothing.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Counter and residual content (for example water or counter-ions in the lyophilised
            powder) is normal and does not reduce measured purity, but it is worth understanding
            when weighing material for assays — our{' '}
            <Link to="/guides/how-to-read-peptide-coa" className="font-semibold text-primary hover:underline">
              guide to reading a peptide certificate of analysis
            </Link>{' '}
            walks through each field.
          </p>
        </div>
      </section>

      {/* Batch matching & release workflow */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2" aria-labelledby="batch-heading">
        <div>
          <h2 id="batch-heading" className="text-2xl font-extrabold tracking-tight">
            Matching Your Vial to Its COA
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Find the batch number printed on your vial label and on the packing slip.</li>
            <li>Locate the same batch number at the top of the Certificate of Analysis.</li>
            <li>
              Check the HPLC purity result (≥99%) and the MS identity confirmation for that batch.
            </li>
            <li>
              If anything does not match, contact us before using the material — we will replace or
              refund it.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Our Release Workflow</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Synthesis by solid-phase methods, then preparative HPLC purification.</li>
            <li>Independent laboratory analysis: HPLC purity and MS identity on the finished batch.</li>
            <li>Results reviewed against our acceptance standard — batches below 99% are destroyed.</li>
            <li>Batch number assigned and Certificate of Analysis issued.</li>
            <li>Only then is the batch released to stock and made available to order.</li>
          </ol>
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-gradient-to-r from-secondary to-accent p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Request Any Batch COA Before You Order
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Email us the product and we will send the current batch Certificate of Analysis within one
          working hour. No account required, no obligation. Browse{' '}
          <Link to="/shop" className="font-semibold text-primary hover:underline">
            research peptides UK
          </Link>{' '}
          laboratories can verify batch by batch — every product in our peptide shop carries the
          paperwork described on this page, supplied for laboratory research use only.
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
