import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chicken Katsu Ramen Near Me | Crispy Katsu Ramen | RamenNearYou',
  description: 'Find chicken katsu ramen near you — crispy panko-fried chicken cutlet over a hot bowl of ramen. What chicken katsu ramen is, what broth pairs best, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/chicken-katsu-ramen' },
  openGraph: {
    title: 'Chicken Katsu Ramen Near Me',
    description: 'Find crispy chicken katsu ramen near you.',
    url: 'https://www.ramennearyou.com/find/chicken-katsu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ChickenKatsuRamenPage() {
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
          pageTitle="Chicken Katsu Ramen Near Me"
          pageDescription="Showing ramen restaurants near you. Enter your ZIP or use your location to find a spot serving crispy chicken katsu ramen."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/chicken-katsu-ramen"
        heading="How I Find Chicken Katsu Ramen Near Me"
        intro={[
          'Chicken katsu ramen is the best of two comfort foods in one bowl — a crispy, panko-fried chicken cutlet laid over hot noodles and broth. The map above shows ramen restaurants near you; enter your ZIP or tap “Use my location,” then open a few listings to find the shops serving katsu.',
          'It is a crowd-pleaser, especially for anyone easing into ramen, because the crunchy chicken is familiar and satisfying. Here is what makes a great bowl and how I track it down.',
        ]}
        sections={[
          {
            h2: 'What is chicken katsu ramen?',
            body: (
              <p>
                Katsu means a breaded, deep-fried cutlet. Chicken katsu ramen tops a standard ramen bowl with a
                crispy panko-crusted chicken cutlet, usually sliced so the crust stays crunchy above the broth
                while the noodles soak below. It is a modern, hearty twist on classic ramen rather than a
                centuries-old style — and it has become a menu favorite across the US.
              </p>
            ),
            points: [
              { h3: 'Crispy panko crust', text: 'The hallmark — a light, crunchy coating that holds up when it meets the broth.' },
              { h3: 'A rich broth to match', text: 'Tonkotsu or a creamy chicken paitan pairs best, standing up to the fried cutlet.' },
              { h3: 'Served crust-up', text: 'Good shops rest the katsu on top so it stays crisp until you dunk it.' },
            ],
          },
          {
            h2: 'What broth pairs best with chicken katsu',
            body: (
              <p>
                I go for a richer broth with katsu — creamy tonkotsu or a chicken paitan gives the fried cutlet
                something substantial to sit in. A lighter shio or shoyu works too if you want the crunch to be
                the star. Use the broth filters above to match the bowl to your mood.
              </p>
            ),
          },
          {
            h2: 'How to order it so it stays crispy',
            body: (
              <p>
                The trick with any katsu ramen is timing. Eat the cutlet earlier rather than later, dipping each
                bite into the broth instead of letting the whole piece soak. That keeps the crust crunchy and the
                noodles at the perfect firmness — the contrast is the whole point.
              </p>
            ),
          },
        ]}
        tipsHeading="My chicken katsu ramen tips"
        tips={[
          'Look for shops that serve the katsu on top of the bowl so the crust stays crisp.',
          'Pair katsu with a rich tonkotsu or chicken paitan broth for the most satisfying bowl.',
          'Dip the cutlet bite by bite instead of letting it soak, to keep the crunch.',
          'Read recent reviews and photos for a thick, golden, freshly fried cutlet.',
          'It is a great gateway bowl — order it for friends new to ramen.',
        ]}
        faqs={[
          { q: 'What is chicken katsu ramen?', a: 'Chicken katsu ramen is a ramen bowl topped with a crispy, panko-breaded fried chicken cutlet over noodles and broth — a hearty, modern twist on classic ramen.' },
          { q: 'How do I find chicken katsu ramen near me?', a: 'Use the map above — enter your ZIP or tap “Use my location,” then open nearby listings to find shops serving chicken katsu ramen.' },
          { q: 'What broth goes best with chicken katsu?', a: 'A rich broth like tonkotsu or creamy chicken paitan pairs best, giving the fried cutlet something substantial to sit in. Lighter shio or shoyu also works if you want the crunch to stand out.' },
          { q: 'How do I keep the katsu from getting soggy?', a: 'Eat the cutlet earlier in the meal and dip it bite by bite rather than letting the whole piece soak in the broth.' },
          { q: 'Is chicken katsu ramen good for ramen beginners?', a: 'Yes — the familiar crispy fried chicken makes it an approachable, crowd-pleasing introduction to ramen.' },
        ]}
      />
    </main>
  )
}
