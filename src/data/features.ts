import featureAi from '@/assets/images/home/feature-ai.webp'
import featureAudio from '@/assets/images/home/feature-audio.webp'
import featureGaming from '@/assets/images/home/feature-gaming.webp'

export interface Feature {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export const features: Feature[] = [
  {
    id: 'ai-power',
    title: 'On-device and generative AI power',
    description:
      'More devices run AI locally for faster, private features (AI assistants, noise removal, real-time game enhancements), and consumers are using GenAI tools regularly.',
    image: featureAi,
    imageAlt: 'Hand holding a smartphone with holographic AI interface',
  },
  {
    id: 'smart-homes',
    title: 'Intelligent homes and ecosystems',
    description:
      'Smart-home tech is shifting from isolated gadgets to coordinated, AI-driven ecosystems that automate routines and tie into entertainment and security.',
    image: featureGaming,
    imageAlt: 'RGB gaming desk setup with keyboard, mouse, and headphones',
  },
  {
    id: 'multi-device',
    title: 'Multi-device ownership and specialization',
    description:
      'People keep multiple devices (phone, laptop, console, wearable) and choose specialized gadgets for gaming, streaming, and productivity rather than one all-purpose device.',
    image: featureAudio,
    imageAlt: 'Close-up of premium audio equipment control knobs',
  },
]
