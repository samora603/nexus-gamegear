import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const pillClasses =
  'inline-flex min-w-[12.5rem] items-center justify-center rounded-full border border-white bg-black px-8 py-3 font-display text-sm uppercase tracking-wide text-white'

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, renders a non-interactive visual control (Phase 1 sub-category pills). */
  decorative?: boolean
}

/**
 * Black pill button with white border — matches Canva category page sub-category controls.
 */
export function PillButton({
  className,
  decorative = false,
  children,
  ...props
}: PillButtonProps) {
  if (decorative) {
    return (
      <span className={cn(pillClasses, 'cursor-default opacity-90', className)}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        pillClasses,
        'transition-colors hover:bg-white/10',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
