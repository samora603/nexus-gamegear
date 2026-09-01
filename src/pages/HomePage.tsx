import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'
import { siteSettings } from '@/data/site-settings'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Development placeholder — full homepage UI in Phase 1B. */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-design px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 space-y-4">
        <BrandLogo showTagline linkToHome={false} />
        <SectionHeading as="h1" size="hero">
          {siteSettings.siteName}
        </SectionHeading>
        <p className="max-w-2xl font-body text-white/70">
          Phase 1A foundation — homepage sections will be implemented in Phase
          1B. Hero CTA preserved as &ldquo;{siteSettings.heroCtaText}&rdquo;.
        </p>
      </header>

      <section aria-labelledby="category-links-heading" className="space-y-4">
        <SectionHeading as="h2" id="category-links-heading" size="card">
          Category routes
        </SectionHeading>
        <ul className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/${category.slug}`}
                className="block rounded-card border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white/90 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
