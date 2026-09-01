import heroBackground from '@/assets/images/home/hero-background.webp'
import heroPhone from '@/assets/images/home/hero-phone.webp'
import { siteSettings } from '@/data/site-settings'
import { HeroBrandLogo } from '@/components/shared/HeroBrandLogo'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-nexus-pink-100"
    >
      <div className="mx-auto max-w-design">
        {/* Brand header */}
        <header className="relative z-20 px-4 pb-6 pt-8 sm:px-8 sm:pt-10">
          <HeroBrandLogo />
        </header>

        {/* Hero content */}
        <div className="relative grid min-h-[28rem] lg:grid-cols-[1fr_auto] lg:min-h-[32rem]">
          {/* Left: desk background + pink panel content */}
          <div className="relative flex flex-col justify-center px-4 pb-10 sm:px-8 lg:pb-16 lg:pr-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <img
                src={heroBackground}
                alt=""
                className="h-full w-full object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-nexus-pink-100/95 via-nexus-pink-200/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-lg space-y-6">
              <h1
                id="hero-heading"
                className="font-display text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem]"
              >
                {siteSettings.heroHeadline}
              </h1>
              <a
                href={siteSettings.heroCtaHref}
                className="inline-flex items-center rounded-full border border-neutral-900/20 bg-white/90 px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-neutral-900 shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-purple-700"
              >
                {siteSettings.heroCtaText}
              </a>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="relative hidden items-end justify-center bg-neutral-900 lg:flex lg:w-[22rem] xl:w-[26rem]">
            <img
              src={heroPhone}
              alt=""
              aria-hidden="true"
              className="h-[95%] w-auto max-w-full object-contain object-bottom"
            />
          </div>
        </div>

        {/* Mobile phone preview */}
        <div className="relative flex justify-center bg-neutral-900 px-4 py-6 lg:hidden">
          <img
            src={heroPhone}
            alt=""
            aria-hidden="true"
            className="h-64 w-auto object-contain"
          />
        </div>
      </div>
    </section>
  )
}
