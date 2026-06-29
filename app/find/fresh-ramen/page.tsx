import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fresh Ramen Noodles Near Me | House-Made Noodle Shops | RamenNearYou',
  description: 'Find fresh ramen noodles near you — shops that make noodles in house for real bite and flavor. Why fresh noodles matter and how to find them.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/fresh-ramen' },
  openGraph: {
    title: 'Fresh Ramen Noodles Near Me',
    description: 'Find shops with fresh, house-made ramen noodles near you.',
    url: 'https://www.ramennearyou.com/find/fresh-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function FreshRamenPage() {
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
          pageTitle="Fresh Ramen Noodles Near Me"
          pageDescription="Find ramen shops with fresh, house-made noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/fresh-ramen"
        heading="Why I Chase Fresh Ramen Noodles Near Me"
        intro={[
          'People obsess over broth — and rightly so — but the noodle is what carries it, and fresh noodles are a completely different animal from dried or pre-packaged ones. That springy, chewy, just-made bite is the unmistakable mark of a shop that genuinely cares about every element of the bowl. I started paying close attention to noodle freshness after a side-by-side comparison that changed how I evaluate ramen shops: the same broth over dried noodles versus fresh house-made ones produced bowls that felt like they came from entirely different restaurants. The map above helps you find ramen near you; enter your ZIP or use your location and look for the spots making noodles fresh.',
          'Once you notice the difference fresh noodles make, you cannot un-notice it. There is a liveliness and elasticity to a fresh noodle that dried noodles simply cannot replicate, no matter how good the broth surrounding them is. Fresh noodles have their own flavor — a clean, wheaty taste that complements rather than disappears into the broth. They hold texture differently, cook more evenly, and interact with the broth in a way that creates a more harmonious, unified eating experience.',
          'The shops that make noodles in-house are almost always making a broader commitment to craft. A kitchen that invests in a noodle machine, custom flour blends, and the daily labor of fresh noodle production is a kitchen that takes ramen seriously as a discipline rather than a product. I use fresh noodles as a proxy for overall kitchen quality, and I have rarely been wrong. When a shop makes great noodles, they usually make great broth and great toppings too.',
          'The map above is your fastest way to find fresh-noodle ramen near you right now. Here is what I have learned about why fresh noodles matter so much, how house-made and hand-pulled noodles differ, and how to find the shops that take their noodles as seriously as their broth.',
        ]}
        sections={[
          {
            h2: 'Why fresh noodles matter so much',
            body: (
              <p>
                Fresh ramen noodles have a springy, elastic quality — what Japanese ramen culture calls koshi —
                that dried or old noodles simply cannot sustain. That satisfying resistance and chew comes from
                gluten networks that are fully developed and alive in a fresh noodle but have relaxed and
                partially broken down in a dried one. Fresh noodles also cook evenly from edge to center because
                they are uniformly hydrated throughout, while dried noodles have to rehydrate as they cook, which
                can lead to uneven texture. They hold their shape in hot broth rather than absorbing liquid
                immediately and swelling out of proportion. Perhaps most importantly, fresh noodles have a
                distinct wheaty flavor of their own — a taste that dried noodles largely lack — which means every
                bite delivers both the noodle and the broth as separate, complementary flavors rather than one
                absorbing the other. A great broth poured over mediocre dried noodles is a genuine letdown, and
                fresh noodles can elevate the entire bowl from the very first slurp.
              </p>
            ),
            points: [
              { h3: 'Koshi (the bite)', text: 'Fresh noodles have a springy elasticity and satisfying chew that dried noodles cannot match. The gluten network is fully active and alive, creating that distinctive resistance that ramen enthusiasts seek out.' },
              { h3: 'Even cooking', text: 'Uniformly hydrated throughout, fresh noodles cook evenly and hold their texture longer in the bowl than dried noodles, which have to rehydrate and can turn soft in patches.' },
              { h3: 'Real flavor', text: 'House-made noodles bring their own clean, wheaty taste and aroma to each bite instead of being a neutral, flavorless vehicle for broth. That added dimension makes the whole bowl more complex.' },
            ],
          },
          {
            h2: 'House-made and hand-pulled noodles',
            body: (
              <p>
                There are two main ways a shop can produce fresh noodles in-house: with a noodle machine or by
                hand. Machine-made in-house noodles are cut from freshly rolled dough, often using custom flour
                blends matched specifically to the broth style — a thicker, higher-hydration dough for miso, a
                low-moisture dough for tonkotsu, a slightly alkaline dough for shoyu. The machine allows for
                precise control over gauge and shape, so the noodle fits the bowl exactly as the chef intends.
                Hand-pulled noodles, common at Chinese-style la mian and Lanzhou beef noodle shops, take a
                different approach entirely: a single lump of dough is stretched and folded by hand to order,
                producing noodles of varying thickness depending on the puller's technique. Both approaches
                signal a kitchen that treats noodles as central to the dining experience rather than an
                afterthought. Either way, you are eating something made the same day, often within the same hour.
              </p>
            ),
          },
          {
            h2: 'How to find fresh-noodle shops',
            body: (
              <p>
                Fresh noodles are not always prominently advertised, so I have developed a few reliable
                strategies. I look at listings and reviews specifically for mentions of house-made, in-house, or
                hand-pulled noodles — these phrases in a review or menu description are strong signals. I also
                favor shops that match their noodle to their broth style, because a kitchen that has thought
                carefully about pairing noodle gauge and dough composition to the broth is almost certainly
                making the noodles themselves. Photos can be surprisingly helpful: fresh noodles often have a
                different sheen and more irregular texture than machine-made commercial noodles, and you can
                sometimes see a noodle machine in the background of kitchen photos. When in doubt, I just ask
                the staff — shops that make their own noodles are almost always proud to tell you, and the
                answer takes two seconds.
              </p>
            ),
          },
          {
            h2: 'Matching the noodle to the broth',
            body: (
              <p>
                One of the most interesting things about house-made fresh noodles is that serious shops match
                them precisely to their broth. A tonkotsu specialist using Hakata-style thin, low-moisture
                noodles has thought about how those specific noodles behave in their specific broth: how quickly
                they absorb liquid, how their texture changes as the bowl cools, how they interact with the fat
                content of the pork-bone broth. A miso shop using thick, wavy noodles has made the same
                calculations for a different set of variables. When you eat at a shop where the noodle and broth
                are clearly designed together, the bowl has a coherence that you feel even if you cannot
                articulate it. Everything belongs. If you want to evaluate whether a shop truly makes its own
                noodles, ask whether the gauge and composition change across different menu items — a shop buying
                commercial noodles usually uses the same noodle for everything, while a house-making shop often
                has different noodles for different bowls.
              </p>
            ),
            points: [
              { h3: 'Thin and firm for tonkotsu', text: 'Low-moisture, thin noodles hold a firm bite in creamy tonkotsu broth and cook almost instantly — a pairing refined over generations in the Hakata tradition.' },
              { h3: 'Thick and wavy for miso', text: 'Wavy, higher-hydration thick noodles trap miso broth in their folds and stand up to the hearty body of a Sapporo-style bowl without going soft.' },
              { h3: 'Medium and springy for shoyu', text: 'A medium-gauge noodle with good elasticity suits the balance of a clear, savory shoyu broth — present enough to have character, delicate enough not to overshadow the broth.' },
            ],
          },
        ]}
        tipsHeading="My fresh-noodle tips"
        tips={[
          'Scan listings and reviews specifically for the words "house-made," "in-house," or "hand-pulled" — those phrases in a review or menu are strong, reliable signals of fresh noodles.',
          'Hand-pulled la mian and Lanzhou beef noodle shops are among the best options for ultra-fresh noodles pulled literally to order.',
          'Look for shops that match noodle gauge and type to each broth style on the menu — this is a strong sign they are making the noodles themselves rather than buying commercial ones.',
          'Order noodles firm when given the option; fresh-noodle koshi is best appreciated when the noodle has its full resistance and has not been overcooked.',
          'Ask the staff directly — shops that make their own noodles are proud of it and will tell you immediately, often with genuine enthusiasm.',
          'Check kitchen photos in listings for visible noodle machines or noodle-making setups in the background; these are clear proof of in-house production.',
          'If a shop uses the same noodle for every bowl on the menu, they may be buying commercial noodles; a house-making shop often uses different noodles for different broth styles.',
          'Eat promptly once the bowl arrives; fresh noodles have a peak texture window that is shorter than dried noodles, and capturing them at their best koshi is worth sitting down and starting immediately.',
        ]}
        faqs={[
          { q: 'Why are fresh ramen noodles better than dried ones?', a: 'Fresh noodles have koshi — a springy, elastic chew — plus uniform hydration that produces even cooking and their own clean wheaty flavor. They hold texture in hot broth far better than dried noodles and make every bite more dynamic and satisfying. A great broth over dried noodles is a lesser experience than the same broth over fresh ones.' },
          { q: 'What does "koshi" mean in ramen?', a: 'Koshi is the Japanese term for the springy, elastic bite of well-made noodles. It is the satisfying resistance you feel when fresh ramen noodles push back against your teeth before yielding cleanly. It is considered one of the most important qualities in a great ramen noodle and is essentially impossible to achieve with dried noodles.' },
          { q: 'What is the difference between fresh and hand-pulled noodles?', a: 'Fresh noodles are made in-house, often by machine, using custom flour blends matched to the specific broth. Hand-pulled noodles are stretched entirely by hand to order, common at Chinese la mian and Lanzhou beef noodle shops. Both are fresh, but hand-pulled noodles have a unique texture from the hand-stretching process that machine-cut noodles cannot fully replicate.' },
          { q: 'How can I tell if a shop makes fresh noodles?', a: 'Look for "house-made," "in-house," or "hand-pulled" in the menu or reviews. Shops that use different noodles for different broth styles are a strong signal of in-house production. You can also check kitchen photos for noodle machines, or simply ask the staff — they are almost always happy to confirm and explain.' },
          { q: 'How do I find fresh ramen noodles near me?', a: 'Use the map above to find ramen nearby, then read listings and reviews specifically for fresh, house-made, or hand-pulled noodle mentions. Favor shops that match their noodle type to their broth style, as this indicates a kitchen that takes noodles seriously as a craft.' },
          { q: 'Do all ramen shops use fresh noodles?', a: 'No — many shops, especially casual or high-volume ones, use commercial pre-made noodles delivered fresh or frozen. Shops that make their own noodles in-house are making a significant investment in labor and equipment, and it shows in the quality of the finished bowl.' },
          { q: 'How quickly do fresh noodles absorb broth compared to dried ones?', a: 'Fresh noodles absorb broth at a different rate depending on their hydration level and gauge, but they generally maintain better texture for longer because their gluten structure is more intact. Eat promptly regardless — even the best fresh noodle will eventually soften in hot broth.' },
          { q: 'Is a shop that uses fresh noodles always better overall?', a: 'Not always, but in my experience it is a very strong positive signal. A kitchen that invests in fresh noodle production is almost always committed to quality across the board — better broth, better toppings, more thoughtful seasoning. I use fresh noodles as a quality proxy and it has rarely led me wrong.' },
        ]}
      />
    </main>
  )
}
