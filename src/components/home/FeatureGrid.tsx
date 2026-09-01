import featureSectionBg from '@/assets/images/home/feature-section-bg.webp'
import { features } from '@/data/features'
import { FeatureCard } from '@/components/home/FeatureCard'
import { GradientBackground } from '@/components/ui/GradientBackground'

export function FeatureGrid() {
  return (
    <section aria-labelledby="features-heading" className="relative">
      <GradientBackground variant="feature" className="px-4 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-design">
          <h2 id="features-heading" className="sr-only">
            Key technology trends
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {features.map((feature) => (
              <li key={feature.id}>
                <FeatureCard feature={feature} />
              </li>
            ))}
          </ul>
        </div>
      </GradientBackground>

      {/* Supporting copy over soundboard background */}
      <div className="relative px-4 py-14 sm:px-8 sm:py-16">
        <div aria-hidden="true" className="absolute inset-0">
          <img
            src={featureSectionBg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-nexus-purple-900/85" />
        </div>
        <div className="relative mx-auto max-w-design">
          <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
            {features.map((feature) => (
              <li key={`${feature.id}-detail`}>
                <p className="font-display text-sm leading-relaxed text-white/90 sm:text-base">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
