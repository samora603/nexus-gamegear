/**
 * Idempotent CMS seed for the remote `media` bucket and public tables.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment (never commit it).
 * Reads VITE_SUPABASE_URL from the environment or .env.local.
 *
 * Storage paths are relative to the `media` bucket:
 *   home/<file>.webp
 *   categories/<slug>/<file>.webp
 *
 * Layout numbers use the base (non-sm) Tailwind utilities already in
 * src/data/category-collages.ts. See the file header notes in the run log
 * for approximations the schema cannot store exactly.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const homeAssets = [
  { file: 'hero-background.webp', alt: 'Pink desk setup used as the homepage hero background' },
  { file: 'hero-phone.webp', alt: 'Smartphone mockup beside the homepage headline' },
  { file: 'feature-ai.webp', alt: 'Hand holding a smartphone with holographic AI interface' },
  { file: 'feature-gaming.webp', alt: 'RGB gaming desk setup with keyboard, mouse, and headphones' },
  { file: 'feature-audio.webp', alt: 'Close-up of premium audio equipment control knobs' },
  { file: 'feature-section-bg.webp', alt: 'Dark soundboard background behind the feature descriptions' },
  { file: 'promo-banner-bg.webp', alt: 'Promotional banner background' },
  { file: 'contact-grid.webp', alt: 'Collage of tech product photography including cameras, headphones, and gadgets' },
  { file: 'category-communication.webp', alt: 'Communication gadgets category card' },
  { file: 'category-entertainment.webp', alt: 'Entertainment gadgets category card' },
  { file: 'category-computer.webp', alt: 'Computer gadgets category card' },
  { file: 'category-photography.webp', alt: 'Photography gadgets category card' },
  { file: 'category-power.webp', alt: 'Power and charging gadgets category card' },
  { file: 'category-wearable.webp', alt: 'Wearable gadgets category card' },
]

const categories = [
  {
    slug: 'communication-gadgets',
    name: 'Communication Gadgets',
    displayTitle: 'COMMUNICATION GADGETS',
    cardLabel: 'Communication gadgets',
    cardFile: 'category-communication.webp',
    offsetCard: false,
    sortOrder: 0,
    pills: [
      { slug: 'smartphones', label: 'Smartphones' },
      { slug: 'tablets', label: 'Tablets' },
      { slug: 'smartwatches', label: 'Smartwatches' },
    ],
  },
  {
    slug: 'entertainment-gadgets',
    name: 'Entertainment Gadgets',
    displayTitle: 'ENTERTAINMENT GADGETS',
    cardLabel: 'Entertainment gadgets',
    cardFile: 'category-entertainment.webp',
    offsetCard: false,
    sortOrder: 1,
    pills: [
      { slug: 'tv', label: 'TV' },
      { slug: 'gaming-consoles', label: 'Gaming Consoles' },
      { slug: 'headphones', label: 'Headphones' },
      { slug: 'speakers', label: 'Speakers' },
    ],
  },
  {
    slug: 'computer-gadgets',
    name: 'Computer Gadgets',
    displayTitle: 'COMPUTER GADGETS',
    cardLabel: 'Computer gadgets',
    cardFile: 'category-computer.webp',
    offsetCard: false,
    sortOrder: 2,
    pills: [
      { slug: 'laptops', label: 'Laptops' },
      { slug: 'desktops', label: 'Desktops' },
      { slug: 'printers', label: 'Printers' },
    ],
  },
  {
    slug: 'wearable-gadgets',
    name: 'Wearable Gadgets',
    displayTitle: 'WEARABLE GADGETS',
    cardLabel: 'Wearable gadgets',
    cardFile: 'category-wearable.webp',
    offsetCard: false,
    sortOrder: 3,
    pills: [
      { slug: 'fitness-trackers', label: 'Fitness trackers' },
      { slug: 'smart-watches', label: 'Smart watches' },
      { slug: 'smart-glasses', label: 'Smart glasses' },
    ],
  },
  {
    slug: 'photography-gadgets',
    name: 'Photography Gadgets',
    displayTitle: 'PHOTOGRAPHY GADGETS',
    cardLabel: 'Photography gadgets',
    cardFile: 'category-photography.webp',
    offsetCard: false,
    sortOrder: 4,
    pills: [
      { slug: 'digital-cameras', label: 'Digital cameras' },
      { slug: 'action-cameras', label: 'Action cameras' },
      { slug: 'drone-cameras', label: 'Drone cameras' },
    ],
  },
  {
    slug: 'power-charging-gadgets',
    name: 'Power & Charging Gadgets',
    displayTitle: 'POWER AND CHARGING GADGETS',
    cardLabel: 'Power and charging gadgets',
    cardFile: 'category-power.webp',
    offsetCard: true,
    sortOrder: 5,
    pills: [
      { slug: 'chargers', label: 'Chargers' },
      { slug: 'power-banks', label: 'Power banks' },
      { slug: 'wireless-charging-pads', label: 'Wireless charging pads' },
    ],
  },
]

const panelVariants = {
  'dark-overlay': 'dark_overlay',
  'white-panel': 'white_panel',
  'burgundy-panel': 'burgundy',
  'white-window': 'white_window',
  'wood-surface': 'wood_surface',
  'grey-panel-left': 'grey_accent',
  'grey-panel-right': 'grey_accent',
}

const collages = {
  'communication-gadgets': {
    overlayPrimary: 'iPhone G',
    overlaySecondary: 'NEXT GENERATION CONCEPT',
    panels: [
      {
        key: 'dark-overlay',
        className:
          'absolute right-[4%] top-[24%] z-20 hidden h-[58%] w-[36%] -skew-x-6 bg-indigo-950/80 sm:block',
      },
    ],
    images: [
      {
        key: 'primary',
        file: 'primary-collage.webp',
        alt: 'Collage of vintage mobile phones arranged as a surreal portrait',
        clip: 'none',
        className:
          'absolute left-[34%] top-[4%] z-10 w-[52%] rounded-collage shadow-collage sm:left-[36%] sm:w-[48%] lg:left-[38%] [clip-path:polygon(0_0,100%_0,100%_88%,88%_100%,0_100%)]',
      },
      {
        key: 'overlay-hand',
        file: 'overlay-hand.webp',
        alt: 'Hand holding a modern smartphone with colorful app icons',
        clip: 'none',
        className:
          'absolute bottom-[6%] right-[0%] z-30 w-[38%] -rotate-6 shadow-collage sm:right-[2%] sm:w-[34%]',
      },
    ],
  },
  'entertainment-gadgets': {
    images: [
      {
        key: 'vintage-tvs',
        file: 'vintage-tvs.webp',
        alt: 'Gallery of vintage CRT televisions',
        clip: 'none',
        className: 'absolute right-[2%] top-[0%] z-10 w-[32%] opacity-90 shadow-collage',
      },
      {
        key: 'speakers',
        file: 'speakers.webp',
        alt: 'Wooden bookshelf speakers with vinyl records',
        clip: 'none',
        className: 'absolute left-[14%] top-[4%] z-30 w-[22%] opacity-85 shadow-collage sm:left-[16%]',
      },
      {
        key: 'tv-main',
        file: 'tv-main.webp',
        alt: 'Modern smart TV displaying streaming apps on a wood console',
        clip: 'none',
        className:
          'absolute left-[30%] top-[16%] z-20 w-[46%] rounded-collage shadow-collage sm:left-[32%]',
      },
      {
        key: 'headphones',
        file: 'headphones.webp',
        alt: 'Light purple over-ear headphones in protective case',
        clip: 'none',
        className:
          'absolute bottom-[4%] left-[24%] z-30 w-[28%] rounded-glass border border-white/10 bg-white/10 p-1 backdrop-blur-sm sm:left-[26%]',
      },
      {
        key: 'playstation',
        file: 'playstation.webp',
        alt: 'Original PlayStation console with controllers and cables',
        clip: 'none',
        className: 'absolute bottom-[6%] right-[4%] z-25 w-[32%] opacity-95 shadow-collage',
      },
    ],
  },
  'computer-gadgets': {
    images: [
      {
        key: 'desk-setup',
        file: 'desk-setup.webp',
        alt: 'Home office desk with monitor and plant',
        clip: 'none',
        className: 'absolute left-[14%] top-[2%] z-10 w-[18%] shadow-collage sm:left-[16%]',
      },
      {
        key: 'printer-main',
        file: 'printer-main.webp',
        alt: 'Office printer with a green meadow visible on the scanner bed',
        clip: 'notch_top_right',
        className:
          'absolute left-[28%] top-[8%] z-30 w-[50%] rounded-collage shadow-collage sm:left-[30%] [clip-path:polygon(0_0,82%_0,100%_14%,100%_100%,0_100%)]',
      },
      {
        key: 'floor-printer',
        file: 'floor-printer.webp',
        alt: 'Multifunction office printer on the floor',
        clip: 'none',
        className: 'absolute bottom-[0%] left-[36%] z-15 w-[30%] opacity-90 shadow-collage',
      },
      {
        key: 'desktop-setup',
        file: 'desktop-setup.webp',
        alt: 'Desktop computer with monitor, keyboard, and mouse',
        clip: 'none',
        className: 'absolute bottom-[6%] right-[2%] z-20 w-[34%] shadow-collage',
      },
    ],
  },
  'wearable-gadgets': {
    panels: [
      {
        key: 'white-panel',
        className:
          'absolute left-[34%] top-[10%] z-0 h-[72%] w-[54%] rounded-window bg-white/15 sm:left-[36%]',
      },
      {
        key: 'burgundy-panel',
        className:
          'absolute bottom-[14%] left-[18%] z-15 h-[30%] w-[30%] bg-nexus-burgundy sm:left-[20%]',
      },
    ],
    images: [
      {
        key: 'watch-main',
        file: 'watch-main.webp',
        alt: 'Rugged black smartwatch with fitness metrics on display',
        clip: 'none',
        className: 'absolute left-[36%] top-[12%] z-20 w-[46%] shadow-collage sm:left-[38%]',
      },
      {
        key: 'smart-glasses',
        file: 'smart-glasses.webp',
        alt: 'Smart glasses with visible internal components',
        clip: 'none',
        className: 'absolute bottom-[10%] left-[16%] z-30 w-[32%] shadow-collage sm:left-[18%]',
      },
      {
        key: 'watch-strap',
        file: 'watch-strap.webp',
        alt: 'Close-up of a textured black watch strap',
        clip: 'none',
        className: 'absolute right-[0%] top-[2%] z-25 w-[18%] shadow-collage',
      },
      {
        key: 'watch-secondary',
        file: 'watch-secondary.webp',
        alt: 'Smartwatch displaying post-workout heart rate data',
        clip: 'none',
        className: 'absolute bottom-[8%] right-[6%] z-25 w-[22%] shadow-collage',
      },
    ],
  },
  'photography-gadgets': {
    panels: [
      {
        key: 'white-window',
        className:
          'absolute left-[32%] top-[6%] z-0 h-[84%] w-[60%] rounded-window bg-white/20 backdrop-blur-sm sm:left-[34%]',
      },
    ],
    images: [
      {
        key: 'drone-main',
        file: 'drone-main.webp',
        alt: 'DJI Air 3S drone in flight over snowy mountains',
        clip: 'none',
        className:
          'absolute left-[36%] top-[10%] z-20 w-[52%] rounded-collage shadow-collage sm:left-[38%]',
      },
      {
        key: 'action-camera',
        file: 'action-camera.webp',
        alt: 'Waterproof action camera housing marked HD 1080P',
        clip: 'none',
        className:
          'absolute bottom-[12%] left-[14%] z-30 w-[30%] opacity-90 shadow-collage sm:left-[16%]',
      },
      {
        key: 'leica-camera',
        file: 'leica-camera.webp',
        alt: 'Hands holding two vintage-style rangefinder cameras',
        clip: 'none',
        className: 'absolute bottom-[6%] left-[40%] z-25 w-[34%] opacity-90 shadow-collage',
      },
      {
        key: 'gear-layout',
        file: 'gear-layout.webp',
        alt: 'Flat lay of camera lenses, batteries, and accessories',
        clip: 'none',
        className: 'absolute right-[0%] top-[6%] z-15 w-[16%] shadow-collage',
      },
    ],
  },
  'power-charging-gadgets': {
    panels: [
      {
        key: 'wood-surface',
        className:
          'absolute left-[30%] top-[8%] z-0 h-[80%] w-[62%] rounded-window bg-stone-300/25 sm:left-[32%]',
      },
      {
        key: 'grey-panel-left',
        className: 'absolute bottom-[10%] left-[26%] z-10 h-[24%] w-[22%] bg-white/10',
      },
      {
        key: 'grey-panel-right',
        className: 'absolute right-[0%] top-[18%] z-10 h-[50%] w-[12%] bg-white/10',
      },
    ],
    images: [
      {
        key: 'power-banks',
        file: 'power-banks.webp',
        alt: 'Stack of colorful power banks showing USB ports',
        clip: 'none',
        className: 'absolute left-[28%] top-[0%] z-20 w-[30%] opacity-95 shadow-collage',
      },
      {
        key: 'bow-charger',
        file: 'bow-charger.webp',
        alt: 'Decorative silver bow-shaped wall charger',
        clip: 'none',
        className: 'absolute left-[50%] top-[2%] z-25 w-[20%] shadow-collage',
      },
      {
        key: 'wireless-charger',
        file: 'wireless-charger.webp',
        alt: 'Wireless charging pad with glowing cyan symbols charging a smartphone',
        clip: 'none',
        className: 'absolute left-[36%] top-[18%] z-30 w-[44%] shadow-collage sm:left-[38%]',
      },
      {
        key: 'lavender-charger',
        file: 'lavender-charger.webp',
        alt: 'Lavender wall charger with matching cable',
        clip: 'none',
        className: 'absolute bottom-[6%] left-[26%] z-20 w-[28%] opacity-90 shadow-collage',
      },
      {
        key: 'charging-pads',
        file: 'charging-pads.webp',
        alt: 'Stack of slim circular wireless charging pads in assorted colors',
        clip: 'none',
        className: 'absolute right-[0%] top-[16%] z-25 w-[18%] shadow-collage',
      },
    ],
  },
}

const features = [
  {
    key: 'ai-power',
    title: 'On-device and generative AI power',
    description:
      'More devices run AI locally for faster, private features (AI assistants, noise removal, real-time game enhancements), and consumers are using GenAI tools regularly.',
    imageAlt: 'Hand holding a smartphone with holographic AI interface',
    file: 'feature-ai.webp',
    sortOrder: 0,
  },
  {
    key: 'smart-homes',
    title: 'Intelligent homes and ecosystems',
    description:
      'Smart-home tech is shifting from isolated gadgets to coordinated, AI-driven ecosystems that automate routines and tie into entertainment and security.',
    imageAlt: 'RGB gaming desk setup with keyboard, mouse, and headphones',
    file: 'feature-gaming.webp',
    sortOrder: 1,
  },
  {
    key: 'multi-device',
    title: 'Multi-device ownership and specialization',
    description:
      'People keep multiple devices (phone, laptop, console, wearable) and choose specialized gadgets for gaming, streaming, and productivity rather than one all-purpose device.',
    imageAlt: 'Close-up of premium audio equipment control knobs',
    file: 'feature-audio.webp',
    sortOrder: 2,
  },
]

const siteSettings = {
  site_name: 'GameGear Nexus',
  tagline: 'DISCOVER. COMPARE. DOMINATE.',
  hero_headline: 'Next-Gen Gear, Expertly Reviewed.',
  hero_cta_text: 'VIEW PROPERTIES',
  hero_cta_href: '#explore-solutions',
  about_heading: 'What we are about',
  about_body:
    'We bring you trusted product reviews, practical buying guides, and the latest tech news — everything you need to choose the right gear with confidence.',
  explore_heading: 'Explore our solutions',
  promo_banner_text:
    'Power up your next-level tech journey with fresh gadget insights, gaming gear reviews, and the smartest picks for modern users.',
  contact_heading: 'CONTACT US!',
  contact_phone: '0793510481',
  contact_email: 'jetagakoi@gmail.com',
  published: true,
}

const socialLinks = [
  { platform: 'facebook', label: 'Facebook', url: '#', sort_order: 0, published: true },
  { platform: 'twitter', label: 'Twitter', url: '#', sort_order: 1, published: true },
  { platform: 'instagram', label: 'Instagram', url: '#', sort_order: 2, published: true },
]

function readEnvFile(name) {
  const file = path.join(root, '.env.local')
  const text = readFileSync(file, 'utf8')
  const line = text.split('\n').find((entry) => entry.startsWith(`${name}=`))
  if (!line) throw new Error(`Missing ${name} in .env.local`)
  return line.slice(name.length + 1).trim()
}

function percent(className, utility) {
  const match = className.match(new RegExp(`(?:^|\\s)${utility}-\\[(\\d+(?:\\.\\d+)?)%\\]`))
  return match ? Number(match[1]) : null
}

function round2(value) {
  return Math.round(value * 100) / 100
}

function clampPct(value, label) {
  if (value < 0 || value > 100) {
    throw new Error(`${label} ${value} is outside 0–100`)
  }
  return round2(value)
}

/**
 * Base Tailwind box → schema percentages.
 * If the class uses bottom without height, height stays null and top is
 * computed as if the box were square (height = width) so the bottom edge
 * still lands on the declared bottom offset.
 */
