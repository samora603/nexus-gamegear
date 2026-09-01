import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { cn } from '@/lib/cn'

export interface CategoryBackNavProps {
  className?: string
}

/**
 * Minimal category-page navigation — logo/home link only.
 * Intentionally lightweight; easy to remove or adjust after visual comparison.
 * Not part of the original Canva composition.
 */
export function CategoryBackNav({ className }: CategoryBackNavProps) {
  return (
    <nav
      aria-label="Category navigation"
      className={cn('mb-8 flex items-center justify-between', className)}
    >
      <BrandLogo linkToHome />
      <Link
        to="/"
        className="font-body text-sm text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
      >
        Back to home
      </Link>
    </nav>
  )
}
