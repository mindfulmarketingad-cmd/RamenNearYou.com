import { permanentRedirect } from 'next/navigation'
import { getCities } from '@/lib/restaurants'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'

export async function generateStaticParams() {
  return getCities()
    .filter((c) => c.count > 1)
    .map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

export default async function CityPage({ params }: { params: Promise<{ city: string; state: string }> }) {
  const { city, state } = await params
  const stateCode = (STATE_SLUG_TO_CODE[state] ?? state.slice(0, 2)).toLowerCase()
  permanentRedirect(`/find/${city}-${stateCode}`)
}
