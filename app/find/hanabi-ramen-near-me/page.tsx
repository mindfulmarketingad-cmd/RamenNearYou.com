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
  title: 'Hanabi Ramen Near Me | Find Hanabi Ramen Restaurants | RamenNearYou',
  description: 'Find Hanabi Ramen near you — browse Hanabi Ramen restaurant locations by rating, hours, and distance. See menus, directions, and reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hanabi-ramen-near-me' },
  openGraph: {
    title: 'Hanabi Ramen Near Me',
    description: 'Find Hanabi Ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/hanabi-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function HanabiRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["hanabi"] }
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
        initialFlags={['hanabi']}
        pageTitle="Hanabi Ramen Near Me"
        pageDescription="Showing Hanabi Ramen locations near you. Enter your ZIP or use your location to find the closest one."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Hanabi Ramen Near Me" }]}
        title={`Hanabi Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/hanabi-ramen-near-me"
        heading="How I Find Hanabi Ramen Near Me"
        intro={[
          'Hanabi Ramen is a popular ramen chain known for its rich broths, generous bowls, and a welcoming atmosphere that makes it an easy choice whether you are a ramen regular or just getting into the style. The map above is filtered to Hanabi Ramen locations near you. Enter your ZIP or tap "Use my location" and the closest spots sort to the top so you can immediately see distance, ratings, and hours.',
          'The name Hanabi (花火) means fireworks in Japanese, and that name carries a promise — bold, vivid flavors that are meant to make an impression. In my experience Hanabi Ramen delivers on that spirit in the bowl. The broths tend to be deeply seasoned and satisfying, and the range of styles on the menu means there is usually something for everyone at the table, from classic tonkotsu to spicy miso to lighter shoyu.',
          'What I appreciate about Hanabi as a ramen destination is the combination of approachability and quality. The setting is comfortable without being pretentious, the menu is readable and not overwhelming, and the kitchen clearly pays attention to foundational technique. A well-simmered broth is the foundation of any good ramen, and Hanabi prioritizes that foundation. I have had consistently satisfying bowls across multiple visits, and the toppings are handled with care rather than treated as an afterthought.',
          'Here is everything I know about Hanabi Ramen — what to expect, how to order, how to time your visit, and how to use the map to find the location nearest to you.',
        ]}
        sections={[
          {
            h2: 'What is Hanabi Ramen?',
            body: (
              <p>
                Hanabi Ramen is a ramen restaurant known for serving Japanese-style ramen in a comfortable,
                welcoming setting. "Hanabi" (花火) means fireworks in Japanese — a nod to the bold, vibrant
                flavors in every bowl. Locations typically offer a range of broth styles including tonkotsu,
                shoyu, and spicy ramen alongside classic Japanese sides and starters. The concept strikes a
                balance between the focused intensity of a single-style specialist and the breadth of a
                full-menu ramen bar, which makes it versatile for different occasions. I find Hanabi works
                equally well for a solo weekday lunch and for a group dinner where people have different
                preferences. The kitchen tends to do its best work on the tonkotsu and the spicy bowls, which
                in my experience are where the depth of the broth is most apparent.
              </p>
            ),
            points: [
              { h3: 'Rich, house-simmered broths', text: 'House-simmered broths across multiple styles — tonkotsu, shoyu, miso, and spicy. The tonkotsu is typically the most developed, with the kind of creamy opacity that only comes from a properly long bone simmer.' },
              { h3: 'Classic and generous toppings', text: 'Chashu pork belly, soft-boiled egg, bamboo shoots, nori, and scallions are the standard lineup. The chashu at Hanabi is usually braised until it falls apart, which I consider the mark of a kitchen that takes the toppings seriously.' },
              { h3: 'Japanese sides and starters', text: 'Gyoza, rice dishes, and small plates round out the menu at most locations. A good gyoza order while the bowl arrives is one of my standard moves at Hanabi — the crispy bottoms are consistently well executed.' },
            ],
          },
          {
            h2: 'What to order at Hanabi Ramen',
            body: (
              <p>
                First visit? Start with the tonkotsu or house signature bowl to taste what the kitchen does
                best. The signature bowl is the lens through which I evaluate any new ramen spot — it tells
                you more about the kitchen's priorities and technique than anything else on the menu. If you
                like heat, the spicy ramen is a popular order and worth trying, though I always recommend
                asking your server about the heat level so you know what you are getting into. Add a
                soft-boiled egg (ajitama) for extra richness — the jammy yolk breaks into the broth and
                enriches every subsequent sip. A side of gyoza while the bowl arrives is a reliable choice
                that I have yet to regret at any Hanabi visit. If you still have broth when the noodles run
                out, use it — drink it from the bowl or ask for a small rice portion to add to the remaining
                soup. A good tonkotsu broth is worth finishing.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu or signature bowl first', text: 'The house signature and tonkotsu bowls give you the clearest picture of what the kitchen is doing. I always start there on a first visit and branch out on subsequent ones once I know the baseline.' },
              { h3: 'Spicy ramen for heat seekers', text: 'The spicy option at Hanabi tends to be well integrated rather than just hot. The heat builds through the bowl rather than hitting all at once, which I find more interesting than a one-note burn.' },
              { h3: 'Soft-boiled egg is essential', text: 'Adding a soy-marinated soft-boiled egg transforms the bowl. The yolk adds fat and richness that carries through every bite, and at most ramen spots it is one of the best value additions on the menu.' },
            ],
          },
          {
            h2: 'Tips for visiting Hanabi Ramen',
            body: (
              <p>
                Hanabi Ramen locations can get busy at peak lunch and dinner hours, especially on weekends.
                Going on a weekday or arriving right when they open is the easiest way to skip the wait and
                get your pick of seating. Check the listing above for hours before heading out — some
                locations adjust their schedule seasonally or close between lunch and dinner, and nothing is
                more frustrating than showing up to find they are on a break. If you have a large group, it
                is worth calling ahead to confirm they can accommodate the size and whether any advance
                arrangement is needed. Most Hanabi locations do not take formal reservations for smaller
                parties, but a quick call for a group of six or more is always a good idea. I have also
                found that arriving early in the dinner hour — say, five to five-thirty — is one of the
                most reliable strategies for a short wait across most ramen spots, including Hanabi.
              </p>
            ),
          },
          {
            h2: 'Understanding the ramen styles at Hanabi',
            body: (
              <p>
                A little context on the broth styles you will find at Hanabi helps you choose with confidence.
                Tonkotsu is the pork-bone broth style from Hakata, Fukuoka — milky white, rich, and coating.
                Shoyu (soy sauce) ramen is a cleaner, more translucent style with a soy-forward seasoning
                that lets the noodles and toppings stand out more clearly. Miso ramen uses fermented soybean
                paste as its seasoning base and tends to be heartier and earthier — a good choice in cold
                weather. Spicy ramen at a place like Hanabi is usually a tonkotsu or miso base with a chili
                paste or oil added, building heat on top of the existing richness. Each style calls for
                slightly different toppings and noodle pairings, and the Hanabi kitchen tends to know this
                and execute accordingly. I usually ask the staff which broth they are most proud of on a
                given day — kitchens always have something they are running particularly well, and a server
                who can answer that question confidently is a good sign.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu — rich and creamy', text: 'The pork-bone broth style is typically the anchor of any multi-style ramen menu. At Hanabi it is usually the most developed and best-executed style, and I always recommend it as the starting point.' },
              { h3: 'Shoyu — clean and balanced', text: 'The soy-based broth is a lighter, more transparent option that highlights the noodles and toppings rather than coating everything in richness. A great choice if you want something less heavy or are ordering after a big meal.' },
              { h3: 'Spicy — heat on a rich base', text: 'The spicy ramen builds on the existing broth depth rather than replacing it with heat. I find it pairs especially well with the soft-boiled egg, which softens the intensity and adds a creamy counterpoint.' },
            ],
          },
          {
            h2: 'How to use the map to find the closest Hanabi Ramen',
            body: (
              <p>
                The map at the top of this page is already filtered to show Hanabi Ramen locations. Enter
                your ZIP code or tap "Use my location" to sort results by proximity. Each listing shows the
                distance, current rating, and hours so you can see at a glance which location is open and
                closest. If you are looking for the fastest way to decide between two nearby locations, I
                usually look at the rating first and then check whether one has better hours for the time
                I am planning to go. If the ratings are similar, I default to whichever is closer unless
                the further one has a meaningfully better rating. For checking whether a specific location
                is currently open, the "Open Now" filter updates the map in real time — a reliable way to
                confirm before leaving the house.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for Hanabi Ramen"
        tips={[
          'Order the tonkotsu or house signature bowl on your first visit — it tells you more about the kitchen\'s priorities and technique than any other bowl on the menu.',
          'Add a soft-boiled marinated egg to every bowl. The jammy yolk breaks into the broth and enriches every sip after it in a way that makes the whole bowl more satisfying.',
          'Go on a weekday or arrive at opening to skip peak-hour waits. Hanabi locations get busy on weekends, and early timing is the most reliable workaround.',
          'Check the listing for current hours before heading out — some Hanabi locations adjust their schedule seasonally or close between lunch and dinner service.',
          'Order a side of gyoza while the main bowl arrives. The kitchen at most Hanabi locations handles gyoza well, and the crispy-bottomed dumplings are an excellent way to start.',
          'Ask your server which broth they are running best that day — a good staff member will know, and it is one of the most useful ordering tips I have.',
          'For groups of six or more, call ahead to confirm the location can accommodate you. Most Hanabi spots do not take reservations for small parties but appreciate a heads up for larger ones.',
          'If you finish the noodles and still have broth, finish it. A well-simmered tonkotsu broth is worth drinking to the last drop — ask for a small rice portion to add if you want to stretch it further.',
        ]}
        faqs={[
          { q: 'Is there a Hanabi Ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" to see the closest Hanabi Ramen locations, sorted by distance and rating. The map also shows current hours and open status so you can confirm before heading out.' },
          { q: 'What does Hanabi mean?', a: '"Hanabi" (花火) means fireworks in Japanese, reflecting the vibrant, bold flavors the restaurant aims to deliver in every bowl. The name is a statement of intent — the kitchen wants every dish to make an impression the way fireworks do.' },
          { q: 'What kind of ramen does Hanabi serve?', a: 'Hanabi Ramen typically offers a range of Japanese ramen styles including tonkotsu (pork-bone), shoyu (soy sauce), miso, and spicy ramen. The tonkotsu tends to be the most developed style on the menu and is usually my first recommendation for a new visitor.' },
          { q: 'What should I order at Hanabi Ramen for the first time?', a: 'Start with the tonkotsu or house signature bowl to get a clear sense of what the kitchen does best. Add a soft-boiled egg and order a side of gyoza to start. If you enjoy heat, the spicy ramen is a solid second choice on a return visit once you know the baseline.' },
          { q: 'Does Hanabi Ramen take reservations?', a: 'Reservation policies vary by location. Check the listing for your nearest Hanabi Ramen to see if reservations are available, or call ahead for large groups. For smaller parties, most Hanabi locations seat on a walk-in basis, so timing your visit for off-peak hours is the best strategy.' },
          { q: 'What are the hours for Hanabi Ramen?', a: 'Hours vary by location and some adjust seasonally. Check the listing for your nearest Hanabi Ramen on the map above for current hours before heading out, since some locations also close between lunch and dinner service.' },
          { q: 'What is the best ramen style to order at Hanabi if I am new to ramen?', a: 'Tonkotsu is my recommendation for ramen newcomers at Hanabi. The rich, creamy pork-bone broth is deeply satisfying and represents the style that most people find immediately compelling. It is also the style the kitchen is usually most practiced at. Start there and branch out to shoyu or spicy on follow-up visits.' },
          { q: 'How do I use the map to find the nearest Hanabi Ramen?', a: 'The map at the top of this page is already filtered to Hanabi Ramen locations. Enter your ZIP code or tap "Use my location" to sort by proximity. Each listing shows distance, rating, and hours. Use the "Open Now" filter to confirm a location is currently serving before you leave the house.' },
        ]}
      />
    </main>
  )
}
