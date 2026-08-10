import { Link } from 'react-router'
import { useSeo } from '../hooks/useSeo'

const H = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-bold text-foreground">{children}</h2>
)

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy | Noxptide UK',
    description:
      'How Noxptide collects, uses and protects your personal data — UK GDPR compliant privacy policy covering orders, cookies, analytics and your data rights.',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Privacy Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 8 August 2026</p>

      <div className="prose-sm mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <p>
          This policy explains how Noxptide Ltd, trading as Noxptide ("we", "us", "our"),
          collects, uses, and protects personal data when you use www.noxptide.co.uk, place an
          order, or contact us. We are the data controller for this website, registered in England
          and Wales under company number [Company Number]; registered office: [Registered Office
          Address]. You can reach us at any time at{' '}
          <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
            support@noxptide.co.uk
          </a>
          .
        </p>
        <p>
          We run this website on a simple principle: we collect the minimum personal data needed to
          take your order, deliver it, and support you afterwards, and we delete it when it is no
          longer needed. Full deletion timescales are published in our{' '}
          <Link to="/data-retention" className="font-semibold text-primary hover:underline">Data Retention Policy</Link>.
        </p>

        <section aria-labelledby="p1">
          <H id="p1">1. What we collect</H>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Identity and contact details.</strong> Your name,
              email address, delivery and billing address, and phone number, provided when you order
              or create an account.
            </li>
            <li>
              <strong className="text-foreground">Order details.</strong> The products you buy,
              order value, delivery method, and order history.
            </li>
            <li>
              <strong className="text-foreground">Payment status.</strong> Confirmation from our
              payment providers that a payment succeeded or failed. We never see or store your card
              number or bank login.
            </li>
            <li>
              <strong className="text-foreground">Correspondence.</strong> Emails you send to
              support@noxptide.co.uk and our replies.
            </li>
            <li>
              <strong className="text-foreground">Technical data.</strong> IP address, browser type,
              and pages visited, collected through cookies and analytics (see section 7).
            </li>
          </ul>
          <p className="mt-3">
            We do not collect any special-category (sensitive) data, and we ask you not to include
            any in correspondence with us.
          </p>
        </section>

        <section aria-labelledby="p2">
          <H id="p2">2. How we use it, and our lawful basis</H>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Processing and delivering your order</strong>,
              including payment, order confirmation, and delivery updates (<em>performance of a contract</em>).
            </li>
            <li>
              <strong className="text-foreground">Replying when you contact us</strong> and
              resolving delivery or payment issues (<em>legitimate interests</em>: running a responsive business).
            </li>
            <li>
              <strong className="text-foreground">Keeping accounting and tax records</strong> (<em>legal obligation</em>).
            </li>
            <li>
              <strong className="text-foreground">Preventing fraud and keeping the site secure</strong> (<em>legitimate interests</em>).
            </li>
            <li>
              <strong className="text-foreground">Sending marketing emails</strong> (<em>consent</em>,
              or the "soft opt-in" where you are an existing customer). Every marketing email
              contains an unsubscribe link, and unsubscribing takes effect immediately.
            </li>
            <li>
              <strong className="text-foreground">Understanding how the site is used</strong> so we
              can improve it (<em>legitimate interests</em>, using aggregated analytics).
            </li>
          </ul>
        </section>

        <section aria-labelledby="p3">
          <H id="p3">3. Who we share it with</H>
          <p className="mt-3">
            We never sell personal data. We share it only with service providers who need it to
            perform a service for us, under terms that prohibit them from using it for their own
            purposes:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Payment providers.</strong> Card acquiring and
              open banking services, to take and refund payments. Your card details are entered
              directly with the payment provider and never touch our servers.
            </li>
            <li>
              <strong className="text-foreground">Delivery carriers.</strong> Royal Mail and courier
              partners receive your name, address, and contact details to deliver your order.
            </li>
            <li>
              <strong className="text-foreground">Email providers.</strong> To send order
              confirmations, delivery updates, and (where subscribed) marketing emails.
            </li>
            <li>
              <strong className="text-foreground">Hosting, CDN, and security providers.</strong> To
              run and protect the website.
            </li>
            <li>
              <strong className="text-foreground">Analytics.</strong> Google Analytics, configured
              for aggregated statistics.
            </li>
            <li>
              <strong className="text-foreground">Drafting tools.</strong> We use software,
              including AI-based tools, to help our team draft replies to customer emails. Every
              reply is reviewed by a member of staff before it is sent, and these providers may not
              use your data for their own purposes.
            </li>
          </ul>
          <p className="mt-3">
            We may also disclose personal data where the law requires it, or where necessary to
            establish, exercise, or defend legal claims.
          </p>
        </section>

        <section aria-labelledby="p4">
          <H id="p4">4. International transfers</H>
          <p className="mt-3">
            Some of our service providers process data outside the UK, for example in the European
            Economic Area or the United States. Where they do, the transfer is protected by a UK
            adequacy decision (including the UK–US Data Bridge) or by the UK International Data
            Transfer Agreement or Addendum in place with the provider.
          </p>
        </section>

        <section aria-labelledby="p5">
          <H id="p5">5. How long we keep it</H>
          <p className="mt-3">
            Routine customer-service emails are deleted within 12 months, typically after 6. Order
            and transaction records are kept for 6 years, as UK tax law requires. Marketing details
            are kept only until you unsubscribe. The full schedule, including backups and analytics,
            is published in our{' '}
            <Link to="/data-retention" className="font-semibold text-primary hover:underline">Data Retention Policy</Link>.
          </p>
        </section>

        <section aria-labelledby="p6">
          <H id="p6">6. Security</H>
          <p className="mt-3">
            The whole site runs over HTTPS (TLS). Payments are processed on our payment providers'
            secure platforms, so no card numbers or bank credentials are collected, stored, or seen
            by us. Access to customer data is limited to staff who need it, and the website sits
            behind a web application firewall.
          </p>
        </section>

        <section aria-labelledby="p7">
          <H id="p7">7. Cookies</H>
          <p className="mt-3">We use a small number of cookies:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Essential cookies.</strong> The session cookie
              that operates your basket and checkout, and security cookies set by our content
              delivery network. The site cannot function without these.
            </li>
            <li>
              <strong className="text-foreground">Analytics cookies.</strong> Google Analytics, used
              to produce aggregated statistics about how the site is used.
            </li>
          </ul>
          <p className="mt-3">
            You can block or delete cookies in your browser settings at any time; blocking essential
            cookies will prevent checkout from working.
          </p>
        </section>

        <section aria-labelledby="p8">
          <H id="p8">8. Your rights</H>
          <p className="mt-3">Under UK data protection law you have the right to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li><strong className="text-foreground">access</strong> a copy of the personal data we hold about you, free of charge;</li>
            <li><strong className="text-foreground">correct</strong> inaccurate or incomplete data;</li>
            <li>
              <strong className="text-foreground">erasure</strong>, meaning you can ask us to delete
              your data. We will, except where the law requires us to keep it (for example, tax records);
            </li>
            <li>
              <strong className="text-foreground">restrict or object</strong> to processing,
              including objecting to direct marketing at any time;
            </li>
            <li>
              <strong className="text-foreground">portability</strong>, meaning you can receive the
              data you provided to us in a machine-readable format;
            </li>
            <li>
              <strong className="text-foreground">withdraw consent</strong> at any time, where
              processing is based on consent.
            </li>
          </ul>
          <p className="mt-3">
            Email{' '}
            <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
              support@noxptide.co.uk
            </a>{' '}
            to exercise any of these rights. We respond within one month and never charge a fee
            unless a request is manifestly unfounded or excessive. If you are unhappy with how we
            have handled your data, you can complain to the Information Commissioner's Office at
            ico.org.uk. We would welcome the chance to resolve any concern first, though.
          </p>
        </section>

        <section aria-labelledby="p9">
          <H id="p9">9. Age</H>
          <p className="mt-3">
            This website is for adults. You must be at least 18 years old to order, and we do not
            knowingly collect personal data relating to anyone under 18.
          </p>
        </section>

        <section aria-labelledby="p10">
          <H id="p10">10. Changes to this policy</H>
          <p className="mt-3">
            Any changes will be published on this page with an updated date at the top.
          </p>
        </section>
      </div>
    </div>
  )
}
