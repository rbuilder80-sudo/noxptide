import { useState } from 'react'
import { Link } from 'react-router'
import { Truck, Package, BadgePercent, RotateCcw, Plus } from 'lucide-react'
import type { Product } from '../data/products'

const strips = [
  { icon: Truck, color: 'text-emerald-600', text: 'Free UK Delivery on orders over £25' },
  { icon: Package, color: 'text-sky-600', text: 'Want It Tomorrow? Order before 4pm' },
  { icon: BadgePercent, color: 'text-amber-500', text: 'Price Match Promise' },
  { icon: RotateCcw, color: 'text-violet-600', text: '7-Day Money-Back Guarantee' },
]

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-foreground transition hover:text-primary"
      >
        {title}
        <Plus
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        />
      </button>
      {/* Content stays in the DOM for SEO; only visibility toggles */}
      <div hidden={!open} className="pb-5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

export function TrustStrips() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3.5">
        <span className="relative flex h-3 w-3" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <span className="text-sm font-semibold">In stock</span>
      </div>
      {strips.map(({ icon: Icon, color, text }) => (
        <div key={text} className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3.5">
          <Icon className={`h-5 w-5 shrink-0 ${color}`} aria-hidden="true" />
          <span className="text-sm font-bold">{text}</span>
        </div>
      ))}
    </div>
  )
}

export default function ProductDetailsAccordion({ product }: { product: Product }) {
  return (
    <section className="mt-6" aria-label={`${product.name} details`}>
      {/* Accordions */}
      <div className="mt-5 border-t border-border">
        <AccordionSection title="Description" defaultOpen>
          {product.description.map((p, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {p}
            </p>
          ))}
        </AccordionSection>

        <AccordionSection title="Shipping & Returns">
          <p>
            Orders placed before 4pm Monday–Friday are dispatched the same working day. Standard
            tracked UK delivery (1–2 working days) is £4.99, or free on orders over £25;
            next-working-day delivery is available at checkout. All orders ship in plain,
            tamper-evident packaging with no external indication of contents.
          </p>
          <p className="mt-3">
            Every order is covered by our 7-day money-back guarantee: if anything arrives damaged
            or incorrect, contact us within 7 days and we will replace it or refund you in full.
            Volume pricing applies automatically — 20% off orders over £150 and 30% off over £500.
            See our{' '}
            <Link to="/shipping" className="font-semibold text-primary hover:underline">
              shipping page
            </Link>{' '}
            for full details, including European delivery.
          </p>
        </AccordionSection>

        <AccordionSection title="Storage & Handling">
          <p>{product.storage}</p>
          <p className="mt-3">
            Reconstitute under sterile laboratory conditions using bacteriostatic water. Handle only
            with appropriate laboratory PPE and procedures.
          </p>
        </AccordionSection>

        <AccordionSection title="Research Use & Compliance">
          <p>
            {product.name} is supplied strictly for in-vitro laboratory research purposes only. It
            is not a medicine, supplement or cosmetic, and is not intended for human or veterinary
            use, consumption, or diagnostic purposes. By purchasing you confirm you are a qualified
            researcher or institution and agree to our{' '}
            <Link to="/legal" className="font-semibold text-primary hover:underline">
              Research Use Terms
            </Link>
            .
          </p>
        </AccordionSection>
      </div>
    </section>
  )
}
