/**
 * Read-only CMS fetch and mapping.
 * Database percentages are returned as numbers. Tailwind class strings are not
 * reconstructed: the React collage still owns CSS.
 */

export class CmsError extends Error {
  /**
   * @param {'CMS_QUERY_FAILED' | 'CMS_MEDIA_RESOLUTION_FAILED' | 'CMS_CATEGORY_MAPPING_FAILED'} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message)
    this.name = 'CmsError'
    this.code = code
  }
}

/**
 * @param {string | null | undefined} supabaseUrl
 * @param {string | null | undefined} storagePath
 */
export function publicMediaUrl(supabaseUrl, storagePath) {
  if (storagePath == null || storagePath === '') return null
  if (!supabaseUrl) {
    throw new CmsError('CMS_MEDIA_RESOLUTION_FAILED', 'Supabase URL is missing')
  }
  const normalized = storagePath.replace(/^\/+/, '')
  if (normalized.startsWith('media/') || normalized.includes('..')) {
    throw new CmsError(
      'CMS_MEDIA_RESOLUTION_FAILED',
      `Storage path must be relative to the media bucket: ${normalized}`,
    )
  }
  const base = supabaseUrl.replace(/\/+$/, '')
  return `${base}/storage/v1/object/public/media/${normalized}`
}

function num(value, label) {
  if (value == null || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(parsed)) {
    throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `Invalid number for ${label}`)
  }
  return parsed
}

function requireNum(value, label) {
  const parsed = num(value, label)
  if (parsed == null) {
    throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `Missing number for ${label}`)
  }
  return parsed
}

/**
 * @param {string | null | undefined} supabaseUrl
 * @param {Map<string, { storage_path: string }>} mediaById
 * @param {string | null | undefined} mediaId
 * @param {string} label
 */
function mediaPath(supabaseUrl, mediaById, mediaId, label) {
  if (!mediaId) return { storagePath: null, publicUrl: null }
  const media = mediaById.get(mediaId)
  if (!media) {
    throw new CmsError('CMS_MEDIA_RESOLUTION_FAILED', `Missing media for ${label}`)
  }
  return {
    storagePath: media.storage_path,
    publicUrl: publicMediaUrl(supabaseUrl, media.storage_path),
  }
}

/**
 * @param {object} rows
 * @param {string} supabaseUrl
 */
export function mapCmsRows(rows, supabaseUrl) {
  const mediaById = new Map(rows.media.map((row) => [row.id, row]))
  if (rows.siteSettings.length !== 1) {
    throw new CmsError(
      'CMS_QUERY_FAILED',
      `Expected one site_settings row, received ${rows.siteSettings.length}`,
    )
  }
  const site = rows.siteSettings[0]
  const heroBackground = mediaPath(supabaseUrl, mediaById, site.hero_background_media_id, 'hero background')
  const heroPhone = mediaPath(supabaseUrl, mediaById, site.hero_phone_media_id, 'hero phone')

  const categories = [...rows.categories].sort((a, b) => a.sort_order - b.sort_order)
  const collageByCategory = new Map(rows.collages.map((row) => [row.category_id, row]))
  const pillsByCategory = new Map()
  for (const pill of rows.pills) {
    const list = pillsByCategory.get(pill.category_id) ?? []
    list.push(pill)
    pillsByCategory.set(pill.category_id, list)
  }
  const layersByCollage = new Map()
  for (const layer of rows.layers) {
    const list = layersByCollage.get(layer.collage_id) ?? []
    list.push(layer)
    layersByCollage.set(layer.collage_id, list)
  }

  return {
    site: {
      siteName: site.site_name,
      tagline: site.tagline,
      heroHeadline: site.hero_headline,
      heroCtaText: site.hero_cta_text,
      heroCtaHref: site.hero_cta_href,
      aboutHeading: site.about_heading,
      aboutBody: site.about_body,
      exploreHeading: site.explore_heading,
      promoBannerText: site.promo_banner_text,
      contactHeading: site.contact_heading,
      contactPhone: site.contact_phone,
      contactEmail: site.contact_email,
      heroBackgroundPath: heroBackground.storagePath,
      heroPhonePath: heroPhone.storagePath,
    },
    socialLinks: [...rows.socialLinks]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((link) => ({ platform: link.platform, label: link.label, href: link.url })),
    features: [...rows.features]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((feature) => {
        const image = mediaPath(supabaseUrl, mediaById, feature.media_id, `feature ${feature.key}`)
        return {
          id: feature.key,
          title: feature.title,
          description: feature.description,
          imageAlt: feature.image_alt,
          storagePath: image.storagePath,
        }
      }),
    contentBlocks: [...rows.contentBlocks]
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((block) => ({
        key: block.key,
        body: block.body,
        storagePath: mediaPath(supabaseUrl, mediaById, block.media_id, `block ${block.key}`).storagePath,
      })),
    contactImages: [...rows.contactImages]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        alt: image.alt_text,
        storagePath: mediaPath(supabaseUrl, mediaById, image.media_id, 'contact grid').storagePath,
        sortOrder: image.sort_order,
      })),
    mediaPaths: rows.media.map((row) => row.storage_path).sort(),
    categories: categories.map((category) => {
      const collage = collageByCategory.get(category.id)
      if (!collage) {
        throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `Missing collage for ${category.slug}`)
      }
      const layers = [...(layersByCollage.get(collage.id) ?? [])].sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
        return a.z_index - b.z_index
      })
      const pills = [...(pillsByCategory.get(category.id) ?? [])].sort((a, b) => a.sort_order - b.sort_order)
      return {
        slug: category.slug,
        name: category.name,
        displayTitle: category.display_title,
        cardLabel: category.card_label,
        offsetCard: category.offset_card,
        cardPath: mediaPath(supabaseUrl, mediaById, category.card_media_id, `${category.slug} card`).storagePath,
        pills: pills.map((pill) => ({ slug: pill.slug, name: pill.label })),
        collage: {
          containerVariant: collage.container_variant,
          overlayPrimary: collage.overlay_primary,
          overlaySecondary: collage.overlay_secondary,
          layers: layers.map((layer) => mapLayer(supabaseUrl, mediaById, layer, category.slug)),
        },
      }
    }),
  }
}

