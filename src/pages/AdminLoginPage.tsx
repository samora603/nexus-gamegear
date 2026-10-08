import { useState, type FormEvent } from 'react'
import { GradientBackground } from '@/components/ui/GradientBackground'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AdminLoginGate } from '@/lib/auth/auth-guards'
import { useAuth } from '@/lib/auth/use-auth'

function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter an email and password.')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    setPassword('')
    setSubmitting(false)
    if (!result.ok) setError(result.message)
  }

  return (
    <GradientBackground variant="category" className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <SectionHeading as="h1" size="section">
          Admin sign in
        </SectionHeading>
        <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="font-body text-sm text-white/80">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
              required
            />
          </label>
          <label className="font-body text-sm text-white/80">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
              required
            />
          </label>
          {error ? (
            <p className="font-body text-sm text-white" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full border border-white px-6 py-2 font-body text-sm text-white disabled:opacity-60"
          >
            {submitting ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </main>
    </GradientBackground>
  )
}

export default function AdminLoginPage() {
  return (
    <AdminLoginGate>
      <LoginForm />
    </AdminLoginGate>
  )
}
