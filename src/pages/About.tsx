import { Link } from 'react-router'
import { ArrowRight, Target, Eye, ShieldCheck } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

export default function About() {
  useSeo({ pageKey: 'about', ...coreSeo['/about'] })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">About</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        About Noxptide
      </h1>

      <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
        <p>
          Noxptide was founded in the United Kingdom by people who spent years on the other side
          of the purchase order — running assays, troubleshooting inconsistent results, and
          discovering too late that a supplier's "99% purity" was a claim, not a measurement.
        </p>
        <p>
          We started this company with one non-negotiable rule:{' '}
          <strong className="text-foreground">
            every claim we make must be verifiable by the customer.
          </strong>{' '}
          That is why purity is confirmed by an independent laboratory, why every vial carries a
          batch number, and why we will send you the Certificate of Analysis for the current batch
          of any product before you spend a penny.
        </p>
        <p>
          Today we supply universities, contract research organisations and private laboratories
          across the UK and Europe — and we measure ourselves the way they do: by the consistency of
          every batch, not the size of our marketing budget.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Target,
            title: 'Our Mission',
            text: 'To make verifiable quality the baseline of UK research peptide supply — not the exception.',
          },
          {
            icon: Eye,
            title: 'Radical Transparency',
            text: 'Batch numbers, independent testing, COAs before purchase. If you cannot verify it, we will not claim it.',
          },
          {
            icon: ShieldCheck,
            title: 'Compliance First',
            text: 'Strict research-use-only supply with clear documentation and responsible fulfilment on every order.',
          },
        ].map((v) => (
          <article key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <v.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
          </article>
        ))}
      </div>

      {/* Factual business identity */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8" aria-labelledby="identity-heading">
        <h2 id="identity-heading" className="text-xl font-bold">How We Operate</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">Quality approach</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              We supply high purity laboratory peptides for in-vitro research only. Every batch is
              verified by an independent analytical laboratory — HPLC for peptide purity, mass
              spectrometry for identity — before it is released to stock. Batches below 99% are
              destroyed, never discounted.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Verification before purchase</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Any customer can request the current batch Certificate of Analysis for any product
              before ordering — no account needed. We would rather you run your own peptide
              supplier comparison on documented facts than take our marketing at face value.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Batch documentation</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Every vial carries a batch number matching its COA, giving full traceability from
              synthesis to dispatch. Our guides also cover correct peptide reconstitution and
              storage so verified purity survives into your experiments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Research-use compliance</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              As a UK research peptide supplier, we sell strictly for laboratory research. No
              medical claims, no human-use advice, and orders are declined where communication
              suggests otherwise — see our{' '}
              <Link to="/legal" className="font-semibold text-primary hover:underline">
                Research Use Only Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-3xl bg-gradient-to-r from-secondary to-accent p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Experience the Difference Yourself</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Browse the catalogue, request a batch COA, and see why UK laboratories switch to Noxptide.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
        >
          Shop Research Peptides <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
