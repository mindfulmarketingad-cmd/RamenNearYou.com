import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen Delivery Near Me | Order Ramen Delivered | RamenNearYou',
  description: 'Find ramen restaurants that deliver near you. Order tonkotsu, miso, shoyu, and tsukemen — plus my tips for ramen that survives the trip and tastes fresh at home.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-delivery' },
  openGraph: {
    title: 'Ramen Delivery Near Me',
    description: 'Find ramen restaurants that deliver near you — order tonkotsu, miso, shoyu, and more.',
    url: 'https://www.ramennearyou.com/find/ramen-delivery',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenDeliveryPage() {
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
          initialFlags={['delivers']}
          pageTitle="Ramen Delivery Near Me"
          pageDescription="Find ramen restaurants that deliver near you. Enter your ZIP code to browse spots in your area — many offer pickup too."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-delivery"
        heading="How I Order Ramen Delivery That Still Tastes Great at Home"
        intro={[
          'I love ramen, but I do not always want to put on real pants for it. The good news is that ramen delivery has gotten dramatically better over the last few years, and the map above is filtered to spots near you that actually offer it. Enter your ZIP code or tap “Use my location” and I will sort the closest delivering restaurants to the top.',
          'After ordering a lot of ramen to my couch, I have learned that the restaurant you pick matters just as much as the bowl. Some kitchens are built for delivery and pack everything to survive the trip; others assume you are eating in and the noodles arrive sad. Below is exactly what I look for, plus how to keep your delivery bowl tasting like it was made to order.',
        ]}
        sections={[
          {
            h2: 'What makes a ramen shop good at delivery',
            body: (
              <p>
                The single biggest factor is packaging. Ramen is assembled to be eaten within minutes, so
                the shops that travel well are the ones that break the bowl into parts — hot broth in one
                sealed container, noodles in another, toppings kept separate — and let you combine
                everything at home. When I see a restaurant that does this, I order from them again and
                again, because the bowl I get on my kitchen counter is nearly identical to the one at the bar.
              </p>
            ),
            points: [
              { h3: 'Separated components', text: 'Broth, noodles, and toppings packed apart means the noodles are not sitting in hot liquid for 30 minutes turning to mush. This one detail is the difference between a great delivery bowl and a soggy one.' },
              { h3: 'Noodle style', text: 'Thicker, wavier noodles hold their bite far longer than thin, straight Hakata-style strands. If a shop only does ultra-thin noodles, I either eat in or order their brothless options instead.' },
              { h3: 'Distance and timing', text: 'I try to order from places within about 15 minutes of me. The shorter the trip, the hotter the broth and the firmer the noodles when it lands.' },
            ],
          },
          {
            h2: 'The best ramen styles to order for delivery',
            body: (
              <p>
                If a bowl is going to ride in a bag, I lean toward styles that are forgiving. Brothless
                ramen is the obvious winner because there is no soup for the noodles to drown in, but a few
                soup styles travel well too when they are packed right.
              </p>
            ),
            points: [
              { h3: 'Mazemen and tsukemen', text: 'Both keep noodles and liquid separate by design, so they arrive almost exactly as intended. These are my default delivery orders when a shop offers them.' },
              { h3: 'Tonkotsu and miso', text: 'Rich, fatty broths hold heat better than light, clear ones, so they stay hot longer in transit. Just make sure the noodles are bagged separately.' },
              { h3: 'Shio and light shoyu', text: 'Delicate, clear broths cool the fastest and the thin noodles soak quickly — I save these for dining in.' },
            ],
          },
          {
            h2: 'How to assemble and revive a delivery bowl',
            body: (
              <p>
                A two-minute reheat makes a huge difference. When the bag arrives, I microwave the broth for
                30 to 60 seconds until it is steaming, give the noodles a quick loosen, then pour the hot
                broth over the noodles and add toppings last so they stay fresh. If the broth and noodles
                came pre-combined and the noodles feel soft, a splash of boiling water and a fresh squeeze of
                whatever chili oil or aromatics came on the side brings the bowl back to life.
              </p>
            ),
          },
        ]}
        tipsHeading="My ramen delivery cheat sheet"
        tips={[
          'Filter the map to “Delivers,” then sort by distance — closer almost always means a better bowl.',
          'Check the listing for separated packaging notes or call and ask; it is the #1 predictor of quality.',
          'Default to mazemen or tsukemen when available — they are basically built for delivery.',
          'Reheat the broth until steaming before combining; lukewarm broth is the most common delivery letdown.',
          'Add a soft egg, nori, or scallions yourself at home so the toppings taste fresh, not steamed.',
        ]}
        faqs={[
          { q: 'Can you actually get good ramen delivered?', a: 'Yes. The key is ordering from shops that pack broth, noodles, and toppings separately so the noodles do not over-soak in transit. Reheat the broth until steaming, combine at home, and it tastes close to dine-in.' },
          { q: 'Which ramen travels best for delivery?', a: 'Brothless styles like mazemen and tsukemen travel best because the noodles and liquid stay separate. Among soup styles, rich tonkotsu and miso hold heat better than light shio or delicate shoyu.' },
          { q: 'How do I find ramen delivery near me?', a: 'Use the map above — it is filtered to restaurants that offer delivery. Enter your ZIP or tap “Use my location,” then open any listing to confirm delivery and order. You can also check DoorDash, Uber Eats, or Grubhub for the same spots.' },
          { q: 'Why do my delivery noodles get mushy?', a: 'Because they sat in hot broth during the trip. Order from shops that bag noodles separately, choose thicker noodle styles, and pick a restaurant close to you to shorten transit time.' },
          { q: 'Is delivery ramen more expensive than dine-in?', a: 'Usually slightly, once you add delivery fees and tip. Ordering directly from the restaurant’s own site or app, when available, often costs less than third-party platforms and supports the shop more.' },
        ]}
      />
    </main>
  )
}
