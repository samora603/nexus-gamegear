import { useContext } from 'react'
import { AuthContext } from '@/lib/auth/auth-context-object'
import type { AuthState } from '@/lib/auth/auth-types'

export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
