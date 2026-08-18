import { Link } from 'react-router'
import { FlaskConical } from 'lucide-react'
import type { Product } from '../data/products'
import { formatGBP } from '../data/products'
import { liveImage, liveName, livePrice, liveStock, useProductOverrides } from '../hooks/useProductOverrides'

/** Noxptide-branded vial photography: /images/products/<slug>-<size>.webp per vial size.
 *  Pass sizeLabel to show the matching strength; falls back to a clean placeholder if missing. */
export function sizeFile(label: string) {
  return label.replace(/\s/g, '').toLowerCase()
}

export function ProductImage({
  product,
  className = '',
  sizeLabel,
  eager = false,
  name,
  imageUrl,
}: {
  product: Product
  className?: string
  sizeLabel?: string
  eager?: boolean
  /** Live listing name override (used for placeholder text and alt). */
  name?: string
  /** Live listing image override; replaces the static catalogue image when set. */
  imageUrl?: string | null
}) {
  const size = sizeLabel ?? product.sizes[0].label
  const displayName = name ?? product.name
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-accent ${className}`}>
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-primary/60" aria-hidden="true">
        <FlaskConical className="h-10 w-10" />
        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">{displayName}</span>
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${displayName} ${size} research peptide vial — Noxptide, ${product.purity} purity, UK COA verified`}
          width={800}
          height={1200}
          className="relative z-10 h-full w-full object-cover"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
      <img
        src={`/images/products/${product.slug}-${sizeFile(size)}-400.webp`}
        srcSet={`/images/products/${product.slug}-${sizeFile(size)}-400.webp 400w, /images/products/${product.slug}-${sizeFile(size)}.webp 800w`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        alt={`${displayName} ${size} research peptide vial — Noxptide, ${product.purity} purity, UK COA verified`}
        width={800}
        height={1200}
        className="relative z-10 h-full w-full object-cover"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      )}
    </div>
  )
}

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const overrides = useProductOverrides()
  const displayName = liveName(overrides, product.slug, product.name)
  const imageUrl = liveImage(overrides, product.slug)
  const fromPrice = livePrice(overrides, product.slug, product.sizes[0].label) ?? product.sizes[0].price
  const allOut =
    product.sizes.length > 0 &&
    product.sizes.every((s) => liveStock(overrides, product.slug, s.label) === 0)
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/product/${product.slug}`} className="relative block">
        <ProductImage product={product} className="aspect-[4/3] w-full" eager={eager} name={displayName} imageUrl={imageUrl} />
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
            {product.badge}
          </span>
        )}
        {allOut && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">{product.purity}</p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug">
          <Link to={`/product/${product.slug}`} className="hover:text-primary">
            {displayName}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.short}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-xs text-muted-foreground">from</span>
            <p className="text-lg font-extrabold text-foreground">{formatGBP(fromPrice)}</p>
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition group-hover:opacity-90"
          >
            View & Buy
          </Link>
        </div>
      </div>
    </article>
  )
}
