import { siteSettings } from '@/data/site-settings'
import { CategoryCard } from '@/components/home/CategoryCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useHomepageCategories } from '@/lib/cms/category-data'

export function AboutSection() {
  const { status, source, offset, main } = useHomepageCategories()

  return (
    <section
      id="explore-solutions"
      aria-labelledby="about-heading"
      className="bg-nexus-purple-900 px-4 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-design">
        <div className="max-w-3xl space-y-4">
          <SectionHeading as="h2" id="about-heading" size="section">
            {siteSettings.aboutHeading}
          </SectionHeading>
          <p className="font-body text-base leading-relaxed text-white/85 sm:text-lg">
            {siteSettings.aboutBody}
          </p>
        </div>

        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {siteSettings.exploreHeading}
          </h3>

          <div className="relative mt-8" data-category-source={source}>
            {status === 'empty' ? (
              <p className="font-body text-white/80">No published categories yet.</p>
            ) : (
              <>
                {offset && (
                  <div className="mb-4 flex justify-end lg:absolute lg:-top-24 lg:mb-0 lg:w-[calc(20%-0.625rem)]">
                    <CategoryCard
                      category={offset}
                      className="w-full max-w-[12rem] sm:max-w-[14rem] lg:max-w-none"
                    />
                  </div>
                )}

                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                  {main.map((category) => (
                    <li key={category.slug}>
                      <CategoryCard category={category} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
