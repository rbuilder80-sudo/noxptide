import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProduct, products } from '../data/products'
import { livePrice, useProductOverrides } from '../hooks/useProductOverrides'

export interface CartItem {
  slug: string
  sizeLabel: string
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (slug: string, sizeLabel: string, qty?: number) => void
  removeItem: (slug: string, sizeLabel: string) => void
  setQty: (slug: string, sizeLabel: string, qty: number) => void
  clear: () => void
  count: number
  subtotal: number
  discountRate: number
  discountAmount: number
  discountedSubtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  /** Live (admin-controlled) unit price in pounds, falling back to catalogue default. */
  priceOf: (slug: string, sizeLabel: string) => number
}

/** Volume pricing: 20% off over £150, 30% off over £500 — applied automatically. */
export function volumeDiscountRate(subtotal: number): number {
  if (subtotal >= 500) return 0.3
  if (subtotal >= 150) return 0.2
  return 0
}

const CartContext = createContext<CartContextValue | null>(null)

export function unitPrice(slug: string, sizeLabel: string): number {
  const p = getProduct(slug)
  if (!p) return 0
  return p.sizes.find((s) => s.label === sizeLabel)?.price ?? p.price
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  const overrides = useProductOverrides()

  const priceOf = (slug: string, sizeLabel: string): number =>
    livePrice(overrides, slug, sizeLabel) ?? unitPrice(slug, sizeLabel)

  const addItem = (slug: string, sizeLabel: string, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === slug && x.sizeLabel === sizeLabel)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { slug, sizeLabel, qty }]
    })
    setOpen(true)
  }

  const removeItem = (slug: string, sizeLabel: string) =>
    setItems((prev) => prev.filter((x) => !(x.slug === slug && x.sizeLabel === sizeLabel)))

  const setQty = (slug: string, sizeLabel: string, qty: number) => {
    if (qty <= 0) return removeItem(slug, sizeLabel)
    setItems((prev) =>
      prev.map((x) => (x.slug === slug && x.sizeLabel === sizeLabel ? { ...x, qty } : x)),
    )
  }

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    let count = 0
    let subtotal = 0
    for (const it of items) {
      count += it.qty
      subtotal += unitPrice(it.slug, it.sizeLabel) * it.qty
    }
    return { count, subtotal }
  }, [items])

  const discountRate = volumeDiscountRate(subtotal)
  const discountAmount = subtotal * discountRate
  const discountedSubtotal = subtotal - discountAmount

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clear, count, subtotal, discountRate, discountAmount, discountedSubtotal, isOpen, setOpen, priceOf }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { products }
