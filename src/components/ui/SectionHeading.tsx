import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type SectionHeadingLevel = 'h1' | 'h2' | 'h3'

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: SectionHeadingLevel
  size?: 'hero' | 'section' | 'card'
}

const sizeClasses = {
  hero: 'text-hero uppercase',
  section: 'text-section uppercase',
  card: 'text-card-title uppercase',
} as const

/** Serif display heading — matches Canva page titles and section headers. */
export function SectionHeading({
  as: Component = 'h2',
  size = 'section',
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <Component
      className={cn('font-display text-white', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
