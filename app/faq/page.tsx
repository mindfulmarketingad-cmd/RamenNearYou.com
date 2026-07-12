import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'

export const metadata: Metadata = {
  title: 'Ramen FAQ — Common Questions About Ramen',
  description: 'Answers to the most common questions about ramen — broth types, ingredients, ordering tips, nutrition, and how to find great ramen near you.',
  alternates: { canonical: 'https://www.ramennearyou.com/faq' },
  openGraph: {
    title: 'Ramen FAQ — Common Questions About Ramen',
    description: 'Everything you want to know about ramen — broth styles, toppings, how to order, and where to find the best bowl near you.',
    url: 'https://www.ramennearyou.com/faq',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the main types of ramen broth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The four main ramen broth styles are tonkotsu (rich, milky pork bone broth), shoyu (clear soy sauce-seasoned broth), miso (fermented soybean paste broth), and shio (light, salt-based broth). Spicy ramen and vegan ramen are also popular variations found at many restaurants.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is tonkotsu ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tonkotsu ramen is a style of ramen originating from Fukuoka, Japan. It features a rich, creamy, milky-white broth made by boiling pork bones at high heat for 12–18 hours. The resulting broth is thick with collagen and fat, giving it a deeply savory, indulgent flavor. It is typically served with thin straight noodles, chashu pork belly, soft-boiled egg, green onions, and nori.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between shoyu and miso ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shoyu ramen uses a soy sauce-based tare (seasoning) mixed into a clear chicken or dashi stock. It has a lighter, cleaner flavor with savory depth. Miso ramen uses fermented soybean paste blended into stock, producing a thicker, heartier, earthier broth. Miso ramen is the signature style of Hokkaido, Japan, and is often served with corn, butter, and thick wavy noodles.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ramen healthy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Restaurant ramen can be high in sodium and calories, but it also provides protein from meat and eggs, carbohydrates from noodles, and vitamins from vegetables. Many ramen restaurants offer lighter broth options like shio or shoyu, and you can request less sodium or extra vegetables. Vegan ramen made with kombu and mushroom dashi is a lower-fat, plant-based alternative.',
      },
    },
    {
      '@type': 'Question',
      name: 'What toppings come on ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common ramen toppings include chashu (braised pork belly), ajitsuke tamago (soft-boiled marinated egg), nori (dried seaweed), menma (bamboo shoots), narutomaki (fish cake), green onions, corn, butter, bean sprouts, mushrooms, and sesame seeds. Many restaurants allow you to customize your toppings.',
      },
    },
    {
      '@type': 'Question',
      name: 'What noodles are used in ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ramen noodles are wheat-based and come in different shapes depending on the style: thin and straight (common with tonkotsu and shoyu), thick and wavy (common with miso and tsukemen), or flat. The noodles are made with an alkaline ingredient like kansui, giving them their springy texture and yellow color.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is tsukemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tsukemen is a style of ramen where the noodles are served separate from the broth. You dip the cold or room-temperature noodles into a concentrated, intensely flavored dipping broth before eating. The broth is usually richer and more strongly seasoned than regular ramen broth to compensate for not being absorbed by the noodles.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does ramen contain gluten?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional ramen noodles are made from wheat flour and contain gluten. The broth may also contain soy sauce or miso, which often contain gluten. Some restaurants offer gluten-free rice noodle substitutions — call ahead to confirm. Vegan ramen restaurants are more likely to have gluten-free options available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there vegan or vegetarian ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vegan ramen uses a plant-based broth typically made from kombu (dried kelp), dried shiitake mushrooms, and vegetables to create rich umami flavor without animal products. Toppings include tofu, roasted vegetables, corn, and nori. Many ramen restaurants now offer vegan or vegetarian options — use the broth filter on Ramen Near You to find restaurants with vegan-friendly bowls.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find ramen restaurants near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can browse ramen restaurants by city or broth type at RamenNearYou.com. We list top-rated ramen restaurants across Georgia and the United States with ratings, hours, menus, and directions. Use the search bar on the homepage or browse by city to find the best ramen near you.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I order at a ramen restaurant for the first time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For first-timers, tonkotsu or shoyu ramen are the most approachable choices. Tonkotsu offers a rich, satisfying bowl while shoyu gives you a classic, balanced flavor. Order a soft-boiled egg as an add-on — it is worth it. Ask your server about the spice level and protein options. Many restaurants let you customize noodle firmness and broth richness.',
      },
    },
    {
      '@type': 'Question',
      name: 'How spicy is spicy ramen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spice levels vary widely by restaurant and dish. Tantanmen (Japanese dan dan noodles) is warmly spicy with a nutty, sesame-rich broth. Volcano or fire ramen can be extremely hot. Most restaurants offer spice level choices from mild to extra hot. If you are sensitive to heat, ask for mild or try a classic tonkotsu or shoyu instead.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does ramen cost at a restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A bowl of ramen at a sit-down restaurant typically costs $14–$22 in the United States, depending on the city and restaurant quality. Upscale or specialty ramen spots may charge more. Many restaurants charge extra for additional toppings or protein. Ramen is generally considered a great value for the quality and care that goes into each bowl.',
      },
    },
  ],
}

const faqs = faqSchema.mainEntity

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <details
      className="group border border-black/5 rounded-xl bg-[#F5F4F0] overflow-hidden"
      open={index === 0}
    >
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-white/[0.03] transition-colors">
        <h2 className="font-semibold text-[#1E2026] text-base leading-snug">{question}</h2>
        <ChevronDown className="w-4 h-4 text-[#96602F] shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-5">
        <p className="text-[#6B6862] text-sm leading-relaxed">{answer}</p>
      </div>
    </details>
  )
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-[#ffffff]">
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative w-full max-w-xl mx-auto h-40 sm:h-48 rounded-2xl overflow-hidden mb-8">
            <RestaurantImage src={pickStockPhoto('faq')} alt="A bowl of ramen" fill className="object-cover" sizes="576px" priority />
          </div>
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Learn</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Ramen FAQ
          </h1>
          <p className="text-[#6B6862] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you want to know about ramen — broth styles, toppings, ordering tips, and where to find a great bowl near you.
          </p>
        </section>

        {/* FAQ list */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.name}
                answer={faq.acceptedAnswer.text}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-3xl mx-auto text-center bg-[#F5F4F0] border border-black/5 rounded-2xl px-8 py-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-3">
              Ready to find your next bowl?
            </h2>
            <p className="text-[#6B6862] text-sm mb-6">
              Browse top-rated ramen restaurants near you — filtered by city or broth type.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/cities"
                className="px-5 py-2.5 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
              >
                Browse by City
              </Link>
              <Link
                href="/broth"
                className="px-5 py-2.5 rounded-lg border border-black/8 text-[#6B6862] text-sm font-medium hover:border-black/15 hover:text-[#1E2026] transition-colors"
              >
                Browse by Broth Type
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
