import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Tantanmen Near Me | Japanese Dan Dan Ramen | RamenNearYou',
  description: 'Find tantanmen near you — the creamy, nutty, spicy sesame-and-chili ramen. What tantanmen is, how it differs from dan dan noodles, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tantanmen' },
  openGraph: {
    title: 'Tantanmen Near Me',
    description: 'Find creamy, spicy sesame tantanmen near you.',
    url: 'https://www.ramennearyou.com/find/tantanmen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function TantanmenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["tantanmen"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, NATIONWIDE_LISTICLE_CAP), { verifiedSlugs })
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
        initialBowls={['tantanmen']}
        pageTitle="Tantanmen Near Me"
        pageDescription="Showing tantanmen near you. Enter your ZIP or use your location to find a creamy, spicy sesame bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Tantanmen Near Me" }]}
        title={`Tantanmen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/tantanmen"
        heading="How I Find Great Tantanmen Near Me"
        intro={[
          'Tantanmen is comfort and fire in the same bowl — a creamy, nutty sesame broth spiked with chili oil and topped with savory ground pork that shatters into the soup and infuses every bite with its seasoning. It is rich, spicy, and deeply satisfying in a way no other ramen quite matches, and I find myself craving it more than almost any other style when the weather turns cold or I need something that truly fills me up. The map above is filtered to tantanmen near you; enter your ZIP or use your location to find the closest bowl.',
          'Tantanmen descends from a famous Chinese dish but has evolved into something distinctly its own in Japan. The Japanese version is soupier, creamier, and rounder than its Sichuan ancestor, and understanding those differences helps you know exactly what to expect when you sit down with a bowl. Here is what tantanmen is, how it differs from dan dan noodles, and how I order it to get the best out of every version.',
          'I have eaten a lot of tantanmen, and the element I am always evaluating first is the sesame-to-chili balance. A great tantanmen has both in conversation with each other — the sesame paste providing a nutty, creamy foundation that tempers the heat, the chili oil rising through it with real presence but not aggression. When that balance is right, the bowl is almost addictive. When one side dominates, it feels one-dimensional.',
          'Beyond the balance question, I look for quality in the ground pork seasoning, the noodle choice, and the optional additions the shop offers. A side of rice, an extra soft egg, or a more intense chili option can all significantly change the experience. This guide covers everything so you can walk in and order with confidence.',
        ]}
        sections={[
          {
            h2: 'What tantanmen is',
            body: (
              <p>
                Tantanmen is the Japanese interpretation of Chinese dan dan noodles, adapted through a distinctly
                Japanese sensibility that prized soup, creaminess, and balance over the dry, intense, pungently
                numbing character of the Sichuan original. The Japanese version is typically built on a sesame
                paste broth — often enriched with soy milk, chicken stock, or a combination of both — balanced
                with chili oil (rayu) for heat, and topped with well-seasoned ground pork and leafy greens like
                bok choy or spinach. The result is a bowl that is simultaneously nutty, rich, spicy, and
                umami-packed — a lot going on at once, but in a way that feels harmonious rather than chaotic.
                What distinguishes tantanmen from a standard spicy ramen is the sesame paste, which gives the
                broth a specific creamy, nutty body and a faintly toasty character that no other ingredient
                can replicate.
              </p>
            ),
            points: [
              { h3: 'Sesame base', text: 'Ground sesame paste (neri goma) and often soy milk or a rich stock give the broth its signature creamy, nutty body. The sesame should taste toasty and present, not faint or washed out. It is the defining characteristic of the style.' },
              { h3: 'Chili oil heat', text: 'Rayu (chili oil) and sometimes a chili paste bring the spice, balanced against the richness of the sesame. The heat should build gradually and feel warming rather than punishing. The sesame tempers the edge of the chili without masking it entirely.' },
              { h3: 'Ground pork and greens', text: 'Seasoned minced pork — stir-fried with garlic, ginger, and a soy-based seasoning — and leafy greens are the classic toppings. The pork breaks apart as you eat and infuses the broth with extra savory richness. The greens provide freshness and a slight bitterness that cuts through the richness.' },
            ],
          },
          {
            h2: 'Tantanmen vs. dan dan noodles — what actually changed',
            body: (
              <p>
                The original Sichuan dan dan noodles are typically served with very little or no broth, topped
                with a dry, intensely flavored mix of pork, preserved vegetables, and a sauce built on sesame
                paste, soy, vinegar, and a generous quantity of Sichuan peppercorns for the signature mala
                (numbing-spicy) sensation. When this dish traveled to Japan — most accounts credit a Chinese
                vendor in Yokohama's Chinatown for the early adaptation — it was transformed to suit Japanese
                preferences: more soup was added, the mala peppercorn heat was dialed back in favor of a
                rounder chili oil heat, and the sesame was amplified into a creamier, more prominent broth
                base. The result is a dish that shares the spirit of dan dan noodles while being clearly and
                distinctly Japanese in its execution. Both are worth trying, and if you love one, the other
                is a natural next step.
              </p>
            ),
            points: [
              { h3: 'Broth vs. no broth', text: 'Dan dan noodles are traditionally almost brothless — a small amount of sauce rather than a bowl of soup. Japanese tantanmen is genuinely soupy, with a creamy sesame broth that is fully drinkable and central to the experience.' },
              { h3: 'Mala vs. rayu heat', text: 'Sichuan dan dan uses Sichuan peppercorns for a numbing, tingling, electric heat. Japanese tantanmen typically uses chili oil (rayu) for a warmer, rounder, more familiar heat that builds rather than numbs.' },
              { h3: 'Sesame as broth vs. sesame as sauce', text: 'In the original, sesame paste is one component of a complex sauce. In Japanese tantanmen, it is the foundation of the entire broth — amplified and diluted into a creamy, nutty soup that defines the character of the bowl.' },
            ],
          },
          {
            h2: 'How I order tantanmen',
            body: (
              <p>
                I order at a medium-to-high spice level so the chili shows up clearly without burying the sesame
                — that balance is everything. I always add a soft egg for the extra richness the runny yolk
                provides, and I mix the chili oil through the bowl before digging in rather than leaving it
                pooled on top. If the shop offers an extra sesame option or a more numbing Sichuan-peppercorn
                version, I will try it at least once to understand what dimension it adds. A side of rice is
                not just a nice afterthought — it is legitimately great for soaking up the last of that creamy,
                spicy broth when the noodles are gone, and I order it almost every time.
              </p>
            ),
            points: [
              { h3: 'Spice level strategy', text: 'Start at medium if you are not sure of your heat tolerance. Tantanmen\'s sesame base softens the chili significantly, so a medium spice in tantanmen feels milder than medium in a straight chili ramen. You can always add more chili oil at the table.' },
              { h3: 'Mix before eating', text: 'Stir the bowl thoroughly before your first bite. The chili oil and sesame can pool separately if left to settle, and mixing ensures every noodle is coated evenly. Do not be shy about this — really work the bowl.' },
              { h3: 'Rice as a finishing move', text: 'A small bowl of white rice dropped into the remaining tantanmen broth at the end — or eaten alongside it as a scoop — soaks up the creamy, spicy remnants beautifully. It turns the last few spoonfuls into something almost risotto-like.' },
            ],
          },
          {
            h2: 'Variations and what to look for on the menu',
            body: (
              <p>
                Tantanmen appears in a range of variations across different shops, and knowing the language
                helps you order the right version. Some shops offer a white tantanmen (shiro tantanmen) that
                is creamier and milder, built more heavily on soy milk and white sesame for a subtler, less
                fiery bowl. Others offer a black version (kuro tantanmen) that uses black sesame paste for a
                more intense, slightly bitter, deeply nutty character. A vegan or vegetarian tantanmen replaces
                the ground pork with seasoned mushrooms or plant-based protein, and a good version can be
                excellent — the sesame broth is naturally plant-based. If a shop offers a tsukemen-style
                tantanmen where you dip the noodles into a concentrated sesame-chili sauce, that is worth
                ordering at least once for the intensity of flavor you get in each dip.
              </p>
            ),
            points: [
              { h3: 'White tantanmen', text: 'A milder, creamier version built on soy milk and white sesame. Less fiery and more subtle than the standard version. Good entry point if you are heat-sensitive but still want the sesame experience.' },
              { h3: 'Black sesame tantanmen', text: 'Uses black sesame paste instead of white, producing a darker, slightly more bitter, intensely nutty broth with a dramatic appearance. The flavor is more complex and roasted than the standard version.' },
              { h3: 'Vegetarian tantanmen', text: 'The sesame-and-soy-milk broth is naturally plant-based, so vegetarian tantanmen can be genuinely excellent. Look for shops that use well-seasoned mushroom or tofu in place of pork — a great version should be just as satisfying as the original.' },
            ],
          },
        ]}
        tipsHeading="My tantanmen tips"
        tips={[
          'Filter to "Tantanmen," then sort by distance for the nearest bowl. The map is already set so just confirm your location.',
          'Order medium-to-high spice to let the chili complement the sesame — the sesame base softens the heat significantly, so you can go a level higher than you might expect.',
          'Mix the bowl thoroughly before eating — the chili oil and sesame can separate if left to settle, and a good stir ensures every noodle gets coated evenly.',
          'Add a soft egg without fail — the jammy yolk mixes into the sesame broth and adds a richness and creaminess that takes the bowl to another level.',
          'Order a side of white rice to soak up the creamy, spicy broth at the end. It turns the last few spoonfuls into something almost risotto-like and ensures nothing is wasted.',
          'If the shop offers black sesame tantanmen, try it at least once — the deeper, more intensely nutty character is a genuinely different experience from the standard version.',
          'Look for shops that let you add more chili oil at the table so you can calibrate the heat as you eat rather than committing to a fixed level at the start.',
          'Stack "Top Rated" on the map to find the best-reviewed tantanmen near you, then look specifically in the reviews for mentions of sesame depth and broth balance.',
        ]}
        faqs={[
          { q: 'What is tantanmen?', a: 'Tantanmen is the Japanese version of Chinese dan dan noodles — a creamy, nutty sesame broth spiked with chili oil and topped with seasoned ground pork and leafy greens. It is rich and spicy at once, with the sesame providing a creamy base that balances the heat of the chili oil. It is soupier and creamier than the Sichuan original.' },
          { q: 'How is tantanmen different from dan dan noodles?', a: 'Sichuan dan dan noodles are typically almost brothless, served with a dry, intensely flavored sauce and the numbing heat of Sichuan peppercorns. Japanese tantanmen has a full, creamy sesame soup as its base, uses chili oil instead of mala peppercorns for a warmer, rounder heat, and is generally soupier and more approachable in character.' },
          { q: 'Is tantanmen very spicy?', a: 'It is adjustable. The chili oil brings real heat, but the creamy sesame base buffers it significantly — tantanmen at a medium spice level feels milder than a medium-spice straight chili ramen. Order a moderate level and add more chili oil at the table if you want to push the heat further. The sesame keeps it from ever feeling purely fiery.' },
          { q: 'Is tantanmen vegetarian?', a: 'The sesame and soy milk broth base is naturally plant-based, but most standard versions include ground pork and are built on a meat stock. Some shops offer a genuinely excellent vegetarian or vegan tantanmen with mushrooms or plant-based protein and a vegetable or kombu stock. Confirm before ordering if it is important to you.' },
          { q: 'How do I find tantanmen near me?', a: 'The map above is filtered to tantanmen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open any listing for hours, photos, and directions. Check reviews specifically for mentions of sesame depth and heat balance.' },
          { q: 'What is the sesame paste in tantanmen?', a: 'The sesame base in tantanmen is neri goma — a smooth, creamy paste made from ground white sesame seeds, similar in texture to tahini but with a distinctly toasted, Japanese-style flavor. It is blended into the broth (often alongside soy milk or a rich stock) to create the characteristic nutty, creamy body of the style. The quality of the sesame paste has an enormous effect on the final bowl.' },
          { q: 'Can I make tantanmen spicier or milder at the restaurant?', a: 'Most tantanmen shops offer spice level options when you order, and many also provide extra chili oil or chili paste at the table so you can adjust as you eat. If you are heat-sensitive, ask for the mildest level — the sesame broth will still be flavorful without the chili. If you love heat, request extra rayu and add more from the table condiments.' },
          { q: 'Why is a side of rice recommended with tantanmen?', a: 'The creamy, spicy sesame broth is so good that leaving it in the bowl when you finish the noodles feels like a waste. A small bowl of plain white rice soaks up every last drop beautifully, and the combination is almost risotto-like in its richness and satisfaction. Many shops offer oimeshi — a scoop of rice added directly to the remaining broth — as a standard option.' },
        ]}
      />
    </main>
  )
}
