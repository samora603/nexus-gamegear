/**
 * Pure canary rules. Presentation class names stay on the static collage.
 * CMS supplies copy, pills, and storage paths. This file does not fetch.
 */
import { CmsError } from './read-cms.mjs'

export const CMS_CANARY_SLUG = 'communication-gadgets'

export function resolveCategorySource(slug) {
  return slug === CMS_CANARY_SLUG ? 'cms' : 'static'
}

/**
 * @param {{ category: object, collage: object }} staticView
 * @param {object} cmsCategory
 * @param {(storagePath: string) => string | null} resolveUrl
 */
export function mergeCanaryCategory(staticView, cmsCategory, resolveUrl) {
  if (cmsCategory.slug !== staticView.category.slug) {
    throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', 'Canary slug does not match the static category')
  }

  const layers = cmsCategory.collage?.layers ?? []
  const images = staticView.collage.images.map((image) => {
    const layer = layers.find((entry) => entry.key === image.id && entry.type === 'image')
    if (!layer?.storagePath) {
      throw new CmsError('CMS_MEDIA_RESOLUTION_FAILED', `Missing media for ${image.id}`)
    }
    const src = resolveUrl(layer.storagePath)
    if (!src) throw new CmsError('CMS_MEDIA_RESOLUTION_FAILED', `Unresolved media for ${image.id}`)
    return {
      ...image,
      src,
      alt: layer.alt || image.alt,
    }
  })

  const imageKeys = new Set(staticView.collage.images.map((image) => image.id))
  for (const layer of layers) {
    if (layer.type === 'image' && !imageKeys.has(layer.key)) {
      throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `No presentation class for ${layer.key}`)
    }
    if (layer.type === 'panel') {
      const panel = (staticView.collage.panels ?? []).find((entry) => entry.id === layer.key)
      if (!panel) {
        throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `No presentation class for ${layer.key}`)
      }
    }
  }

  const overlay = staticView.collage.overlayText
  return {
    category: {
      ...staticView.category,
      name: cmsCategory.name,
      displayTitle: cmsCategory.displayTitle,
      cardLabel: cmsCategory.cardLabel,
      offsetCard: cmsCategory.offsetCard,
      subCategories: cmsCategory.pills.map((pill) => ({ slug: pill.slug, name: pill.name })),
    },
    collage: {
      containerClassName: staticView.collage.containerClassName,
      panels: (staticView.collage.panels ?? []).map((panel) => ({ ...panel })),
      images,
      overlayText: overlay
        ? {
            className: overlay.className,
            primary: cmsCategory.collage.overlayPrimary || overlay.primary,
            secondary: cmsCategory.collage.overlaySecondary || overlay.secondary,
          }
        : undefined,
    },
  }
}

export function presentCanary(staticView, loaded) {
  if (!loaded.ok) {
    return { source: 'static-fallback', view: staticView }
  }
  return {
    source: 'cms',
    view: mergeCanaryCategory(staticView, loaded.category, loaded.resolveUrl),
  }
}
