import { Link } from 'react-router'
import { useSeo } from '../hooks/useSeo'

export default function Legal() {
  useSeo({
    title: 'Research Use Only Policy | Noxptide UK',
    description:
      'Every product sold by Noxptide is a chemical reference material supplied strictly for in-vitro laboratory research. Read our full Research Use Only policy.',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Research Use Only Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Research Use Only Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 8 August 2026</p>

      <div className="prose-sm mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <p>
          Every product sold on this website is a chemical reference material supplied strictly for{' '}
          <strong className="text-foreground">in-vitro laboratory research</strong>. Our products are not
          medicines, are not licensed for human or veterinary use, and are not foods, supplements, or
          cosmetics. This page sets out what that means in practice, for us and for you.
        </p>

        <section aria-labelledby="what-we-do">
          <h2 id="what-we-do" className="text-xl font-bold text-foreground">What we do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Supply research compounds with batch documentation. Every research compound carries a
              Safety Data Sheet prepared in accordance with UK REACH/CLP and a Certificate of
              Analysis, available on its product page.
            </li>
            <li>
              State only identity, purity, and handling information on product pages. We make no
              claims about effects.
            </li>
            <li>
              Store products in temperature-controlled, digitally monitored facilities, and ship
              them in stable, undiluted form.
            </li>
            <li>
              Work openly with UK regulators, and review the entire website against UK
              medicines-advertising rules every quarter.
            </li>
          </ul>
        </section>

        <section aria-labelledby="what-we-wont">
          <h2 id="what-we-wont" className="text-xl font-bold text-foreground">What we will not do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">We do not make medical claims.</strong> No product
              page, email, or document from us will state or imply that any product treats,
              prevents, or affects any condition, and we do not link to clinical literature.
            </li>
            <li>
              <strong className="text-foreground">We do not answer questions about human use.</strong>{' '}
              Our team is instructed to decline such questions without exception, regardless of who
              is asking.
            </li>
            <li>
              <strong className="text-foreground">
                We refuse sales where communication suggests intended human use.
              </strong>{' '}
              Such enquiries are declined in writing and the account is flagged.
            </li>
            <li>
              <strong className="text-foreground">
                We do not stock prescription-only medicines
              </strong>{' '}
              (for example, semaglutide), and we do not stock SARMs.
            </li>
            <li>
              We do not advertise on social media. If you see our products offered on a marketplace
              or social platform, it is not us.
            </li>
          </ul>
        </section>

        <section aria-labelledby="what-we-ask">
          <h2 id="what-we-ask" className="text-xl font-bold text-foreground">What we ask of you</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>You must be at least 18 years old and purchasing for genuine research purposes.</li>
            <li>
              By placing an order you confirm the declaration shown at checkout: that you are
              purchasing for in-vitro research use only and have the knowledge and facilities to
              handle research compounds safely.
            </li>
            <li>
              For orders outside the United Kingdom, you are responsible for confirming before
              ordering that the products may lawfully be imported into the destination country (see
              our <Link to="/terms" className="font-semibold text-primary hover:underline">Terms &amp; Conditions</Link>).
            </li>
          </ul>
        </section>

        <p className="rounded-xl bg-secondary p-5 text-sm">
          Questions about this policy are welcome at{' '}
          <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
            support@noxptide.co.uk
          </a>
          . We can discuss orders, delivery, and documentation — never the use of any product.
        </p>
      </div>
    </div>
  )
}
