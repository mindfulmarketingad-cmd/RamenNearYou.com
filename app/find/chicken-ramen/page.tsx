import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Chicken Ramen Near Me | Chicken Paitan & Tori Ramen | RamenNearYou',
  description: 'Find chicken ramen near you — creamy chicken paitan and clean tori broths. What chicken ramen is, how paitan differs from clear chicken broth, and what to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/chicken-ramen' },
  openGraph: {
    title: 'Chicken Ramen Near Me',
    description: 'Find creamy chicken paitan and chicken-broth ramen near you.',
    url: 'https://www.ramennearyou.com/find/chicken-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ChickenRamenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["chicken-paitan"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, 48), { verifiedSlugs })
  const count = matched.length

  const mapSlot = (
    <ErrorBoundary
      fallback={
        <section className="pt-16 bg-[#F5F4F0]">
          <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
          </div>
        </section>
      }
    >
      <HomeMapHero
        initialBowls={['chicken-paitan']}
        pageTitle="Chicken Ramen Near Me"
        pageDescription="Showing chicken ramen near you. Enter your ZIP or use your location to find creamy chicken paitan and tori broths nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Chicken Ramen Near Me" }]}
        title={`Chicken Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track that matches this, ranked by rating and review volume. Search by name or city, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <FindPageContent
        currentHref="/find/chicken-ramen"
        heading="My Guide to Chicken Ramen Near Me"
        intro={[
          'Chicken ramen is one of the most underrated styles out there, and I will argue that point with anyone who dismisses it in favor of a heavier pork broth. Whether it is a creamy, luxurious chicken paitan or a clean, soulful tori chintan, chicken delivers serious depth without the same heaviness that can make a large tonkotsu feel like a commitment. The map above is filtered to chicken ramen near you — enter your ZIP or use your location to find the closest bowl and start exploring.',
          'What I love most about chicken ramen is how it rewards attention. A great tori broth is not just chicken soup — it is hours of careful simmering, often with a blend of whole birds, carcasses, and aromatics, coaxed into something that feels both light on the palate and deeply satisfying in the stomach. When a kitchen genuinely cares about its chicken broth, you can taste the difference in the first sip.',
          'If pork tonkotsu sometimes feels like too much, chicken ramen is your answer and my go-to recommendation for anyone looking to branch out. The two main styles, creamy paitan and clear chintan, could not feel more different from each other, yet they share the same honest, comforting base. Here is how the styles differ, what to look for when you are reading a menu, and exactly how I order chicken ramen when I walk into a new shop.',
          'Chicken ramen also tends to be one of the more accessible styles for people with dietary restrictions or preferences around pork, though it is always worth double-checking the tare and toppings when that matters. More on that below.',
        ]}
        sections={[
          {
            h2: 'Chicken paitan vs. clear chicken broth',
            body: (
              <p>
                "Chicken ramen" covers two very different bowls, and understanding the distinction is the first
                step to ordering the right one. Paitan — specifically tori paitan — is the creamy one. Chicken
                bones are simmered hard over high heat until the collagen breaks down and the broth turns rich,
                opaque, and almost as luxurious as tonkotsu, but lighter and naturally sweeter. It coats the
                noodles beautifully and feels indulgent without the same weight as pork. Clear chicken broth, the
                chintan style, goes the other direction entirely: a long, gentle simmer that draws out clean,
                golden, deeply savory liquid without emulsifying the fat. It is elegant, refined, and deeply
                comforting in its own way. Both styles are fantastic — they just scratch very different itches
                depending on your mood and appetite.
              </p>
            ),
            points: [
              { h3: 'Tori paitan', text: 'Creamy and full-bodied from long-simmered chicken bones — rich like tonkotsu but a touch lighter and naturally sweet. The fat emulsifies into the broth, giving it that signature opaque, almost milky appearance.' },
              { h3: 'Clear chicken (chintan)', text: 'A clean, golden, savory broth that is elegant and soothing — chicken soup elevated to an art form. The simmer is gentler, the result brighter and more delicate, and the nuances of the chicken and aromatics shine through clearly.' },
              { h3: 'Toppings', text: 'Often chicken chashu, scallion, and a soft marinated egg; some shops add yuzu for citrus brightness, black pepper for warmth, or ginger to enhance the clean chicken flavor. The toppings on a chicken bowl tend to be thoughtfully chosen to complement the broth rather than overpower it.' },
            ],
          },
          {
            h2: 'Why I love chicken ramen',
            body: (
              <p>
                Chicken hits a sweet spot that few other broth styles can match: deeply savory and genuinely
                satisfying without the weight that can make a big tonkotsu feel heavy. Tori paitan especially
                is my move when I want richness and comfort but still want to feel good walking out of the shop.
                There is a sweetness and brightness to good chicken broth that pork cannot replicate, and when it
                is done well, a bowl of tori ramen can be just as complex and layered as any tonkotsu. I also
                appreciate that chicken ramen tends to let the tare and toppings shine more clearly. Because the
                base broth is a little less dominant, a shoyu tare or a well-made shio tare has room to express
                itself, and a squeeze of yuzu or a few drops of fragrant oil can lift the whole bowl. It is also
                a great option if you do not eat pork, though it is always worth confirming the tare and toppings
                are pork-free if that matters to you.
              </p>
            ),
          },
          {
            h2: 'How I order chicken ramen',
            body: (
              <p>
                For a creamy bowl I always order the tori paitan with a soft marinated egg and extra chicken
                chashu if the shop offers it. I look for any yuzu or black pepper variations because that
                brightness is a perfect counterpoint to the rich broth. For a lighter mood, I go for a clear
                chintan and let the clean, honest broth do all the talking. I keep the toppings simple — maybe
                just scallion, menma, and an egg — so nothing competes with the delicate stock. Either way,
                I always look for shops that specialize in chicken or have built their whole identity around tori
                broth. When a kitchen makes chicken ramen their focus rather than an afterthought on a long menu,
                the difference in depth and care is immediately obvious from the first sip.
              </p>
            ),
          },
          {
            h2: 'What to look for in a quality chicken ramen shop',
            body: (
              <p>
                The best chicken ramen shops share a few tells. A focused menu with just one or two chicken
                broth styles is a strong signal — it means the kitchen is not spreading itself thin. Fresh
                noodles that hold up in the broth, with enough bite and texture to carry the soup, make a huge
                difference. I also look at the chashu: properly made chicken chashu should be tender and juicy,
                not dry or rubbery, and ideally rolled and slow-cooked to keep every slice moist. Reviews that
                specifically mention the broth depth rather than just the toppings tell me the shop has its
                priorities right. And if a shop mentions simmering time or their sourcing for the chicken, that
                kind of transparency usually signals genuine craft.
              </p>
            ),
            points: [
              { h3: 'Focused menu', text: 'A shop that does one or two chicken styles exceptionally well beats a sprawling menu every time. Specialization almost always means better broth.' },
              { h3: 'Fresh noodles with real bite', text: 'Good chicken ramen noodles should have enough structure to hold up in the broth without going limp quickly. Ask about noodle firmness if you have a preference.' },
              { h3: 'Properly made chashu', text: 'Chicken chashu done right is tender, moist, and flavorful. Dry, thin slices are a sign the kitchen is not giving the toppings the same care as the broth.' },
            ],
          },
          {
            h2: 'Pairing noodle types with chicken broth',
            body: (
              <p>
                Noodle choice matters more with chicken ramen than many people realize. A creamy tori paitan
                can handle a thicker, wavier noodle that grabs and holds the rich broth — it is a satisfying,
                hearty combination. A clear chintan, on the other hand, is often better with a thinner, straighter
                noodle that lets the clean soup coat without overwhelming it. Some shops give you a choice, and
                if they do, I encourage experimenting across visits. Wavy noodles in a creamy paitan are one of
                my favorite combinations in all of ramen, while thin straight noodles in a pristine chintan feel
                elegant and restrained in the best possible way.
              </p>
            ),
          },
        ]}
        tipsHeading="My chicken ramen tips"
        tips={[
          'Filter to "Chicken Paitan" on the map, then sort by distance to find the nearest creamy bowl fast.',
          'Want richness without the weight of pork? Tori paitan is your best bet — it delivers indulgence while staying lighter and sweeter than tonkotsu.',
          'In a lighter mood? Seek out a clear chicken chintan broth instead — it is clean, golden, and deeply comforting.',
          'Add a soft marinated egg and chicken chashu to any chicken bowl; look for yuzu or black pepper versions to add brightness to a rich paitan.',
          'Favor shops that specialize in chicken broth — when tori is a kitchen\'s focus rather than a side offering, the depth and care in the broth is immediately apparent.',
          'Check recent reviews for comments on broth depth specifically, not just the toppings — that tells you the shop is getting the fundamentals right.',
          'If you prefer thicker, chewier noodles, ask for them with a creamy paitan; for a clear chintan, a thin, straight noodle is often the perfect match.',
          'If you are avoiding pork, chicken ramen is a great option — but always confirm the tare and toppings, since some shops use a pork-based seasoning sauce even in chicken bowls.',
        ]}
        faqs={[
          { q: 'What is chicken ramen?', a: 'Chicken ramen uses a chicken-based broth, either creamy chicken paitan (tori paitan) made by hard-simmering chicken bones until the broth turns rich and opaque, or a clean, golden clear chicken broth called chintan. Both are savory and deeply satisfying in different ways.' },
          { q: 'What is chicken paitan?', a: 'Tori paitan is a creamy, opaque chicken broth made by simmering chicken bones at a vigorous boil until the collagen emulsifies into the soup, making it rich and full-bodied. The result is similar in texture to tonkotsu but lighter and naturally a bit sweeter, with a clean chicken character.' },
          { q: 'What is tori chintan?', a: 'Tori chintan is a clear chicken broth made by simmering chicken gently rather than hard-boiling it. The result is a clean, golden, delicate soup that showcases the pure flavor of the chicken and aromatics without becoming cloudy or heavy. It is elegant and deeply comforting.' },
          { q: 'Is chicken ramen lighter than tonkotsu?', a: 'Generally yes. Even creamy tori paitan tends to feel a touch lighter and sweeter than pork tonkotsu, because chicken fat has a different character than pork fat. Clear chicken chintan is lighter still and is one of the cleanest, most refined ramen styles you can order.' },
          { q: 'Is chicken ramen pork-free?', a: 'The base broth is chicken, but not all chicken bowls are pork-free. Some shops use a pork-based tare as the seasoning sauce, or offer pork-based toppings alongside the chicken. If you avoid pork, always confirm the tare, oil, and toppings with the shop before ordering.' },
          { q: 'How do I find chicken ramen near me?', a: 'The map above is filtered to chicken ramen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open a listing to check hours, menus, and photos before you go.' },
          { q: 'What toppings go best with chicken ramen?', a: 'Classic chicken ramen toppings include chicken chashu, a soft marinated egg, scallion, menma (bamboo shoots), and nori. Many shops add yuzu for citrus brightness, black pepper for warmth, or a drizzle of fragrant chicken oil to enhance the broth. Keep it simple to let a clear chintan shine, or go richer with a paitan.' },
          { q: 'What noodles are best for chicken ramen?', a: 'There is no single right answer, but a wavy or thicker noodle pairs beautifully with creamy tori paitan because it grabs the rich broth. A thinner, straighter noodle often suits a clear chintan better, letting the delicate soup coat without overwhelming the bowl. Ask the shop what they recommend or experiment across visits.' },
        ]}
      />
    </main>
  )
}
