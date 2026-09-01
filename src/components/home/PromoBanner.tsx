import promoBannerBg from '@/assets/images/home/promo-banner-bg.webp'
import { siteSettings } from '@/data/site-settings'

export function PromoBanner() {
  return (
    <section aria-labelledby="promo-heading" className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={promoBannerBg}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-nexus-purple-900/40" />
      </div>

      <div className="relative mx-auto flex min-h-[16rem] max-w-design items-center justify-center px-6 py-16 sm:min-h-[18rem] sm:px-12 sm:py-20">
        <h2
          id="promo-heading"
          className="max-w-4xl text-center font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl lg:text-[1.75rem]"
        >
          {siteSettings.promoBannerText}
        </h2>
      </div>
    </section>
  )
}
