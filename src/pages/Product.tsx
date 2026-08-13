import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  ShieldCheck, Truck, FileCheck, FlaskConical, ChevronDown, ShoppingCart, Check,
} from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { notFoundSeo, productSeo } from '../data/seo'
import { useCart } from '../context/CartContext'
import { isProductHidden, liveCategory, liveDescription, liveImage, liveName, livePrice, liveStock, useProductOverrides } from '../hooks/useProductOverrides'
import { formatGBP, getProduct, productsByCategory } from '../data/products'
import ProductCard, { ProductImage } from '../components/ProductCard'
import ProductDetailsAccordion, { TrustStrips } from '../components/ProductDetailsAccordion'
import Rating from '../components/Rating'
import { guidesForProduct } from '../data/guides'
import { BookOpen, ArrowRight } from 'lucide-react'

function FaqItem({ q, a }: { q: string; a: string }) {
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

export default function Product() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const { addItem } = useCart()
  const overrides = useProductOverrides()
  const related = product
    ? productsByCategory(liveCategory(overrides, product.slug, product.category)).filter((p) => p.slug !== slug)
    : []
  const productGuides = guidesForProduct(slug).filter((g) => !g.slug.endsWith('storage-guide'))
  const [sizeIdx, setSizeIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useSeo({
    pageKey: `product:${product?.slug ?? ""}`,
    ...(product ? productSeo(product) : notFoundSeo),
  })

  if (!product || isProductHidden(overrides, slug)) return <Navigate to="/shop" replace />

  /** Live listing overrides (DB) fall back to static catalogue values. */
  const displayName = liveName(overrides, product.slug, product.name)
  const displayDescription = liveDescription(overrides, product.slug, product.short)
  const displayImage = liveImage(overrides, product.slug)

  const size = product.sizes[sizeIdx]
  /** Admin-controlled live values (DB) fall back to catalogue defaults. */
  const priceForSize = (s: { label: string; price: number }) =>
    livePrice(overrides, product.slug, s.label) ?? s.price
  const unitNow = priceForSize(size)
  const stock = liveStock(overrides, product.slug, size.label)
  const outOfStock = stock === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product.slug, size.label, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> /{' '}
        <Link to="/shop" className="hover:text-primary">Peptides</Link> /{' '}
        <span className="text-foreground">{displayName}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative">
          <ProductImage
            product={product}
            sizeLabel={size.label}
            eager
            name={displayName}
            imageUrl={displayImage}
            className="aspect-square w-full rounded-2xl border border-border shadow-sm"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
              {product.badge}
            </span>
          )}
        </div>

        {/* Buy box */}
        <div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            Peptides
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {displayName} Research Peptide
          </h1>
          <p className="mt-1 text-muted-foreground">{product.subtitle}</p>
          <div className="mt-3">
            <Rating rating={product.rating} reviews={product.reviews} size="lg" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> {product.purity} purity
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <FileCheck className="h-3.5 w-3.5" aria-hidden="true" /> Batch COA included
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Truck className="h-3.5 w-3.5" aria-hidden="true" /> Tracked UK delivery
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{displayDescription}</p>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <fieldset>
              <legend className="text-sm font-bold">Select size</legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIdx(i)}
                    aria-pressed={i === sizeIdx}
                    className={`rounded-xl border-2 px-5 py-3 text-left transition ${
                      i === sizeIdx
                        ? 'border-primary bg-secondary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="block text-sm font-bold">{s.label}</span>
                    <span className="block text-sm text-muted-foreground">{formatGBP(s.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button className="px-3 py-2.5 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                <button className="px-3 py-2.5 text-lg" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="text-2xl font-extrabold">{formatGBP(unitNow * qty)}</p>
            </div>

            {stock !== null && (
              <p
                className={`mt-3 text-sm font-semibold ${outOfStock ? 'text-red-600' : stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}
                role="status"
              >
                {outOfStock
                  ? 'Out of stock — check back soon'
                  : stock <= 10
                    ? `Low stock — only ${stock} left`
                    : 'In stock, dispatching today before 4pm'}
              </p>
            )}

            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? (
                'Out of Stock'
              ) : added ? (
                <>
                  <Check className="h-5 w-5" aria-hidden="true" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" /> Add to Cart
                </>
              )}
            </button>

            <div className="mt-5">
              <TrustStrips />
            </div>
          </div>

          {/* Specs */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <h2 className="bg-secondary px-5 py-3 text-sm font-bold">Specifications</h2>
            <dl className="divide-y divide-border text-sm">
              {[
                ['Purity', product.purity],
                ['CAS Number', product.cas],
                ['Molecular Formula', product.formula],
                ['Molecular Weight', product.molecularWeight],
                ['Sequence', product.sequence],
                ['Appearance', product.appearance],
                ['Storage', product.storage],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3">
                  <dt className="font-semibold text-foreground">{k}</dt>
                  <dd className="col-span-2 break-words text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Trust strips + expandable details */}
          <ProductDetailsAccordion product={product} />
        </div>
      </div>

      {/* Applications */}
      <section className="mt-12" aria-labelledby="apps-heading">
        <h2 id="apps-heading" className="text-2xl font-extrabold tracking-tight">
          Research Applications
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {product.applications.map((a) => (
            <li key={a} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{a}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Scientific context — E-E-A-T anchored to published literature */}
      <section className="mt-12 max-w-3xl rounded-2xl border border-border bg-card p-7" aria-labelledby="scientific-context">
        <h2 id="scientific-context" className="text-xl font-extrabold tracking-tight">
          Scientific Context & Literature
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The research applications above summarise areas examined in the published scientific
          literature. They describe preclinical research contexts only — {product.name} is supplied
          strictly for in-vitro laboratory research and is not intended for human or veterinary use.
          Explore the primary literature:
        </p>
        <ul className="mt-4 space-y-2">
          {product.references.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" /> {r.title} (PubMed)
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Research guides — internal links, no dead ends */}
      {productGuides.length > 0 && (
        <section className="mt-10 max-w-3xl" aria-labelledby="product-guides">
          <h2 id="product-guides" className="text-xl font-extrabold tracking-tight">
            {product.name} Research Guides
          </h2>
          <div className="mt-4 space-y-3">
            {productGuides.slice(0, 3).map((g) => (
              <Link
                key={g.slug}
                to={`/guides/${g.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{g.keyword}</p>
                  <p className="mt-1 font-bold leading-snug group-hover:text-primary">{g.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* COA reassurance */}
      <section className="mt-12 rounded-2xl bg-gradient-to-r from-secondary to-accent p-8" aria-labelledby="coa-heading">
        <h2 id="coa-heading" className="text-xl font-extrabold">Certificate of Analysis Included</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every vial of {product.name} ships with its batch-specific COA showing the HPLC purity
          trace, mass spectrometry identity confirmation and physical appearance result. Want to see
          the current batch documentation before ordering?{' '}
          <Link to="/contact" className="font-semibold text-primary hover:underline">
            Contact our team
          </Link>{' '}
          and we will send it within one working hour. Batch COA and testing methods are described on our{' '}
          <Link to="/quality" className="font-semibold text-primary hover:underline">
            quality page
          </Link>
          .
        </p>
      </section>

      {/* FAQs */}
      <section className="mt-12 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight">
          {product.name} — Frequently Asked Questions
        </h2>
        <div className="mt-5 space-y-3">
          {product.faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-7" aria-labelledby="product-proof">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="product-proof" className="text-xl font-extrabold tracking-tight">
              Trusted by UK Research Teams
            </h2>
            <div className="mt-2">
              <Rating rating={product.rating} reviews={product.reviews} size="lg" />
            </div>
          </div>
          <blockquote className="max-w-xl rounded-xl bg-secondary p-5 text-sm leading-relaxed text-foreground">
            "Consistent purity across every batch we've tested, with documentation that matches
            independent retesting. Exactly what a research lab needs."
            <footer className="mt-2 text-xs text-muted-foreground">— Laboratory Manager, Cambridge Biotech</footer>
          </blockquote>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-extrabold tracking-tight">
            Frequently Studied Alongside {product.name}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold leading-tight">{displayName} · {size.label}</p>
            <p className="text-lg font-extrabold text-primary">{formatGBP(unitNow * qty)}</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
            {outOfStock ? 'Out of Stock' : added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  )
}
