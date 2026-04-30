import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

const sizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export const StarRating = ({ rating, reviewCount, size = 'sm', showCount = true }: StarRatingProps) => {
  const filled = Math.floor(rating)
  const partial = rating % 1
  const empty = 5 - Math.ceil(rating)

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: filled }).map((_, i) => (
          <Star key={i} className={`${sizes[size]} fill-amber-400 text-amber-400`} />
        ))}
        {partial > 0 && (
          <span className="relative">
            <Star className={`${sizes[size]} text-white/10`} />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${partial * 100}%` }}
            >
              <Star className={`${sizes[size]} fill-amber-400 text-amber-400`} />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={i} className={`${sizes[size]} text-white/10`} />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-[var(--text-muted)] ml-0.5">
          {rating.toFixed(1)} ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
