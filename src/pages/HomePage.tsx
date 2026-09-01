import { AboutSection } from '@/components/home/AboutSection'
import { ContactSection } from '@/components/home/ContactSection'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HeroSection } from '@/components/home/HeroSection'
import { PromoBanner } from '@/components/home/PromoBanner'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeatureGrid />
      <AboutSection />
      <PromoBanner />
      <ContactSection />
    </main>
  )
}
