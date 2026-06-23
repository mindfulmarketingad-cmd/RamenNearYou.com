import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chicken Ramen Near Me | Chicken Paitan & Tori Ramen | RamenNearYou',
  description: 'Find chicken ramen near you — creamy chicken paitan and clean tori broths. What chicken ramen is, how paitan differs from clear chicken broth, and what to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/chicken-ramen' },
  openGraph: {
    title: 'Chicken Ramen Near Me',
    description: 'Find creamy chicken paitan and chicken-broth ramen near you.',
    url: 'https://www.ramennearyou.com/find/chicken-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ChickenRamenPage() {
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
          initialBowls={['chicken-paitan']}
          pageTitle="Chicken Ramen Near Me"
          pageDescription="Showing chicken ramen near you. Enter your ZIP or use your location to find creamy chicken paitan and tori broths nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/chicken-ramen"
        heading="My Guide to Chicken Ramen Near Me"
        intro={[
          'Chicken ramen is one of the most underrated styles out there. Whether it is a creamy, luxurious chicken paitan or a clean, soulful tori broth, chicken delivers serious depth with a little less heaviness than pork. The map above is filtered to chicken ramen near you — enter your ZIP or use your location to find the closest bowl.',
          'If pork tonkotsu sometimes feels like too much, chicken is your answer. Here is how the styles differ, what to look for, and how I order chicken ramen.',
        ]}
        sections={[
          {
            h2: 'Chicken paitan vs. clear chicken broth',
            body: (
              <p>
                “Chicken ramen” covers two very different bowls. Paitan (tori paitan) is the creamy one — chicken
                bones simmered hard until the broth turns rich, opaque, and almost as luxurious as tonkotsu, but
                lighter and sweeter. Clear chicken broth (the chintan style) goes the other way: a clean,
                golden, deeply savory soup that is elegant and comforting. Both are fantastic; they just scratch
                different itches.
              </p>
            ),
            points: [
              { h3: 'Tori paitan', text: 'Creamy and full-bodied from long-simmered chicken bones — rich like tonkotsu but a touch lighter and naturally sweet.' },
              { h3: 'Clear chicken (chintan)', text: 'A clean, golden, savory broth that is elegant and soothing — chicken soup elevated to an art form.' },
              { h3: 'Toppings', text: 'Often chicken chashu, scallion, and a soft egg; some shops add yuzu or black pepper for brightness.' },
            ],
          },
          {
            h2: 'Why I love chicken ramen',
            body: (
              <p>
                Chicken hits a sweet spot: deeply savory and satisfying without the weight that can make a big
                tonkotsu a commitment. Paitan especially is my move when I want richness but still want to feel
                good afterward. It is also a great option if you do not eat pork, though it is worth confirming
                the tare and toppings are pork-free if that matters to you.
              </p>
            ),
          },
          {
            h2: 'How I order chicken ramen',
            body: (
              <p>
                For a creamy bowl I order the paitan with a soft egg and extra chicken chashu. For a lighter
                mood I go clear and let the clean broth do the talking. Either way, I look for shops that
                specialize in chicken — when a kitchen builds its identity around tori broth, it usually means
                they simmer it properly and the depth is real.
              </p>
            ),
          },
        ]}
        tipsHeading="My chicken ramen tips"
        tips={[
          'Filter to “Chicken Paitan,” then sort by distance for the nearest bowl.',
          'Want richness without the weight of pork? Paitan is your best bet.',
          'In a lighter mood? Seek out a clear chicken (chintan) broth instead.',
          'Add a soft egg and chicken chashu; look for yuzu or black pepper versions for brightness.',
          'Favor shops that specialize in chicken broth — they simmer it properly for real depth.',
        ]}
        faqs={[
          { q: 'What is chicken ramen?', a: 'Chicken ramen uses a chicken-based broth, either creamy chicken paitan (tori paitan) made by hard-simmering chicken bones, or a clean, golden clear chicken broth (chintan). Both are savory and satisfying.' },
          { q: 'What is chicken paitan?', a: 'Tori paitan is a creamy, opaque chicken broth made by simmering chicken bones until rich and full-bodied — similar in texture to tonkotsu but lighter and naturally a bit sweeter.' },
          { q: 'Is chicken ramen lighter than tonkotsu?', a: 'Generally yes. Even creamy paitan tends to feel a touch lighter and sweeter than pork tonkotsu, and clear chicken broth is lighter still.' },
          { q: 'Is chicken ramen pork-free?', a: 'It can be, but not always — some chicken bowls still use a pork-based tare or pork toppings. If you avoid pork, confirm the tare and toppings with the shop.' },
          { q: 'How do I find chicken ramen near me?', a: 'The map above is filtered to chicken ramen. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
