import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shio Ramen Near Me | Light Salt-Based Ramen | RamenNearYou',
  description: 'Find shio ramen near you — the delicate, salt-seasoned broth that is the lightest classic style. What shio ramen is, how to order it, and how to spot a great one.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shio-ramen' },
  openGraph: {
    title: 'Shio Ramen Near Me',
    description: 'Find light, delicate shio (salt) ramen near you.',
    url: 'https://www.ramennearyou.com/find/shio-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ShioRamenPage() {
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
          initialBowls={['shio']}
          pageTitle="Shio Ramen Near Me"
          pageDescription="Showing shio (salt) ramen near you. Enter your ZIP or use your location to find a light, delicate bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/shio-ramen"
        heading="Where I Find Delicate Shio Ramen Near Me"
        intro={[
          'Shio is the quiet master of the ramen world. It is the lightest of the classic styles — a clear, salt-seasoned broth that lets the quality of the stock shine through with almost nothing to hide behind. The map above is filtered to shio ramen near you; enter your ZIP or use your location to find the closest delicate bowl.',
          'Shio rewards a careful palate and a careful kitchen. Here is what the style is, why it is harder to make well than it looks, and how I find a version worth seeking out.',
        ]}
        sections={[
          {
            h2: 'What shio ramen is',
            body: (
              <p>
                Shio means “salt,” and that is the seasoning at the heart of the bowl. Instead of soy or miso,
                the tare is salt-based, producing the clearest, most delicate broth of the classic styles. It
                is usually built on a clean chicken, seafood, or pork stock, and served with thinner, straighter
                noodles. The result is light, savory, and pure — the broth tastes like exactly what went into it.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Clear and pale, the lightest classic style, seasoned with salt so the underlying stock takes center stage.' },
              { h3: 'The base', text: 'Often chicken or seafood for a clean, elegant flavor; some shops use a dashi-forward stock for extra depth.' },
              { h3: 'The toppings', text: 'Kept simple and refined — chashu, scallion, menma, and sometimes yuzu or a slice of citrus for brightness.' },
            ],
          },
          {
            h2: 'Why shio is harder than it looks',
            body: (
              <p>
                Because there is no soy or miso to mask anything, every flaw shows. A great shio broth has to be
                built on a genuinely excellent stock, balanced so precisely that it tastes clean and savory at
                once. That is why shio is often where I judge a refined, technique-driven shop — if their shio
                sings, they can do anything.
              </p>
            ),
          },
          {
            h2: 'Who should order shio',
            body: (
              <p>
                Shio is for when I want something elegant rather than heavy — a clean, restorative bowl that
                does not weigh me down. It is perfect for lunch, for warmer days, and for anyone who appreciates
                subtlety over richness. Stack “Top Rated” to find the kitchens that have truly mastered this
                deceptively simple style.
              </p>
            ),
          },
        ]}
        tipsHeading="My shio ramen tips"
        tips={[
          'Filter to “Shio,” then sort by distance for the nearest delicate bowl.',
          'Judge it on the stock — shio has nowhere to hide, so the broth must taste clean and deeply savory.',
          'Great for lunch and warmer days when you want something light and restorative.',
          'Look for shops using chicken or seafood bases for the most elegant versions.',
          'Stack “Top Rated” to find kitchens that have mastered this subtle style.',
        ]}
        faqs={[
          { q: 'What is shio ramen?', a: 'Shio (“salt”) ramen is the lightest classic style — a clear, salt-seasoned broth, usually built on a clean chicken or seafood stock and served with thinner noodles. It is delicate, savory, and pure.' },
          { q: 'How is shio different from shoyu ramen?', a: 'Both are clear and light, but shio is seasoned with salt and shoyu with soy sauce. Shio is even more delicate and lets the underlying stock shine; shoyu has a deeper, soy-driven savoriness.' },
          { q: 'Is shio ramen healthy or light?', a: 'It is the lightest of the classic styles, with a clear broth and simple toppings. That makes it a great choice when you want something restorative rather than rich.' },
          { q: 'How can I tell if shio ramen is good?', a: 'Because there is no soy or miso to hide behind, a great shio depends entirely on the stock. It should taste clean, balanced, and deeply savory at the same time.' },
          { q: 'How do I find shio ramen near me?', a: 'The map above is filtered to shio. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
