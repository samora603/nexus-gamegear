import { Link } from 'react-router-dom'
import { siteSettings } from '@/data/site-settings'
import { cn } from '@/lib/cn'

export interface BrandLogoProps {
  className?: string
  showTagline?: boolean
  linkToHome?: boolean
}

/** SVG logo + wordmark derived from Canva brand header. */
export function BrandLogo({
  className,
  showTagline = false,
  linkToHome = true,
}: BrandLogoProps) {
  const content = (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="h-8 w-8 shrink-0"
          fill="none"
        >
          <circle cx="16" cy="16" r="6" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2" fill="#22D3EE" />
          <path
            d="M16 4v4M16 24v4M4 16h4M24 16h4"
            stroke="#22D3EE"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-lg uppercase tracking-wider text-white">
          {siteSettings.siteName}
        </span>
      </div>
      {showTagline && (
        <span className="font-body text-tagline uppercase text-white/80">
          {siteSettings.tagline}
        </span>
      )}
    </div>
  )

  if (linkToHome) {
    return (
      <Link
        to="/"
        className="inline-block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
        aria-label={`${siteSettings.siteName} — Home`}
      >
        {content}
      </Link>
    )
  }

  return content
}
