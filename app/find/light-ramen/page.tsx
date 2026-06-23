import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Light & Clean Ramen Near Me | Clear-Broth Bowls | RamenNearYou',
  description: 'Find light and clean ramen near you — clear, delicate broths that satisfy without weighing you down. The lightest styles to order and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/light-ramen' },
  openGraph: {
    title: 'Light & Clean Ramen Near Me',
    description: 'Find light, clean, clear-broth ramen near you.',
    url: 'https://www.ramennearyou.com/find/light-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function LightRamenPage() {
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
          initialMoods={['light-clean']}
          pageTitle="Light & Clean Ramen Near Me"
          pageDescription="Showing light, clean ramen near you. Enter your ZIP or use your location to find a delicate, clear-broth bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/light-ramen"
        heading="How I Find Light & Clean Ramen Near Me"
        intro={[
          'Not every ramen craving calls for a heavy bowl. Sometimes I want something light and clean — a clear, delicate broth that is deeply savory but leaves me feeling good, not weighed down. The map above is filtered toward light and clean ramen near you; enter your ZIP or use your location to find the closest bowl.',
          'Light does not mean less flavorful — the best clear broths are some of the most refined ramen out there. Here are the lightest styles to look for and how I order when I want something clean.',
        ]}
        sections={[
          {
            h2: 'The lightest ramen styles',
            body: (
              <p>
                The clean end of the ramen spectrum is built on clear (chintan) broths rather than creamy
                emulsified ones. Shio (salt) is the lightest and most delicate, letting a pristine stock shine.
                Shoyu (soy) is clear and savory with a touch more depth. A clear chicken or dashi-forward broth
                also keeps things elegant. These are the bowls that prove ramen can be restorative and refined,
                not just rich.
              </p>
            ),
            points: [
              { h3: 'Shio (salt)', text: 'The lightest classic style — a clear, salt-seasoned broth that highlights a clean, high-quality stock.' },
              { h3: 'Shoyu (soy)', text: 'Clear and savory with soy-driven depth; light on the palate but full of flavor.' },
              { h3: 'Clear chicken & dashi', text: 'Golden chintan and dashi-forward broths are elegant and soothing without any heaviness.' },
            ],
          },
          {
            h2: 'When a light bowl is the right call',
            body: (
              <p>
                I reach for light ramen at lunch when I do not want an afternoon slump, on warmer days when a
                heavy bowl feels like too much, and any time I want the comfort of ramen without the food coma.
                It is also the most forgiving style for a careful palate — clean and balanced rather than
                intense. Pair it with the “Ramen for Lunch” filter for a perfect midday bowl.
              </p>
            ),
          },
          {
            h2: 'How to spot a great clean broth',
            body: (
              <p>
                With a light broth, quality has nowhere to hide, so the tell is clarity and depth at the same
                time: the soup should look clean and taste like real stock and aromatics, savory without being
                salty or thin. Shops that specialize in shio or clear chicken broth are your best bet — when a
                kitchen builds its name on a delicate bowl, it usually means they have the technique to back it up.
              </p>
            ),
          },
        ]}
        tipsHeading="My light-ramen tips"
        tips={[
          'Filter to “Light & Clean,” then sort by distance for the nearest delicate bowl.',
          'Shio is the lightest classic style; shoyu and clear chicken are close behind.',
          'Great for lunch and warm days — stack “Ramen for Lunch” for a perfect midday bowl.',
          'Judge it on clarity plus depth: clean-looking broth that still tastes of real stock.',
          'Favor shops that specialize in shio or clear chicken broth for the best versions.',
        ]}
        faqs={[
          { q: 'What is light and clean ramen?', a: 'It is ramen built on a clear (chintan) broth rather than a creamy one — delicate, savory, and satisfying without being heavy. Shio, shoyu, and clear chicken or dashi broths are the lightest styles.' },
          { q: 'Which ramen is the lightest?', a: 'Shio (salt) ramen is the lightest and most delicate classic style, followed by shoyu (soy) and clear chicken or dashi-forward broths.' },
          { q: 'Is light ramen less flavorful?', a: 'No — the best clear broths are deeply savory and refined. Light refers to the body and feel, not the flavor; a great clean broth tastes of real stock and aromatics.' },
          { q: 'Is light ramen a good lunch?', a: 'Yes — a clean, clear bowl satisfies without the afternoon slump that a heavy bowl can cause, which makes it ideal for lunch and warmer days.' },
          { q: 'How do I find light ramen near me?', a: 'The map above is filtered toward light, clean bowls. Enter your ZIP or tap “Use my location,” and favor shops specializing in shio or clear chicken broth.' },
        ]}
      />
    </main>
  )
}
