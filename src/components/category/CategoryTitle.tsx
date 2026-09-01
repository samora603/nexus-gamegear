import { cn } from '@/lib/cn'

export interface CategoryTitleProps {
  title: string
  className?: string
}

/** Large serif category heading — matches Canva all-caps page titles. */
export function CategoryTitle({ title, className }: CategoryTitleProps) {
  return (
    <h1
      className={cn(
        'font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-white sm:text-4xl lg:text-[2.75rem]',
        className,
      )}
    >
      {title}
    </h1>
  )
}
