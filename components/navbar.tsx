import NavbarClient from './navbar-client'
import { getSiteStats } from '@/lib/restaurants'
import { getPhoStats } from '@/lib/pho'

export default function Navbar() {
  // Real dataset counts (not fabricated) surfaced as small authority badges
  // in the nav — computed here on the server so the client bundle only ever
  // sees plain numbers, not the underlying datasets.
  const { restaurants } = getSiteStats()
  const { restaurants: phoRestaurants } = getPhoStats()
  return <NavbarClient restaurantCount={restaurants} phoCount={phoRestaurants} />
}
