/** Lowercase URL slug. Empty input is rejected. */
import { CmsError } from './read-cms.mjs'

export function slugify(value) {
  const slug = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug) throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', 'Title did not produce a slug')
  return slug
}
