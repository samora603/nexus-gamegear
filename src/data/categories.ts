import categoryCommunication from '@/assets/images/home/category-communication.webp'
import categoryComputer from '@/assets/images/home/category-computer.webp'
import categoryEntertainment from '@/assets/images/home/category-entertainment.webp'
import categoryPhotography from '@/assets/images/home/category-photography.webp'
import categoryPower from '@/assets/images/home/category-power.webp'
import categoryWearable from '@/assets/images/home/category-wearable.webp'
import type { Category } from '@/types/category'

/**
 * Static category configuration aligned with Canva designs 2–7.
 * Will be replaced by Supabase queries in Phase 2.
 */
export const categories: Category[] = [
  {
    slug: 'communication-gadgets',
    name: 'Communication Gadgets',
    displayTitle: 'COMMUNICATION GADGETS',
    cardLabel: 'Communication gadgets',
    cardImage: categoryCommunication,
    designFile: '2.png',
    subCategories: [
      { slug: 'smartphones', name: 'Smartphones' },
      { slug: 'tablets', name: 'Tablets' },
      { slug: 'smartwatches', name: 'Smartwatches' },
    ],
  },
  {
    slug: 'entertainment-gadgets',
    name: 'Entertainment Gadgets',
    displayTitle: 'ENTERTAINMENT GADGETS',
    cardLabel: 'Entertainment gadgets',
    cardImage: categoryEntertainment,
    designFile: '3.png',
    subCategories: [
      { slug: 'tv', name: 'TV' },
      { slug: 'gaming-consoles', name: 'Gaming Consoles' },
      { slug: 'headphones', name: 'Headphones' },
      { slug: 'speakers', name: 'Speakers' },
    ],
  },
  {
    slug: 'computer-gadgets',
    name: 'Computer Gadgets',
    displayTitle: 'COMPUTER GADGETS',
    cardLabel: 'Computer gadgets',
    cardImage: categoryComputer,
    designFile: '4.png',
    subCategories: [
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'desktops', name: 'Desktops' },
      { slug: 'printers', name: 'Printers' },
    ],
  },
  {
    slug: 'wearable-gadgets',
    name: 'Wearable Gadgets',
    displayTitle: 'WEARABLE GADGETS',
    cardLabel: 'Wearable gadgets',
    cardImage: categoryWearable,
    designFile: '5.png',
    subCategories: [
      { slug: 'fitness-trackers', name: 'Fitness trackers' },
      { slug: 'smart-watches', name: 'Smart watches' },
      { slug: 'smart-glasses', name: 'Smart glasses' },
    ],
  },
  {
    slug: 'photography-gadgets',
    name: 'Photography Gadgets',
    displayTitle: 'PHOTOGRAPHY GADGETS',
    cardLabel: 'Photography gadgets',
    cardImage: categoryPhotography,
    designFile: '6.png',
    subCategories: [
      { slug: 'digital-cameras', name: 'Digital cameras' },
      { slug: 'action-cameras', name: 'Action cameras' },
      { slug: 'drone-cameras', name: 'Drone cameras' },
    ],
  },
  {
    slug: 'power-charging-gadgets',
    name: 'Power & Charging Gadgets',
    displayTitle: 'POWER AND CHARGING GADGETS',
    cardLabel: 'Power and charging gadgets',
    cardImage: categoryPower,
    designFile: '7.png',
    offsetCard: true,
    subCategories: [
      { slug: 'chargers', name: 'Chargers' },
      { slug: 'power-banks', name: 'Power banks' },
      { slug: 'wireless-charging-pads', name: 'Wireless charging pads' },
    ],
  },
]

export const categorySlugs = categories.map((category) => category.slug)
