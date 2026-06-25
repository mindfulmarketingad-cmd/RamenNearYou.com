import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fish Ramen Near Me | Seafood & Gyokai Broth Ramen | RamenNearYou',
  description: 'Find fish ramen near you — bowls built on seafood broth (gyokai and niboshi) and topped with fish and shellfish. Discover seafood-forward ramen spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/fish-ramen-near-me' },
  openGraph: {
    title: 'Fish Ramen Near Me',
    description: 'Find seafood-broth and fish-topped ramen near you.',
    url: 'https://www.ramennearyou.com/find/fish-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function FishRamenPage() {
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
          initialFlags={['fish-ramen']}
          pageTitle="Fish Ramen Near Me"
          pageDescription="Showing seafood-forward ramen spots near you — bowls built on fish broth or topped with seafood. Enter your ZIP or use your location to find one nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/fish-ramen-near-me"
        heading="How I Find Fish Ramen Near Me"
        intro={[
          'Fish ramen is one of my favorite under-the-radar styles — a bowl where seafood does the heavy lifting, whether that is a deeply savory dried-fish broth or fresh seafood piled on top. The map above is filtered to seafood-forward ramen spots near you. Enter your ZIP or tap “Use my location” and the closest options sort to the top.',
          'Fish-based ramen goes by a few names and shows up in a few forms, so here is how I find the real seafood bowls and what to expect when I do.',
        ]}
        sections={[
          {
            h2: 'What is fish ramen?',
            body: (
              <p>
                Fish ramen leans on seafood for its flavor instead of pork or chicken. The classic version uses a
                gyokai (seafood) broth — often built on niboshi (dried sardines), bonito, kombu, or other dried
                fish — for a deep, savory, umami-rich stock. Other bowls keep a lighter base but top it with fresh
                fish or shellfish like shrimp, crab, scallop, or clams. Many shops also blend seafood with a pork or
                chicken base, a popular style called gyokai tonkotsu.
              </p>
            ),
            points: [
              { h3: 'Gyokai (seafood) broth', text: 'A savory stock built on dried fish like niboshi (sardines), bonito, and kombu.' },
              { h3: 'Seafood toppings', text: 'Shrimp, crab, scallop, clams, or fresh fish over the noodles.' },
              { h3: 'Gyokai tonkotsu', text: 'A blended broth that combines seafood depth with creamy pork richness.' },
            ],
          },
          {
            h2: 'How to find a real seafood bowl',
            body: (
              <p>
                Because fish ramen is a niche, I read the menu and reviews before going. Look for words like gyokai,
                niboshi, seafood, or specific fish and shellfish on the menu — and recent reviews that praise the
                broth’s depth. Japanese restaurants, izakaya, and shops that also serve sushi are the most likely to
                run a true seafood ramen.
              </p>
            ),
          },
          {
            h2: 'What to order on your first visit',
            body: (
              <p>
                I start with the house seafood or gyokai bowl to taste what the kitchen is proud of. If they offer a
                niboshi ramen, that is the purest expression of the style — bold, briny, and unmistakably fishy in
                the best way. Eat it hot and fast, before the delicate broth cools and the noodles soften.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for fish ramen"
        tips={[
          'Scan the menu for gyokai, niboshi, or seafood — the clearest sign of a true fish broth.',
          'Try the niboshi bowl if they have one; it is the boldest, most authentic seafood ramen.',
          'Check shops that also serve sushi — they often run a proper seafood ramen.',
          'Read recent reviews for praise of the broth’s depth, not just the toppings.',
          'Eat it hot — delicate seafood broths fade fast once they cool.',
        ]}
        faqs={[
          { q: 'What is fish ramen?', a: 'Fish ramen is a bowl that gets its flavor from seafood — usually a gyokai (seafood) broth built on dried fish like niboshi (sardines), bonito, and kombu, or a bowl topped with fresh fish and shellfish.' },
          { q: 'How do I find fish ramen near me?', a: 'Use the map above — enter your ZIP or tap “Use my location.” It is filtered to seafood-forward ramen spots near you, sorted by rating and distance. Check menus and reviews for gyokai or niboshi to confirm a true seafood bowl.' },
          { q: 'What is gyokai ramen?', a: 'Gyokai means “seafood” in Japanese. Gyokai ramen is built on a broth made from dried fish and seaweed — like niboshi, bonito, and kombu — for a deep, savory, umami-rich flavor.' },
          { q: 'What is niboshi ramen?', a: 'Niboshi ramen uses a broth made from dried baby sardines, giving it a bold, briny, intensely savory taste. It is one of the purest expressions of seafood-based ramen.' },
          { q: 'Is fish ramen healthy?', a: 'Seafood broths tend to be lighter and lower in fat than rich pork styles, though they can still be high in sodium. A clear gyokai or niboshi bowl is generally on the lighter end of ramen.' },
        ]}
      />
    </main>
  )
}