export function layoutFromClassName(className) {
  const left = percent(className, 'left')
  const right = percent(className, 'right')
  const top = percent(className, 'top')
  const bottom = percent(className, 'bottom')
  const width = percent(className, 'w')
  const height = percent(className, 'h')
  if (width == null) throw new Error(`Missing width in: ${className}`)

  let posLeft
  if (left != null) posLeft = left
  else if (right != null) posLeft = 100 - right - width
  else throw new Error(`Missing left/right in: ${className}`)

  let posTop
  let usedSquareFallback = false
  if (top != null) posTop = top
  else if (bottom != null && height != null) posTop = 100 - bottom - height
  else if (bottom != null) {
    usedSquareFallback = true
    posTop = 100 - bottom - width
  } else {
    throw new Error(`Missing top/bottom in: ${className}`)
  }

  const zMatch = className.match(/(?:^|\s)z-(\d+)/)
  const opacityMatch = className.match(/(?:^|\s)opacity-(\d+)/)
  const rotateMatch = className.match(/(?:^|\s)-rotate-(\d+(?:\.\d+)?)|(?:^|\s)rotate-(\d+(?:\.\d+)?)/)
  const rotation = rotateMatch ? Number(rotateMatch[1] ? -rotateMatch[1] : rotateMatch[2]) : 0
  const opacity = opacityMatch ? Number(opacityMatch[1]) / 100 : 1

  return {
    pos_left_pct: clampPct(posLeft, 'pos_left_pct'),
    pos_top_pct: clampPct(posTop, 'pos_top_pct'),
    width_pct: clampPct(width, 'width_pct'),
    height_pct: height == null ? null : clampPct(height, 'height_pct'),
    z_index: zMatch ? Number(zMatch[1]) : 0,
    rotation_deg: rotation,
    opacity,
    usedSquareFallback,
  }
}

