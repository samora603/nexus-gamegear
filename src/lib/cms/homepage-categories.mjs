/**
 * Homepage category cards. CMS chooses which published categories appear and
 * their order. Static data supplies the existing card image and design file.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function compareHomepageCategories(left, right) {
  const leftOrder = Number(left?.sortOrder)
  const rightOrder = Number(right?.sortOrder)
  const leftRank = Number.isFinite(leftOrder) ? leftOrder : Number.MAX_SAFE_INTEGER
  const rightRank = Number.isFinite(rightOrder) ? rightOrder : Number.MAX_SAFE_INTEGER
  if (leftRank !== rightRank) return leftRank - rightRank
  return String(left?.slug ?? '').localeCompare(String(right?.slug ?? ''))
}

function usableSlug(value) {
  const slug = String(value ?? '').trim()
  return SLUG_PATTERN.test(slug) ? slug : null
}

/**
 * @param {object[]} staticCategories
 * @param {object[]} cmsCategories Published rows only. An empty list is a real empty result.
 */
export function presentHomepageCategories(staticCategories, cmsCategories) {
  const staticBySlug = new Map((staticCategories ?? []).map((category) => [category.slug, category]))
  const seen = new Set()
  const cards = []

  for (const cmsCategory of [...(cmsCategories ?? [])].sort(compareHomepageCategories)) {
    const slug = usableSlug(cmsCategory?.slug)
    const cardLabel = String(cmsCategory?.cardLabel ?? '').trim()
    if (!slug || !cardLabel || seen.has(slug)) continue
    seen.add(slug)
    const staticCategory = staticBySlug.get(slug)
    const name = String(cmsCategory?.name ?? '').trim() || staticCategory?.name || cardLabel
    const displayTitle = String(cmsCategory?.displayTitle ?? '').trim() || staticCategory?.displayTitle || cardLabel
    cards.push({
      slug,
      name,
      displayTitle,
      cardLabel,
      cardImage: staticCategory?.cardImage,
      designFile: staticCategory?.designFile ?? '',
      offsetCard: cmsCategory?.offsetCard === true,
      subCategories: staticCategory?.subCategories ?? [],
    })
  }

  return cards
}

/**
 * Loading and request failure keep the static cards so the grid never flashes empty.
 * A successful empty snapshot stays empty.
 * @param {'loading' | 'error' | 'ready'} phase
 */
export function homepageCategoryView(phase, staticCategories, cmsCategories) {
  if (phase === 'loading' || phase === 'error') {
    return {
      status: phase,
      source: phase === 'error' ? 'static-fallback' : 'static',
      categories: staticCategories ?? [],
    }
  }
  const categories = presentHomepageCategories(staticCategories, cmsCategories)
  if (categories.length === 0) {
    return { status: 'empty', source: 'cms', categories: [] }
  }
  return { status: 'ready', source: 'cms', categories }
}

export function splitHomepageCards(categories) {
  const offset = (categories ?? []).find((category) => category.offsetCard) ?? null
  return {
    offset,
    main: (categories ?? []).filter((category) => category !== offset),
  }
}
