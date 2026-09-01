import type { CategoryCollageConfig } from '@/types/collage'

/* Communication */
import commPrimary from '@/assets/images/category/communication-gadgets/primary-collage.webp'
import commOverlay from '@/assets/images/category/communication-gadgets/overlay-hand.webp'

/* Entertainment */
import entTv from '@/assets/images/category/entertainment-gadgets/tv-main.webp'
import entVintage from '@/assets/images/category/entertainment-gadgets/vintage-tvs.webp'
import entHeadphones from '@/assets/images/category/entertainment-gadgets/headphones.webp'
import entSpeakers from '@/assets/images/category/entertainment-gadgets/speakers.webp'
import entPs1 from '@/assets/images/category/entertainment-gadgets/playstation.webp'

/* Computer */
import compPrinter from '@/assets/images/category/computer-gadgets/printer-main.webp'
import compDesk from '@/assets/images/category/computer-gadgets/desk-setup.webp'
import compDesktop from '@/assets/images/category/computer-gadgets/desktop-setup.webp'
import compFloor from '@/assets/images/category/computer-gadgets/floor-printer.webp'

/* Wearable */
import wearWatch from '@/assets/images/category/wearable-gadgets/watch-main.webp'
import wearGlasses from '@/assets/images/category/wearable-gadgets/smart-glasses.webp'
import wearStrap from '@/assets/images/category/wearable-gadgets/watch-strap.webp'
import wearSecondary from '@/assets/images/category/wearable-gadgets/watch-secondary.webp'

/* Photography */
import photoDrone from '@/assets/images/category/photography-gadgets/drone-main.webp'
import photoAction from '@/assets/images/category/photography-gadgets/action-camera.webp'
import photoLeica from '@/assets/images/category/photography-gadgets/leica-camera.webp'
import photoGear from '@/assets/images/category/photography-gadgets/gear-layout.webp'

/* Power */
import powerWireless from '@/assets/images/category/power-charging-gadgets/wireless-charger.webp'
import powerBanks from '@/assets/images/category/power-charging-gadgets/power-banks.webp'
import powerBow from '@/assets/images/category/power-charging-gadgets/bow-charger.webp'
import powerLavender from '@/assets/images/category/power-charging-gadgets/lavender-charger.webp'
import powerPads from '@/assets/images/category/power-charging-gadgets/charging-pads.webp'

