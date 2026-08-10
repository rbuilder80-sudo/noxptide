import { Children, cloneElement, isValidElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/** Tiny IntersectionObserver hook — adds .in-view once when scrolled into view. */
function useInView<T extends HTMLDivElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in-view')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('in-view')
            io.disconnect()
          }
        }
      },
      { rootMargin: '-60px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** Fade-up entrance when the element scrolls into view (fires once). */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

/** Stagger container — children wrapped in <RevealItem> animate in sequence. */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.12,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const ref = useInView<HTMLDivElement>()
  const items = Children.map(children, (child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<{ __delay?: number }>, { __delay: i * stagger })
      : child
  )
  return (
    <div ref={ref} className={`reveal-group ${className}`}>
      {items}
    </div>
  )
}

export function RevealItem({
  children,
  className = '',
  __delay = 0,
}: {
  children: ReactNode
  className?: string
  __delay?: number
}) {
  return (
    <div className={`reveal-item ${className}`} style={{ transitionDelay: `${__delay}s` }}>
      {children}
    </div>
  )
}

/** Slow floating loop for hero imagery. */
export function Float({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`animate-float ${className}`}>{children}</div>
}

/** Immediate entrance on page load (above the fold). */
export function Enter({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const style: CSSProperties = { animationDelay: `${delay}s` }
  return (
    <div className={`animate-enter ${className}`} style={style}>
      {children}
    </div>
  )
}
