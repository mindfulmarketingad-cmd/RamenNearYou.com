import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

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

export default function RamenFullBarPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ErrorBoundary
        fallback={
          <section className="pt-16 bg-[#F5F4F0]">
            <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
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

      <FindPageContent
        currentHref="/find/ramen-full-bar"
        heading="My Favorite Ramen Spots With a Full Bar"
        intro={[
          'A cold beer or a pour of sake next to a steaming bowl is, in my opinion, the complete ramen experience. The map above is filtered to ramen restaurants near you that serve alcohol — whether that is a full cocktail bar, a sake list, or just ice-cold Japanese lagers on tap. Enter your ZIP or use your location to find the closest ones.',
          'Drinking with ramen is a real tradition, not an afterthought. In Japan, an ice-cold beer with a rich bowl, or a few drinks and small plates at an izakaya that happens to make great noodles, is a normal night out. Here is how I think about pairing drinks with broth, and how to find the right kind of spot.',
        ]}
        sections={[
          {
            h2: 'What to drink with each broth',
            body: (
              <p>
                The general rule I follow: the richer the bowl, the more you want something crisp and clean to
                cut through it. The lighter the bowl, the more a delicate sake or a citrusy highball can shine
                without overwhelming it.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu and rich miso', text: 'A crisp Japanese lager (think Asahi, Sapporo, or Kirin) or a dry sake slices right through the fatty, collagen-heavy broth and resets your palate between bites.' },
              { h3: 'Shoyu and shio', text: 'Lighter, clearer broths pair beautifully with a clean junmai sake or a lemon highball — something that complements rather than competes.' },
              { h3: 'Spicy ramen and tantanmen', text: 'A slightly sweeter beer or a fruity highball tames the heat. Save the bone-dry stuff here; a little sweetness is your friend with chili.' },
            ],
          },
          {
            h2: 'Ramen bar vs. izakaya — what is the difference',
            body: (
              <p>
                These get used interchangeably, but they are not quite the same. An izakaya is a Japanese
                gastropub built around drinks and small shareable plates, where ramen may be one item on a long
                menu. A ramen bar centers on the noodles and adds a bar program around it. Plenty of great spots
                blur the line, offering both a serious bowl and a real drink list — those are usually my
                favorites for a longer evening.
              </p>
            ),
          },
          {
            h2: 'Best occasions for ramen with drinks',
            body: (
              <p>
                A full bar turns ramen into a proper night out. I stack this filter with “Date Night” when I
                want a cocktail and a cozy room, “Open Late” for an after-work or post-show bowl, and
                “Takes Reservations” when I am bringing a group and want a guaranteed table. The combination
                makes it easy to build the exact evening you are after.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen-and-drinks tips"
        tips={[
          'Filter to “Full Bar,” then sort by distance or add “Top Rated” for the best of both.',
          'Match crisp, dry drinks to rich broths and lighter, brighter drinks to clear broths.',
          'A slightly sweet beer or highball is the move with spicy bowls — it cools the heat.',
          'Stack with “Open Late” for an after-work bowl and a drink to unwind.',
          'Look for izakaya-style spots if you want small plates and gyoza alongside your noodles.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants have a full bar near me?', a: 'The map above is filtered to spots that serve alcohol. Enter your ZIP or tap “Use my location” to find ramen with sake, beer, and cocktails nearby.' },
          { q: 'What drinks pair well with ramen?', a: 'Crisp Japanese lagers, dry sake, shochu, and highballs are classic. Dry, clean drinks cut rich tonkotsu and miso; lighter sake suits shoyu and shio; a slightly sweet drink balances spicy bowls.' },
          { q: 'Are ramen bars and izakayas the same thing?', a: 'Not exactly. An izakaya centers on drinks and small plates with ramen as one option; a ramen bar centers on the noodles with a bar added. Many spots offer both a great bowl and a full drink list.' },
          { q: 'Is it normal to drink beer with ramen?', a: 'Very. An ice-cold beer with a rich bowl is a beloved pairing in Japan, and many shops are designed around exactly that combination.' },
          { q: 'What should I drink with spicy ramen?', a: 'Something with a touch of sweetness — a fruity highball or a slightly sweet lager. Bone-dry drinks can amplify the burn, while a little sweetness cools it down.' },
        ]}
      />
    </main>
  )
}
