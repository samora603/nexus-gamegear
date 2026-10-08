import type { Session, User } from '@supabase/supabase-js'

export interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>
  signOut: () => Promise<void>
}
