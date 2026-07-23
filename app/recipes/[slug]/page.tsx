import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Star, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RecipeCard from '@/components/recipe-card'
import RestaurantImage from '@/components/restaurant-image'
import AdUnit from '@/components/ad-unit'
import SaveRecipeButton from '@/components/save-recipe-button'
import { RECIPES, getRecipe } from '@/lib/recipes'

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : 'text-black/15'}`} />
      ))}
    </span>
  )
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }))
}

function minutesFrom(label: string): number {
  const hours = label.match(/(\d+)\s*hour/)
  const minutes = label.match(/(\d+)\s*minute/)
  if (hours || minutes) {
    return (hours ? parseInt(hours[1], 10) * 60 : 0) + (minutes ? parseInt(minutes[1], 10) : 0)
  }
  const bare = label.match(/\d+/)
  return bare ? parseInt(bare[0], 10) : 0
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
    image: [recipe.image.startsWith('http') ? recipe.image : `https://www.ramennearyou.com${recipe.image}`],
    author: { '@type': 'Person', name: recipe.author.name },
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
    review: recipe.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    })),
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap print:hidden">
            <Link href="/" className="hover:text-[#96602F] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/recipes" className="hover:text-[#96602F] transition-colors">Recipes</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{recipe.cardTitle}</span>
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-4 print:hidden">
            {recipe.title}
          </h1>

          {/* Author + rating + save — byline row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5 print:hidden">
            <div className="flex items-center gap-3">
              <Image
                src={recipe.author.avatar}
                alt={recipe.author.name}
                width={36}
                height={36}
                className="rounded-full border border-black/8 shrink-0"
                unoptimized
              />
              <div>
                <p className="text-sm font-medium text-[#1E2026]">By {recipe.author.name}</p>
                <div className="flex items-center gap-1.5">
                  <StarRow rating={recipe.rating} />
                  <span className="text-xs text-[#6B6862]">{recipe.rating.toFixed(1)} ({recipe.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <SaveRecipeButton slug={recipe.slug} />
          </div>

          {/* Brief description */}
          <p className="text-[#4B4845] text-base leading-relaxed mb-6 print:hidden">
            {recipe.description}
          </p>

          {/* Featured image */}
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-[#EFEDE6] mb-10 print:hidden">
            <RestaurantImage
              src={recipe.image}
              alt={recipe.cardTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* Photo gallery */}
          {recipe.gallery && recipe.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-10 print:hidden">
              {recipe.gallery.map((src, i) => (
                <div key={i} className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#EFEDE6]">
                  <RestaurantImage
                    src={src}
                    alt={`${recipe.cardTitle} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 384px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Why you'll love this recipe */}
          <section className="mb-10 print:hidden rounded-2xl border-2 border-[#B57F50]/30 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">Why You&apos;ll Love This Recipe</h2>
            <ul className="space-y-3">
              {recipe.whyYoullLoveIt.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1E2026]">
                  <CheckCircle2 className="w-4 h-4 text-[#96602F] shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Ingredients needed */}
          <section className="mb-10 print:hidden rounded-2xl bg-[#EFEDE6] p-6 sm:p-8">
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
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#B57F50]/15 text-[#96602F] text-sm font-bold flex items-center justify-center">
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

          {/* Reviews */}
          <section className="mb-12 print:hidden">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h2 className="font-serif text-2xl font-bold text-[#1E2026]">Reviews</h2>
              <div className="flex items-center gap-1.5">
                <StarRow rating={recipe.rating} />
                <span className="text-sm text-[#6B6862]">{recipe.rating.toFixed(1)} ({recipe.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>
            <div className="space-y-4">
              {recipe.reviews.map((review, i) => (
                <div key={i} className="rounded-xl border border-black/8 bg-white p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-[#1E2026] text-sm">{review.name}</p>
                    <span className="text-xs text-[#6B6862]/70">{review.date}</span>
                  </div>
                  <StarRow rating={review.rating} />
                  <p className="text-[#6B6862] text-sm leading-relaxed mt-2">{review.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mb-12 print:hidden">
            <AdUnit />
          </div>

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
