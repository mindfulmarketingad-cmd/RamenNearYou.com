import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import type { MapCard } from '@/components/blog-scroll-map'
import FindPageContent from '@/components/find-page-content'
import quebecData from '@/lib/places-quebec.json'

interface QuebecListing {
  placeId: string
  name: string
  address: string
  phone: string
  website: string
  rating: number | null
  reviewCount: number
  priceLevel: number | null
  photo: string | null
  latitude: number | null
  longitude: number | null
  openNow: boolean | null
  type: string
  googleMapsUrl: string
}

const listings = quebecData as QuebecListing[]

export const metadata: Metadata = {
  title: 'Ramen in Quebec | Best Ramen Restaurants in Quebec | RamenNearYou',
  description: `Find ramen in Quebec — ${listings.length} ramen restaurants across Montreal, Quebec City, Laval, Gatineau and beyond, ranked by rating with maps, addresses, and directions.`,
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-in-quebec' },
  openGraph: {
    title: 'Ramen in Quebec',
    description: 'Find the best ramen restaurants in Quebec, ranked by rating with maps and directions.',
    url: 'https://www.ramennearyou.com/find/ramen-in-quebec',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenInQuebecPage() {
  const cards: MapCard[] = listings.map((r, i) => ({
    rank: i + 1,
    slug: r.placeId,
    citySlug: '',
    stateSlug: '',
    name: r.name,
    rating: r.rating ?? 0,
    reviewCount: r.reviewCount ?? 0,
    address: r.address ?? '',
    phone: r.phone ?? '',
    description: '',
    photo: '',
    tags: r.type ? [r.type] : [],
    lat: r.latitude,
    lng: r.longitude,
    externalUrl: r.googleMapsUrl,
  }))

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Ramen Restaurants in Quebec',
    description: 'Top-rated ramen restaurants in Quebec, Canada',
    numberOfItems: listings.length,
    itemListElement: listings.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      url: r.googleMapsUrl,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Find Ramen', item: 'https://www.ramennearyou.com/find' },
      { '@type': 'ListItem', position: 3, name: 'Ramen in Quebec', item: 'https://www.ramennearyou.com/find/ramen-in-quebec' },
    ],
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/find" className="hover:text-[#1E2026] transition-colors">Find Ramen</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Ramen in Quebec</span>
          </nav>

          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Quebec, Canada</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">
            Ramen in Quebec
          </h1>
          <p className="text-[#6B6862] text-lg max-w-2xl">
            The best ramen restaurants across Quebec — from Montreal and Quebec City to Laval, Gatineau, and
            Longueuil. {listings.length} spots ranked by rating, with addresses, hours, and directions.
          </p>
        </div>
      </section>

      {/* Listings + map */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="flex items-center gap-1.5 text-[#1E2026] font-semibold text-sm mb-4">
            <MapPin className="w-4 h-4 text-[#B57F50]" />
            {listings.length} ramen restaurants in Quebec
          </p>
          <BlogScrollMapWrapper cards={cards} listHeading="The Best Ramen in Quebec" />
        </div>
      </section>

      <FindPageContent
        currentHref="/find/ramen-in-quebec"
        heading="Where to Find the Best Ramen in Quebec"
        intro={[
          'Quebec has quietly become one of Canada’s best ramen provinces. Montreal leads the way with a deep, competitive scene, but you’ll find serious bowls in Quebec City, Laval, Gatineau, and beyond. The map and list above show ramen restaurants across the province, ranked by rating so the best-reviewed spots rise to the top.',
          'Whether you’re after a rich Hakata-style tonkotsu in the Plateau, a clean shoyu downtown, or a late bowl after exploring Vieux-Québec, here’s how I’d approach finding ramen in Quebec.',
        ]}
        sections={[
          {
            h2: 'Ramen in Montreal',
            body: (
              <p>
                Montreal is the heart of Quebec’s ramen scene. The city has everything from dedicated
                Hakata tonkotsu counters to izakaya serving ramen alongside small plates and sake. The
                Plateau-Mont-Royal, Mile End, downtown (Centre-Ville), and Chinatown are the densest areas
                to find a good bowl. Expect lines at the most popular shops on weekends.
              </p>
            ),
            points: [
              { h3: 'Plateau & Mile End', text: 'Trendy, walkable neighborhoods with several well-rated ramen-ya and izakaya.' },
              { h3: 'Downtown & Chinatown', text: 'Convenient for visitors, with a cluster of Japanese and pan-Asian spots serving ramen.' },
            ],
          },
          {
            h2: 'Ramen beyond Montreal',
            body: (
              <p>
                You don’t have to be in Montreal for a great bowl. Quebec City pairs a growing ramen scene
                with its historic old town, Gatineau serves the Ottawa–Hull region, and Laval and Longueuil
                cover the suburbs north and south of Montreal. Use the map above to find the closest spot
                wherever you are in the province.
              </p>
            ),
          },
          {
            h2: 'How these listings are ranked',
            body: (
              <p>
                The restaurants above are sourced live from Google and sorted by rating and review count, so
                the most consistently loved spots appear first. Tap any card to open it on Google Maps for
                hours, the full menu, photos, and turn-by-turn directions. Hours change often, so it’s always
                worth a quick check before heading out.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for ramen in Quebec"
        tips={[
          'Start in Montreal’s Plateau or downtown for the highest concentration of well-rated shops.',
          'Go at off-peak hours — the best Montreal ramen-ya draw weekend lines.',
          'In Quebec City, pair a bowl with a walk through Vieux-Québec.',
          'Tap through to Google Maps to confirm current hours before you go.',
          'Order the house signature bowl on a first visit to judge the kitchen.',
        ]}
        faqs={[
          { q: 'Where can I find the best ramen in Quebec?', a: `The map and list above show ${listings.length} ramen restaurants across Quebec, ranked by rating. Montreal has the largest and most competitive scene, followed by Quebec City, Laval, Gatineau, and Longueuil.` },
          { q: 'What city in Quebec has the best ramen?', a: 'Montreal has the deepest ramen scene in Quebec, with everything from dedicated tonkotsu counters to izakaya. Quebec City is a strong second and growing fast.' },
          { q: 'Is there good ramen in Quebec City?', a: 'Yes. Quebec City has a growing number of well-rated ramen restaurants, many within easy reach of the historic old town (Vieux-Québec).' },
          { q: 'How do I get directions to a ramen spot in Quebec?', a: 'Tap any restaurant card above to open it on Google Maps, where you can see hours, the menu, photos, and turn-by-turn directions.' },
        ]}
      />
    </main>
  )
}
