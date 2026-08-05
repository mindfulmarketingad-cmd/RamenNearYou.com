import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, pickNationwideSample } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Fish Ramen Near Me | Seafood & Gyokai Broth Ramen | RamenNearYou',
  description: 'Find fish ramen near you — bowls built on seafood broth (gyokai and niboshi) and topped with fish and shellfish. Discover seafood-forward ramen spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/fish-ramen-near-me' },
  openGraph: {
    title: 'Fish Ramen Near Me',
    description: 'Find seafood-broth and fish-topped ramen near you.',
    url: 'https://www.ramennearyou.com/find/fish-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function FishRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["fish-ramen"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(pickNationwideSample(ranked), { verifiedSlugs })
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
        initialFlags={['fish-ramen']}
        pageTitle="Fish Ramen Near Me"
        pageDescription="Showing seafood-forward ramen spots near you — bowls built on fish broth or topped with seafood. Enter your ZIP or use your location to find one nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Fish Ramen Near Me" }]}
        title={`Fish Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/fish-ramen-near-me"
        heading="How I Find Fish Ramen Near Me"
        intro={[
          'Fish ramen is one of my favorite under-the-radar styles — a bowl where seafood does the heavy lifting, whether that is a deeply savory dried-fish broth or beautifully fresh seafood piled on top of a clean, steaming soup. There is a briny, oceanic complexity to a great gyokai broth that I find completely addictive, and it is a style that rewards those who seek it out. The map above is filtered to seafood-forward ramen spots near you. Enter your ZIP or tap "Use my location" and the closest options sort to the top.',
          'What I love about fish-based ramen is the sheer range of flavors it can deliver. At one end you have the bold, assertive intensity of a niboshi broth — dark with dried sardines, briny and umami-loaded in a way that is unlike any other ramen style. At the other end you have a delicate shrimp or clam broth that is light and almost sweet, serving as a clean canvas for beautiful seafood toppings. Both ends of that spectrum fascinate me, and I find myself thinking about the best fish bowls I have had long after I have finished them.',
          'Fish-based ramen goes by a few names and shows up in several forms, so it helps to know the vocabulary before you start searching. Gyokai, niboshi, seafood tonkotsu, and fresh-seafood-topped bowls are all different experiences worth understanding on their own terms. Here is how I navigate the category and what to expect when I finally sit down with a great seafood bowl.',
          'The hunt for exceptional fish ramen has taken me to Japanese restaurants, izakaya, and coastal-focused noodle shops, and I have rarely been disappointed when I find a kitchen that takes its seafood broth seriously. The patience required to locate these spots makes the discovery all the more rewarding.',
        ]}
        sections={[
          {
            h2: 'What is fish ramen?',
            body: (
              <p>
                Fish ramen leans on seafood for its flavor instead of the more common pork or chicken bases.
                The classic version uses a gyokai (seafood) broth — often built on niboshi (dried sardines),
                katsuobushi (dried bonito flakes), kombu (dried kelp), or other dried fish and seafood — for
                a deep, savory, umami-rich stock that is distinctly oceanic without tasting fishy in an
                unpleasant way. Other bowls keep a lighter base broth but top it with fresh fish or shellfish
                like shrimp, crab, scallop, or clams as the centerpiece. Many shops also blend seafood with a
                pork or chicken base, a popular hybrid style called gyokai tonkotsu that combines the ocean
                depth of gyokai with the creamy richness of tonkotsu.
              </p>
            ),
            points: [
              { h3: 'Gyokai (seafood) broth', text: 'A savory stock built on dried fish like niboshi (dried sardines), katsuobushi (bonito), and kombu (kelp). The result is deeply umami, oceanic, and complex — lighter-bodied than tonkotsu but intensely flavorful in its own right.' },
              { h3: 'Seafood toppings', text: 'Shrimp, crab, scallop, clams, or fresh fish over the noodles, often with a lighter base broth that serves as a clean backdrop for the seafood. The toppings are the star in this style.' },
              { h3: 'Gyokai tonkotsu', text: 'A blended broth that combines the oceanic depth of seafood stock with the creamy richness of slow-simmered pork bones. One of the more popular hybrid styles and a great entry point for people new to fish ramen.' },
            ],
          },
          {
            h2: 'The world of niboshi ramen',
            body: (
              <p>
                Niboshi ramen deserves its own discussion because it is such a distinct and polarizing
                experience — polarizing in the sense that those who love it become deeply loyal to it. Niboshi
                are small dried sardines used extensively in Japanese cooking, and when they form the backbone
                of a ramen broth, the result is bold, briny, and intensely savory in a way that no other
                ingredient can replicate. The flavor is assertive and sometimes almost bitter, with a deeply
                marine character that coats the palate. It is not the gentlest introduction to seafood ramen,
                but if you are curious about pushing your ramen boundaries, niboshi is one of the most
                rewarding places to go. The best versions balance the fish intensity with a well-chosen tare
                and subtle aromatics that prevent the broth from becoming overwhelming.
              </p>
            ),
            points: [
              { h3: 'Bold and briny character', text: 'Niboshi broth has an assertive, deeply savory, slightly bitter marine quality that is unlike any other ramen style. It is an acquired taste for some, but enthusiasts consider it one of the highest expressions of Japanese ramen craft.' },
              { h3: 'Balance is everything', text: 'The best niboshi ramen uses a carefully chosen tare and aromatics to balance the fish intensity. Too much and the bowl becomes one-dimensional; the right balance produces extraordinary complexity.' },
              { h3: 'Best eaten hot and fast', text: 'Niboshi broth changes noticeably as it cools. The delicate balance of flavors is at its peak when the bowl is steaming hot, so eating quickly is actually the right move here.' },
            ],
          },
          {
            h2: 'How to find a real seafood bowl',
            body: (
              <p>
                Because fish ramen is a niche within the broader ramen world, I do a little homework before
                going to a new shop. I look for words like gyokai, niboshi, seafood, katsuobushi, or specific
                fish and shellfish on the menu — and recent reviews that praise the broth's depth and
                complexity rather than just the toppings. Japanese restaurants, izakaya, and shops that also
                serve sushi are the most likely to run a true seafood ramen, because they already have access
                to quality seafood and an appreciation for its flavors. The map filter above already surfaces
                seafood-forward spots, but reading menus and reviews before visiting helps confirm what kind
                of fish experience you are in for.
              </p>
            ),
          },
          {
            h2: 'What to order on your first visit',
            body: (
              <p>
                I always start with the house seafood or gyokai bowl to taste what the kitchen is most proud
                of. If they offer a niboshi ramen specifically, that is the purest expression of the style —
                bold, briny, and unmistakably maritime in the best possible way. For a more accessible
                entry point, a gyokai tonkotsu gives you the seafood depth blended with creamy pork richness,
                which can be a gentler introduction. Fresh shellfish toppings like clams or scallops are
                always worth ordering if the shop offers them. And no matter what you choose, eat it hot
                and reasonably quickly — delicate seafood broths fade noticeably once they cool.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for fish ramen"
        tips={[
          'Scan the menu for gyokai, niboshi, katsuobushi, or specific seafood — these are the clearest signs of a true fish broth rather than a standard pork base.',
          'Try the niboshi bowl if they have one; it is the boldest, most authentic expression of seafood ramen and one of the most distinctive bowls in all of ramen.',
          'Check shops that also serve sushi or seafood dishes — they tend to have access to quality seafood and the culinary knowledge to use it well in ramen.',
          'Read recent reviews for genuine praise of the broth depth and complexity, not just the toppings — that tells you the kitchen gets the fundamentals right.',
          'Eat it hot and without too much delay — delicate seafood broths and especially niboshi fade as the bowl cools, so urgency is appropriate here.',
          'Gyokai tonkotsu is a great entry point if you are new to seafood ramen — the creamy pork base softens the intensity of the seafood and makes for a more accessible bowl.',
          'Look at photos in reviews for a broth with color and body — a great gyokai broth often has a darker, more complex hue than a standard clear ramen soup.',
          'Fresh shellfish toppings like clams or scallops are a treat when they appear on a menu; order them if you can, as they add sweetness and texture that dried-fish broths alone cannot provide.',
        ]}
        faqs={[
          { q: 'What is fish ramen?', a: 'Fish ramen is a bowl that gets its primary flavor from seafood — usually a gyokai (seafood) broth built on dried fish like niboshi (sardines), bonito, and kombu, or a bowl topped with fresh fish and shellfish over a lighter base broth.' },
          { q: 'How do I find fish ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location." It is filtered to seafood-forward ramen spots near you, sorted by rating and distance. Check menus and reviews for gyokai or niboshi language to confirm a true seafood bowl before visiting.' },
          { q: 'What is gyokai ramen?', a: 'Gyokai means "seafood" in Japanese. Gyokai ramen is built on a broth made from dried fish and seaweed — like niboshi, katsuobushi (bonito), and kombu — for a deep, savory, umami-rich flavor that is distinctly oceanic but not unpleasantly fishy.' },
          { q: 'What is niboshi ramen?', a: 'Niboshi ramen uses a broth made from dried baby sardines (niboshi), giving it a bold, briny, intensely savory flavor. It is one of the purest and most assertive expressions of seafood-based ramen, with a deep marine character that enthusiasts find deeply satisfying.' },
          { q: 'What is gyokai tonkotsu?', a: 'Gyokai tonkotsu is a hybrid broth that blends seafood stock (gyokai) with creamy pork-bone broth (tonkotsu). The result combines oceanic umami depth with the rich, creamy weight of tonkotsu, making it one of the more complex and beloved hybrid ramen styles.' },
          { q: 'Is fish ramen healthy?', a: 'Seafood broths tend to be lighter and lower in saturated fat than rich pork styles, though they can still be high in sodium. A clear gyokai or niboshi bowl is generally on the lighter end of the ramen spectrum.' },
          { q: 'What seafood toppings can I expect in fish ramen?', a: 'Fresh toppings vary by shop but can include shrimp, crab, scallop, clams, fish cakes (narutomaki), or sliced fresh fish. Some shops focus on dried fish flavor in the broth with more traditional toppings like scallion and nori, while others make fresh seafood the visual and flavor centerpiece.' },
          { q: 'How does fish ramen differ from regular ramen?', a: 'The primary difference is the broth base. Most ramen uses pork or chicken; fish ramen replaces or supplements these with seafood, creating a distinctly oceanic, umami-rich flavor profile. The experience ranges from delicately briny to boldly assertive depending on the style and ingredients used.' },
        ]}
      />
    </main>
  )
}