function mapLayer(supabaseUrl, mediaById, layer, slug) {
  if (layer.layer_type !== 'image' && layer.layer_type !== 'panel') {
    throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', `Unknown layer type ${layer.layer_type}`)
  }
  const image = mediaPath(supabaseUrl, mediaById, layer.media_id, `${slug}/${layer.layer_key}`)
  if (layer.layer_type === 'image' && !image.storagePath) {
    throw new CmsError('CMS_MEDIA_RESOLUTION_FAILED', `Image layer ${slug}/${layer.layer_key} has no media`)
  }
  if (layer.layer_type === 'panel' && image.storagePath) {
    throw new CmsError(
      'CMS_CATEGORY_MAPPING_FAILED',
      `Panel ${slug}/${layer.layer_key} unexpectedly references media`,
    )
  }
  return {
    key: layer.layer_key,
    type: layer.layer_type,
    storagePath: image.storagePath,
    alt: layer.alt_text,
    panelVariant: layer.panel_variant,
    clipVariant: layer.clip_variant,
    posLeftPct: requireNum(layer.pos_left_pct, `${layer.layer_key}.pos_left_pct`),
    posTopPct: requireNum(layer.pos_top_pct, `${layer.layer_key}.pos_top_pct`),
    widthPct: requireNum(layer.width_pct, `${layer.layer_key}.width_pct`),
    heightPct: num(layer.height_pct, `${layer.layer_key}.height_pct`),
    zIndex: requireNum(layer.z_index, `${layer.layer_key}.z_index`),
    rotationDeg: requireNum(layer.rotation_deg, `${layer.layer_key}.rotation_deg`),
    opacity: requireNum(layer.opacity, `${layer.layer_key}.opacity`),
    sortOrder: requireNum(layer.sort_order, `${layer.layer_key}.sort_order`),
  }
}

const selects = {
  media:
    'media_assets?select=id,storage_path,file_name,mime_type,alt_text,width,height,file_size_bytes&order=storage_path.asc',
  siteSettings:
    'site_settings?select=site_name,tagline,hero_headline,hero_cta_text,hero_cta_href,hero_background_media_id,hero_phone_media_id,about_heading,about_body,explore_heading,promo_banner_text,contact_heading,contact_phone,contact_email',
  socialLinks: 'social_links?select=platform,label,url,sort_order&order=sort_order.asc',
  features: 'features?select=key,title,description,image_alt,media_id,sort_order&order=sort_order.asc',
  contentBlocks: 'content_blocks?select=key,body,media_id&order=key.asc',
  categories:
    'categories?select=id,slug,name,display_title,card_label,card_media_id,offset_card,sort_order&order=sort_order.asc',
  pills: 'category_pills?select=category_id,slug,label,sort_order&order=sort_order.asc',
  collages:
    'category_collages?select=id,category_id,container_variant,overlay_primary,overlay_secondary,overlay_pos_left_pct,overlay_pos_top_pct',
  layers:
    'collage_layers?select=collage_id,layer_key,layer_type,media_id,panel_variant,clip_variant,alt_text,pos_left_pct,pos_top_pct,width_pct,height_pct,z_index,rotation_deg,opacity,sort_order&order=sort_order.asc',
  contactImages: 'contact_grid_images?select=alt_text,media_id,sort_order&order=sort_order.asc',
}

/**
 * Read published CMS rows with the anon key. No writes.
 * @param {string} supabaseUrl
 * @param {string} anonKey
 * @param {typeof fetch} [fetchImpl]
 */
export async function readCms(supabaseUrl, anonKey, fetchImpl = fetch) {
  if (!supabaseUrl || !anonKey) {
    throw new CmsError('CMS_QUERY_FAILED', 'Supabase URL and anon key are required')
  }
  const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
  const base = supabaseUrl.replace(/\/+$/, '')

  async function get(path, label) {
    let response
    try {
      response = await fetchImpl(`${base}/rest/v1/${path}`, { headers })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network failure'
      throw new CmsError('CMS_QUERY_FAILED', `${label} request failed: ${message}`)
    }
    if (!response.ok) {
      throw new CmsError('CMS_QUERY_FAILED', `${label} failed with HTTP ${response.status}`)
    }
    return response.json()
  }

  const [media, siteSettings, socialLinks, features, contentBlocks, categories, pills, collages, layers, contactImages] =
    await Promise.all([
      get(selects.media, 'media_assets'),
      get(selects.siteSettings, 'site_settings'),
      get(selects.socialLinks, 'social_links'),
      get(selects.features, 'features'),
      get(selects.contentBlocks, 'content_blocks'),
      get(selects.categories, 'categories'),
      get(selects.pills, 'category_pills'),
      get(selects.collages, 'category_collages'),
      get(selects.layers, 'collage_layers'),
      get(selects.contactImages, 'contact_grid_images'),
    ])

  return mapCmsRows(
    { media, siteSettings, socialLinks, features, contentBlocks, categories, pills, collages, layers, contactImages },
    supabaseUrl,
  )
}
