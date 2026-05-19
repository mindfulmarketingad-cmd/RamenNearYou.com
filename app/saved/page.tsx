import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { restaurants } from '@/lib/restaurants'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saved Restaurants',
  description: 'Your saved ramen restaurants on Ramen Near You.',
}

export default async function SavedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/saved')

  const { data: saves } = await supabase
    .from('saved_restaurants')
    .select('restaurant_slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const savedSlugs = new Set((saves ?? []).map((s) => s.restaurant_slug))
  const saved = restaurants.filter((r) => savedSlugs.has(r.slug))

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest">Your List</p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">Saved Restaurants</h1>
          <p className="text-[#B0B3BB] text-base">
            {saved.length > 0
              ? `${saved.length} saved restaurant${saved.length === 1 ? '' : 's'}`
              : 'No saved restaurants yet'}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {saved.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-[#77567A]/30 mx-auto mb-4" />
              <p className="text-white text-lg font-medium mb-2">Nothing saved yet</p>
              <p className="text-[#B0B3BB] text-sm mb-6">
                Hit the Save button on any restaurant listing to build your list.
              </p>
              <Link
                href="/cities"
                className="px-5 py-2.5 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                  className="group flex flex-col bg-[#1E2026] rounded-xl border border-white/5 overflow-hidden hover:border-[#77567A]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="relative h-44 bg-[#2F323A] overflow-hidden flex-shrink-0">
                    <RestaurantImage
                      src={r.photo}
                      alt={r.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2026] via-transparent to-transparent" />
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <h2 className="font-semibold text-white text-sm leading-snug group-hover:text-[#77567A] transition-colors line-clamp-1">
                        {r.name}
                      </h2>
                      <p className="flex items-center gap-1 text-xs text-[#B0B3BB] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#77567A] flex-shrink-0" />
                        {r.city}, {r.stateCode}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      {r.rating ? (
                        <span className="flex items-center gap-1 text-xs text-white/60">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {r.rating.toFixed(1)}
                          <span className="text-white/30">({r.reviewCount.toLocaleString()})</span>
                        </span>
                      ) : <span />}
                      <span className="text-[#77567A] text-xs font-medium group-hover:underline">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
