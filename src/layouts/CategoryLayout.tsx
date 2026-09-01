import type { ReactNode } from 'react'
import { CategoryBackNav } from '@/components/navigation/CategoryBackNav'
import { GradientBackground } from '@/components/ui/GradientBackground'

interface CategoryLayoutProps {
  children: ReactNode
}

/** Category page shell — purple gradient with minimal back navigation. */
export function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <GradientBackground variant="category" className="min-h-screen overflow-x-hidden">
      <div className="mx-auto min-h-screen max-w-design px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <CategoryBackNav className="mb-6 lg:mb-8" />
        {children}
      </div>
    </GradientBackground>
  )
}
