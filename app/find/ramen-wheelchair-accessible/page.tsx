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
  title: 'Wheelchair Accessible Ramen Near Me | Accessible Ramen | RamenNearYou',
  description: 'Find wheelchair accessible ramen restaurants near you — accessible entrances and seating. Plus exactly what to confirm before you go so the visit is smooth.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible' },
  openGraph: {
    title: 'Wheelchair Accessible Ramen Near Me',
    description: 'Find wheelchair accessible ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-wheelchair-accessible',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function RamenWheelchairAccessiblePage() {
  const NATIONWIDE_FILTER = { initialFlags: ["wheelchair"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked, { verifiedSlugs })
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
        initialFlags={['wheelchair']}
        pageTitle="Wheelchair Accessible Ramen Near Me"
        pageDescription="Showing ramen restaurants listed as wheelchair accessible. Enter your ZIP or use your location to find accessible spots near you."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Wheelchair Accessible Ramen Near Me" }]}
        title={`Wheelchair Accessible Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/ramen-wheelchair-accessible"
        heading="Finding Wheelchair Accessible Ramen Near Me"
        intro={[
          'Everyone deserves a great bowl of ramen without an obstacle course to get to the table. The map above is filtered to ramen restaurants near you that are listed as wheelchair accessible — typically meaning an accessible entrance and seating that can accommodate a wheelchair. Enter your ZIP or use your location to find the closest accessible spots and sort them by distance.',
          'Accessibility is one filter where I always recommend confirming the details directly with the restaurant before you make the trip. The reason is simple: "accessible" can mean very different things at different restaurants. One place may have a ramped entrance but a restroom down a flight of stairs. Another may have table seating but aisles that are tight for a wider chair. A third may be fully ADA-compliant in every detail. The flag narrows the field significantly, but a phone call is the only reliable way to know whether a specific location actually works for your needs.',
          'I also want to be honest about something: accessibility data across restaurant listing platforms is imperfect. Some restaurants self-report; some information is crowd-sourced; some is gathered from third-party audits. The "wheelchair accessible" flag on this page is the best available signal that a place meets a baseline standard, but it is a starting point for research rather than a definitive guarantee. That is why this page is detailed about what to ask and how to confirm.',
          'Below I walk through what the accessibility flag typically covers, what it often misses, how to confirm the specific details that matter for your visit, and how to combine filters to find a spot that works smoothly for everyone in your group.',
        ]}
        sections={[
          {
            h2: 'What "wheelchair accessible" usually means here',
            body: (
              <p>
                The accessibility flag is sourced from each restaurant's listed amenities and most often
                indicates a step-free or ramped entrance and seating that can accommodate a wheelchair. In
                practice, this means you are unlikely to face stairs at the front door, and the restaurant
                has at least some table seating rather than exclusively high counters. What the flag does not
                always specify is the finer detail — restroom accessibility, table heights, aisle width,
                accessible parking in the lot, or whether the staff are trained and willing to assist with
                any specific needs. These details can vary enormously from one restaurant to the next, and
                they are always worth confirming before the visit.
              </p>
            ),
            points: [
              { h3: 'Entrance', text: 'Usually a step-free or ramped way in is what this flag signals most reliably. Older buildings, basement-level spots, and restaurants in historic districts are the ones most likely to have a step or lip at the entrance, and this filter helps rule those out or at least flag them for a confirmatory call.' },
              { h3: 'Seating', text: 'Table seating at a standard height is generally far easier to accommodate than a high sushi counter or a traditional ramen counter stool. If you need a specific table height, clearance for a wheelchair footrest, or space alongside a table rather than a booth, mention this when you call ahead — most restaurants can accommodate with a little notice.' },
              { h3: 'Restrooms and parking', text: 'Restroom accessibility and accessible parking are not always captured by the flag. If either matters for your visit, call ahead and ask specifically about both. Accessible parking in the lot and an ADA restroom are not guaranteed even at a restaurant that passes the basic entrance-and-seating threshold.' },
            ],
          },
          {
            h2: 'How I confirm before going',
            body: (
              <p>
                My process is simple and takes less than two minutes. I open the restaurant's listing, find
                the phone number, and call with a short, specific list of questions: Is the entrance step-free?
                Is there table seating available, and what is the table height? Is the restroom accessible? Is
                there accessible parking in the lot or nearby? Is there room to navigate the dining room in a
                wheelchair? Restaurants that genuinely prioritize accessibility will answer these questions
                without hesitation and will often volunteer additional helpful information. The call also
                gives you the chance to make a reservation if the place takes them, which means you can ask
                for a specific table placement that works best for your needs.
              </p>
            ),
            points: [
              { h3: 'Ask specific questions', text: 'Vague questions get vague answers. Asking "are you accessible?" gets a yes or no; asking "is there a step at the front door?" and "is the restroom on the same floor as the dining room?" gets you the actual information you need to make a decision.' },
              { h3: 'Book ahead and note your needs', text: 'At restaurants that take reservations, booking ahead and noting your seating requirements means the staff can prepare a table that works before you arrive rather than scrambling when you walk in. Stack the "Takes Reservations" filter with this one to find spots where this is possible.' },
              { h3: 'Visit off-peak when possible', text: 'A quieter dining room means more space to navigate, less ambient noise, and more attentive staff. Going at lunch on a weekday or early for dinner on a weeknight rather than peak Saturday service makes a meaningful difference in how smoothly the visit goes.' },
            ],
          },
          {
            h2: 'Making the visit smooth',
            body: (
              <p>
                Going a little outside peak hours usually means more physical space to move through the dining
                room and a calmer atmosphere overall. If you want a guaranteed, well-placed table, stack the
                "Takes Reservations" filter with this one and mention any seating needs when you book — even a
                simple note that says "we need table seating with room for a wheelchair alongside it" is enough
                for most restaurants to prepare appropriately. And if parking is a factor, stacking the
                "Free Parking" filter helps narrow to spots with their own lot, which typically means you can
                park close to the entrance rather than walking a distance from a public garage.
              </p>
            ),
            points: [
              { h3: 'Arrive slightly early', text: 'Arriving a few minutes before your reservation or at the start of a service period gives the staff time to get your table set correctly without any rush, and gives you time to assess the space and ask any remaining questions before the meal begins.' },
              { h3: 'Pair with Free Parking', text: 'Getting from the car to the restaurant entrance is the first accessibility consideration, not the last. The "Free Parking" filter helps surface spots with their own lot, which usually means a shorter and more predictable walk from the car to the door.' },
              { h3: 'Communicate your needs to the staff', text: 'Restaurant staff can almost always accommodate specific seating and service needs when they know what they are. I find that being direct and friendly about what would make the visit work well almost always gets a helpful response — most people working in hospitality genuinely want guests to have a good experience.' },
            ],
          },
          {
            h2: 'Why accessible ramen matters',
            body: (
              <p>
                Ramen, more than almost any other food culture I know, is communal and convivial at its core.
                The counter seat, the shared table, the steam rising over a crowded room — these experiences
                should be available to everyone, not just people who can navigate a flight of stairs or squeeze
                through a narrow aisle. Good accessibility is a sign that a restaurant is thinking carefully
                about all of its guests, and in my experience, places that take accessibility seriously also tend
                to take hospitality seriously in every other way. Finding accessible ramen spots is not just
                about logistics — it is about finding restaurants that genuinely welcome everyone.
              </p>
            ),
          },
        ]}
        tipsHeading="My accessibility tips"
        tips={[
          'Filter to "Wheelchair Accessible," then sort by distance for the nearest options — this gives you a strong starting list, but treat it as the beginning of your research rather than the final answer.',
          'Call ahead to confirm the entrance, restroom, and parking before you make the trip — the flag does not always cover all three, and a 60-second call removes all the guesswork.',
          'Ask specific questions rather than a general "are you accessible?" — specific questions like "is there a step at the front door?" or "is the restroom on the same floor?" get you actual useful information.',
          'Visit slightly off-peak for more room to navigate the dining room and more attentive staff — a quieter service period makes a meaningful difference in the overall experience.',
          'Stack "Takes Reservations" to lock in a well-placed table and mention your seating needs when you book — most restaurants can accommodate with a little notice.',
          'Add "Free Parking" if getting from the car to the door is a factor — a restaurant with its own lot usually means a shorter, more predictable walk to the entrance.',
          'Arrive a few minutes early so the staff can get your table set correctly without any rush and you have time to assess the space.',
          'Restaurants that answer accessibility questions without hesitation and volunteer helpful information are usually the ones that genuinely prioritize it in practice.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants are wheelchair accessible near me?', a: 'The map above is filtered to spots listed as wheelchair accessible. Enter your ZIP or tap "Use my location" to find them nearby sorted by distance. Use this as your starting list and call ahead to confirm the specific details that matter for your visit.' },
          { q: 'What does wheelchair accessible mean for these listings?', a: 'It generally means a step-free or ramped entrance and seating that can accommodate a wheelchair — typically table seating rather than exclusively a high counter. Details like restroom accessibility, table clearance, aisle width, and accessible parking are not always captured by the flag and should be confirmed directly with the restaurant.' },
          { q: 'How can I confirm accessibility before visiting?', a: 'Call the restaurant with a specific list of questions: Is the entrance step-free? Is there table seating? Is the restroom accessible and on the same floor? Is there accessible parking nearby? Specific questions get specific answers. Restaurants that take accessibility seriously will answer readily and often volunteer additional helpful details.' },
          { q: 'Are ramen counters or tables better for accessibility?', a: 'Table seating is generally much easier to accommodate than a high ramen counter stool. If you need clearance for a wheelchair footrest, room to sit alongside a table rather than in a booth, or a specific table height, mention these needs when you call ahead or book — most restaurants can accommodate with advance notice.' },
          { q: 'Can I reserve an accessible table for ramen?', a: 'At spots that take reservations, yes — and booking ahead is strongly recommended for accessibility needs. Stack the "Takes Reservations" filter with this one to find restaurants where you can book, then note your seating requirements when you make the reservation so the staff can prepare accordingly.' },
          { q: 'Is the accessibility data on these listings reliable?', a: 'It is the best available signal, but it is not a guarantee. Restaurant accessibility data is self-reported, crowd-sourced, or gathered from third-party reviews, and the quality varies. Treat the filter as a starting point that meaningfully narrows the field, and confirm the specific details that matter for your visit by calling the restaurant directly.' },
          { q: 'What should I ask when I call a ramen restaurant about accessibility?', a: 'Ask specifically: Is there a step or ramp at the entrance? Are there accessible restrooms on the same floor as the dining room? Is there accessible parking in the lot? Is there enough aisle space for a wheelchair in the dining room? Do you have table seating rather than exclusively counter seating? These questions cover the most common access points and will get you the information you need.' },
          { q: 'How does visiting off-peak help with accessibility?', a: 'A quieter dining room means more physical space to navigate through the aisles without squeezing past other diners, more attentive staff who have time to assist, and a calmer atmosphere overall. Lunch on a weekday or early dinner on a weeknight tends to be significantly more comfortable than peak Saturday service for any visit where space and staff attention matter.' },
        ]}
      />
    </main>
  )
}
