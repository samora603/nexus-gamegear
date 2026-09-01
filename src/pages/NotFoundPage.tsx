import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-design flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <SectionHeading as="h1" size="section">
        Page not found
      </SectionHeading>
      <p className="mt-4 max-w-md font-body text-white/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-full border border-white px-6 py-2 font-body text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
      >
        Return home
      </Link>
      <div className="mt-12 opacity-60">
        <BrandLogo linkToHome showTagline />
      </div>
    </main>
  )
}
