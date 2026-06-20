import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ramen Map | Searchmap For Ramen Restaurants',
  description: 'Search the interactive ramen map to find ramen restaurants near you. Filter by broth type, rating, and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/searchmap' },
}

export default function SearchMapLayout({ children }: { children: React.ReactNode }) {
  return children
}
