import type { CategoryCollageConfig } from '@/types/collage'
import { cn } from '@/lib/cn'

export interface CategoryImageCollageProps {
  config: CategoryCollageConfig
  className?: string
}

/** Layered editorial image collage driven by per-category configuration. */
export function CategoryImageCollage({
  config,
  className,
}: CategoryImageCollageProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        config.containerClassName,
        className,
      )}
    >
      {config.panels?.map((panel) => (
        <div
          key={panel.id}
          aria-hidden="true"
          className={panel.className}
        />
      ))}

      {config.images.map((image) => (
        <img
          key={image.id}
          src={image.src}
          alt={image.decorative ? '' : image.alt}
          aria-hidden={image.decorative ? true : undefined}
          loading="lazy"
          className={cn('object-cover', image.className)}
        />
      ))}

      {config.overlayText && (
        <div className={config.overlayText.className} aria-hidden="true">
          <p className="text-base lg:text-lg">{config.overlayText.primary}</p>
          {config.overlayText.secondary && (
            <p className="mt-1 text-[0.65rem] uppercase tracking-widest opacity-80">
              {config.overlayText.secondary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
