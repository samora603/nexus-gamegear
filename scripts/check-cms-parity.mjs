/**
 * Compare the static semantic model with the remote read-only CMS snapshot.
 * Does not render pages and does not write to Supabase.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { readCms } from '../src/lib/cms/read-cms.mjs'
import { buildLocalSemanticModel } from './seed-cms.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readEnv(name) {
  const text = readFileSync(path.join(root, '.env.local'), 'utf8')
  const line = text.split('\n').find((entry) => entry.startsWith(`${name}=`))
  if (!line) throw new Error(`Missing ${name}`)
  return line.slice(name.length + 1).trim()
}

function compare(local, remote, trail, mismatches) {
  if (typeof local === 'number' && typeof remote === 'number') {
    if (Math.abs(local - remote) > 0.001) mismatches.push(`MISMATCH: ${trail}`)
    return
  }
  if (local === remote) return
  if (Array.isArray(local) && Array.isArray(remote)) {
    if (local.length !== remote.length) {
      mismatches.push(`MISMATCH: ${trail}.length local=${local.length} remote=${remote.length}`)
      return
    }
    local.forEach((item, index) => compare(item, remote[index], `${trail}[${index}]`, mismatches))
    return
  }
  if (local && remote && typeof local === 'object' && typeof remote === 'object') {
    const keys = [...new Set([...Object.keys(local), ...Object.keys(remote)])].sort()
    for (const key of keys) compare(local[key], remote[key], `${trail}.${key}`, mismatches)
    return
  }
  mismatches.push(`MISMATCH: ${trail}`)
}

const local = buildLocalSemanticModel()
const remote = await readCms(readEnv('VITE_SUPABASE_URL'), readEnv('VITE_SUPABASE_ANON_KEY'))
const mismatches = []
compare(local, remote, 'cms', mismatches)

const layerCount = remote.categories.reduce((sum, category) => sum + category.collage.layers.length, 0)
const pillCount = remote.categories.reduce((sum, category) => sum + category.pills.length, 0)

console.log(`categories ${remote.categories.length}`)
console.log(`pills ${pillCount}`)
console.log(`collages ${remote.categories.length}`)
console.log(`layers ${layerCount}`)
console.log(`media ${remote.mediaPaths.length}`)
console.log('KNOWN_GAP designFile is frontend-only and is not compared')
console.log('KNOWN_GAP contactAnchor is frontend-only and is not compared')
console.log('KNOWN_GAP collage className, breakpoints, skew, and glass frames are not reconstructed')
console.log('KNOWN_GAP overlay text position classes are stored as null and are not compared')

if (mismatches.length === 0) {
  console.log('MATCH')
} else {
  for (const line of mismatches) console.log(line)
  process.exit(1)
}
