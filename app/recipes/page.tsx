import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import RecipesHubSearch from './recipes-hub-search'
import { getAllRecipes } from '@/lib/recipes'
import { pickStockPhoto } from '@/lib/stock-photos'

export const metadata: Metadata = {
  title: 'Ramen Recipes — Make Ramen at Home',
  description: 'Step-by-step homemade ramen recipes with ingredients, instructions, and a printable recipe card for each — chicken, beef, shrimp, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/recipes' },
}

export default function RecipesHubPage() {
  const recipes = getAllRecipes()

  // Split into simple browse groups — broth-focused recipes vs full bowls.
  const brothRecipes = recipes.filter((r) => r.slug.includes('broth'))
  const bowlRecipes = recipes.filter((r) => !r.slug.includes('broth'))

  const groups = [
    {
      heading: 'Ramen Bowl Recipes',
      recipes: bowlRecipes.map((r) => ({ href: `/recipes/${r.slug}`, label: r.title })),
    },
    {
      heading: 'Ramen Broth Recipes',
      recipes: brothRecipes.map((r) => ({ href: `/recipes/${r.slug}`, label: r.title })),
    },
  ].filter((g) => g.recipes.length > 0)

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6">
          <RestaurantImage src={pickStockPhoto('recipes-hub')} alt="A bowl of homemade ramen" fill className="object-cover" sizes="672px" priority />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Ramen Recipes</h1>
        <p className="text-[#6B6862] text-sm mb-6">
          Make real ramen at home — every recipe includes step-by-step instructions and a printable
          recipe card with ingredients, directions, and nutrition facts.
        </p>

        <RecipesHubSearch groups={groups} />
      </div>
      <Footer />
    </main>
  )
}
