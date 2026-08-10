import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import { coreSeo } from '../data/seo'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  useSeo({ pageKey: 'shop', ...coreSeo['/shop'] })

  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')

  const filtered = useMemo(() => {
    let list = [...products]
    if (q.trim()) {
      const needle = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.short.toLowerCase().includes(needle) ||
          p.cas.includes(needle),
      )
    }
    if (sort === 'price-asc') list.sort((a, b) => a.sizes[0].price - b.sizes[0].price)
    if (sort === 'price-desc') list.sort((a, b) => b.sizes[0].price - a.sizes[0].price)
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [q, sort])

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
          <ProductCard key={p.slug} product={p} eager={i < 4} />
        ))}
      </div>

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
