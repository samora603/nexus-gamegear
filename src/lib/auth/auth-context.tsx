import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

import { isAdminUser } from './auth-access.mjs'
import { AuthContext } from './auth-context-object'
import type { AuthState } from './auth-types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const client = getSupabaseClient()
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthState>(() => {
    const user = session?.user ?? null
    return {
      session,
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminUser(user),
      async signIn(email, password) {
        const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
        if (error) return { ok: false, message: 'Sign-in failed. Check the email and password.' }
        return { ok: true }
      },
      async signOut() {
        const { error } = await getSupabaseClient().auth.signOut()
        if (error && import.meta.env.DEV) console.error('Sign-out failed.')
      },
    }
  }, [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