function webpSize(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null
  }
  let offset = 12
  while (offset + 8 <= buffer.length) {
    const tag = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    const data = offset + 8
    if (tag === 'VP8X' && size >= 10) {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      }
    }
    if (tag === 'VP8 ' && size >= 10) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      }
    }
    if (tag === 'VP8L' && size >= 5) {
      const bits = buffer.readUInt32LE(data + 1)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
    offset += 8 + size + (size % 2)
  }
  return null
}

function listWebp(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.webp'))
    .sort()
}

function assertSourceContains(relativeFile, snippets) {
  const text = readFileSync(path.join(root, relativeFile), 'utf8')
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      throw new Error(`Seed is out of date. ${relativeFile} no longer contains: ${snippet}`)
    }
  }
}

function validateAgainstSource() {
  const diskHome = listWebp(path.join(root, 'src/assets/images/home'))
  const expectedHome = homeAssets.map((asset) => asset.file).sort()
  if (diskHome.join() !== expectedHome.join()) {
    throw new Error(`Home WebP set mismatch.\n disk: ${diskHome}\n seed: ${expectedHome}`)
  }

  const referencedCategory = []
  for (const [slug, collage] of Object.entries(collages)) {
    for (const image of collage.images) referencedCategory.push(`${slug}/${image.file}`)
    const disk = listWebp(path.join(root, 'src/assets/images/category', slug))
    const expected = collage.images.map((image) => image.file).sort()
    if (disk.join() !== expected.join()) {
      throw new Error(`Category WebP mismatch for ${slug}.\n disk: ${disk}\n seed: ${expected}`)
    }
  }

  assertSourceContains('src/data/site-settings.ts', [
    siteSettings.site_name,
    siteSettings.hero_headline,
    siteSettings.hero_cta_text,
    siteSettings.contact_email,
    "platform: 'facebook'",
    "platform: 'twitter'",
    "platform: 'instagram'",
  ])
  assertSourceContains(
    'src/data/features.ts',
    features.flatMap((feature) => [feature.key, feature.title, feature.imageAlt]),
  )
  assertSourceContains(
    'src/data/categories.ts',
    categories.flatMap((category) => [
      category.slug,
      category.displayTitle,
      category.cardLabel,
      ...category.pills.flatMap((pill) => [pill.slug, pill.label]),
    ]),
  )
  assertSourceContains(
    'src/data/category-collages.ts',
    Object.values(collages).flatMap((collage) => [
      ...(collage.panels ?? []).map((panel) => panel.className),
      ...collage.images.flatMap((image) => [image.alt, image.className]),
      collage.overlayPrimary,
      collage.overlaySecondary,
    ].filter(Boolean)),
  )

  return referencedCategory
}

