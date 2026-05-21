import { getCities, getStates } from '@/lib/restaurants'
import NavbarClient from './navbar-client'

export default function Navbar() {
  const cities = getCities().map((c) => ({
    city: c.city,
    citySlug: c.citySlug,
    stateSlug: c.stateSlug,
    stateCode: c.stateCode,
    count: c.count,
  }))

  const states = getStates().map((s) => ({
    state: s.state,
    stateSlug: s.stateSlug,
    stateCode: s.stateCode,
    count: s.count,
  }))

  return <NavbarClient cities={cities} states={states} />
}
