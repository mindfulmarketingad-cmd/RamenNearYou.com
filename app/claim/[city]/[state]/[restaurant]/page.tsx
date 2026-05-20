import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ClaimForm from './claim-form'
import { createClient } from '@/lib/supabase/server'
import { getRestaurant } from '@/lib/restaurants'

export default async function ClaimPage({ params }: { params: Promise<{ city: string; state: string; restaurant: string }> }) {
  const { city, state, restaurant } = await params
  const r = getRestaurant(city, state, restaurant)
  if (!r) notFound()

  const supabase = await createClient()
  if (!supabase) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirectTo=/claim/${city}/${state}/${restaurant}`)

  const { data: existingClaim } = await supabase
    .from('claims')
    .select('id, status')
    .eq('restaurant_slug', r.slug)
    .single()

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Claim Listing</p>
          <h1 className="font-serif text-4xl font-bold text-[#1E2026] mb-2">Claim {r.name}</h1>
          <p className="text-[#6B6862] mb-8">{r.address}</p>
          {existingClaim ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-amber-300 text-sm">
              This listing has already been claimed (status: {existingClaim.status}). If you believe this is an error, please contact us.
            </div>
          ) : (
            <ClaimForm userEmail={user.email ?? ''} restaurant={r} />
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
