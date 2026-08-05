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
  title: 'Ramen With a Full Bar Near Me | Ramen & Drinks | RamenNearYou',
  description: 'Find ramen restaurants with a full bar near you. Pair your bowl with sake, beer, shochu, or highballs — plus my go-to drink pairings for every broth.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-full-bar' },
  openGraph: {
    title: 'Ramen With a Full Bar Near Me',
    description: 'Find ramen restaurants that serve alcohol near you — sake, beer, and cocktails.',
    url: 'https://www.ramennearyou.com/find/ramen-full-bar',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenFullBarPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["full-bar"] }
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
        initialFlags={['full-bar']}
        pageTitle="Ramen With a Full Bar Near Me"
        pageDescription="Showing ramen restaurants that serve alcohol. Enter your ZIP or use your location to find ramen and drinks near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Ramen With a Full Bar Near Me" }]}
        title={`Ramen With a Full Bar Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-full-bar"
        heading="My Favorite Ramen Spots With a Full Bar"
        intro={[
          'A cold beer or a pour of sake next to a steaming bowl is, in my opinion, the complete ramen experience. The map above is filtered to ramen restaurants near you that serve alcohol — whether that is a full cocktail bar, a curated sake list, or ice-cold Japanese lagers on tap. Enter your ZIP or use your location to find the closest ones and see what they are pouring.',
          'Drinking with ramen is a real tradition, not an afterthought. In Japan, an ice-cold beer alongside a rich bowl, or a few drinks and small plates at an izakaya that happens to make great noodles, is a completely normal night out. My first bowl of tonkotsu with a cold Sapporo taught me that the drink is not just something to wash the noodles down — it actually changes how you experience the broth between sips, resetting your palate and making each mouthful taste cleaner and more vivid.',
          'Not all ramen spots that serve alcohol are created equal. Some have a single bottled beer on the menu as an afterthought. Others have built a serious sake program, a short list of Japanese whisky highballs, and a shochu selection that rivals a dedicated bar. The "Full Bar" filter on this page is designed to surface the latter — places where the drink program is as intentional as the broth.',
          'Below I break down what drinks actually pair best with each broth style, the practical difference between a ramen bar and an izakaya, and how to use the filters to find the right kind of spot for whatever evening you have planned.',
        ]}
        sections={[
          {
            h2: 'What to drink with each broth',
            body: (
              <p>
                The general rule I follow: the richer the bowl, the more you want something crisp and clean to
                cut through it. The lighter the bowl, the more a delicate sake or a citrusy highball can shine
                without overwhelming it. This rule holds across most pairing decisions, and once you internalize
                it you will find yourself instinctively reaching for the right drink. A dry, effervescent sake
                next to a creamy tonkotsu is almost a palate cleanser between bites; the same sake next to a
                delicate shio would compete with the broth rather than complement it.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu and rich miso', text: 'A crisp Japanese lager — think the major domestic brands or a well-chosen craft pilsner — or a dry junmai sake slices right through the fatty, collagen-heavy broth and resets your palate between bites. I tend to go beer for tonkotsu and sake for miso, but both work beautifully.' },
              { h3: 'Shoyu and shio', text: 'Lighter, cleaner broths pair beautifully with a floral junmai sake or a lemon highball — something that complements the clarity of the broth rather than competes with it. A whisky highball with a shio ramen is one of my favorite low-key pairings because the carbonation lifts the delicate dashi notes.' },
              { h3: 'Spicy ramen and tantanmen', text: 'A slightly sweeter beer or a fruity highball tames the heat and lets you keep eating without your eyes watering. Save the bone-dry, high-alcohol options for a different bowl; a little residual sweetness is genuinely your friend when chili is involved.' },
            ],
          },
          {
            h2: 'Ramen bar vs. izakaya — what is the difference',
            body: (
              <p>
                These get used interchangeably, but they are not quite the same thing. An izakaya is a Japanese
                gastropub built primarily around drinks and small shareable plates, where ramen may be one item
                on a long menu alongside grilled skewers, sashimi, and fried chicken. A ramen bar centers on
                the noodles and builds a bar program around them as a complement. Plenty of great spots blur
                the line, offering both a serious bowl and a real drink list — those are usually my favorites
                for a longer evening because you get the best of both worlds. If I am going specifically for
                the ramen, I want the noodles to be the headliner. If I am going for drinks and food, an
                izakaya with good ramen on the menu gives me more range.
              </p>
            ),
            points: [
              { h3: 'Sake: junmai vs. ginjo', text: 'Junmai sake is fuller-bodied and earthy, which makes it a great companion for rich miso and tonkotsu. Ginjo and daiginjo are lighter and more fragrant — better suited to delicate shio and shoyu broths. Asking which style the bar pours is the fastest way to gauge whether they take sake seriously.' },
              { h3: 'Shochu and whisky highballs', text: 'Shochu — Japan\'s distilled spirit made from sweet potato, barley, or rice — is lower in alcohol than whisky and pairs naturally with food. A shochu soda is one of the most food-friendly drinks I know. Japanese whisky highballs, served very cold and very fizzy, are equally versatile and have become a staple of any ramen bar worth its salt.' },
              { h3: 'Japanese craft beer', text: 'The Japanese craft beer scene has produced some exceptional lagers, IPAs, and witbiers that pair brilliantly with ramen. If a spot carries local Japanese-style craft, I always try it alongside my bowl — there is usually a reason it made the menu.' },
            ],
          },
          {
            h2: 'Best occasions for ramen with drinks',
            body: (
              <p>
                A full bar turns ramen into a proper night out rather than just a meal. I stack this filter
                with "Date Night" when I want a cocktail, a candlelit room, and an unhurried pace. I add
                "Open Late" for an after-work or post-show bowl when I want the bar to still be humming. And
                I use "Takes Reservations" when I am bringing a group and want a guaranteed table and room for
                everyone to order a round together. The combination of filters makes it easy to build the exact
                kind of evening you are after, whether that is a romantic two-top at the bar or a rowdy group
                of six sharing small plates and swapping sake recommendations.
              </p>
            ),
            points: [
              { h3: 'Date night with drinks', text: 'A ramen bar with a real sake list is one of the most underrated date spots. The interactive nature of sharing bowls and trading sips of different drinks creates natural conversation and a relaxed pace that a formal restaurant sometimes kills.' },
              { h3: 'After-work unwinding', text: 'Nothing beats a cold beer and a hot bowl of tonkotsu after a long day. The "Open Late" filter paired with this one surfaces spots that are still fully staffed and pouring well into the evening, which is exactly what you need when you finish late.' },
              { h3: 'Group dinner with rounds', text: 'For groups, a full bar is essential — it gives everyone something to do while the bowls are being assembled and something to share over the meal. Book ahead with the "Takes Reservations" filter and ask the bar to walk the table through the sake list.' },
            ],
          },
          {
            h2: 'How to read a sake menu at a ramen bar',
            body: (
              <p>
                Walking up to a sake list for the first time can feel overwhelming, but the key terms are
                straightforward. Junmai means the sake is made from only rice, water, yeast, and koji — no
                added alcohol — and tends to be fuller and more savory. Ginjo and daiginjo refer to the
                polish level of the rice grain: more polishing yields a lighter, more fragrant sake. Nigori is
                unfiltered and slightly cloudy, with a creamy sweetness that pairs surprisingly well with spicy
                ramen. Temperature matters too: serving sake warm amplifies its savory, earthy character, while
                cold serving highlights freshness and delicacy. When in doubt, ask the bartender which sake they
                would drink with the bowl you ordered — that question almost always gets you a better answer
                than pointing at the menu blindly.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen-and-drinks tips"
        tips={[
          'Filter to "Full Bar," then sort by distance or add "Top Rated" to find the best combination of great noodles and a real drink list near you.',
          'Match crisp, dry drinks to rich broths like tonkotsu and miso; reach for lighter, brighter sake or a highball with clear shio and shoyu.',
          'A slightly sweet beer or fruity highball is the move with spicy bowls and tantanmen — it genuinely cools the heat rather than amplifying it.',
          'Stack with "Open Late" for a proper after-work bowl and a drink to decompress; ramen bars hit their stride mid-evening when the kitchen is fully warmed up.',
          'Look for izakaya-style spots if you want small plates and gyoza alongside your noodles — the combination of shared food, drinks, and ramen is the full experience.',
          'Ask the bartender or server which sake pairs with your specific bowl; the best ramen bars train staff on pairing and the recommendation is almost always worth taking.',
          'Try a shochu soda if the bar carries shochu — it is lower in alcohol than beer, refreshing, and one of the most food-friendly drinks there is.',
          'If the bar has a sake flight option, order it before your bowl so you can identify the style you want to drink alongside the ramen.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants have a full bar near me?', a: 'The map above is filtered to spots that serve alcohol. Enter your ZIP or tap "Use my location" to find ramen with sake, beer, and cocktails nearby. The "Full Bar" flag surfaces places where the drink program is intentional, not just a single beer on the menu.' },
          { q: 'What drinks pair well with ramen?', a: 'Crisp Japanese lagers, dry junmai sake, shochu, and highballs are classic pairings. Dry, clean drinks cut through rich tonkotsu and miso; lighter sake suits shoyu and shio; a slightly sweet drink balances spicy bowls and tantanmen. The general rule is: the richer the broth, the crisper the drink should be.' },
          { q: 'Are ramen bars and izakayas the same thing?', a: 'Not exactly. An izakaya centers on drinks and small plates with ramen as one option on a longer menu. A ramen bar centers on the noodles and builds a bar program around them. Many excellent spots blur the line, and both formats are worth visiting depending on whether your priority is the bowl or the broader drink-and-food experience.' },
          { q: 'Is it normal to drink beer with ramen?', a: 'Very. An ice-cold beer alongside a rich bowl is a beloved pairing in Japan, and many shops are designed around exactly that combination. The carbonation and bitterness of a lager cut through fatty broth and reset the palate between bites, making each mouthful of noodles taste brighter.' },
          { q: 'What should I drink with spicy ramen?', a: 'Something with a touch of sweetness — a fruity highball, a slightly sweet lager, or an unfiltered nigori sake. Bone-dry drinks can amplify the burn, while a little residual sweetness cools it down and lets you keep eating without discomfort. A cold, lightly sweet wheat beer also works beautifully with tantanmen.' },
          { q: 'What is shochu and how does it pair with ramen?', a: 'Shochu is a Japanese distilled spirit made from sweet potato, barley, rice, or other ingredients. It is lower in alcohol than whisky and has a clean, slightly earthy flavor. Mixed with soda water, it becomes a shochu soda — one of the most food-friendly drinks I know and a natural companion for any bowl of ramen.' },
          { q: 'How do I read a sake menu at a ramen bar?', a: 'Focus on three terms: junmai (fuller-bodied, savory, pairs well with rich broths), ginjo or daiginjo (lighter and more fragrant, better with delicate shoyu and shio), and nigori (unfiltered and creamy, excellent with spicy ramen). When in doubt, ask the bartender which sake they would drink with your bowl.' },
          { q: 'Is ramen with a full bar good for date night?', a: 'It is one of my favorite date-night formats. Sharing bowls, trading sips of different sake, and ordering small plates together creates a relaxed, interactive meal that a formal restaurant can rarely match. Stack the "Date Night" filter with "Full Bar" to find spots designed for exactly this kind of evening.' },
        ]}
      />
    </main>
  )
}