function collectMedia() {
  const files = []
  for (const asset of homeAssets) {
    files.push({
      absolute: path.join(root, 'src/assets/images/home', asset.file),
      storagePath: `home/${asset.file}`,
      fileName: asset.file,
      alt: asset.alt,
    })
  }
  for (const [slug, collage] of Object.entries(collages)) {
    for (const image of collage.images) {
      files.push({
        absolute: path.join(root, 'src/assets/images/category', slug, image.file),
        storagePath: `categories/${slug}/${image.file}`,
        fileName: image.file,
        alt: image.alt,
      })
    }
  }
  const paths = files.map((file) => file.storagePath)
  if (new Set(paths).size !== paths.length) throw new Error('Duplicate storage paths in seed manifest')
  return files
}

function buildLayers(mediaIds) {
  const rows = []
  const notes = []
  for (const [slug, collage] of Object.entries(collages)) {
    let sort = 0
    for (const panel of collage.panels ?? []) {
      const variant = panelVariants[panel.key]
      if (!variant) throw new Error(`No panel variant for ${panel.key}`)
      const layout = layoutFromClassName(panel.className)
      if (layout.usedSquareFallback) notes.push(`${slug}/${panel.key}: square fallback for bottom anchor`)
      if (panel.className.includes('-skew-')) notes.push(`${slug}/${panel.key}: skew is not stored; rotation_deg is 0`)
      rows.push({
        slug,
        layer_key: panel.key,
        layer_type: 'panel',
        mediaPath: null,
        panel_variant: variant,
        clip_variant: null,
        alt_text: null,
        ...layout,
        decorative: true,
        sort_order: sort,
        published: true,
      })
      sort += 1
    }
    for (const image of collage.images) {
      const layout = layoutFromClassName(image.className)
      if (layout.usedSquareFallback) notes.push(`${slug}/${image.key}: square fallback for bottom anchor`)
      if (image.className.includes('clip-path') && image.clip === 'none') {
        notes.push(`${slug}/${image.key}: clip-path is not an approved clip_variant; stored as none`)
      }
      if (image.className.includes('backdrop-blur') || image.className.includes('rounded-glass')) {
        notes.push(`${slug}/${image.key}: glass frame classes stay in the frontend; not stored as CSS`)
      }
      const mediaPath = `categories/${slug}/${image.file}`
      if (!mediaIds.has(mediaPath)) throw new Error(`Missing media id for ${mediaPath}`)
      rows.push({
        slug,
        layer_key: image.key,
        layer_type: 'image',
        mediaPath,
        panel_variant: null,
        clip_variant: image.clip,
        alt_text: image.alt,
        ...layout,
        decorative: false,
        sort_order: sort,
        published: true,
      })
      sort += 1
    }
  }
  return { rows, notes }
}

