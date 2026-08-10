import { Link } from 'react-router'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

const rows: [string, string, string][] = [
  ['Order and transaction records', '6 years from the end of the financial year of the order', 'Required by UK tax and accounting law; needed to handle any legal claim'],
  ['Customer accounts', 'While your account remains active. Deleted on request.', 'So you can view your order history and reorder easily'],
  ['Customer service emails', 'Routine correspondence is deleted within 12 months, and typically after 6', 'Kept only while your query may still be live'],
  ['Emails about disputes, complaints, or payment issues', 'Until resolved, then up to 6 years where needed', 'Evidence for payment disputes and legal claims'],
  ['Marketing subscriptions', 'Until you unsubscribe', 'A minimal suppression record is kept afterwards so we never email you again'],
  ['Website analytics', 'Up to 14 months, aggregated', 'Understanding how the site is used; not used to identify individuals'],
  ['Backups', 'Rotated automatically; no backup copy is older than 60 days', 'Disaster recovery only'],
]

export default function DataRetention() {
  useSeo({ ...coreSeo['/data-retention'] })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Data Retention Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Data Retention Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 8 August 2026</p>

      <div className="prose-sm mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <p>
          We believe the best way to protect our customers' privacy is to hold as little personal
          data as possible, for as short a time as possible. This page sets out exactly how long we
          keep each kind of data and why. It supplements our{' '}
          <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">What</th>
                <th className="px-4 py-3 font-semibold">How long we keep it</th>
                <th className="px-4 py-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(([what, how, why]) => (
                <tr key={what}>
                  <td className="px-4 py-3 font-medium text-foreground">{what}</td>
                  <td className="px-4 py-3">{how}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section aria-labelledby="dr-never">
          <h2 id="dr-never" className="text-xl font-bold text-foreground">What we never keep</h2>
          <p className="mt-3">
            Card numbers and bank logins. All payments are processed directly on our payment
            providers' platforms. Your payment credentials never reach our servers, so there is
            nothing for us to retain.
          </p>
        </section>

        <section aria-labelledby="dr-delete">
          <h2 id="dr-delete" className="text-xl font-bold text-foreground">Deletion on request</h2>
          <p className="mt-3">
            You do not have to wait for these timescales. Ask us to delete your personal data at any
            time by emailing{' '}
            <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
              support@noxptide.co.uk
            </a>
            . We will action it within one month, free of charge, keeping only what the law requires
            us to keep (such as tax records) and a minimal record needed to honour the request
            itself.
          </p>
        </section>

        <section aria-labelledby="dr-six">
          <h2 id="dr-six" className="text-xl font-bold text-foreground">Why we keep some data for 6 years</h2>
          <p className="mt-3">
            UK law requires businesses to keep records supporting their accounts and tax returns for
            six years, and payment disputes or contractual claims can be raised years after a
            purchase. That is a legal requirement rather than a choice, so order and transaction
            records stay for the full period.
          </p>
        </section>
      </div>
    </div>
  )
}
