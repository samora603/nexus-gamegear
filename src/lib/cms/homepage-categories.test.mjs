import assert from 'node:assert/strict'
import test from 'node:test'

import { homepageCategoryView, presentHomepageCategories, splitHomepageCards } from './homepage-categories.mjs'
import { presentPublishedCategory } from './category-source.mjs'

const staticCategories = [
  { slug: 'communication-gadgets', name: 'Communication Gadgets', displayTitle: 'COMMUNICATION GADGETS', cardLabel: 'Communication gadgets', cardImage: '/local/communication.webp', designFile: '2.png', offsetCard: false, subCategories: [] },
  { slug: 'entertainment-gadgets', name: 'Entertainment Gadgets', displayTitle: 'ENTERTAINMENT GADGETS', cardLabel: 'Entertainment gadgets', cardImage: '/local/entertainment.webp', designFile: '3.png', offsetCard: false, subCategories: [] },
  { slug: 'power-charging-gadgets', name: 'Power & Charging Gadgets', displayTitle: 'POWER AND CHARGING GADGETS', cardLabel: 'Power and charging gadgets', cardImage: '/local/power.webp', designFile: '7.png', offsetCard: true, subCategories: [] },
]

test('published categories appear in ascending sort order', () => {
  const cards = presentHomepageCategories(staticCategories, [
    { slug: 'power-charging-gadgets', cardLabel: 'Power and charging gadgets', sortOrder: 5, offsetCard: true },
    { slug: 'communication-gadgets', cardLabel: 'Communication gadgets', sortOrder: 2, offsetCard: false },
    { slug: 'entertainment-gadgets', cardLabel: 'Live entertainment', sortOrder: 2, offsetCard: false },
  ])
  assert.deepEqual(
    cards.map((card) => card.slug),
    ['communication-gadgets', 'entertainment-gadgets', 'power-charging-gadgets'],
  )
  assert.equal(cards[1].cardLabel, 'Live entertainment')
  assert.equal(cards[1].cardImage, '/local/entertainment.webp')
  assert.equal(cards[0].cardImage, '/local/communication.webp')
})

test('unpublished categories are excluded from a successful snapshot', () => {
  const cards = presentHomepageCategories(staticCategories, [
    { slug: 'entertainment-gadgets', cardLabel: 'Entertainment gadgets', sortOrder: 1, offsetCard: false },
  ])
  assert.deepEqual(cards.map((card) => card.slug), ['entertainment-gadgets'])
})

test('a successful empty response does not restore static categories', () => {
  const view = homepageCategoryView('ready', staticCategories, [])
  assert.equal(view.status, 'empty')
  assert.deepEqual(view.categories, [])
})

test('a failed CMS request displays the static fallback', () => {
  const view = homepageCategoryView('error', staticCategories, [])
  assert.equal(view.source, 'static-fallback')
  assert.equal(view.categories, staticCategories)
  assert.equal(view.categories[0].cardLabel, 'Communication gadgets')
})

test('loading keeps the static cards instead of an empty grid', () => {
  const view = homepageCategoryView('loading', staticCategories, [])
  assert.equal(view.status, 'loading')
  assert.equal(view.categories.length, staticCategories.length)
  assert.equal(view.categories[2].slug, 'power-charging-gadgets')
})

test('card links and labels stay on the existing card shape', () => {
  const [card] = presentHomepageCategories(staticCategories, [
    {
      slug: 'communication-gadgets',
      name: 'Renamed',
      displayTitle: 'RENAMED',
      cardLabel: 'Updated label',
      sortOrder: 0,
      offsetCard: false,
    },
  ])
  assert.equal(card.slug, 'communication-gadgets')
  assert.equal(card.cardLabel, 'Updated label')
  assert.equal(card.cardImage, '/local/communication.webp')
  assert.equal(card.designFile, '2.png')
  const split = splitHomepageCards([card, { ...staticCategories[2], offsetCard: true }])
  assert.equal(split.offset.slug, 'power-charging-gadgets')
  assert.deepEqual(split.main.map((entry) => entry.slug), ['communication-gadgets'])
})

test('malformed slugs and blank labels are omitted', () => {
  const cards = presentHomepageCategories(staticCategories, [
    { slug: '../admin', cardLabel: 'Bad', sortOrder: 0 },
    { slug: 'communication-gadgets', cardLabel: '   ', sortOrder: 1 },
    { slug: 'entertainment-gadgets', cardLabel: 'Entertainment gadgets', sortOrder: 2 },
  ])
  assert.deepEqual(cards.map((card) => card.slug), ['entertainment-gadgets'])
})

test('homepage ordering does not change category-page publication behavior', () => {
  const staticView = {
    category: staticCategories[0],
    collage: { containerClassName: 'min-h', panels: [], images: [] },
  }
  const hidden = presentPublishedCategory(staticView, [], () => null)
  assert.equal(hidden.status, 'not-found')
})
