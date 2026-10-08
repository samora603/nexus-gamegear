import { Link } from 'react-router-dom'
import { CategoryBackNav } from '@/components/navigation/CategoryBackNav'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GradientBackground } from '@/components/ui/GradientBackground'
import { useBlogIndex } from '@/lib/cms/blog-data'

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function BlogIndexPage() {
  const page = useBlogIndex()

  return (
    <GradientBackground variant="category" className="min-h-screen overflow-x-hidden">
      <div className="mx-auto min-h-screen max-w-design px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <CategoryBackNav className="mb-6 lg:mb-8" />
        <SectionHeading as="h1" size="section">
          Journal
        </SectionHeading>
        <p className="mt-4 max-w-2xl font-body text-white/80">
          Notes from GameGear Nexus on gear, reviews, and buying decisions.
        </p>

        {page.status === 'loading' ? (
          <p className="mt-10 font-body text-sm text-white/70" role="status">
            Loading articles
          </p>
        ) : null}

        {page.status === 'error' ? (
          <p className="mt-10 max-w-xl font-body text-white/80" role="alert">
            Articles are unavailable right now.
          </p>
        ) : null}

        {page.status === 'ready' && page.posts.length === 0 ? (
          <p className="mt-10 max-w-xl font-body text-white/80">No published articles yet.</p>
        ) : null}

        {page.status === 'ready' && page.posts.length > 0 ? (
          <ul className="mt-10 grid gap-6">
            {page.posts.map((post) => (
              <li key={post.slug}>
                <article className="grid gap-4 rounded-glass border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:grid-cols-[12rem_1fr] sm:p-5">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      className="h-40 w-full rounded-collage object-cover sm:h-full"
                    />
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  <div>
                    <p className="font-body text-xs uppercase tracking-widest text-white/60">
                      <time dateTime={post.publishedAt}>{formatPublishedAt(post.publishedAt)}</time>
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-white">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 font-body text-white/80">{post.excerpt}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </GradientBackground>
  )
}
