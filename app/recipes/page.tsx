import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { getAllRecipes } from '@/lib/recipes'

export const metadata: Metadata = {
  title: 'Ramen Recipes — Make Ramen at Home',
  description: 'Step-by-step homemade ramen recipes with ingredients, instructions, and a printable recipe card for each — chicken, beef, shrimp, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/recipes' },
}

export default function RecipesHubPage() {
  const recipes = getAllRecipes()

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">Ramen Recipes</h1>
        <p className="text-[#6B6862] text-sm mb-10 max-w-2xl">
          Make real ramen at home — every recipe includes step-by-step instructions and a printable
          recipe card with ingredients, directions, and nutrition facts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-black/8 overflow-hidden hover:border-[#B57F50]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative h-44 bg-[#F5F4F0] overflow-hidden shrink-0">
                <RestaurantImage src={r.image} alt={r.cardTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h2 className="font-serif text-lg font-bold text-[#1E2026] leading-snug group-hover:text-[#B57F50] transition-colors">
                  {r.cardTitle}
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#9B9490]">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {r.rating.toFixed(1)} ({r.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B57F50]" />
                    {r.totalTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
