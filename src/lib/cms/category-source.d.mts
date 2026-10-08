export const CMS_CANARY_SLUGS: readonly [
  'communication-gadgets',
  'entertainment-gadgets',
  'computer-gadgets',
  'wearable-gadgets',
  'photography-gadgets',
  'power-charging-gadgets',
]

export function resolveCategorySource(slug: string): 'cms' | 'static'

export function mergeCanaryCategory<TCategory extends { slug: string }, TCollage>(
  staticView: { category: TCategory; collage: TCollage },
  cmsCategory: {
    slug: string
    name: string
    displayTitle: string
    cardLabel: string
    offsetCard: boolean
    pills: { slug: string; name: string }[]
    collage: {
      overlayPrimary: string | null
      overlaySecondary: string | null
      layers: {
        key: string
        type: 'image' | 'panel'
        storagePath: string | null
        alt: string | null
      }[]
    }
  },
  resolveUrl: (storagePath: string) => string | null,
): { category: TCategory; collage: TCollage }

export function presentCanary<TView>(
  staticView: TView,
  loaded:
    | { ok: false }
    | {
        ok: true
        category: Parameters<typeof mergeCanaryCategory>[1]
        resolveUrl: (storagePath: string) => string | null
      },
): { source: 'cms' | 'static-fallback'; view: TView }
