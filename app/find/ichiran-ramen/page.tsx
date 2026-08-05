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
  title: 'ICHIRAN Ramen Near Me | Find an ICHIRAN Location | RamenNearYou',
  description: 'Find ICHIRAN near you — the famous solo-booth tonkotsu chain with its signature order sheet. What makes ICHIRAN unique, how the booths work, and nearby alternatives.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ichiran-ramen' },
  openGraph: {
    title: 'ICHIRAN Ramen Near Me',
    description: 'Find an ICHIRAN ramen location near you.',
    url: 'https://www.ramennearyou.com/find/ichiran-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function IchiranRamenPage() {
  const NATIONWIDE_FILTER = { initialQuery: "ichiran" }
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
        initialQuery="ichiran"
        pageTitle="ICHIRAN Ramen Near Me"
        pageDescription="Find an ICHIRAN ramen location near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "ICHIRAN Ramen Near Me" }]}
        title={`ICHIRAN Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ichiran-ramen"
        heading="How to Find ICHIRAN Ramen Near Me"
        intro={[
          'ICHIRAN is one of the most distinctive ramen experiences in the world — solo "flavor concentration booths," a paper order sheet where you customize every detail, and a single, laser-focused tonkotsu bowl. The map above is set to find ICHIRAN locations near you; enter your ZIP or use your location to see the closest one, plus how it works and where to go if there is not one nearby. I have used this map many times to track down the nearest ICHIRAN before a trip, and it has never let me down.',
          'ICHIRAN does one thing and does it obsessively. The entire concept is built around the idea that ramen deserves your full, undivided attention — no conversation to manage, no menu to debate, just you and your bowl. I have eaten at ICHIRAN in different cities and every time the ritual of filling out the order sheet and sitting down in my private booth feels genuinely special. It is one of those dining experiences that is genuinely hard to replicate anywhere else.',
          'Because ICHIRAN locations are still relatively limited in the United States compared to Japan, I always check the map before planning a visit. The closest location might be in the next major city over, but if you are already nearby it is absolutely worth the trip. I have driven over an hour specifically for an ICHIRAN bowl and felt completely satisfied at the end of it. The experience is that memorable.',
          'Here is everything I know about what makes ICHIRAN unique, how to navigate the ordering process, and what to do if the nearest location is simply too far away.',
        ]}
        sections={[
          {
            h2: 'What makes ICHIRAN unique',
            body: (
              <p>
                ICHIRAN serves a single dish — a classic Hakata tonkotsu — but the experience is the draw. You
                sit in an individual booth designed to let you focus entirely on the ramen, and you order via a
                detailed sheet where you specify broth richness, garlic, scallion, spice level (their signature
                red sauce), noodle firmness, and more. The staff pass your bowl through a small window, and you
                can eat in near-solitude. It is ramen as a personal ritual, and I find that the intentional
                isolation actually makes the flavors hit differently — there is nothing competing for your
                attention. The booths are typically separated by wooden dividers with a small curtain at the
                window, so each guest gets genuine privacy. I have gone to ICHIRAN alone, with a friend in the
                next booth, and both times felt equally satisfying.
              </p>
            ),
            points: [
              { h3: 'Solo booths', text: 'Individual "flavor concentration" stalls let you focus entirely on the bowl. I find eating alone at ICHIRAN to be one of the most relaxing dining experiences I have had — there is zero social pressure and every bite gets your full attention.' },
              { h3: 'The order sheet', text: 'Customize broth strength, richness, garlic, scallion, noodle firmness, and the signature spicy red sauce. The sheet covers every variable you could think to tweak, and getting your personal combination dialed in over multiple visits is genuinely fun.' },
              { h3: 'One perfected bowl', text: 'ICHIRAN makes only tonkotsu, refined obsessively — depth over breadth. I respect the focus enormously. The broth is the result of decades of refinement, and limiting the menu to one bowl means every ounce of energy goes into making that one bowl the best it can be.' },
            ],
          },
          {
            h2: 'How to order at ICHIRAN',
            body: (
              <p>
                Take your time with the order sheet — it is the whole point. For a first visit I suggest medium
                richness, medium garlic, the original (or level 2) red sauce, and firm noodles. These settings
                give you a balanced bowl that lets the broth shine without any one element overwhelming the
                others. If you finish your noodles and still have broth left — and you often will, because the
                broth is too good to leave — order kaedama (extra noodles) by pressing the call button. Kaedama
                is served as a small portion of fresh noodles that you drop straight into the remaining broth,
                effectively giving you a second, slightly evolved bowl. I almost always order kaedama on my
                second pass through, and by then I have figured out that I want a bit more garlic or one tick
                more spice. The order sheet for your second bowl is a blank slate, which is a nice touch.
              </p>
            ),
            points: [
              { h3: 'Start with medium settings', text: 'Medium richness, medium garlic, and level 1 or 2 red sauce let you taste the broth clearly on your first visit. You can push the dial in any direction once you know the baseline.' },
              { h3: 'Order kaedama when the bowl is empty', text: 'Extra noodles dropped into the remaining broth are the ICHIRAN way to extend the meal. It is affordable, satisfying, and gives you a chance to tweak your second-round preferences.' },
              { h3: 'Save your order sheet settings', text: 'I take a photo of my completed order sheet so I can replicate or adjust my exact preferences on the next visit. It is a small habit that has made every subsequent bowl better.' },
            ],
          },
          {
            h2: 'No ICHIRAN nearby? Find a tonkotsu spot',
            body: (
              <p>
                ICHIRAN has only a handful of U.S. locations, so there is a good chance the nearest one is far.
                If so, the map can find a local Hakata-style tonkotsu shop with the same thin noodles and creamy
                broth. Clear the search and stack the "Tonkotsu" filter, then add "Top Rated" to find the
                best-reviewed bowls near you. I have done this many times when I am craving that pork-bone
                richness without wanting to make a long drive, and I have discovered some incredible independent
                shops this way — places that do not have the name recognition of a chain but serve bowls that
                rival anything I have had. The thin Hakata-style noodle, firm and springy in a deeply rich broth,
                is a style many independent shops in larger cities do extremely well.
              </p>
            ),
          },
          {
            h2: 'Understanding Hakata tonkotsu — the style behind ICHIRAN',
            body: (
              <p>
                To appreciate what ICHIRAN is doing, it helps to understand Hakata tonkotsu as a style. Hakata
                refers to the old port district of Fukuoka, the city in Kyushu, Japan where this style of ramen
                originated. The broth is made by boiling pork bones at a high temperature for many hours, which
                breaks down the collagen and fat into a milky white, intensely rich liquid. The noodles are thin
                and straight — almost the opposite of the thick, wavy noodles you find in styles like Sapporo
                miso ramen. The classic toppings are simple: chashu pork, beni shoga (pickled ginger), sesame
                seeds, and green onion. ICHIRAN strips the bowl back even further, centering everything on the
                broth and the noodles and letting the diner customize from there. When I first learned the
                history of this style I found it made every sip feel more meaningful — I was tasting something
                that generations of ramen cooks in Fukuoka had spent decades perfecting.
              </p>
            ),
            points: [
              { h3: 'Milky, collagen-rich broth', text: 'The high-heat, long-simmer process is what gives Hakata tonkotsu its distinctive opacity and creamy texture. The richness coats the noodles in a way that lighter broths simply cannot match.' },
              { h3: 'Thin, firm Hakata noodles', text: 'The noodles are a key part of the style — thin and straight so they cook quickly and slip through the broth cleanly. Ordering them firm (kata) means they still have bite even as they sit in the hot soup.' },
              { h3: 'The role of the red sauce', text: "ICHIRAN's signature spicy red sauce is a proprietary blend that adds heat and complexity without masking the tonkotsu flavor. I usually land at level 2 or 3 after a few visits — enough heat to notice but not enough to obscure the broth." },
            ],
          },
          {
            h2: 'Making the most of your ICHIRAN visit',
            body: (
              <p>
                A few things I have learned from multiple visits that make the experience better. First, go at
                off-peak hours if you can — midweek lunches or early weekday dinners tend to have shorter queues,
                and a shorter queue means you get seated and into your booth faster. Second, read the order sheet
                carefully before you fill it in. Some options have nuance that is easy to miss in a first read.
                Third, do not rush. The booth is your private space for as long as you are eating, and the whole
                point of the concept is to slow down and pay attention. I have had some of my best ramen moments
                at ICHIRAN simply because I was not splitting my attention between conversation and my bowl.
              </p>
            ),
          },
        ]}
        tipsHeading="My ICHIRAN tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest ICHIRAN, sorted by distance. Note that U.S. locations are limited, so the closest one may require a bit of a drive.',
          'Take your time with the order sheet — customizing the bowl is the whole experience, not just a preamble to it. I spend a full minute reading every option before I fill anything in.',
          'First visit? Try medium richness and garlic, original red sauce, and firm noodles. This balanced starting point lets you taste the broth clearly and gives you a reference for future visits.',
          'Still have broth when the noodles are gone? Order kaedama (extra noodles) via the call button. The fresh noodles drop into the remaining broth and give you a second, slightly different bowl at a low cost.',
          'Take a photo of your completed order sheet so you can refine or replicate your exact settings on the next visit.',
          'Go at off-peak times — midweek lunches and early weekday dinners have noticeably shorter waits than weekend dinner rushes.',
          'No ICHIRAN nearby? Clear the search and stack "Tonkotsu" then "Top Rated" for a local tonkotsu specialist that might become your new regular.',
          'Do not rush your meal in the booth — the private setting is part of the experience, and slowing down makes the flavors noticeably more enjoyable.',
        ]}
        faqs={[
          { q: 'What is ICHIRAN known for?', a: 'ICHIRAN is famous for individual solo dining booths called flavor concentration booths, a detailed paper order sheet to customize every aspect of your bowl, and a single obsessively refined Hakata tonkotsu ramen with a signature spicy red sauce. The concept is designed to help you focus entirely on the ramen with minimal distraction.' },
          { q: 'How does ordering at ICHIRAN work?', a: 'You fill out a paper sheet choosing broth richness, garlic, scallion, spice level (the red sauce), noodle firmness, and more. Staff deliver the bowl through a small window to your private booth. The sheet is the heart of the experience — take your time with it and do not hesitate to ask staff for guidance if it is your first visit.' },
          { q: 'What should I order at ICHIRAN for the first time?', a: 'Try medium richness, medium garlic, the original or level-2 red sauce, and firm noodles. This combination gives you a balanced view of the broth and lets you adjust in one direction or another on subsequent visits. If you still have broth when the noodles are gone, order kaedama (extra noodles) to extend the meal.' },
          { q: 'What is kaedama at ICHIRAN?', a: 'Kaedama is an extra serving of noodles that you can add to your remaining broth when your bowl is almost finished. You press the call button and a small portion of fresh noodles is delivered to add to your soup. It is an affordable way to extend the meal and lets you fill out a new order sheet with your refined preferences for the second round.' },
          { q: 'How do I find an ICHIRAN near me?', a: 'The map above is set to find ICHIRAN locations. Enter your ZIP or tap "Use my location" to see the closest ones sorted by distance. Keep in mind there are only a handful of U.S. locations, so the nearest one may be in the next major city.' },
          { q: 'What if there is no ICHIRAN near me?', a: 'Clear the search and stack the "Tonkotsu" filter to find a local Hakata-style shop with the same thin noodles and creamy broth, then add "Top Rated" for the best-reviewed options nearby. Many independent ramen shops do exceptional tonkotsu that rivals any chain.' },
          { q: 'Can I bring someone to ICHIRAN even though it has solo booths?', a: 'Yes — you and your companion will be seated in adjacent booths separated by a divider. You can still talk through the divider, but most people find they naturally focus on their own bowl, which is very much the intention. It is actually a fun experience to do with another ramen lover.' },
          { q: 'Is ICHIRAN worth the hype?', a: 'In my opinion, yes — but for reasons that might surprise you. The ramen itself is very good, but what makes ICHIRAN worth experiencing is the concept: the booth, the order sheet, the ritual of customizing every variable and eating in quiet focus. It is a different way to relate to a bowl of ramen, and most people I know who have tried it come away genuinely moved by it.' },
        ]}
      />
    </main>
  )
}
