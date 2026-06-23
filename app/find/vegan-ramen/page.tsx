import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vegan Ramen Near Me | Plant-Based Ramen | RamenNearYou',
  description: 'Find vegan ramen near you — fully plant-based broths and toppings with serious umami. What makes great vegan ramen, what to ask, and how it differs from vegetarian.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/vegan-ramen' },
  openGraph: {
    title: 'Vegan Ramen Near Me',
    description: 'Find fully plant-based vegan ramen near you.',
    url: 'https://www.ramennearyou.com/find/vegan-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function VeganRamenPage() {
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
          initialBowls={['vegan']}
          pageTitle="Vegan Ramen Near Me"
          pageDescription="Showing vegan ramen near you. Enter your ZIP or use your location to find a fully plant-based bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/vegan-ramen"
        heading="How I Find Genuinely Great Vegan Ramen Near Me"
        intro={[
          'Vegan ramen has gone from an afterthought to some of the most exciting bowls being made — kitchens are coaxing incredible depth out of mushrooms, kombu, and miso with no animal products at all. The map above is filtered to vegan ramen near you; enter your ZIP or use your location to find the closest plant-based bowl.',
          'The catch is that “vegan” needs to be verified in a ramen kitchen, where fish and pork sneak into broths and seasonings by default. Here is what makes a great vegan bowl and exactly what to confirm before you order.',
        ]}
        sections={[
          {
            h2: 'What makes great vegan ramen',
            body: (
              <p>
                The whole game is building umami without animal products, and the best vegan kitchens do it
                brilliantly. A deep broth comes from kombu (kelp), dried shiitake mushrooms, roasted vegetables,
                soy, and miso, layered until it is every bit as savory and satisfying as a traditional bowl.
                Creamy styles use sesame or soy milk for body, and the result can genuinely rival a meat-based ramen.
              </p>
            ),
            points: [
              { h3: 'Mushroom and kombu broth', text: 'Shiitake and kelp deliver the deep, savory backbone that meat usually provides — the foundation of great vegan ramen.' },
              { h3: 'Miso and sesame', text: 'Vegan miso and creamy sesame (tantanmen-style) bowls are naturally suited to plant-based cooking and tend to be the most satisfying.' },
              { h3: 'Toppings with substance', text: 'Marinated mushrooms, tofu, corn, bamboo shoots, greens, and nori make the bowl hearty and complete.' },
            ],
          },
          {
            h2: 'Vegan vs. vegetarian — verify it',
            body: (
              <p>
                Vegan means zero animal products, full stop — and that is stricter than it sounds in a ramen
                shop. A broth that looks plant-based may be finished with a fish tare (bonito or niboshi), and
                toppings like a soft egg or a pat of butter make a bowl vegetarian but not vegan. So even on a
                vegan-filtered list, I confirm the specific bowl is fully plant-based before ordering.
              </p>
            ),
          },
          {
            h2: 'What to ask before ordering',
            body: (
              <p>
                Two questions cover it: “Is the broth and the tare entirely plant-based, with no fish or chicken
                stock?” and “Are all the toppings vegan — no egg, no butter, no mayo?” Most shops that offer a
                vegan bowl have thought this through and will answer confidently. A quick check means you get a
                bowl you can fully enjoy.
              </p>
            ),
          },
        ]}
        tipsHeading="My vegan ramen tips"
        tips={[
          'Filter to “Vegan,” then sort by distance for the nearest plant-based bowl.',
          'Lean toward vegan miso and sesame (tantanmen-style) bowls — they shine without animal products.',
          'Confirm both the broth and the tare are plant-based; a fish tare is the most common hidden catch.',
          'Check toppings too — egg and butter make a bowl vegetarian but not vegan.',
          'Load up on mushrooms, tofu, corn, and greens to make the bowl hearty and complete.',
        ]}
        faqs={[
          { q: 'What is vegan ramen?', a: 'Vegan ramen is a fully plant-based bowl — no meat, fish, egg, or dairy. The broth builds umami from kombu, shiitake mushrooms, roasted vegetables, soy, and miso, and can be every bit as savory as a traditional bowl.' },
          { q: 'Is vegan ramen the same as vegetarian ramen?', a: 'No. Vegetarian ramen may include egg, dairy, or a fish-based tare. Vegan excludes all animal products. Always confirm the specific bowl is fully plant-based, even on a vegan-filtered list.' },
          { q: 'What makes a good vegan ramen broth?', a: 'Deep umami from kombu (kelp), dried shiitake mushrooms, and roasted vegetables, seasoned with soy and miso. Creamy versions use sesame or soy milk for body.' },
          { q: 'What should I ask to confirm ramen is vegan?', a: 'Ask whether the broth and tare are entirely plant-based with no fish or chicken stock, and whether all toppings are vegan — no egg, butter, or mayo. A fish tare is the most common hidden ingredient.' },
          { q: 'How do I find vegan ramen near me?', a: 'The map above is filtered to vegan. Enter your ZIP or tap “Use my location” to sort the closest plant-based bowls by distance, then confirm the details with the shop.' },
        ]}
      />
    </main>
  )
}
