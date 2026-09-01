import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/** Semi-transparent card with backdrop blur — homepage category cards. */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-glass border border-white/10 bg-white/20 p-4 backdrop-blur-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
