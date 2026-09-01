import { siteSettings } from '@/data/site-settings'
import { cn } from '@/lib/cn'

export interface HeroBrandLogoProps {
  className?: string
}

/** Centered hero branding — GAMEGEAR [icon] NEXUS with tagline. */
export function HeroBrandLogo({ className }: HeroBrandLogoProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 text-center', className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-semibold uppercase tracking-[0.15em] text-neutral-900 sm:text-3xl">
          GameGear
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          fill="none"
        >
          <polygon
            points="20,2 36,11 36,29 20,38 4,29 4,11"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="20" cy="20" r="5" stroke="#1a1a1a" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="1.5" fill="#1a1a1a" />
          <path
            d="M20 8v4M20 28v4M8 20h4M28 20h4"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-2xl font-semibold uppercase tracking-[0.15em] text-neutral-900 sm:text-3xl">
          Nexus
        </span>
      </div>
      <p className="font-body text-tagline uppercase text-neutral-700">
        {siteSettings.tagline}
      </p>
    </div>
  )
}
