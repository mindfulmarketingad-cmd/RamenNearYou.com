import type { Metadata } from 'next'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { getPhoStats, getPhoCities, phoCityParam } from '@/lib/pho'

export const metadata: Metadata = {
  title: 'Pho Restaurants Near Me | Ramen Near You',
  description:
    'Find pho restaurants near you on an interactive map. Filter by hours, takeout, and delivery, then open a full profile with hours, amenities, ratings, and what to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/pho-restaurants' },
  openGraph: {
    title: 'Pho Restaurants Near Me',
    description: 'Find pho restaurants near you on an interactive map.',
    url: 'https://www.ramennearyou.com/find/pho-restaurants',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function PhoFindPage() {
  const stats = getPhoStats()
  const topCities = getPhoCities().slice(0, 10)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
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
          initialFlags={['pho']}
          pageTitle="Pho Restaurants Near Me"
          pageDescription={`Showing ${stats.restaurants} pho restaurants across ${stats.states} states. Enter your ZIP or use your location to sort by distance.`}
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/pho-restaurants"
        heading="Finding Good Pho Near You"
        intro={[
          `This map is filtered to pho restaurants only — ${stats.restaurants} of them across ${stats.cities} cities and ${stats.states} states. They show as green pins so they stand apart from the ramen listings that make up the rest of the site. Enter your ZIP or tap "Use my location" and the closest ones sort to the top.`,
          'Every pin opens a full profile with the restaurant\'s verified hours, the amenities it actually lists on Google, a full 1-to-5-star rating breakdown, and directions. Nothing on those pages is invented — it is all pulled from the restaurant\'s own business profile.',
        ]}
        guideLink={{
          href: '/blog/what-are-the-healthiest-noodles-you-can-eat',
          title: 'What Are the Healthiest Noodles You Can Eat?',
          blurb: 'Where rice noodles, ramen noodles, soba, and shirataki actually land nutritionally.',
        }}
        sections={[
          {
            h2: 'What separates good pho from average pho',
            body: (
              <p>
                It comes down to the broth. Real pho broth is beef bones simmered for hours with charred onion
                and ginger, seasoned with star anise, cinnamon, clove, coriander, and fennel. It should be{' '}
                <em>clear</em> rather than cloudy, aromatic before you taste it, and savory without reading as
                simply salty. A cloudy, flat broth usually means a concentrate base rather than a long simmer —
                the single biggest quality tell in the whole dish.
              </p>
            ),
            points: [
              {
                h3: 'Know the cuts',
                text: 'Tai is rare steak that cooks in the broth at your table, chin is well-done brisket, nam is flank, gau is fatty brisket, gan is tendon, and sach is tripe. A "dac biet" (special) bowl combines several, which is the best way to find the one you actually like on a first visit.',
              },
              {
                h3: 'Use the garnish plate properly',
                text: 'Thai basil, bean sprouts, lime, and chili arrive on the side for a reason. Add them gradually — herbs wilt fast and lime shifts the whole balance of the broth. Over-acidify a bowl and there is no undoing it.',
              },
              {
                h3: 'Go easy on the hoisin and sriracha',
                text: 'Squeezing them straight into the broth muddies a stock the kitchen spent hours clarifying. Put them in a side dish and dip the meat instead — that is how it is usually done in Vietnam.',
              },
            ],
          },
          {
            h2: 'How pho compares to ramen',
            body: (
              <p>
                Both are noodle soups, but they are built differently. Pho uses flat rice noodles in a clear,
                spice-forward broth and is finished by the diner with fresh herbs. Ramen uses alkaline wheat
                noodles in a richer broth seasoned with a concentrated tare, and arrives composed. Pho generally
                runs lighter; ramen&apos;s richer styles carry more fat. Both can be high in sodium. If you want the
                detail, see{' '}
                <Link href="/blog/is-ramen-healthier-than-pasta" className="text-[#96602F] hover:underline">
                  is ramen healthier than pasta
                </Link>{' '}
                and{' '}
                <Link href="/blog/what-are-ramen-noodles-made-of" className="text-[#96602F] hover:underline">
                  what ramen noodles are made of
                </Link>
                . If pho is your baseline, the ramen styles closest in weight are{' '}
                <Link href="/blog/what-is-shio-ramen" className="text-[#96602F] hover:underline">shio</Link> and{' '}
                <Link href="/blog/what-is-shoyu-ramen" className="text-[#96602F] hover:underline">shoyu</Link>.
              </p>
            ),
          },
          {
            h2: 'Ordering pho for takeout',
            body: (
              <p>
                Pho travels badly if it is packed wrong. Rice noodles keep absorbing liquid the moment they sit
                in hot broth, so a kitchen that cares packs the broth, noodles, meat, and herbs separately for
                you to assemble at home. If it arrives pre-combined, eat it immediately — reheating will not
                bring the texture back. Same problem ramen has, and the same fix; I cover it on the{' '}
                <Link href="/find/ramen-takeout" className="text-[#96602F] hover:underline">ramen takeout</Link>{' '}
                page.
              </p>
            ),
          },
          {
            h2: 'Where we have the most pho coverage',
            body: (
              <>
                <p className="mb-3">
                  Coverage is deepest in these metros right now. Open any listing for full hours, amenities,
                  and ratings:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                  {topCities.map(c => (
                    <Link
                      key={`${c.citySlug}-${c.stateCode}`}
                      href={`/find/${phoCityParam(c.citySlug, c.stateCode)}`}
                      className="text-[#96602F] hover:underline"
                    >
                      {c.city}, {c.stateCode} ({c.count})
                    </Link>
                  ))}
                </div>
                <p className="mt-3">
                  You can also browse every pho listing on the{' '}
                  <Link href="/partners" className="text-[#96602F] hover:underline">partners directory</Link>.
                </p>
              </>
            ),
          },
        ]}
        tipsHeading="My tips for picking a pho spot"
        tips={[
          'Look at the broth in the photos before you go — clear and glossy beats cloudy and flat.',
          'A restaurant that opens before 11 AM often takes pho seriously; it is a breakfast dish in Vietnam.',
          'Order a "dac biet" special on a first visit so you can taste several cuts and learn what you like.',
          'Check whether the listing says cash-only before you sit down — plenty of the best family-run shops are.',
          'Add herbs and lime gradually. You can always add more; you cannot take it back out.',
        ]}
        faqs={[
          { q: 'What is pho?', a: 'Pho is a Vietnamese noodle soup built on a clear beef or chicken broth simmered for hours with charred onion, ginger, and warm spices like star anise and cinnamon, served over flat rice noodles with sliced meat and a side plate of fresh herbs, lime, and chili.' },
          { q: 'Is pho healthier than ramen?', a: 'Generally pho is lighter — a clear broth, rice noodles, and lean sliced beef, compared with ramen broths that are often richer and higher in fat. Both can be high in sodium, which is the main caveat for either dish. The specific bowl matters more than the category.' },
          { q: 'Is pho gluten-free?', a: 'The rice noodles themselves are gluten-free, but the broth and sauces are not guaranteed to be — hoisin sauce commonly contains wheat, and shared kitchen equipment is a risk. Ask the restaurant directly if you have celiac disease.' },
          { q: 'How do you pronounce pho?', a: 'It is closer to "fuh" than "foe" — roughly rhyming with "duh," with a rising tone in Vietnamese.' },
          { q: 'How many pho restaurants are on this map?', a: `We currently list ${getPhoStats().restaurants} pho restaurants across ${getPhoStats().cities} cities in ${getPhoStats().states} states, each with a full profile page. They appear as green pins on the map.` },
        ]}
      />
    </main>
  )
}