function relayClient(url, anonKey, token) {
  async function call(body) {
    const response = await fetch(`${url}/functions/v1/cms-seed-relay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
        'x-seed-token': token,
      },
      body: JSON.stringify(body),
    })
    const text = await response.text()
    if (!response.ok) throw new Error(text.slice(0, 500))
    return text ? JSON.parse(text) : null
  }

  function builder(query) {
    const api = {
      upsert(rows, options) {
        query.op = 'upsert'
        query.rows = rows
        query.onConflict = options?.onConflict ?? null
        return api
      },
      insert(rows) {
        query.op = 'insert'
        query.rows = Array.isArray(rows) ? rows : [rows]
        return api
      },
      update(values) {
        query.op = 'update'
        query.values = values
        return api
      },
      select(columns = '*') {
        query.columns = columns
        if (!query.op) query.op = 'select'
        return api
      },
      eq(column, value) {
        query.filters.push({ column, value })
        return api
      },
      then(resolve, reject) {
        return call(query).then(
          (data) => resolve({ data, error: null }),
          (error) => resolve({ data: null, error: { message: error.message } }),
        ).catch(reject)
      },
    }
    return api
  }

  return {
    storage: {
      from() {
        return {
          async upload(storagePath, body, options) {
            try {
              await call({
                op: 'upload',
                path: storagePath,
                base64: Buffer.from(body).toString('base64'),
                contentType: options.contentType,
              })
              return { error: null }
            } catch (error) {
              return { error: { message: error instanceof Error ? error.message : String(error) } }
            }
          },
        }
      },
    },
    from(table) {
      return builder({ table, filters: [] })
    },
  }
}

async function must(promise, label) {
  const result = await promise
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const notesFromValidation = validateAgainstSource()
  if (notesFromValidation.length !== 24) {
    throw new Error(`Expected 24 category images, found ${notesFromValidation.length}`)
  }
  const preview = buildLayers(new Set(collectMedia().map((file) => file.storagePath)))
  if (process.argv.includes('--check')) {
    console.log(`Check ok. Layers ${preview.rows.length}. Notes ${preview.notes.length}.`)
    for (const note of preview.notes) console.log(`NOTE ${note}`)
    return
  }

  const url = process.env.SUPABASE_URL || readEnvFile('VITE_SUPABASE_URL')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const relayToken = process.env.CMS_SEED_RELAY_TOKEN
  let supabase
  if (serviceKey) {
    if (serviceKey.startsWith('sb_publishable_') || readEnvFile('VITE_SUPABASE_ANON_KEY') === serviceKey) {
      throw new Error('Refusing to seed with the anon/publishable key.')
    }
    supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  } else if (relayToken) {
    supabase = relayClient(url, readEnvFile('VITE_SUPABASE_ANON_KEY'), relayToken)
  } else {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required. Anonymous writes are denied by RLS. Do not commit this key.',
    )
  }

  const mediaFiles = collectMedia()
  console.log(`Uploading ${mediaFiles.length} objects to bucket media`)
  for (const file of mediaFiles) {
    const body = readFileSync(file.absolute)
    const upload = await supabase.storage.from('media').upload(file.storagePath, body, {
      contentType: 'image/webp',
      upsert: true,
    })
    if (upload.error) throw new Error(`Upload ${file.storagePath}: ${upload.error.message}`)
  }

  const mediaRows = mediaFiles.map((file) => {
    const body = readFileSync(file.absolute)
    const size = webpSize(body)
    return {
      storage_path: file.storagePath,
      file_name: file.fileName,
      mime_type: 'image/webp',
      alt_text: file.alt,
      width: size?.width ?? null,
      height: size?.height ?? null,
      file_size_bytes: body.length,
    }
  })

  const media = await must(
    supabase.from('media_assets').upsert(mediaRows, { onConflict: 'storage_path' }).select('id, storage_path'),
    'upsert media_assets',
  )
  const mediaIds = new Map(media.map((row) => [row.storage_path, row.id]))
  if (mediaIds.size !== mediaFiles.length) {
    throw new Error(`media_assets upsert returned ${mediaIds.size} paths, expected ${mediaFiles.length}`)
  }

  const heroBackground = mediaIds.get('home/hero-background.webp')
  const heroPhone = mediaIds.get('home/hero-phone.webp')
  const settingsExisting = await must(supabase.from('site_settings').select('id'), 'select site_settings')
  if (settingsExisting.length > 1) throw new Error('site_settings has more than one row')
  const settingsPayload = {
    ...siteSettings,
    hero_background_media_id: heroBackground,
    hero_phone_media_id: heroPhone,
    logo_media_id: null,
  }
  if (settingsExisting.length === 1) {
    await must(
      supabase.from('site_settings').update(settingsPayload).eq('id', settingsExisting[0].id),
      'update site_settings',
    )
  } else {
    await must(supabase.from('site_settings').insert(settingsPayload), 'insert site_settings')
  }

  await must(supabase.from('social_links').upsert(socialLinks, { onConflict: 'platform' }), 'upsert social_links')

  await must(
    supabase.from('features').upsert(
      features.map((feature) => ({
        key: feature.key,
        title: feature.title,
        description: feature.description,
        image_alt: feature.imageAlt,
        media_id: mediaIds.get(`home/${feature.file}`),
        sort_order: feature.sortOrder,
        published: true,
      })),
      { onConflict: 'key' },
    ),
    'upsert features',
  )

  await must(
    supabase.from('content_blocks').upsert(
      [
        {
          key: 'feature_section_bg',
          body: null,
          media_id: mediaIds.get('home/feature-section-bg.webp'),
          published: true,
        },
        {
          key: 'promo_banner_bg',
          body: null,
          media_id: mediaIds.get('home/promo-banner-bg.webp'),
          published: true,
        },
      ],
      { onConflict: 'key' },
    ),
    'upsert content_blocks',
  )

  await must(
    supabase.from('categories').upsert(
      categories.map((category) => ({
        slug: category.slug,
        name: category.name,
        display_title: category.displayTitle,
        card_label: category.cardLabel,
        card_media_id: mediaIds.get(`home/${category.cardFile}`),
        offset_card: category.offsetCard,
        sort_order: category.sortOrder,
        published: true,
      })),
      { onConflict: 'slug' },
    ),
    'upsert categories',
  )

  const categoryRows = await must(supabase.from('categories').select('id, slug'), 'select categories')
  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]))

  await must(
    supabase.from('category_pills').upsert(
      categories.flatMap((category) =>
        category.pills.map((pill, index) => ({
          category_id: categoryIds.get(category.slug),
          slug: pill.slug,
          label: pill.label,
          sort_order: index,
          published: true,
        })),
      ),
      { onConflict: 'category_id,slug' },
    ),
    'upsert category_pills',
  )

  await must(
    supabase.from('category_collages').upsert(
      categories.map((category) => {
        const collage = collages[category.slug]
        return {
          category_id: categoryIds.get(category.slug),
          container_variant: 'default',
          overlay_primary: collage.overlayPrimary ?? null,
          overlay_secondary: collage.overlaySecondary ?? null,
          overlay_pos_left_pct: null,
          overlay_pos_top_pct: null,
          published: true,
        }
      }),
      { onConflict: 'category_id' },
    ),
    'upsert category_collages',
  )

  const collageRows = await must(
    supabase.from('category_collages').select('id, category_id'),
    'select category_collages',
  )
  const collageIds = new Map(collageRows.map((row) => [row.category_id, row.id]))
  const { rows: layerDrafts, notes } = buildLayers(mediaIds)

  await must(
    supabase.from('collage_layers').upsert(
      layerDrafts.map((layer) => ({
        collage_id: collageIds.get(categoryIds.get(layer.slug)),
        layer_key: layer.layer_key,
        layer_type: layer.layer_type,
        media_id: layer.mediaPath ? mediaIds.get(layer.mediaPath) : null,
        panel_variant: layer.panel_variant,
        clip_variant: layer.clip_variant,
        alt_text: layer.alt_text,
        pos_left_pct: layer.pos_left_pct,
        pos_top_pct: layer.pos_top_pct,
        width_pct: layer.width_pct,
        height_pct: layer.height_pct,
        z_index: layer.z_index,
        rotation_deg: layer.rotation_deg,
        opacity: layer.opacity,
        decorative: layer.decorative,
        sort_order: layer.sort_order,
        published: true,
      })),
      { onConflict: 'collage_id,layer_key' },
    ),
    'upsert collage_layers',
  )

  const contactMediaId = mediaIds.get('home/contact-grid.webp')
  const contactExisting = await must(
    supabase.from('contact_grid_images').select('id').eq('media_id', contactMediaId),
    'select contact_grid_images',
  )
  if (contactExisting.length > 1) throw new Error('Multiple contact grid rows for the same media')
  const contactPayload = {
    media_id: contactMediaId,
    alt_text: 'Collage of tech product photography including cameras, headphones, and gadgets',
    sort_order: 0,
    published: true,
  }
  if (contactExisting.length === 1) {
    await must(
      supabase.from('contact_grid_images').update(contactPayload).eq('id', contactExisting[0].id),
      'update contact_grid_images',
    )
  } else {
    await must(supabase.from('contact_grid_images').insert(contactPayload), 'insert contact_grid_images')
  }

  console.log(`Seed complete. Media objects: ${mediaFiles.length}. Layout notes: ${notes.length}`)
  for (const note of notes) console.log(`NOTE ${note}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
