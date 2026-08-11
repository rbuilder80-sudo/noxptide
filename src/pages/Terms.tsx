import { Link } from 'react-router'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'

const H = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-bold text-foreground">{children}</h2>
)

export default function Terms() {
  useSeo({ ...coreSeo['/terms'] })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Terms &amp; Conditions</span>
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Terms &amp; Conditions</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 8 August 2026</p>

      <div className="prose-sm mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <p>
          These terms govern your use of www.noxptide.co.uk and every order placed on it. The
          website and store are operated by Noxptide Ltd, trading as Noxptide, a company
          registered in England and Wales under company number [Company Number], with its registered
          office at [Registered Office Address] ("we", "us", "our"). By using the site or placing an
          order you agree to these terms. You must be at least 18 years old to order.
        </p>

        <section aria-labelledby="t1">
          <H id="t1">1. Research use only</H>
          <p className="mt-3">
            Every product we sell is a chemical reference material supplied strictly for in-vitro
            laboratory research. Our products are not medicines, are not licensed for human or
            veterinary use, and are not foods, supplements, or cosmetics. We make no claims about
            the effects of any product, and nothing on this website is medical, veterinary, or
            professional advice.
          </p>
          <p className="mt-3">
            By placing an order you confirm the declaration shown at checkout: that you are
            purchasing for in-vitro research use only, and that you have the knowledge and
            facilities to handle research compounds safely. A Safety Data Sheet and Certificate of
            Analysis are published on the product page of every research compound and you should
            review them before ordering.
          </p>
          <p className="mt-3">
            We do not answer questions about human use, and we refuse sales where communication
            suggests intended human use. Such enquiries are declined in writing and the account is
            flagged. Our full policy is at{' '}
            <Link to="/legal" className="font-semibold text-primary hover:underline">Research Use Only Policy</Link>.
          </p>
        </section>

        <section aria-labelledby="t2">
          <H id="t2">2. Your responsibilities</H>
          <p className="mt-3">
            You are responsible for the safe receipt, storage, and handling of everything you buy
            from us, for ensuring the products are used only in a lawful research setting, and for
            complying with all laws and regulations that apply to you. Products must be handled by
            suitably qualified individuals.
          </p>
        </section>

        <section aria-labelledby="t3">
          <H id="t3">3. International orders and destination-country laws</H>
          <p className="mt-3">
            We ship to a number of countries outside the United Kingdom. Laws governing the
            purchase, importation, and possession of research compounds differ from country to
            country, and they change. It is your sole responsibility, before placing an order, to
            confirm that every product in your order may be lawfully imported into and possessed in
            the destination country. If you are unsure, check with your local customs authority or
            regulator before ordering.
          </p>
          <p className="mt-3">By placing an order for delivery outside the United Kingdom, you confirm that:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              you have verified, before ordering, that the products in your order are lawful to
              import and possess in the destination country;
            </li>
            <li>
              you act as the importer of record and are responsible for complying with all laws and
              regulations of the destination country, including customs clearance and any import
              duties, taxes, or fees;
            </li>
            <li>
              we make no representation or warranty that any product is lawful to import or possess
              in any jurisdiction outside the United Kingdom; and
            </li>
            <li>
              if a shipment is delayed, seized, destroyed, refused, or returned by customs or a
              carrier due to destination-country restrictions, this is at your risk, and we cannot
              guarantee a refund or replacement in those circumstances.
            </li>
          </ul>
        </section>

        <section aria-labelledby="t4">
          <H id="t4">4. Orders, prices, and payment</H>
          <p className="mt-3">
            Prices are shown in British Pounds and may change without notice; the price at the time
            you place your order is the price you pay. Your order is an offer to buy, which we
            accept when payment clears and we confirm the order. We may decline or cancel any order
            at our discretion, including under our research-use policy.
          </p>
          <p className="mt-3">
            If a price was displayed incorrectly because of an input error or a website fault, we
            may cancel the order and refund you in full, or offer a like-for-like replacement to the
            value of the order.
          </p>
        </section>

        <section aria-labelledby="t5">
          <H id="t5">5. Delivery</H>
          <p className="mt-3">
            Delivery services, timescales, and restrictions are set out on our{' '}
            <Link to="/shipping" className="font-semibold text-primary hover:underline">Delivery page</Link>.
            Risk in the products passes to you on delivery; ownership passes when payment is
            received in full.
          </p>
          <p className="mt-3">
            If a parcel is returned to us by the courier because of non-delivery, an address error,
            or a refused delivery, we must receive the parcel back at our facility before any refund
            or replacement can be issued. This applies even where you did not personally initiate
            the return.
          </p>
        </section>

        <section aria-labelledby="t6">
          <H id="t6">6. Returns, refunds, and cancellations</H>
          <p className="mt-3">One section, three rules:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Faulty, damaged, or incorrect items.</strong> Tell
              us promptly at{' '}
              <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
                support@noxptide.co.uk
              </a>{' '}
              and we will replace the item or refund you. Photographs of any damage help us resolve
              it quickly.
            </li>
            <li>
              <strong className="text-foreground">Research compounds (peptides and similar).</strong>{' '}
              These are temperature-sensitive and integrity-critical materials. Once dispatched,
              they cannot be returned or exchanged except where faulty, damaged, or incorrect: we
              cannot verify storage conditions once a product has left our control, and these goods
              are exempt from the usual cancellation right for that reason (they are liable to
              deteriorate and are sealed for protection). Please check your order carefully before
              confirming it.
            </li>
            <li>
              <strong className="text-foreground">Accessories and non-compound items.</strong> If
              you are a consumer, you may cancel within 14 days of delivery and return the item
              unused and unopened for a refund. You pay the return postage, and we refund within 14
              days of receiving the item back.
            </li>
          </ul>
          <p className="mt-3">
            You can cancel any order free of charge at any time before it is dispatched. If a parcel
            is lost in transit, we will refund or replace it once the carrier confirms the loss.
          </p>
        </section>

        <section aria-labelledby="t7">
          <H id="t7">7. Liability</H>
          <p className="mt-3">
            Nothing in these terms excludes or limits our liability for death or personal injury
            caused by our negligence, for fraud, or for anything else that cannot be excluded under
            the law of England and Wales.
          </p>
          <p className="mt-3">
            Subject to that, our total liability arising from any order is limited to the price you
            paid for that order, and we are not liable for indirect or consequential losses.
            Products are supplied for research use on the basis of the declarations you make at
            checkout; you are responsible for outcomes arising from storage, handling, or use after
            delivery.
          </p>
        </section>

        <section aria-labelledby="t8">
          <H id="t8">8. Intellectual property</H>
          <p className="mt-3">
            All content on this website, including text, product descriptions, images, documents,
            and code, is owned by or licensed to us and is protected by copyright. The Noxptide
            name and logo are our trade marks. You may view, download, or print content for your own
            personal, non-commercial use; any other reproduction or distribution requires our
            written consent.
          </p>
        </section>

        <section aria-labelledby="t9">
          <H id="t9">9. Using this website</H>
          <p className="mt-3">
            We work to keep the site accurate and available, but we provide it without warranties as
            to availability or freedom from error, and we may correct errors, change content, or
            withdraw the site at any time. Links to other websites are provided for convenience; we
            are not responsible for their content.
          </p>
          <p className="mt-3">
            You may not use this website unlawfully, attempt to interfere with its operation, or
            post anything defamatory, obscene, or illegal. We may suspend or close accounts that
            breach these terms.
          </p>
        </section>

        <section aria-labelledby="t10">
          <H id="t10">10. Changes to these terms</H>
          <p className="mt-3">
            We may update these terms from time to time by publishing the new version on this page
            with an updated date. The version in force when you place an order is the one that
            applies to that order.
          </p>
        </section>

        <section aria-labelledby="t11">
          <H id="t11">11. Force majeure</H>
          <p className="mt-3">
            We are not liable for delay or failure caused by events outside our reasonable control,
            including carrier delays, customs delays, supplier shortages, or lost shipments. Where
            an event outside our control affects your order, we will let you know as soon as
            reasonably possible.
          </p>
        </section>

        <section aria-labelledby="t12">
          <H id="t12">12. General</H>
          <p className="mt-3">
            If any part of these terms is found unenforceable, the rest remains in force. These
            terms are the entire agreement between us about your use of this website and your
            orders. These terms are governed by the law of England and Wales, and the courts of
            England and Wales have jurisdiction, except that if you are a consumer living elsewhere
            in the UK you may also rely on the courts and consumer protections of your home nation.
          </p>
        </section>

        <section aria-labelledby="t13">
          <H id="t13">13. Contact</H>
          <p className="mt-3">
            Registered office: [Registered Office Address]. Email:{' '}
            <a href="mailto:support@noxptide.co.uk" className="font-semibold text-primary hover:underline">
              support@noxptide.co.uk
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
