import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { isProductHidden, liveName, livePrice, useProductOverrides } from '../hooks/useProductOverrides'

export default function Shop() {
  useSeo({ pageKey: 'shop', ...coreSeo['/shop'] })

  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')
  const overrides = useProductOverrides()

  const filtered = useMemo(() => {
    let list = products.filter((p) => !isProductHidden(overrides, p.slug))
    const fromPrice = (p: (typeof products)[number]) =>
      livePrice(overrides, p.slug, p.sizes[0].label) ?? p.sizes[0].price
    if (q.trim()) {
      const needle = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.short.toLowerCase().includes(needle) ||
          p.cas.includes(needle),
      )
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => fromPrice(a) - fromPrice(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => fromPrice(b) - fromPrice(a))
    if (sort === 'name')
      list = [...list].sort((a, b) =>
        liveName(overrides, a.slug, a.name).localeCompare(liveName(overrides, b.slug, b.name)),
      )
    return list
  }, [q, sort, overrides])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Peptides</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Research Peptides UK</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every product below is synthesised to ≥99% purity, independently verified by HPLC and mass
        spectrometry, and shipped with a batch-specific Certificate of Analysis.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search peptides by name or CAS number…"
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Search peptides"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" role="status">
        Showing {filtered.length} of {products.length} peptides
      </p>

      <h2 className="sr-only">Product list</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p, i) => (
          <ProductCard key={p.slug} product={p} eager={i < 2} />
        ))}
      </div>

      {/* Catalogue guidance */}
      <section className="mt-16 border-t border-border pt-12" aria-labelledby="guidance-heading">
        <div className="max-w-3xl space-y-5 leading-relaxed text-muted-foreground">
          <h2 id="guidance-heading" className="text-2xl font-extrabold tracking-tight text-foreground">
            Buying Research Peptides in the UK: What to Check
          </h2>
          <p>
            Not every peptide shop UK researchers find online works to the same standard. Before
            you buy peptides in the UK for laboratory use, three things matter more than price:
            documented purity, batch traceability, and verifiable testing. Every compound in this
            catalogue is a lyophilised research peptide supplied strictly for in-vitro laboratory
            research — synthesised by solid-phase methods and purified by preparative
            chromatography to ≥99%.
          </p>
          <p>
            Purity claims are only as good as the evidence behind them. Our peptide purity figures
            come from independent HPLC peptide testing, with molecular identity confirmed by mass
            spectrometry — and every vial is tied to a numbered batch with its own{' '}
            <Link to="/quality" className="font-semibold text-primary hover:underline">
              Certificate of Analysis
            </Link>
            . You can request the current batch COA for any product above before you order, and
            learn to read it in our{' '}
            <Link to="/guides/how-to-read-peptide-coa" className="font-semibold text-primary hover:underline">
              guide to peptide COAs
            </Link>
            . If a supplier cannot show you batch-matched documentation, that is the answer to your
            quality question.
          </p>
          <p>
            Handling matters as much as synthesis. Lyophilised peptides are stable in transit, but
            correct peptide storage and careful peptide reconstitution determine how long a
            compound remains reliable in the lab. Our{' '}
            <Link to="/guides/peptide-reconstitution-storage-guide" className="font-semibold text-primary hover:underline">
              reconstitution and storage guide
            </Link>{' '}
            covers solvent selection, aliquoting and freezer practice, and each product page
            carries compound-specific guidance.
          </p>
          <p>
            Orders dispatch same day before 4pm from UK stock, with tracked delivery free over £25
            — see <Link to="/shipping" className="font-semibold text-primary hover:underline">shipping &amp; delivery</Link>{' '}
            for timings, and our <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>{' '}
            for volume pricing and guarantees. Questions about a compound or batch?{' '}
            <Link to="/contact" className="font-semibold text-primary hover:underline">Contact us</Link> —
            we answer as fellow researchers, not salespeople.
          </p>
        </div>
      </section>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">No peptides match "{q}"</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different name or CAS number.</p>
          <button
            onClick={() => setQ('')}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}
