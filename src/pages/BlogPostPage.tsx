import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
import { CategoryBackNav } from '@/components/navigation/CategoryBackNav'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GradientBackground } from '@/components/ui/GradientBackground'
import { useBlogArticle } from '@/lib/cms/blog-data'

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const page = useBlogArticle(slug)

  useEffect(() => {
    if (page.status !== 'ready') return
    const previousTitle = document.title
    document.title = page.post.seoTitle
    return () => {
      document.title = previousTitle
    }
  }, [page])

  if (page.status === 'not-found') return <NotFoundPage />

  return (
    <GradientBackground variant="category" className="min-h-screen overflow-x-hidden">
      <div className="mx-auto min-h-screen max-w-design px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <CategoryBackNav className="mb-6 lg:mb-8" />
        {page.status === 'loading' ? (
          <p className="font-body text-sm text-white/70" role="status">
            Loading article
          </p>
        ) : null}
        {page.status === 'error' ? (
          <p className="max-w-xl font-body text-white/80" role="alert">
            This article is unavailable right now.
          </p>
        ) : null}
        {page.status === 'ready' ? (
          <article className="mx-auto max-w-3xl">
            <p className="font-body text-xs uppercase tracking-widest text-white/60">
              <time dateTime={page.post.publishedAt}>{formatPublishedAt(page.post.publishedAt)}</time>
              <span aria-hidden="true"> · </span>
              <span>{page.post.authorName}</span>
            </p>
            <SectionHeading as="h1" size="section" className="mt-3 normal-case">
              {page.post.title}
            </SectionHeading>
            {page.post.featuredImage ? (
              <img
                src={page.post.featuredImage.url}
                alt={page.post.featuredImage.alt}
                className="mt-8 w-full rounded-collage object-cover"
              />
            ) : null}
            <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-white/85">
              {page.post.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              to="/blog"
              className="mt-10 inline-flex font-body text-sm text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-cyan-400"
            >
              Back to journal
            </Link>
          </article>
        ) : null}
      </div>
    </GradientBackground>
  )
}
