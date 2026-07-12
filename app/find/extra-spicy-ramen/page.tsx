import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extra Spicy Ramen Near Me | Extreme Heat Ramen | RamenNearYou',
  description: 'Find extra spicy ramen near you — the bowls for serious heat seekers. Where to find max-heat ramen, how to order it, and how to survive the burn.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/extra-spicy-ramen' },
  openGraph: {
    title: 'Extra Spicy Ramen Near Me',
    description: 'Find the hottest, most fiery ramen near you.',
    url: 'https://www.ramennearyou.com/find/extra-spicy-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ExtraSpicyRamenPage() {
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
          initialMoods={['extra-spicy']}
          pageTitle="Extra Spicy Ramen Near Me"
          pageDescription="Showing extra spicy ramen near you. Enter your ZIP or use your location to find the hottest bowls nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/extra-spicy-ramen"
        heading="Where I Find Extra Spicy Ramen Near Me"
        intro={[
          'This page is for my fellow heat seekers — the people who ask for it hot, get it hot, and then reach for the chili oil anyway. Maximum heat ramen is its own pursuit, and finding a bowl that genuinely challenges you while still tasting like exceptional ramen rather than a capsaicin endurance test is harder than it sounds. The map above is filtered to the spiciest ramen near you, the bowls built for serious heat chasers rather than casual spice fans. Enter your ZIP or use your location to find the closest fire.',
          'Extra spicy ramen is not just about turning up a dial — the best high-heat bowls are carefully engineered to deliver maximum burn without destroying the underlying ramen. The broth still has to taste like ramen. The noodles still have to have texture. The toppings still have to make sense. Finding a kitchen that achieves all of this at a genuinely extreme heat level is one of the more satisfying discoveries in the entire world of ramen.',
          'I have pushed through a lot of extra-spicy bowls over the years, some genuinely great and some that were clearly designed to hurt rather than satisfy. The distinction matters: great extra-spicy ramen has layers of heat that build and evolve through the bowl, a broth that stays complex under the fire, and an endorphin payoff that makes you want to come back. Bad extra-spicy ramen is just pure capsaicin poured over noodles with no further thought. The shops listed through the map above skew toward the former.',
          'Here is where the real heat lives in the ramen world, how to order maximum heat without losing the bowl in the process, and what actually helps when a bowl is genuinely fiery.',
        ]}
        sections={[
          {
            h2: 'Where the real heat lives',
            body: (
              <p>
                The hottest ramen bowls usually come from a few specific sources: shops with a named
                extra-spicy tier or a numbered spice scale you can push to the top, Korean-influenced ramen
                using high volumes of gochugaru or gochujang, fiery tantanmen cranked to maximum chili, and
                spicy miso pushed to the upper limits. Some restaurants build a reputation entirely around heat
                challenges or a signature high-heat bowl designed for serious capsaicin enthusiasts. These are
                the spots worth seeking out when standard spicy ramen just is not cutting it — the shops that
                treat extreme heat as a craft rather than a gimmick. The key difference is whether the kitchen
                has designed a heat system that scales up without breaking the ramen, or whether they are simply
                adding more chili paste indiscriminately. The first approach produces something worth eating at
                full intensity; the second just produces pain without pleasure.
              </p>
            ),
            points: [
              { h3: 'Numbered spice scales', text: 'Shops that let you choose a level from a numbered or named scale are where you can truly max out the heat with some confidence that the kitchen has thought about what maximum heat means for that specific bowl.' },
              { h3: 'Spicy tantanmen and kara miso', text: 'These rich, chili-forward styles absorb extreme heat better than lighter broths because the fat and body of the base carry the capsaicin through the bowl instead of just scorching the top layer.' },
              { h3: 'Korean-influenced bowls', text: 'Gochugaru- and gochujang-spiked ramen brings a different, deeper kind of heat — fermented, fruity, complex — that is worth seeking out specifically as an alternative to pure Japanese capsaicin heat.' },
            ],
          },
          {
            h2: 'Ordering max heat without ruining the bowl',
            body: (
              <p>
                The mistake many heat seekers make is treating extra-spicy ramen like a tolerance test rather
                than a meal. Drowning a delicate broth in chili until it tastes like nothing but capsaicin
                defeats the entire purpose. The best extra-spicy bowls keep the ramen fully recognizable under
                the fire — you still taste the miso, sesame, pork, or shoyu beneath the heat. The broth still
                has body and umami. The noodles still have texture. My approach is to always choose a rich,
                robust base that can carry extreme heat — spicy miso and tantanmen are the most reliable choices
                because their inherent richness and fat content absorb and distribute the capsaicin evenly
                throughout the bowl. I push the spice level up to the maximum tier, then add chili oil at the
                table so I can dial in additional burn incrementally rather than committing to an unknown ceiling
                from the first order.
              </p>
            ),
          },
          {
            h2: 'How to survive the burn',
            body: (
              <p>
                Real talk on the science: capsaicin is fat- and dairy-soluble, not water-soluble, which is why
                chugging ice water when a bowl is too hot just spreads the capsaicin molecules further rather
                than binding to them and removing them. The fat in a rich tonkotsu or miso broth is your actual
                ally — it is actively dissolving capsaicin as you eat, which is part of why a fatty, rich bowl
                at high heat is more manageable than a light broth at the same heat level. A soft egg does the
                same work more intensely: mixing yolk into a very spicy broth noticeably reduces the perceived
                heat. If a bowl genuinely defeats you, something cold and slightly sweet — a crisp lager, a
                slightly sweet highball, a cold tea with a little sugar — helps far more than water. Pace
                yourself through the bowl rather than eating fast, and lean into the endorphin release that
                builds as you go. That warm, slightly euphoric feeling after finishing a very spicy bowl is
                the whole point, and it rewards patience.
              </p>
            ),
          },
          {
            h2: 'Building your heat tolerance over time',
            body: (
              <p>
                One thing I have found genuinely useful over years of eating extra-spicy ramen is that heat
                tolerance is actually trainable. The capsaicin receptors that signal pain and heat to your brain
                can be temporarily desensitized through regular exposure, which is why experienced heat seekers
                can eat bowls that would be genuinely distressing to someone who rarely eats spicy food. I do
                not recommend diving into maximum heat as a first experience — starting at a moderate spice level
                and working upward over multiple visits is both more enjoyable and more effective for building
                real tolerance. Eating spicy ramen regularly, even at moderate heat, shifts your baseline over
                time. What felt challenging at first becomes comfortable, and you naturally start reaching for
                higher levels to get the same warmth and endorphin response. This is how most serious heat
                enthusiasts get where they are, and it is a genuinely rewarding process.
              </p>
            ),
            points: [
              { h3: 'Start moderate and escalate', text: 'Build heat tolerance progressively over multiple visits rather than jumping to maximum immediately. You will enjoy each bowl more and actually develop lasting tolerance.' },
              { h3: 'Eat spicy ramen regularly', text: 'Regular exposure to capsaicin temporarily desensitizes the receptors that signal heat, raising your functional baseline over time. Consistency matters more than single extreme challenges.' },
              { h3: 'Know your own ceiling', text: 'Heat tolerance varies enormously between people and even day to day based on what else you have eaten. Calibrating your order to where you are on a given day produces better bowls than always ordering at your theoretical maximum.' },
            ],
          },
        ]}
        tipsHeading="My extra-spicy tips"
        tips={[
          'Filter to "Extra Spicy" first, then sort by distance for the nearest seriously hot bowl — the filter removes casual spicy options and surfaces the genuinely extreme ones.',
          'Seek out shops with a numbered spice scale and ask for the top tier; these kitchens have designed their heat levels to scale, which usually means the maximum is still a bowl worth eating.',
          'Order a rich base — spicy miso or tantanmen — that can carry extreme heat without losing its own flavor. A light broth at maximum spice becomes indistinguishable from pure chili water.',
          'Add chili oil at the table to build toward your exact burn level incrementally rather than committing to an unknown heat ceiling from the first order.',
          'Cold, slightly sweet drinks — a crisp lager, a highball, a sweet iced tea — soothe the burn more effectively than water; capsaicin is fat-soluble, not water-soluble, so water just spreads it.',
          'A soft egg is your best tactical tool in an extra-spicy bowl; mixing the yolk into a very spicy broth noticeably reduces the perceived burn by binding to the capsaicin molecules.',
          'Build heat tolerance progressively over multiple visits rather than diving into maximum heat immediately; you will enjoy the bowls more and develop genuine lasting tolerance.',
          'Pace yourself through the bowl and lean into the endorphin release that builds as you eat; the warm, slightly euphoric feeling after finishing a truly hot bowl is the payoff for patience.',
        ]}
        faqs={[
          { q: 'Where can I find extra spicy ramen near me?', a: 'The map above is filtered to the spiciest bowls available. Enter your ZIP or tap "Use my location" to find max-heat ramen nearby, especially shops with a numbered spice scale where you can push the level to the maximum tier.' },
          { q: 'What ramen style is the spiciest?', a: 'Bowls with adjustable numbered spice levels set to the top tier are the most reliably extreme. Fiery tantanmen, spicy miso cranked to maximum, and Korean-influenced gochugaru or gochujang ramen all tend to bring the most heat. The style matters less than whether the shop has designed its heat system to scale up without breaking the bowl.' },
          { q: 'How do I order the hottest possible ramen without ruining the bowl?', a: 'Choose a shop with a spice scale and request the top level, but pick a rich base like spicy miso or tantanmen that can carry extreme heat while staying recognizable as ramen. Add chili oil at the table to push further, incrementally. Ordering maximum heat with a light broth usually produces something that tastes like little more than hot liquid.' },
          { q: 'What actually helps with the burn from very spicy ramen?', a: 'Capsaicin is fat- and dairy-soluble, not water-soluble, so the broth\'s own fat, a soft egg with yolk mixed in, and a cold, slightly sweet drink help far more than ice water. Water just spreads capsaicin molecules around without binding to them. The fat in a rich ramen broth is actively working in your favor with every sip.' },
          { q: 'Is extra spicy ramen supposed to still taste like ramen?', a: 'Yes — the best extra-spicy bowls keep the ramen fully recognizable beneath the heat. You should still taste the miso, sesame, pork, or shoyu under the chili. Kitchens that treat extreme heat as a craft rather than a gimmick design their heat systems to enhance the underlying bowl rather than erase it.' },
          { q: 'Can I build a tolerance to very spicy ramen over time?', a: 'Yes, and it happens more quickly than most people expect. Capsaicin receptors can be temporarily desensitized through regular exposure, which is how experienced heat enthusiasts develop the ability to eat bowls that would be distressing to most people. The key is consistent exposure at escalating levels rather than occasional extreme challenges.' },
          { q: 'Why does a soft egg help with spicy ramen?', a: 'Egg yolk is rich in fat, and since capsaicin is fat-soluble, mixing yolk into a spicy broth actively reduces the perceived heat by binding to capsaicin molecules. It also adds a creamy richness that rounds out the fire and makes the bowl more balanced rather than one-dimensional.' },
          { q: 'What is the difference between extra spicy ramen and regular spicy ramen?', a: 'Extra spicy ramen is designed for heat seekers who find standard spicy options insufficient. It typically involves either a maximum-tier spice level on a shop\'s numbered scale, a specially formulated high-heat broth, or Korean-influenced preparations using large amounts of gochugaru or gochujang. The key distinction is that the heat is the primary experience rather than a moderate enhancement.' },
        ]}
      />
    </main>
  )
}
