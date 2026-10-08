export function isAdminUser(user: unknown): boolean

export function safeAdminNext(value: string | null | undefined): string

export function resolveAdminAccess(input: {
  loading: boolean
  authenticated: boolean
  admin: boolean
  pathname: string
  next?: string | null
}): { type: 'loading' | 'login' | 'unauthorized' | 'allow' } | { type: 'redirect'; to: string }
