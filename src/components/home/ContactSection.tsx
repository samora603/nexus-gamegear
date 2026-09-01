import contactGrid from '@/assets/images/home/contact-grid.webp'
import { siteSettings } from '@/data/site-settings'
import { SocialLinks } from '@/components/shared/SocialLinks'

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-4 grid lg:grid-cols-2"
    >
      {/* Left: contact info panel */}
      <div className="flex flex-col justify-center bg-nexus-purple-700 px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <h2
          id="contact-heading"
          className="font-display text-section uppercase text-neutral-900"
        >
          {siteSettings.contactHeading}
        </h2>

        <div className="mt-8 space-y-6 font-body text-neutral-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Phone
            </p>
            <div className="mt-1 h-0.5 w-12 bg-lime-400" aria-hidden="true" />
            <a
              href={`tel:${siteSettings.contactPhone}`}
              className="mt-2 block text-lg font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              {siteSettings.contactPhone}
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Email
            </p>
            <div className="mt-1 h-0.5 w-12 bg-lime-400" aria-hidden="true" />
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="mt-2 block text-lg font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              {siteSettings.contactEmail}
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Social
            </p>
            <div className="mt-1 h-0.5 w-12 bg-lime-400" aria-hidden="true" />
            <SocialLinks className="mt-4" />
          </div>
        </div>
      </div>

      {/* Right: photo grid collage */}
      <div className="relative min-h-[20rem] bg-nexus-purple-900 lg:min-h-0">
        <img
          src={contactGrid}
          alt="Collage of tech product photography including cameras, headphones, and gadgets"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </section>
  )
}
