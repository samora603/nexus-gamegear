import { Link } from 'react-router-dom'
import type { Category } from '@/types/category'
import { cn } from '@/lib/cn'

export interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      to={`/${category.slug}`}
      className={cn(
        'group relative flex aspect-square flex-col justify-end overflow-hidden rounded-card border border-white/10 bg-black/40 p-4 backdrop-blur-sm transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400 sm:p-5',
        className,
      )}
    >
      {category.cardImage && (
        <img
          src={category.cardImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-50"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="relative z-10 font-body text-sm font-medium text-white sm:text-base">
        {category.cardLabel}
      </span>
    </Link>
  )
}
