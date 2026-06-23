import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

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

export default function IppudoRamenPage() {
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
          initialQuery="ippudo"
          pageTitle="IPPUDO Ramen Near Me"
          pageDescription="Find an IPPUDO ramen location near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ippudo-ramen"
        heading="How to Find IPPUDO Ramen Near Me"
        intro={[
          'IPPUDO is ramen royalty — founded in Hakata (Fukuoka) in 1985, it helped bring serious tonkotsu to the world stage, and its bowls are still a benchmark. The map above is set to find IPPUDO locations near you; enter your ZIP or use your location to see the closest one, plus what to order and where to go if there is no IPPUDO nearby.',
          'If you want to taste classic Hakata-style tonkotsu done by one of the names that made it famous, here is what to know.',
        ]}
        sections={[
          {
            h2: 'What IPPUDO is known for',
            body: (
              <p>
                IPPUDO is synonymous with Hakata-style tonkotsu: a rich, creamy pork-bone broth served with
                thin, firm, straight noodles. Its two signature bowls — Shiromaru Motoaji (the original, pure
                tonkotsu) and Akamaru Shinaji (finished with a special miso paste and fragrant garlic oil) — are
                the bowls to know. The setting is sleek and modern, and the buns and small plates are excellent too.
              </p>
            ),
            points: [
              { h3: 'Shiromaru Motoaji', text: 'The original — a clean, classic tonkotsu that shows off the broth at its purest.' },
              { h3: 'Akamaru Shinaji', text: 'The richer signature, finished with miso paste and aromatic garlic oil for extra depth.' },
              { h3: 'Hakata noodles', text: 'Thin, firm, straight noodles, often cooked to your chosen firmness — the classic tonkotsu pairing.' },
            ],
          },
          {
            h2: 'What to order at IPPUDO',
            body: (
              <p>
                First-timers should get the Akamaru Shinaji to taste IPPUDO at its most signature, or the
                Shiromaru if you want the purest tonkotsu. Order your noodles firm, add a seasoned egg, and do
                not skip the pork buns (hirata buns) — they are a highlight. If you finish your noodles and still
                have broth, ask whether kaedama (extra noodles) is available.
              </p>
            ),
          },
          {
            h2: 'No IPPUDO nearby? Where to go instead',
            body: (
              <p>
                IPPUDO locations are still fairly limited, so if there is not one near you, the map can find an
                excellent local tonkotsu shop instead. Clear the search and stack the “Tonkotsu” filter for the
                same rich, creamy style, and add “Top Rated” to surface the best-reviewed bowls around you —
                often hidden gems that rival the big names.
              </p>
            ),
          },
        ]}
        tipsHeading="My IPPUDO tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest IPPUDO, sorted by distance.',
          'Order the Akamaru Shinaji for the signature, or Shiromaru for pure tonkotsu.',
          'Ask for firm noodles and do not skip the pork (hirata) buns.',
          'If you still have broth, ask about kaedama — an extra noodle portion.',
          'No IPPUDO nearby? Clear the search and stack “Tonkotsu” + “Top Rated” for a local equal.',
        ]}
        faqs={[
          { q: 'What is IPPUDO known for?', a: 'IPPUDO is famous for Hakata-style tonkotsu — a rich, creamy pork-bone broth with thin, firm noodles. Its signature bowls are Shiromaru Motoaji (classic) and Akamaru Shinaji (with miso paste and garlic oil).' },
          { q: 'What should I order at IPPUDO?', a: 'Get the Akamaru Shinaji for the signature flavor or Shiromaru for pure tonkotsu. Order noodles firm, add a seasoned egg, and try the pork (hirata) buns.' },
          { q: 'What is the difference between Akamaru and Shiromaru?', a: 'Shiromaru Motoaji is the original, pure tonkotsu. Akamaru Shinaji is the richer version, finished with a special miso paste and fragrant garlic oil for added depth.' },
          { q: 'How do I find an IPPUDO near me?', a: 'The map above is set to find IPPUDO locations. Enter your ZIP or tap “Use my location” to see the closest ones sorted by distance.' },
          { q: 'What if there is no IPPUDO near me?', a: 'Clear the search and stack the “Tonkotsu” filter to find a local pork-bone specialist, then add “Top Rated” to surface the best-reviewed bowls nearby.' },
        ]}
      />
    </main>
  )
}
