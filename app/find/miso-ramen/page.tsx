import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Miso Ramen Near Me | Hearty Sapporo-Style Ramen | RamenNearYou',
  description: 'Find miso ramen near you — the hearty, fermented-soybean broth from Sapporo. What makes great miso ramen, what to order, and how it compares to other styles.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/miso-ramen' },
  openGraph: {
    title: 'Miso Ramen Near Me',
    description: 'Find hearty, savory miso ramen near you.',
    url: 'https://www.ramennearyou.com/find/miso-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function MisoRamenPage() {
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
          initialBowls={['miso']}
          pageTitle="Miso Ramen Near Me"
          pageDescription="Showing miso ramen near you. Enter your ZIP or use your location to find a hearty, savory bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/miso-ramen"
        heading="How I Find Hearty Miso Ramen Near Me"
        intro={[
          'When I want a bowl that feels like a warm hug, miso ramen is what I reach for. That deep, savory, slightly sweet broth built on fermented soybean paste is the most full-bodied of the classic styles, and it is incredible on a cold day. The map above is filtered to miso ramen near you — enter your ZIP or use your location to find the closest bowl.',
          'Miso ramen has a specific origin and a specific personality, and knowing both makes it easier to order well. Here is what defines it, what to look for, and the toppings that make it sing.',
        ]}
        sections={[
          {
            h2: 'What miso ramen is all about',
            body: (
              <p>
                Miso ramen comes from Sapporo, on the northern island of Hokkaido, where the cold winters call
                for something rich and warming. The broth is seasoned with miso (fermented soybean paste),
                which gives it a thick, savory, umami-packed body with a touch of natural sweetness. It is often
                built on a pork or chicken base and finished with ground pork, corn, butter, and bean sprouts —
                a combination that is pure comfort.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Thick, savory, and slightly sweet from the miso, with more body than shoyu or shio but a different richness than tonkotsu.' },
              { h3: 'Classic toppings', text: 'Ground pork, sweet corn, a pat of butter, bean sprouts, and scallion — the Sapporo signature combination.' },
              { h3: 'The noodles', text: 'Usually thicker, curlier noodles that grab the hearty broth and stand up to the toppings.' },
            ],
          },
          {
            h2: 'Spicy miso and other variations',
            body: (
              <p>
                One of my favorite things about miso ramen is how well it takes to heat. Spicy miso (kara miso)
                adds chili paste or oil for a warming kick that plays beautifully against the broth’s natural
                sweetness — if you like a little fire, look for it. The corn-and-butter version (a Hokkaido
                classic) leans the other way, rich and almost comforting-sweet. Both are worth trying.
              </p>
            ),
          },
          {
            h2: 'How I order miso ramen',
            body: (
              <p>
                I go for the corn and butter when I want pure comfort, or the spicy miso when I want something
                with a kick. A soft egg is a must, and the thicker noodles mean I do not need to rush. If a shop
                is known for its miso specifically, I trust them to have dialed in the balance of salt,
                sweetness, and umami that makes or breaks the style.
              </p>
            ),
          },
        ]}
        tipsHeading="My miso ramen tips"
        tips={[
          'Filter to “Miso,” then sort by distance for the nearest hearty bowl.',
          'Try the corn-and-butter Sapporo classic for pure comfort.',
          'Love heat? Look for spicy miso (kara miso) — the sweetness balances the chili beautifully.',
          'Add a soft egg; the thick, curly noodles mean you can take your time.',
          'Stack “Top Rated” to find the best-reviewed miso ramen near you.',
        ]}
        faqs={[
          { q: 'What is miso ramen?', a: 'Miso ramen is built on a broth seasoned with fermented soybean paste (miso). Originating in Sapporo, Hokkaido, it is rich, savory, and slightly sweet, often topped with corn, butter, bean sprouts, and ground pork.' },
          { q: 'Is miso ramen spicy?', a: 'Classic miso ramen is savory rather than spicy, but spicy miso (kara miso) adds chili paste or oil for heat. Many shops offer both versions.' },
          { q: 'How is miso ramen different from tonkotsu?', a: 'Miso gets its body and flavor from fermented soybean paste, giving a savory-sweet profile, while tonkotsu is a creamy broth from long-simmered pork bones. Miso also tends to use thicker, curlier noodles.' },
          { q: 'Is miso ramen vegetarian?', a: 'Not usually — most miso broths use a pork or chicken base and ground-pork topping. Some shops offer a vegetarian or vegan miso, which adapts well to a vegetable base; confirm before ordering.' },
          { q: 'How do I find miso ramen near me?', a: 'The map above is filtered to miso. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
