import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rich & Creamy Ramen Near Me | Thick, Decadent Bowls | RamenNearYou',
  description: 'Find rich and creamy ramen near you — the thickest, most decadent bowls, from tonkotsu to chicken paitan. What makes broth creamy and how to find the richest bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/rich-ramen' },
  openGraph: {
    title: 'Rich & Creamy Ramen Near Me',
    description: 'Find the richest, creamiest ramen bowls near you.',
    url: 'https://www.ramennearyou.com/find/rich-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RichRamenPage() {
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
          initialMoods={['rich-creamy']}
          pageTitle="Rich & Creamy Ramen Near Me"
          pageDescription="Showing rich, creamy ramen near you. Enter your ZIP or use your location to find a decadent bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/rich-ramen"
        heading="Where I Find the Richest, Creamiest Ramen Near Me"
        intro={[
          'Some days only a thick, decadent, lip-coating bowl will do — the kind of ramen so rich it feels indulgent. The map above is filtered toward rich and creamy ramen near you, the most luxurious bowls in your area. Enter your ZIP or use your location to find the closest one.',
          'Richness in ramen comes from specific techniques and styles, not just from being heavy. Here is what makes a broth creamy, which bowls deliver it best, and how I order for maximum decadence.',
        ]}
        sections={[
          {
            h2: 'What makes a broth rich and creamy',
            body: (
              <p>
                That creamy, opaque texture comes from emulsification — boiling bones hard and long until
                collagen, fat, and marrow break down and blend into the liquid. The result is a broth with body
                that clings to every noodle. Tonkotsu (pork) and tori paitan (chicken) are the classic creamy
                broths, while rich miso and certain sesame bowls get their body from paste and fat rather than
                bones.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu', text: 'The benchmark for rich — pork bones simmered into a milky, collagen-heavy broth that coats the bowl.' },
              { h3: 'Chicken paitan', text: 'Creamy and luxurious from hard-simmered chicken bones, a touch lighter and sweeter than pork.' },
              { h3: 'Rich miso & sesame', text: 'Body from fermented soybean paste, ground sesame, and fat rather than bones — hearty and full.' },
            ],
          },
          {
            h2: 'The richest bowls to order',
            body: (
              <p>
                For maximum decadence, I look for tonkotsu (especially with a swirl of black garlic oil), tori
                paitan, and rich/spicy miso. Adding extra chashu and a soft, jammy egg pushes a bowl further
                into indulgent territory. If a shop is known for a thick, “double soup” or extra-rich house
                broth, that is exactly what this craving calls for.
              </p>
            ),
          },
          {
            h2: 'Balancing the richness',
            body: (
              <p>
                A truly rich bowl is glorious but intense, so I balance it. Firm noodles cut through the
                heaviness, a squeeze of acidity or some pickled ginger resets the palate, and a crisp drink on
                the side keeps every bite feeling fresh. Order the rich bowl, but give yourself a little contrast
                and you will enjoy it all the way to the bottom.
              </p>
            ),
          },
        ]}
        tipsHeading="My rich-ramen tips"
        tips={[
          'Filter to “Rich & Creamy,” then sort by distance for the nearest decadent bowl.',
          'Tonkotsu, chicken paitan, and rich miso are the most reliably creamy styles.',
          'Add black garlic oil, extra chashu, and a soft egg for maximum indulgence.',
          'Order firm noodles and use pickled ginger to cut through the richness.',
          'A crisp drink on the side keeps a heavy bowl feeling fresh to the last bite.',
        ]}
        faqs={[
          { q: 'What is rich and creamy ramen?', a: 'It is ramen with a thick, opaque, lip-coating broth, usually from long-simmered bones (tonkotsu or chicken paitan) or rich miso and sesame bowls. The texture clings to every noodle.' },
          { q: 'What makes ramen broth creamy?', a: 'Emulsification — boiling bones hard until collagen, fat, and marrow break down and blend into the liquid, giving the broth its milky body. Miso and sesame bowls get richness from paste and fat instead.' },
          { q: 'Which ramen is the richest?', a: 'Tonkotsu is the benchmark, especially with black garlic oil; tori paitan (chicken) and rich or spicy miso are also very creamy. Add extra chashu and a soft egg to push the indulgence further.' },
          { q: 'How do I balance a very rich bowl?', a: 'Order firm noodles, use pickled ginger or a touch of acidity to reset your palate, and keep a crisp drink on the side. A little contrast keeps a heavy bowl enjoyable to the end.' },
          { q: 'How do I find rich ramen near me?', a: 'The map above is filtered toward rich, creamy bowls. Enter your ZIP or tap “Use my location” to sort the closest decadent ramen by distance.' },
        ]}
      />
    </main>
  )
}
