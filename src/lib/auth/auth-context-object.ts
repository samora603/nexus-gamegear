import { createContext } from 'react'
import type { AuthState } from '@/lib/auth/auth-types'

export const AuthContext = createContext<AuthState | null>(null)
