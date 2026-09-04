import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { useSeo } from '../hooks/useSeo'
import { categorySeo, notFoundSeo } from '../data/seo'
import { categories, productsByCategory } from '../data/products'
import ProductCard from '../components/ProductCard'
import { isProductHidden, useProductOverrides } from '../hooks/useProductOverrides'
import NotFound from './NotFound'

function CategoryDescription({ text, slug }: { text: string; slug: string }) {
  if (slug !== 'recovery-repair') return <>{text}</>

  const links: Record<string, string> = {
    'BPC-157': '/product/bpc-157',
    'TB-500': '/product/tb-500',
  }
  const parts: ReactNode[] = []
  const pattern = /(BPC-157|TB-500)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(
      <Link
        key={`${match[0]}-${match.index}`}
        to={links[match[0]]}
        className="font-medium text-teal-700 hover:underline"
      >
        {match[0]}
      </Link>,
    )
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  return <>{parts}</>
}

/**
 * Crawlable category hub (audit §8). Each category is an indexable landing
 * page with its own metadata, CollectionPage + ItemList schema and links
 * through to every product in the range.
 */
export default function Category() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)
  const overrides = useProductOverrides()
  const seo = category ? categorySeo(category) : notFoundSeo
  useSeo({ pageKey: category ? `category:${category.slug}` : 'category:unknown', ...seo })

  if (!category) return <NotFound />

  const items = productsByCategory(category.slug).filter(
    (p) => !isProductHidden(overrides, p.slug),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-slate-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/shop" className="hover:text-slate-700">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-700">{category.name}</li>
        </ol>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {category.name}
        </h1>
        {category.tagline ? (
          <p className="mt-2 text-lg text-slate-600">{category.tagline}</p>
        ) : null}
        <p className="mt-4 leading-relaxed text-slate-600">
          <CategoryDescription text={category.description} slug={category.slug} />
        </p>
        <p className="mt-4 leading-relaxed text-slate-600">
          Every batch in this range is independently verified by HPLC and mass spectrometry and
          ships with a batch-specific Certificate of Analysis — see{' '}
          <Link to="/quality" className="font-medium text-teal-700 hover:underline">
            how we test
          </Link>{' '}
          for the full methodology, or browse the{' '}
          <Link to="/shop" className="font-medium text-teal-700 hover:underline">
            complete catalogue
          </Link>
          . All products are supplied strictly for in-vitro laboratory research use only.
        </p>
      </header>

      <section className="mt-10" aria-label={`${category.name} products`}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-label="Other categories">
        <h2 className="text-lg font-semibold text-slate-900">Browse other categories</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/category/${c.slug}`}
                  className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-600 hover:text-teal-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
