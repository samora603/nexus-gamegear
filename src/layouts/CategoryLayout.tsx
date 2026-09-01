import type { ReactNode } from 'react'
import { CategoryBackNav } from '@/components/navigation/CategoryBackNav'
import { GradientBackground } from '@/components/ui/GradientBackground'

interface CategoryLayoutProps {
  children: ReactNode
}

/**
 * Minimal category page shell with optional back navigation.
 * Full Canva composition is implemented in Phase 1C.
 */
export function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <GradientBackground variant="category" className="min-h-screen">
      <div className="mx-auto min-h-screen max-w-design px-4 py-6 sm:px-6 lg:px-8">
        <CategoryBackNav />
        {children}
      </div>
    </GradientBackground>
  )
}
