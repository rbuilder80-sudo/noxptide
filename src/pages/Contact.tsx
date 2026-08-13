import { useState } from 'react'
import { Link } from 'react-router'
import { Mail, Clock, CheckCircle2 } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

export default function Contact() {
  useSeo({ pageKey: 'contact', ...coreSeo['/contact'] })

  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Contact</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Contact Noxptide</h1>
      <p className="mt-3 text-muted-foreground">
        COA requests, order support and research enquiries — handled by people who understand
        laboratory work. As a UK research peptide supplier, we answer questions about our products,
        documentation and delivery; we cannot discuss human or veterinary use.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-bold">Email</h2>
            <a href="mailto:support@noxptide.co.uk" className="mt-1 block text-sm text-primary hover:underline">
              support@noxptide.co.uk
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-bold">Response Times</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              COA requests: within one working hour.
              <br />
              General enquiries: same working day.
              <br />
              Hours: Monday–Friday, 9am–5pm GMT.
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-6">
            <h2 className="font-bold">Requesting a batch COA?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Include the product name in your message and we will send the current batch Certificate
              of Analysis — no purchase required. Every COA reports peptide purity by independent
              HPLC peptide testing with MS identity confirmation.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-bold">Which Team Handles Your Enquiry?</h2>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Order support</strong> — dispatch status,
                tracking, delivery issues and returns.
              </li>
              <li>
                <strong className="text-foreground">COA requests</strong> — batch documentation for
                any product, sent within one working hour.
              </li>
              <li>
                <strong className="text-foreground">Research enquiries</strong> — compound
                specifications, peptide storage and reconstitution guidance for laboratory work.
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              One address reaches all three; the subject line routes it. Messages sent outside
              working hours are answered the next working day.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold">Message Received</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thank you — our team will reply within one working hour during business hours.
              </p>
            </div>
          ) : (
            <form
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold">Name</span>
                  <input required type="text" className="mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Email</span>
                  <input required type="email" className="mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="text-sm font-semibold">Organisation / Laboratory (optional)</span>
                <input type="text" className="mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
              <label className="mt-5 block">
                <span className="text-sm font-semibold">Subject</span>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option>Batch COA request</option>
                  <option>Order support</option>
                  <option>Product enquiry</option>
                  <option>Wholesale / institutional</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="mt-5 block">
                <span className="text-sm font-semibold">Message</span>
                <textarea required rows={5} className="mt-1.5 w-full rounded-lg border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
              <button type="submit" className="mt-6 w-full rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground hover:opacity-90 sm:w-auto">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        Prefer to read first? Our <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>{' '}
        answers the most common questions about ordering peptides UK researchers ask, and the{' '}
        <Link to="/quality" className="font-semibold text-primary hover:underline">quality page</Link>{' '}
        explains the testing behind every batch we ship as a peptide supplier UK laboratories can
        verify — all supplied for laboratory research use only.
      </p>
    </div>
  )
}
