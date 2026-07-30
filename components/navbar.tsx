import NavbarClient from './navbar-client'
import { getSiteStats } from '@/lib/restaurants'

export default function Navbar() {
  // Real dataset counts (not fabricated) surfaced as a small authority badge
  // in the nav — computed here on the server so the client bundle only ever
  // sees a plain number, not the restaurant dataset itself.
  const { restaurants } = getSiteStats()
  return <NavbarClient restaurantCount={restaurants} />
}
