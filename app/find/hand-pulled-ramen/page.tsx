import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hand Pulled Ramen Near Me | Fresh Hand-Pulled Noodles | RamenNearYou',
  description: 'Find hand pulled ramen near you — fresh noodles stretched by hand for incredible chew and bite. What hand-pulled noodles are, where to find them, and how to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hand-pulled-ramen' },
  openGraph: {
    title: 'Hand Pulled Ramen Near Me',
    description: 'Find fresh, hand-pulled ramen noodles near you.',
    url: 'https://www.ramennearyou.com/find/hand-pulled-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function HandPulledRamenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ErrorBoundary
        fallback={
          <section className="pt-16 bg-[#F5F4F0]">
            <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
            </div>
          </section>
        }
      >
        <HomeMapHero
          pageTitle="Hand Pulled Ramen Near Me"
          pageDescription="Find ramen with fresh, hand-pulled noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/hand-pulled-ramen"
        heading="Where I Find Hand Pulled Ramen Near Me"
        intro={[
          'Watching a cook take a single lump of dough and stretch, fold, and snap it into a bowl of perfectly even noodles never gets old — and the noodles that come out of it have a chew and freshness that machine-cut strands just cannot match. Every time I see hand-pulling in action, I am struck by how much skill is encoded in that seemingly simple motion. The angle of the pull, the speed of the fold, the number of doublings — each one affects the final texture of the noodle in ways that no machine can fully replicate. The map above helps you find ramen near you; enter your ZIP or use your location, then look for the hand-pulled noodle shops, which I will show you how to spot below.',
          'Hand-pulled noodles (often called la mian) are a craft that takes years to master, and the shops that make them tend to take everything seriously — not just the noodles but the broth, the toppings, and the overall bowl. When a kitchen commits to pulling noodles by hand, it is a signal that they value the craft of noodle-making as a discipline in its own right. That commitment almost always extends to everything else on the menu.',
          'I seek out hand-pulled noodle shops whenever I travel to a new city because they represent a fundamentally different approach to noodle-making than Japanese ramen shops. While I love both traditions deeply, there is something uniquely compelling about watching the physical act of noodle creation moments before you eat them. The transparency of the process — seeing the dough become your noodles right in front of you — adds a dimension to the meal that no other style can replicate.',
          'The map above gives you the fastest route to hand-pulled noodles near you right now. Here is what hand-pulled ramen actually is, where to find the best shops, and how I order to get the most out of every visit.',
        ]}
        sections={[
          {
            h2: 'What hand-pulled ramen noodles are',
            body: (
              <p>
                Hand-pulled noodles are made by repeatedly stretching and folding a single piece of dough,
                doubling the strands with each pull until one rope becomes dozens of thin, even noodles — all by
                hand, to order. The technique comes from Chinese la mian and is most famous in Lanzhou beef
                noodle soup, but you will find it at many noodle shops with Chinese or broader Asian influences.
                Because the dough is worked and pulled fresh for each order, the noodles have a springy, elastic
                bite — what the Japanese call koshi — that you simply cannot get from dried or pre-cut noodles.
                The gluten network developed through hand-pulling is different from what a machine achieves:
                more aligned, more elastic, and more responsive to the broth around it. Each pull stretches the
                protein strands in a way that creates a uniquely satisfying resistance when you bite through.
              </p>
            ),
            points: [
              { h3: 'Pulled to order', text: 'The dough is stretched moments before it hits the water, so the noodles are about as fresh as noodles can possibly be. You are eating something that did not exist as a noodle five minutes ago.' },
              { h3: 'Incredible chew', text: 'Hand-pulling develops and aligns the gluten network in a way machines cannot replicate, giving the noodles a springy, satisfying bite that holds up beautifully in broth.' },
              { h3: 'Choose your width', text: 'Many shops let you pick a thickness, from ultra-thin strands to wide, belt-like noodles, all pulled from the same lump of dough. Each width creates a genuinely different eating experience.' },
            ],
          },
          {
            h2: 'Where to find hand-pulled noodles',
            body: (
              <p>
                The most reliable place to find hand-pulled noodles is a Lanzhou beef noodle or la mian shop —
                look for &quot;Lanzhou,&quot; &quot;la mian,&quot; or &quot;hand-pulled&quot; in the name or on
                the menu. These shops often have an open kitchen or a counter facing the noodle station so you
                can watch the pulling process, which is worth seeking out for the experience alone. Some Japanese
                ramen-yas and broader noodle houses pull noodles in-house too, though this is less common and
                often noted as a special feature of the menu. Since the technique is not always advertised, I
                open a few listings, scan the photos and reviews for hand-pulled mentions, and look for images
                that show the noodle-making process. When in doubt, I just ask — shops that pull their own
                noodles are proud of it, usually do it in the open, and love talking about the craft.
              </p>
            ),
          },
          {
            h2: 'How I order hand-pulled ramen',
            body: (
              <p>
                I start by choosing my noodle width — a medium gauge is a great first try because it gives a
                clear sense of the hand-pulled texture without going to either extreme. On later visits I explore
                thinner strands, which have a more delicate slurp, or wider, more belt-like noodles that chew
                more substantially and carry more broth. At a Lanzhou shop I get the classic beef noodle soup
                and ask for a spoon of chili oil on the side; at a Japanese spot I pair hand-pulled noodles with
                whatever broth the kitchen is known for, trusting that they matched the noodle width to the
                broth style. Either way, I eat them promptly: fresh-pulled noodles are at their springy best in
                the first few minutes, so I dig in while the texture is still perfect and the broth is at its
                hottest.
              </p>
            ),
          },
          {
            h2: 'The difference between la mian and Japanese ramen noodles',
            body: (
              <p>
                Japanese ramen noodles are typically made from wheat flour and kansui (an alkaline solution),
                rolled and cut by machine into specific gauges and shapes matched to the broth style. La mian
                noodles are made from a high-gluten wheat flour with no alkaline additive, pulled entirely by
                hand, and eaten fresh. The result is a different kind of bite: la mian noodles are chewier and
                more elastic, with a wheaty flavor that comes through clearly because there is no alkaline
                component changing the taste. I think of them as two distinct but equally worthy traditions.
                A great Japanese ramen noodle, matched precisely to its broth, is a marvel of refinement. A
                freshly pulled la mian noodle, still steaming from the water, is a marvel of craft and immediacy.
                Seeking both out teaches you something new every time about what a noodle can be.
              </p>
            ),
            points: [
              { h3: 'Different flour and process', text: 'La mian uses high-gluten wheat flour pulled by hand; Japanese ramen noodles use wheat with kansui (alkaline salts) and are typically machine-cut. The result is a genuinely different flavor and texture.' },
              { h3: 'Different flexibility', text: 'Hand-pulled noodles can be adjusted in width on the spot based on your order; Japanese ramen noodles are fixed in gauge per batch, matched to a specific broth style.' },
              { h3: 'Both traditions are worth knowing', text: 'Experiencing both styles builds a deeper appreciation for what noodle-making craft actually means. They are different answers to the same fundamental question about what a great noodle should be.' },
            ],
          },
        ]}
        tipsHeading="My hand-pulled ramen tips"
        tips={[
          'Look for "Lanzhou," "la mian," or "hand-pulled" in a shop\'s name or menu — these are the most reliable signals that fresh hand-pulling is actually happening.',
          'Open listings and scan photos and reviews for images of the noodle-making process; many hand-pulled shops feature open kitchens and customers love to photograph the pulling.',
          'Choose your noodle width thoughtfully — try a medium gauge on your first visit to appreciate the baseline texture, then explore thin and wide on return visits.',
          'Eat promptly after the bowl arrives; fresh-pulled noodles are at their springiest in the first few minutes and soften as they absorb broth.',
          'At a Lanzhou shop, get the classic beef noodle soup with a side of chili oil; at a ramen-ya, pair with whatever broth the kitchen is most known for.',
          'If you can see the kitchen from your seat, watch the pulling process while you wait — it makes the bowl taste even better when you understand what went into it.',
          'Ask about the flour blend if you are curious; many hand-pulled noodle cooks are passionate about their flour and happy to explain why they chose it.',
          'Wide, belt-like hand-pulled noodles are exceptional with braises and thick sauces that cling to the broad surface; do not default to thin if the menu suggests a pairing.',
        ]}
        faqs={[
          { q: 'What is hand-pulled ramen?', a: 'Hand-pulled ramen uses noodles made by repeatedly stretching and folding a single piece of dough by hand until it becomes many thin, even strands, pulled fresh to order for each customer. The technique comes from Chinese la mian and is most famous in Lanzhou beef noodle soup, though some Japanese shops also pull noodles in-house.' },
          { q: 'Are hand-pulled noodles better than regular ramen noodles?', a: 'Many people think so, and for good reason. Because they are stretched and cooked fresh, hand-pulled noodles have a springy, elastic chew and a wheaty freshness that dried or pre-cut noodles cannot match. That said, a perfectly made machine-cut Japanese ramen noodle matched to its broth is also exceptional — both traditions have real value.' },
          { q: 'Where can I find hand-pulled ramen near me?', a: 'Use the map above to find ramen nearby, then look for Lanzhou beef noodle or la mian shops specifically, or any listing that mentions hand-pulled noodles. Check photos and reviews for images of the noodle-making process, or simply ask the shop — they are usually proud to confirm it.' },
          { q: 'What is the difference between hand-pulled noodles and Japanese ramen noodles?', a: 'Japanese ramen noodles are typically machine-cut from dough made with kansui (alkaline salts), which gives them their characteristic yellow color and springy bite. Hand-pulled la mian noodles use high-gluten wheat flour without alkaline additives and are stretched entirely by hand to order. Both can be exceptional; they represent different noodle-making philosophies.' },
          { q: 'Can I choose the noodle thickness for hand-pulled ramen?', a: 'Often, yes. Many hand-pulled and Lanzhou shops let you pick a width — from ultra-thin strands to wide, belt-like noodles — all pulled from the same dough. This flexibility is one of the real advantages of the hand-pulled method over machine-cut noodles.' },
          { q: 'How long does it take to make hand-pulled noodles?', a: 'A skilled noodle puller can produce a full portion of noodles in under two minutes. The speed is part of what makes the technique so impressive — the transition from a single rope of dough to dozens of perfect, even strands happens in a few quick, practiced movements.' },
          { q: 'Do hand-pulled noodles soften quickly in broth?', a: 'Like all fresh noodles, hand-pulled noodles absorb broth over time and will soften if left too long. Because they start from a fresher, more elastic state, they can hold their texture a bit longer than some thin noodles, but the general rule applies: eat promptly and enjoy the texture at its peak.' },
          { q: 'Is hand-pulled ramen more expensive than regular ramen?', a: 'It can be, since the technique requires a skilled cook and more labor per serving. Many Lanzhou beef noodle shops keep prices very reasonable despite the craftsmanship involved, while Japanese shops that hand-pull in-house may charge a slight premium. The experience is almost always worth it.' },
        ]}
      />
    </main>
  )
}
