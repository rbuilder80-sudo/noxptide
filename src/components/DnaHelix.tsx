import { useEffect, useRef } from 'react'

/**
 * Glowing amber DNA double-helix particle animation on a dark canvas,
 * in the style of a bio-age dashboard hero.
 */
export default function DnaHelix({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Ambient dust particles
    const dust = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      s: 0.00004 + Math.random() * 0.00012,
      o: 0.15 + Math.random() * 0.5,
    }))

    const N = 46 // particles per strand
    let t = 0

    const draw = () => {
      t += 0.012
      ctx.clearRect(0, 0, w, h)

      // warm ambient glow blobs
      const glow = (x: number, y: number, r: number, a: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(255,140,40,${a})`)
        g.addColorStop(1, 'rgba(255,140,40,0)')
        ctx.fillStyle = g
        ctx.fillRect(x - r, y - r, r * 2, r * 2)
      }
      glow(w * 0.68, h * 0.42, Math.max(w, h) * 0.5, 0.16)
      glow(w * 0.25, h * 0.75, Math.max(w, h) * 0.35, 0.08)

      // dust
      for (const d of dust) {
        d.y -= d.s * h * 0.02
        if (d.y < -0.02) d.y = 1.02
        ctx.beginPath()
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,190,120,${d.o * 0.5})`
        ctx.fill()
      }

      // helix geometry — runs diagonally, tilted
      const cx = w * 0.62
      const cy = h * 0.5
      const len = Math.max(w, h) * 1.15
      const amp = Math.min(w, h) * 0.16
      const turns = 2.1

      interface P { x: number; y: number; z: number }
      const strandA: P[] = []
      const strandB: P[] = []

      for (let i = 0; i < N; i++) {
        const u = i / (N - 1)
        const along = (u - 0.5) * len
        const phase = u * Math.PI * 2 * turns + t
        // tilt: rotate axis ~28deg
        const ax = along * Math.cos(0.48)
        const ay = along * Math.sin(0.48)
        const waveA = Math.sin(phase) * amp
        const waveB = Math.sin(phase + Math.PI) * amp
        const depthA = Math.cos(phase)
        const depthB = Math.cos(phase + Math.PI)
        // perpendicular offset
        strandA.push({ x: cx + ax + waveA * Math.sin(0.48) * -1, y: cy + ay + waveA * Math.cos(0.48), z: depthA })
        strandB.push({ x: cx + ax + waveB * Math.sin(0.48) * -1, y: cy + ay + waveB * Math.cos(0.48), z: depthB })
      }

      // rungs
      for (let i = 0; i < N; i += 3) {
        const a = strandA[i]
        const b = strandB[i]
        const alpha = 0.05 + 0.14 * Math.abs(a.z)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(255,160,70,${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // strands
      const drawStrand = (pts: P[]) => {
        for (const p of pts) {
          const depth = (p.z + 1) / 2 // 0..1
          const r = 1 + depth * 2.6
          const alpha = 0.25 + depth * 0.75
          // glow halo
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5)
          g.addColorStop(0, `rgba(255,170,80,${alpha * 0.5})`)
          g.addColorStop(1, 'rgba(255,170,80,0)')
          ctx.fillStyle = g
          ctx.fillRect(p.x - r * 5, p.y - r * 5, r * 10, r * 10)
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,${190 + Math.floor(depth * 50)},${110 + Math.floor(depth * 60)},${alpha})`
          ctx.fill()
        }
      }
      drawStrand(strandB)
      drawStrand(strandA)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
