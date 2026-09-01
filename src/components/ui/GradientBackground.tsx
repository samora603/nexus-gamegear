import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type GradientVariant = 'category' | 'feature' | 'hero-panel'

export interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GradientVariant
  children?: ReactNode
}

const variantClasses: Record<GradientVariant, string> = {
  category: 'bg-gradient-category',
  feature: 'bg-gradient-feature',
  'hero-panel': 'bg-gradient-hero-panel',
}

/** Canva-derived gradient backgrounds for page sections. */
export function GradientBackground({
  variant = 'category',
  className,
  children,
  ...props
}: GradientBackgroundProps) {
  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  )
}
