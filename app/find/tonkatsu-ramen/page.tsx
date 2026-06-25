import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tonkatsu Ramen Near Me | Crispy Pork Cutlet Ramen | RamenNearYou',
  description: 'Find tonkatsu ramen near you — a hot bowl of ramen topped with a crispy, panko-breaded pork cutlet. Browse nearby ramen spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tonkatsu-ramen' },
  openGraph: {
    title: 'Tonkatsu Ramen Near Me',
    description: 'Find ramen topped with a crispy panko pork cutlet, near you.',
    url: 'https://www.ramennearyou.com/find/tonkatsu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TonkatsuRamenPage() {
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
          pageTitle="Tonkatsu Ramen Near Me"
          pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap “Use my location,” then open nearby listings to find spots serving tonkatsu (crispy pork cutlet) ramen."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/tonkatsu-ramen"
        heading="How I Find Tonkatsu Ramen Near Me"
        intro={[
          'Tonkatsu ramen is comfort food turned up a notch — a hot bowl of ramen crowned with a crispy, panko-breaded pork cutlet. The contrast of the crunchy cutlet against the rich broth is what makes it so satisfying. The map above shows ramen restaurants near you, and below I explain how to track down the ones serving a proper katsu bowl.',
          'A quick but important note: tonkatsu (the crispy pork cutlet) is not the same as tonkotsu (the creamy pork-bone broth). Here is how to find the cutlet version.',
        ]}
        sections={[
          {
            h2: 'What is tonkatsu ramen?',
            body: (
              <p>
                Tonkatsu ramen tops a bowl of ramen with tonkatsu — a pork cutlet that has been breaded in panko
                and deep-fried until golden and crisp. The cutlet is usually sliced and laid over the noodles so it
                stays crunchy above the broth. It pairs especially well with a rich tonkotsu or chicken paitan base,
                which gives the fried pork something substantial to sit in. It is a hearty, modern, crowd-pleasing
                twist on a classic bowl.
              </p>
            ),
            points: [
              { h3: 'Crispy panko cutlet', text: 'A pork cutlet breaded in panko and fried until golden, sliced over the noodles.' },
              { h3: 'Rich broth pairing', text: 'Best over a creamy tonkotsu or chicken paitan base that stands up to the fried pork.' },
              { h3: 'Served crunchy', text: 'The cutlet sits on top so it keeps its crunch instead of going soggy in the broth.' },
            ],
          },
          {
            h2: 'Tonkatsu vs. tonkotsu — do not mix them up',
            body: (
              <p>
                The names are one letter apart but mean different things. Tonkatsu is the breaded, deep-fried pork
                cutlet (also the star of katsu curry and katsu sando). Tonkotsu is the rich, milky pork-bone broth
                from Fukuoka. Tonkatsu ramen often uses a tonkotsu broth, so you can absolutely have both in one
                bowl — but when you search, make sure you are getting the crispy cutlet you are after.
              </p>
            ),
          },
          {
            h2: 'How to find tonkatsu ramen nearby',
            body: (
              <p>
                Use the map to see ramen spots near you, then check the menu for katsu, tonkatsu, or “pork cutlet
                ramen.” Shops that serve katsu curry or katsu don often offer a katsu ramen too, and chicken katsu
                ramen is a common cousin if you prefer poultry. Recent reviews and photos showing a breaded cutlet
                on top are the clearest confirmation.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for tonkatsu ramen"
        tips={[
          'Search the menu for “katsu” or “pork cutlet” — not “tonkotsu,” which is the broth.',
          'Shops that serve katsu curry or katsu don usually do a katsu ramen too.',
          'Order it over a rich tonkotsu or chicken paitan broth for the best contrast.',
          'Eat the cutlet first while it is still crisp, before it softens in the broth.',
          'Prefer poultry? Look for chicken katsu ramen, a popular variation.',
        ]}
        faqs={[
          { q: 'What is tonkatsu ramen?', a: 'Tonkatsu ramen is a bowl of ramen topped with a crispy, panko-breaded and deep-fried pork cutlet, usually sliced over the noodles. It is often served over a rich tonkotsu or chicken paitan broth.' },
          { q: 'How do I find tonkatsu ramen near me?', a: 'Use the map above — enter your ZIP or tap “Use my location” — then check nearby menus and reviews for katsu or pork cutlet ramen. Photos showing a breaded cutlet on top are a good sign.' },
          { q: 'Is tonkatsu the same as tonkotsu?', a: 'No. Tonkatsu is a breaded, fried pork cutlet, while tonkotsu is a rich pork-bone broth. Tonkatsu ramen often uses a tonkotsu broth, so a single bowl can feature both.' },
          { q: 'What is the difference between tonkatsu and chicken katsu ramen?', a: 'Tonkatsu ramen uses a fried pork cutlet, while chicken katsu ramen uses a fried chicken cutlet. Both are panko-breaded and served crispy over the noodles.' },
        ]}
      />
    </main>
  )
}