export const categoryCollages: Record<string, CategoryCollageConfig> = {
  'communication-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    panels: [
      {
        id: 'dark-overlay',
        className:
          'absolute right-[4%] top-[24%] z-20 hidden h-[58%] w-[36%] -skew-x-6 bg-indigo-950/80 sm:block',
      },
    ],
    images: [
      {
        id: 'primary',
        src: commPrimary,
        alt: 'Collage of vintage mobile phones arranged as a surreal portrait',
        className:
          'absolute left-[34%] top-[4%] z-10 w-[52%] rounded-collage shadow-collage sm:left-[36%] sm:w-[48%] lg:left-[38%] [clip-path:polygon(0_0,100%_0,100%_88%,88%_100%,0_100%)]',
      },
      {
        id: 'overlay-hand',
        src: commOverlay,
        alt: 'Hand holding a modern smartphone with colorful app icons',
        className:
          'absolute bottom-[6%] right-[0%] z-30 w-[38%] -rotate-6 shadow-collage sm:right-[2%] sm:w-[34%]',
      },
    ],
    overlayText: {
      primary: 'iPhone G',
      secondary: 'NEXT GENERATION CONCEPT',
      className:
        'absolute bottom-[22%] right-[6%] z-40 hidden text-right font-body text-xs font-bold italic text-white sm:block lg:text-sm',
    },
  },

  'entertainment-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    images: [
      {
        id: 'vintage-tvs',
        src: entVintage,
        alt: 'Gallery of vintage CRT televisions',
        className:
          'absolute right-[2%] top-[0%] z-10 w-[32%] opacity-90 shadow-collage',
      },
      {
        id: 'speakers',
        src: entSpeakers,
        alt: 'Wooden bookshelf speakers with vinyl records',
        className:
          'absolute left-[14%] top-[4%] z-30 w-[22%] opacity-85 shadow-collage sm:left-[16%]',
      },
      {
        id: 'tv-main',
        src: entTv,
        alt: 'Modern smart TV displaying streaming apps on a wood console',
        className:
          'absolute left-[30%] top-[16%] z-20 w-[46%] rounded-collage shadow-collage sm:left-[32%]',
      },
      {
        id: 'headphones',
        src: entHeadphones,
        alt: 'Light purple over-ear headphones in protective case',
        className:
          'absolute bottom-[4%] left-[24%] z-30 w-[28%] rounded-glass border border-white/10 bg-white/10 p-1 backdrop-blur-sm sm:left-[26%]',
      },
      {
        id: 'playstation',
        src: entPs1,
        alt: 'Original PlayStation console with controllers and cables',
        className:
          'absolute bottom-[6%] right-[4%] z-25 w-[32%] opacity-95 shadow-collage',
      },
    ],
  },

  'computer-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    images: [
      {
        id: 'desk-setup',
        src: compDesk,
        alt: 'Home office desk with monitor and plant',
        className:
          'absolute left-[14%] top-[2%] z-10 w-[18%] shadow-collage sm:left-[16%]',
      },
      {
        id: 'printer-main',
        src: compPrinter,
        alt: 'Office printer with a green meadow visible on the scanner bed',
        className:
          'absolute left-[28%] top-[8%] z-30 w-[50%] rounded-collage shadow-collage sm:left-[30%] [clip-path:polygon(0_0,82%_0,100%_14%,100%_100%,0_100%)]',
      },
      {
        id: 'floor-printer',
        src: compFloor,
        alt: 'Multifunction office printer on the floor',
        className:
          'absolute bottom-[0%] left-[36%] z-15 w-[30%] opacity-90 shadow-collage',
      },
      {
        id: 'desktop-setup',
        src: compDesktop,
        alt: 'Desktop computer with monitor, keyboard, and mouse',
        className:
          'absolute bottom-[6%] right-[2%] z-20 w-[34%] shadow-collage',
      },
    ],
  },

  'wearable-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    panels: [
      {
        id: 'white-panel',
        className:
          'absolute left-[34%] top-[10%] z-0 h-[72%] w-[54%] rounded-window bg-white/15 sm:left-[36%]',
      },
      {
        id: 'burgundy-panel',
        className:
          'absolute bottom-[14%] left-[18%] z-15 h-[30%] w-[30%] bg-nexus-burgundy sm:left-[20%]',
      },
    ],
    images: [
      {
        id: 'watch-main',
        src: wearWatch,
        alt: 'Rugged black smartwatch with fitness metrics on display',
        className:
          'absolute left-[36%] top-[12%] z-20 w-[46%] shadow-collage sm:left-[38%]',
      },
      {
        id: 'smart-glasses',
        src: wearGlasses,
        alt: 'Smart glasses with visible internal components',
        className:
          'absolute bottom-[10%] left-[16%] z-30 w-[32%] shadow-collage sm:left-[18%]',
      },
      {
        id: 'watch-strap',
        src: wearStrap,
        alt: 'Close-up of a textured black watch strap',
        className:
          'absolute right-[0%] top-[2%] z-25 w-[18%] shadow-collage',
      },
      {
        id: 'watch-secondary',
        src: wearSecondary,
        alt: 'Smartwatch displaying post-workout heart rate data',
        className:
          'absolute bottom-[8%] right-[6%] z-25 w-[22%] shadow-collage',
      },
    ],
  },

  'photography-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    panels: [
      {
        id: 'white-window',
        className:
          'absolute left-[32%] top-[6%] z-0 h-[84%] w-[60%] rounded-window bg-white/20 backdrop-blur-sm sm:left-[34%]',
      },
    ],
    images: [
      {
        id: 'drone-main',
        src: photoDrone,
        alt: 'DJI Air 3S drone in flight over snowy mountains',
        className:
          'absolute left-[36%] top-[10%] z-20 w-[52%] rounded-collage shadow-collage sm:left-[38%]',
      },
      {
        id: 'action-camera',
        src: photoAction,
        alt: 'Waterproof action camera housing marked HD 1080P',
        className:
          'absolute bottom-[12%] left-[14%] z-30 w-[30%] opacity-90 shadow-collage sm:left-[16%]',
      },
      {
        id: 'leica-camera',
        src: photoLeica,
        alt: 'Hands holding two vintage-style rangefinder cameras',
        className:
          'absolute bottom-[6%] left-[40%] z-25 w-[34%] opacity-90 shadow-collage',
      },
      {
        id: 'gear-layout',
        src: photoGear,
        alt: 'Flat lay of camera lenses, batteries, and accessories',
        className:
          'absolute right-[0%] top-[6%] z-15 w-[16%] shadow-collage',
      },
    ],
  },

  'power-charging-gadgets': {
    containerClassName: 'min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]',
    panels: [
      {
        id: 'wood-surface',
        className:
          'absolute left-[30%] top-[8%] z-0 h-[80%] w-[62%] rounded-window bg-stone-300/25 sm:left-[32%]',
      },
      {
        id: 'grey-panel-left',
        className:
          'absolute bottom-[10%] left-[26%] z-10 h-[24%] w-[22%] bg-white/10',
      },
      {
        id: 'grey-panel-right',
        className:
          'absolute right-[0%] top-[18%] z-10 h-[50%] w-[12%] bg-white/10',
      },
    ],
    images: [
      {
        id: 'power-banks',
        src: powerBanks,
        alt: 'Stack of colorful power banks showing USB ports',
        className:
          'absolute left-[28%] top-[0%] z-20 w-[30%] opacity-95 shadow-collage',
      },
      {
        id: 'bow-charger',
        src: powerBow,
        alt: 'Decorative silver bow-shaped wall charger',
        className:
          'absolute left-[50%] top-[2%] z-25 w-[20%] shadow-collage',
      },
      {
        id: 'wireless-charger',
        src: powerWireless,
        alt: 'Wireless charging pad with glowing cyan symbols charging a smartphone',
        className:
          'absolute left-[36%] top-[18%] z-30 w-[44%] shadow-collage sm:left-[38%]',
      },
      {
        id: 'lavender-charger',
        src: powerLavender,
        alt: 'Lavender wall charger with matching cable',
        className:
          'absolute bottom-[6%] left-[26%] z-20 w-[28%] opacity-90 shadow-collage',
      },
      {
        id: 'charging-pads',
        src: powerPads,
        alt: 'Stack of slim circular wireless charging pads in assorted colors',
        className:
          'absolute right-[0%] top-[16%] z-25 w-[18%] shadow-collage',
      },
    ],
  },
}

export function getCategoryCollage(slug: string): CategoryCollageConfig | undefined {
  return categoryCollages[slug]
}
