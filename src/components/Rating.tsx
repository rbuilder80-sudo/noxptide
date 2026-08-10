import { Star } from 'lucide-react'

export default function Rating({
  rating,
  reviews,
  size = 'sm',
}: {
  rating: number
  reviews: number
  size?: 'sm' | 'lg'
}) {
  const starCls = size === 'lg' ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rated ${rating} out of 5 from ${reviews} reviews`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starCls} ${
              i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className={`font-semibold text-foreground ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {rating.toFixed(1)}
      </span>
      <span className={`text-muted-foreground ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        ({reviews} reviews)
      </span>
    </div>
  )
}
