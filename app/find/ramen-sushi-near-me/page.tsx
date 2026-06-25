import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen and Sushi Near Me | Japanese Restaurants With Both | RamenNearYou',
  description: 'Find ramen and sushi near you — Japanese restaurants and izakaya that serve hot bowls of ramen alongside fresh sushi and sashimi. Browse the best spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-sushi-near-me' },
  openGraph: {
    title: 'Ramen and Sushi Near Me',
    description: 'Find Japanese restaurants serving both ramen and sushi near you.',
    url: 'https://www.ramennearyou.com/find/ramen-sushi-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenSushiPage() {
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
          initialFlags={['ramen-sushi']}
          pageTitle="Ramen and Sushi Near Me"
          pageDescription="Showing Japanese restaurants that serve both ramen and sushi near you. Enter your ZIP or use your location to find one nearby, sorted by rating and distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-sushi-near-me"
        heading="How I Find Ramen and Sushi Near Me"
        intro={[
          'Sometimes I want the best of both worlds — a hot bowl of ramen and a plate of fresh sushi in one sitting. Plenty of Japanese restaurants and izakaya do exactly that, and the map above is filtered to the spots near you most likely to serve both. Enter your ZIP or tap “Use my location” and the closest options sort to the top.',
          'A full Japanese menu — ramen, sushi, sashimi, and small plates — is common at izakaya and larger Japanese restaurants. Here is how I find the ones that do both well rather than treating one as an afterthought.',
        ]}
        sections={[
          {
            h2: 'Where to find ramen and sushi together',
            body: (
              <p>
                The most reliable spots are full-service Japanese restaurants and izakaya (Japanese pubs), which
                build their menus around variety — noodles, raw fish, grilled skewers, and rice bowls all under one
                roof. Dedicated ramen-ya usually focus on noodles alone, while sushi bars focus on fish, so when you
                want both, a broader Japanese kitchen is your best bet.
              </p>
            ),
            points: [
              { h3: 'Izakaya', text: 'Japanese pubs are built for variety — ramen, sushi, sashimi, and small plates to share.' },
              { h3: 'Full Japanese restaurants', text: 'Larger sit-down spots often run a ramen kitchen and a sushi bar side by side.' },
              { h3: 'Hibachi & grill houses', text: 'Many serve ramen and sushi rolls alongside their grilled mains.' },
            ],
          },
          {
            h2: 'How to tell a spot does both well',
            body: (
              <p>
                I read the reviews and skim the photos before going. Look for praise of both the broth and the fish —
                not just one. A restaurant that names a real ramen style (tonkotsu, shoyu, miso) and lists a proper
                sushi menu is usually serious about both, rather than offering a token bowl or a few pre-made rolls.
              </p>
            ),
          },
          {
            h2: 'What to order on your first visit',
            body: (
              <p>
                I like to split the table: start with a few pieces of nigiri or a signature roll while the kitchen
                fires the ramen, then dig into the bowl while it is hot. It is the perfect way to sample a kitchen’s
                range and figure out whether you come back for the noodles, the fish, or both.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for ramen and sushi spots"
        tips={[
          'Search izakaya and full-service Japanese restaurants — they most often serve both ramen and sushi.',
          'Read reviews for praise of both the broth and the fish, not just one.',
          'Order the sushi first and eat the ramen while it is hot — noodles soften fast.',
          'Go with a group so you can share rolls, sashimi, and a couple of different bowls.',
          'Check the menu online ahead of time to confirm they run a real ramen kitchen, not just a token bowl.',
        ]}
        faqs={[
          { q: 'Where can I find ramen and sushi near me?', a: 'Use the map above — enter your ZIP or tap “Use my location.” It is filtered to Japanese restaurants and izakaya near you that are most likely to serve both ramen and sushi.' },
          { q: 'Do many restaurants serve both ramen and sushi?', a: 'Yes — full-service Japanese restaurants and izakaya commonly serve both, along with sashimi and small plates. Dedicated ramen shops and sushi bars tend to specialize in one.' },
          { q: 'What is an izakaya?', a: 'An izakaya is a casual Japanese pub that serves a wide range of food — including ramen, sushi, sashimi, and grilled skewers — alongside drinks, making it a great spot when you want variety.' },
          { q: 'How do I know if a spot does both well?', a: 'Read recent reviews and photos for praise of both the broth and the fish. A real ramen style on the menu plus a proper sushi list is a strong sign the kitchen takes both seriously.' },
          { q: 'Should I eat the ramen or sushi first?', a: 'Start with the sushi and eat the ramen while it is still hot — ramen noodles soften quickly, so the bowl is best enjoyed fresh from the kitchen.' },
        ]}
      />
    </main>
  )
}
