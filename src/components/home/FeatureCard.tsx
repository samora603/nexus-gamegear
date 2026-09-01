import type { Feature } from '@/data/features'
import { cn } from '@/lib/cn'

export interface FeatureCardProps {
  feature: Feature
  className?: string
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  return (
    <article className={cn('flex flex-col', className)}>
      <div className="overflow-hidden rounded-card shadow-card">
        <img
          src={feature.image}
          alt={feature.imageAlt}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-nexus-cyan-400 sm:text-xl">
        {feature.title}
      </h3>
    </article>
  )
}
