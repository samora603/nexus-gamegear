import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function AdminField({
  label,
  error,
  children,
}: {
  label: string
  error?: string | null
  children: ReactNode
}) {
  return (
    <label className="block font-body text-sm text-white/80">
      {label}
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-white" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function AdminButton({
  children,
  tone = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'default' | 'danger' }) {
  const color = tone === 'danger' ? 'border-white/70 text-white' : 'border-white text-white'
  return (
    <button
      {...props}
      className={`rounded-full border px-4 py-2 font-body text-sm disabled:opacity-60 ${color} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      {children}
    </button>
  )
}
