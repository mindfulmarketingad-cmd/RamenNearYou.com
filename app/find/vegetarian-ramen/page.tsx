import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vegetarian Ramen Near Me | Find Meat-Free Ramen | RamenNearYou',
  description: 'Find vegetarian ramen near you — meat-free broths and toppings full of umami. How vegetarian differs from vegan ramen, what to order, and what to ask.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/vegetarian-ramen' },
  openGraph: {
    title: 'Vegetarian Ramen Near Me',
    description: 'Find vegetarian ramen near you — meat-free bowls packed with umami and flavor.',
    url: 'https://www.ramennearyou.com/find/vegetarian-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function VegetarianRamenPage() {
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
          initialFlags={['vegetarian']}
          pageTitle="Vegetarian Ramen Near Me"
          pageDescription="Find ramen restaurants with vegetarian options near you — meat-free broths and toppings packed with umami. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/vegetarian-ramen"
        heading="How I Find Vegetarian Ramen That Actually Delivers"
        intro={[
          'Vegetarian ramen has come a long way from the sad “just hold the pork” days. Done right, a meat-free bowl is every bit as deep, rich, and satisfying as a traditional one. The map above is filtered to ramen restaurants near you that offer vegetarian options — enter your ZIP or use your location to sort the closest spots to the top.',
          'I eat a lot of vegetarian ramen, and the single most important thing I have learned is to ask the right questions, because “vegetarian” can be a moving target in a ramen kitchen. Here is what makes a great meat-free bowl, how it differs from vegan, and exactly what to check before you order.',
        ]}
        sections={[
          {
            h2: 'What makes a great vegetarian ramen broth',
            body: (
              <p>
                The magic is umami without meat. The best vegetarian broths build serious depth from kombu
                (dried kelp), dried shiitake mushrooms, roasted vegetables, and miso or soy tare. When a kitchen
                takes it seriously, the result rivals a meat-based bowl — savory, layered, and full-bodied
                rather than thin or watery.
              </p>
            ),
            points: [
              { h3: 'Kombu and shiitake dashi', text: 'This kelp-and-mushroom base is the backbone of great vegetarian broth, delivering the savory depth meat usually provides.' },
              { h3: 'Miso and sesame', text: 'Miso ramen and creamy sesame (tantanmen-style) bowls are naturally suited to going meat-free and tend to be the most satisfying options.' },
              { h3: 'Toppings that carry weight', text: 'Marinated mushrooms, corn, bamboo shoots, tofu, nori, and a soft egg (if you eat eggs) make the bowl feel complete.' },
            ],
          },
          {
            h2: 'Vegetarian vs. vegan ramen — the key difference',
            body: (
              <p>
                This trips people up constantly. Vegetarian ramen may still include eggs, dairy like butter, or
                a fish-based tare or dashi (bonito and niboshi are common). Vegan ramen excludes all animal
                products, full stop. So a vegetarian bowl is not automatically vegan, and a bowl that looks
                plant-based may still use a fish-derived seasoning. If you are strictly vegan, use the dedicated
                vegan filter and still confirm.
              </p>
            ),
          },
          {
            h2: 'What to ask before you order',
            body: (
              <p>
                Two questions clear up almost everything: “Is the broth made with a vegetable base, or does it
                use fish or chicken stock?” and “Is the tare or seasoning fish-based?” Many shops make a
                genuinely vegetarian broth but finish it with a fish tare out of habit, and most kitchens are
                happy to swap or clarify if you ask. A quick check means you get exactly the bowl you want.
              </p>
            ),
          },
        ]}
        tipsHeading="My vegetarian ramen tips"
        tips={[
          'Filter to “Vegetarian Options,” then sort by distance for the nearest meat-free bowls.',
          'Lean toward miso and sesame (tantanmen-style) bowls — they shine without meat.',
          'Ask whether the broth and the tare are both vegetable-based; fish stock and fish tare are easy to miss.',
          'Strictly vegan? Use the vegan filter instead and still confirm there are no eggs, dairy, or fish.',
          'Load up on mushrooms, corn, tofu, and nori to make the bowl hearty and complete.',
        ]}
        faqs={[
          { q: 'What is vegetarian ramen?', a: 'Vegetarian ramen uses a broth made without meat — typically from kombu, shiitake mushrooms, and roasted vegetables — topped with plant-based or egg-based toppings. It can range from light and clear to rich and deeply savory.' },
          { q: 'Is vegetarian ramen the same as vegan ramen?', a: 'No. Vegetarian ramen may include eggs, dairy, or fish-based tare or dashi. Vegan ramen excludes all animal products. If you need fully vegan, use the vegan filter and confirm with the restaurant.' },
          { q: 'What makes a good vegetarian ramen broth?', a: 'Deep umami from kombu (kelp), dried shiitake mushrooms, and roasted vegetables, seasoned with miso or soy tare. The best versions rival meat-based broths in richness.' },
          { q: 'What should I ask before ordering vegetarian ramen?', a: 'Ask whether the broth uses a vegetable base or fish/chicken stock, and whether the tare is fish-based. Many shops use a fish tare by default but will swap or clarify if you ask.' },
          { q: 'Which ramen styles are best for vegetarians?', a: 'Miso and creamy sesame (tantanmen-style) bowls adapt best to going meat-free, and loaded toppings like mushrooms, corn, tofu, and nori make them hearty and satisfying.' },
        ]}
      />
    </main>
  )
}
