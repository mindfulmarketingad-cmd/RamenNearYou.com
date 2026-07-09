import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RecipeCard from '@/components/recipe-card'
import { RECIPES, getRecipe } from '@/lib/recipes'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }))
}

function minutesFrom(label: string): number {
  const match = label.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) return {}
  const url = `https://www.ramennearyou.com/recipes/${slug}`
  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url,
      images: [{ url: recipe.image, alt: recipe.cardTitle }],
    },
  }
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) notFound()

  const url = `https://www.ramennearyou.com/recipes/${slug}`

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.cardTitle,
    description: recipe.description,
    image: [`https://www.ramennearyou.com${recipe.image}`],
    author: { '@type': 'Organization', name: 'RamenNearYou' },
    datePublished: recipe.date,
    prepTime: `PT${minutesFrom(recipe.prepTime)}M`,
    cookTime: `PT${minutesFrom(recipe.cookTime)}M`,
    totalTime: `PT${minutesFrom(recipe.totalTime)}M`,
    recipeYield: `${recipe.baseServings} servings`,
    recipeCategory: 'Main Course',
    recipeCuisine: 'Japanese',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating,
      reviewCount: recipe.reviewCount,
    },
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: recipe.nutrition.protein,
      carbohydrateContent: recipe.nutrition.carbs,
      fatContent: recipe.nutrition.fat,
      fiberContent: recipe.nutrition.fiber,
      sugarContent: recipe.nutrition.sugar,
      sodiumContent: recipe.nutrition.sodium,
    },
    recipeIngredient: recipe.ingredients.map((i) => `${i.amount} ${i.unit} ${i.item}${i.note ? ` (${i.note})` : ''}`.trim()),
    recipeInstructions: recipe.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s.text,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Recipes', item: 'https://www.ramennearyou.com/recipes' },
      { '@type': 'ListItem', position: 3, name: recipe.cardTitle, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen bg-[#F5F4F0]">
        <div className="print:hidden">
          <Navbar />
        </div>

        <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6 print:pt-0 print:max-w-none">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#9B9490] mb-6 flex-wrap print:hidden">
            <Link href="/" className="hover:text-[#B57F50] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/recipes" className="hover:text-[#B57F50] transition-colors">Recipes</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{recipe.cardTitle}</span>
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-4 print:hidden">
            {recipe.title}
          </h1>

          {/* Brief description */}
          <p className="text-[#4B4845] text-base leading-relaxed mb-10 print:hidden">
            {recipe.description}
          </p>

          {/* Ingredients needed */}
          <section className="mb-10 print:hidden">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">Ingredients Needed</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-[#1E2026] text-sm leading-relaxed">
                  <strong>{ing.amount} {ing.unit}</strong> {ing.item}
                  {ing.note && <span className="text-[#6B6862] italic"> ({ing.note})</span>}
                </li>
              ))}
            </ul>
          </section>

          {/* How to make */}
          <section className="mb-10 print:hidden">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">How to Make {recipe.cardTitle}</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4 text-[#1E2026] text-sm leading-relaxed">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#B57F50]/15 text-[#B57F50] text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* What to add */}
          <section className="mb-12 print:hidden">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">What to Add</h2>
            <p className="text-[#6B6862] text-sm mb-4">
              Make it your own — here are a few ways to customize this bowl.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipe.whatToAdd.map((item, i) => (
                <div key={i} className="rounded-xl border border-black/8 bg-white p-4">
                  <p className="font-semibold text-[#1E2026] text-sm mb-1">{item.title}</p>
                  <p className="text-[#6B6862] text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Printable summary card */}
          <section>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4 print:hidden">Printable Recipe Card</h2>
            <RecipeCard recipe={recipe} pageUrl={url} />
          </section>
        </div>

        <div className="print:hidden">
          <Footer />
        </div>
      </main>
    </>
  )
}
