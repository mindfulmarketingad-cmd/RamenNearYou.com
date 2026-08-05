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
  title: 'IPPUDO Ramen Near Me | Find an IPPUDO Location | RamenNearYou',
  description: 'Find IPPUDO near you — the famed Hakata tonkotsu chain from Fukuoka. What IPPUDO is known for, signature bowls like Akamaru and Shiromaru, and nearby alternatives.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ippudo-ramen' },
  openGraph: {
    title: 'IPPUDO Ramen Near Me',
    description: 'Find an IPPUDO ramen location near you.',
    url: 'https://www.ramennearyou.com/find/ippudo-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function IppudoRamenPage() {
  const NATIONWIDE_FILTER = { initialQuery: "ippudo" }
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
        initialQuery="ippudo"
        pageTitle="IPPUDO Ramen Near Me"
        pageDescription="Find an IPPUDO ramen location near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "IPPUDO Ramen Near Me" }]}
        title={`IPPUDO Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ippudo-ramen"
        heading="How to Find IPPUDO Ramen Near Me"
        intro={[
          'IPPUDO is ramen royalty — founded in Hakata (Fukuoka) in 1985, it helped bring serious tonkotsu to the world stage, and its bowls are still a benchmark for what the style can achieve. The map above is set to find IPPUDO locations near you; enter your ZIP or use your location to see the closest one, plus what to order and where to go if there is no IPPUDO nearby. I check this map every time I am traveling somewhere new to see whether there is an IPPUDO within striking distance.',
          'If you want to taste classic Hakata-style tonkotsu done by one of the names that made it famous, here is what to know. IPPUDO has a particular confidence to it — the kind that comes from nearly four decades of making the same style of broth and refining it continuously. Every bowl I have had there has that quality of something that has been worked on and improved many times over.',
          'The dining experience at IPPUDO is also worth mentioning. Unlike more counter-service oriented ramen concepts, IPPUDO leans into a full sit-down atmosphere with attentive service, a strong drinks list, and a rotating selection of small plates. I have had excellent meals there that went well beyond the ramen itself — the hirata buns in particular are something I look forward to almost as much as the main bowl.',
          'Here is my complete guide to understanding IPPUDO, choosing between the signature bowls, and finding a great alternative if the nearest location is too far to reach.',
        ]}
        sections={[
          {
            h2: 'What IPPUDO is known for',
            body: (
              <p>
                IPPUDO is synonymous with Hakata-style tonkotsu: a rich, creamy pork-bone broth served with
                thin, firm, straight noodles. Its two signature bowls — Shiromaru Motoaji (the original, pure
                tonkotsu) and Akamaru Shinaji (finished with a special miso paste and fragrant garlic oil) — are
                the bowls to know. The setting is sleek and modern, and the buns and small plates are excellent
                too. What sets IPPUDO apart from many tonkotsu competitors is the depth of the broth. You can
                taste the hours that went into it — a layered richness that starts creamy and finishes with a
                clean, savory aftertaste. The noodles are equally precise: thin enough to cook in seconds, firm
                enough to hold up in the hot broth without going soft, and just slightly springy in a way that
                makes each bite satisfying.
              </p>
            ),
            points: [
              { h3: 'Shiromaru Motoaji', text: 'The original — a clean, classic tonkotsu that shows off the broth at its purest. I always recommend this one to first-timers who want to understand what Hakata-style tonkotsu is actually supposed to taste like without any additions masking the base.' },
              { h3: 'Akamaru Shinaji', text: 'The richer signature, finished with miso paste and aromatic garlic oil for extra depth. This is my personal go-to on return visits — the added umami from the miso paste rounds the broth out beautifully and the garlic oil lingers in the best possible way.' },
              { h3: 'Hakata noodles', text: 'Thin, firm, straight noodles, often cooked to your chosen firmness — the classic tonkotsu pairing. I always order mine kata (firm) so they still have bite at the end of the bowl rather than turning soft in the rich broth.' },
            ],
          },
          {
            h2: 'What to order at IPPUDO',
            body: (
              <p>
                First-timers should get the Akamaru Shinaji to taste IPPUDO at its most signature, or the
                Shiromaru if you want the purest tonkotsu expression. Order your noodles firm, add a seasoned
                soft-boiled egg (ajitsuke tamago), and do not skip the pork buns (hirata buns) — they are a
                highlight that I consider mandatory at this point. The buns are pillowy and soft with a perfectly
                fatty slice of pork belly and a sauce that is sweet, savory, and slightly tangy all at once.
                If you still have broth when the noodles are gone, ask whether kaedama (extra noodles) is
                available — it is a great way to extend the meal and get a second serving in a slightly
                different form. On the drinks side, a cold Sapporo or a light sake complements the richness
                of the tonkotsu better than most other pairings I have tried.
              </p>
            ),
            points: [
              { h3: 'Hirata buns — do not skip them', text: 'The pork belly hirata buns are arguably the best non-ramen item in IPPUDO\'s repertoire. Soft steamed buns, fatty pork, and a sweet-savory sauce make them an ideal way to start while the ramen is being prepared.' },
              { h3: 'Add a seasoned egg', text: 'The soft-boiled, soy-marinated egg adds a layer of richness to the bowl that I find genuinely transformative. The jammy yolk mingles with the broth in a way that makes every sip after it richer.' },
              { h3: 'Firm noodles hold up best', text: 'Ordering kata (firm) means your noodles still have pleasant bite halfway through the bowl. The thin Hakata noodles soften quickly in hot broth, so firm is almost always the right call.' },
            ],
          },
          {
            h2: 'No IPPUDO nearby? Where to go instead',
            body: (
              <p>
                IPPUDO locations are still fairly limited in the United States, so if there is not one near you,
                the map can find an excellent local tonkotsu shop instead. Clear the search and stack the
                "Tonkotsu" filter for the same rich, creamy pork-bone style, and add "Top Rated" to surface the
                best-reviewed bowls around you. I have used this approach more times than I can count and have
                found remarkable independent shops that way — places doing Hakata-style tonkotsu with the same
                care and precision as any well-known chain, and sometimes with a regional twist that makes the
                bowl genuinely unique. A well-made independent tonkotsu is one of my favorite discoveries in any
                city, and this filter combination is the fastest route I know to finding one.
              </p>
            ),
          },
          {
            h2: 'The history behind the bowl',
            body: (
              <p>
                Understanding where IPPUDO comes from makes the bowl taste better to me, and I think it will for
                you too. Hakata tonkotsu originated in Fukuoka, Japan — a city on the northern coast of Kyushu
                island that has been a center of commerce and culture for centuries. The ramen style grew out of
                the port area and became famous for its intensity and speed: street stalls called yatai served
                quick bowls of pork-bone broth with thin noodles to workers and travelers, and the style spread
                from there. IPPUDO was founded in 1985 by Shigemi Kawahara, who entered Hakata ramen competitions
                and developed a refined version of the broth that became its own distinct expression. When IPPUDO
                expanded internationally, it brought that Fukuoka tradition to new audiences — and to its credit,
                the broth has maintained its integrity through that expansion. Every bowl still tastes like
                something rooted in a specific place and a specific tradition.
              </p>
            ),
            points: [
              { h3: 'Fukuoka origins', text: 'Hakata tonkotsu grew from the yatai street stall culture of Fukuoka\'s port district. The style was built for speed and intensity, and both qualities are still present in every IPPUDO bowl today.' },
              { h3: 'Decades of broth refinement', text: 'The depth of an IPPUDO broth is the result of decades of continuous improvement. Each bowl carries the accumulated knowledge of a kitchen that has been working on the same fundamental recipe since 1985.' },
              { h3: 'Global expansion with consistent quality', text: 'IPPUDO expanded to New York, then to other U.S. cities, without diluting what made the original notable. The broth quality and noodle precision you experience in any IPPUDO location reflects that commitment.' },
            ],
          },
          {
            h2: 'Getting the most from an IPPUDO visit',
            body: (
              <p>
                A few practical things I have learned. IPPUDO can have waits at peak times, especially weekend
                dinners, so arriving right when they open or going on a weekday gives you a much better
                experience. The wait is worth it, but skipping it is better. If you are deciding between
                Shiromaru and Akamaru and genuinely cannot choose, I would say go with Akamaru on a first visit
                — the miso paste and garlic oil additions make it more complex, and if you want the pure broth
                you can always order the Shiromaru next time as a comparison. Finally, do not ignore the
                supplemental menu items. IPPUDO is one of the few ramen chains where the sides and extras are
                consistently worth ordering, and a full meal there — buns, egg, ramen, maybe a dessert — is one
                of the more satisfying restaurant experiences I know.
              </p>
            ),
          },
        ]}
        tipsHeading="My IPPUDO tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest IPPUDO, sorted by distance. Note that U.S. locations are still limited, so check the map before making a long drive.',
          'Order the Akamaru Shinaji for the signature depth of flavor on your first visit, or Shiromaru Motoaji if you want to taste the broth in its purest, unadulterated form.',
          'Always order your noodles firm (kata) — the thin Hakata noodles soften quickly in the hot broth, and firm keeps them pleasant all the way to the last bite.',
          'Do not skip the pork hirata buns. I consider them mandatory — they are some of the best bites in any IPPUDO meal and worth ordering even if you are watching your budget.',
          'Add a seasoned soft-boiled egg to any bowl. The jammy, soy-marinated yolk enriches every sip of broth around it.',
          'If you still have broth when your noodles run out, ask about kaedama — an extra noodle portion to drop into the remaining soup.',
          'Go on a weekday or arrive right at opening to avoid the peak-hour wait. IPPUDO is worth a wait but much better without one.',
          'No IPPUDO nearby? Clear the search and stack "Tonkotsu" then "Top Rated" to find an outstanding local pork-bone specialist near you.',
        ]}
        faqs={[
          { q: 'What is IPPUDO known for?', a: 'IPPUDO is famous for Hakata-style tonkotsu — a rich, creamy pork-bone broth with thin, firm noodles. Its signature bowls are Shiromaru Motoaji (classic pure tonkotsu) and Akamaru Shinaji (with miso paste and garlic oil). The chain was founded in Fukuoka, Japan in 1985 and is credited with elevating Hakata tonkotsu to international recognition.' },
          { q: 'What should I order at IPPUDO?', a: 'Get the Akamaru Shinaji for the signature flavor or Shiromaru Motoaji for pure tonkotsu. Order noodles firm, add a seasoned soft-boiled egg, and try the pork hirata buns as a starter. These three elements together make for a complete and deeply satisfying IPPUDO meal.' },
          { q: 'What is the difference between Akamaru and Shiromaru at IPPUDO?', a: 'Shiromaru Motoaji is the original, expressing pure Hakata tonkotsu at its most straightforward — rich broth, thin noodles, classic toppings. Akamaru Shinaji is the richer, more complex version, finished with a special miso paste and fragrant garlic oil that add umami depth and aromatic richness. Both are excellent; Akamaru tends to be the more popular order.' },
          { q: 'What are hirata buns at IPPUDO?', a: 'Hirata buns are soft steamed bao-style buns filled with braised pork belly and finished with a sweet-savory sauce. They are one of the best items on the IPPUDO menu and I strongly recommend ordering them as a starter. The combination of the pillowy bun, fatty pork, and tangy sauce is addictive.' },
          { q: 'How do I find an IPPUDO near me?', a: 'The map above is set to find IPPUDO locations. Enter your ZIP or tap "Use my location" to see the closest ones sorted by distance. IPPUDO has a limited number of U.S. locations, so the nearest one may require some travel.' },
          { q: 'What if there is no IPPUDO near me?', a: 'Clear the search and stack the "Tonkotsu" filter to find a local pork-bone specialist, then add "Top Rated" to surface the best-reviewed tonkotsu near you. Many independent ramen shops do Hakata-style broth exceptionally well, and this combination of filters is the fastest way I know to find them.' },
          { q: 'Is IPPUDO good for a group dinner?', a: 'Yes — IPPUDO has table service and a full menu of starters, buns, and drinks that make it well suited to group dining. The hirata buns and other shared plates work especially well for the table while everyone waits for their individual bowls. I have had many great group meals there.' },
          { q: 'What is kaedama and can I get it at IPPUDO?', a: 'Kaedama is an extra portion of noodles that you add to your remaining broth when the original noodles are finished. It is a traditional part of Hakata ramen culture and allows you to extend the meal and enjoy the broth a second time. Availability varies by location, so ask your server.' },
        ]}
      />
    </main>
  )
}
