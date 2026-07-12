import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import ServiceCityLinks from '@/components/service-city-links'
import { getServiceCityLinks } from '@/lib/city-filter-pages'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spicy Ramen Near Me | Spicy Miso, Tantanmen & More | RamenNearYou',
  description: 'Find spicy ramen near you — spicy miso, tantanmen, and chili-oil bowls with real heat. The spicy styles to know, how to order, and how to handle the burn.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/spicy-ramen' },
  openGraph: {
    title: 'Spicy Ramen Near Me',
    description: 'Find bold, spicy ramen with real heat near you.',
    url: 'https://www.ramennearyou.com/find/spicy-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function SpicyRamenPage() {
  const cityLinks = getServiceCityLinks('Spicy')

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
          initialBowls={['spicy-miso']}
          pageTitle="Spicy Ramen Near Me"
          pageDescription="Showing spicy ramen near you. Enter your ZIP or use your location to find a bold, fiery bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/spicy-ramen"
        heading="How I Find Spicy Ramen Near Me"
        intro={[
          'For me, a well-placed hit of heat makes a great bowl even better — the way chili interacts with rich broth and springy noodles is genuinely magical rather than just painful. When the heat is integrated thoughtfully into the bowl, it sharpens every other flavor around it, making the umami deeper, the broth more complex, and the whole experience more memorable. The map above is filtered to spicy ramen near you, from spicy miso to tantanmen to chili-oil-laced bowls. Enter your ZIP or use your location to find the closest fiery bowl.',
          'Spicy ramen is a whole category with real depth and variety, not a single dish or a simple heat modifier added to any base. Each spicy style has its own logic: the ingredients that provide the heat, the broth base that carries it, and the way the two interact define the character of the bowl entirely. Learning the styles helps you know what to expect and how to order, instead of hoping for the best and hoping the level is right.',
          'I have eaten through most of the major spicy ramen traditions and come back to them all depending on my mood. Spicy miso on a cold day is one of the most satisfying bowls I know — hearty, warming, complex, and just fiery enough to make you feel fully alive. Tantanmen is what I crave when I want something rich and nutty with heat woven throughout rather than sitting on top. And a clean bowl with chili oil added at the table satisfies the urge to build my own heat level from a baseline I control.',
          'The map above has everything you need to find spicy ramen near you right now. Here are the styles worth knowing, how I approach ordering for the right heat level, and what I do when a bowl is hotter than expected.',
        ]}
        sections={[
          {
            h2: 'The spicy ramen styles to know',
            body: (
              <p>
                Heat shows up in a few classic forms in ramen, each with its own broth base and heat delivery
                mechanism. Spicy miso (kara miso) builds chili paste or chili oil directly into a hearty miso
                broth, where the natural sweetness and umami of the miso balances the burn in a way that makes
                the heat feel integrated rather than bolted on. Tantanmen is the Japanese take on Chinese dan dan
                noodles — a creamy, sesame-and-chili broth with seasoned ground pork that is rich, nutty, and
                fiery all at once. The sesame carries the chili into a smooth, coating heat that builds gradually
                rather than hitting immediately. And plenty of shops offer a chili oil (rayu) or spicy tare you
                can add to any base bowl to dial the heat up yourself, which gives you maximum control over the
                final burn level. Beyond these classics, Korean-influenced bowls using gochugaru or gochujang
                bring a fermented depth to the heat that is worth seeking out on its own terms.
              </p>
            ),
            points: [
              { h3: 'Spicy miso (kara miso)', text: 'Hearty miso broth with chili paste or oil — the natural sweetness and umami of miso tames and balances the heat so it feels warm and integrated rather than sharp and one-dimensional.' },
              { h3: 'Tantanmen', text: 'Creamy sesame-and-chili broth with seasoned ground pork; rich, nutty, and spicy all at once. The sesame base carries the heat smoothly and creates a coating warmth that builds through the bowl.' },
              { h3: 'Add-your-own heat', text: 'Many shops offer chili oil (rayu) or a spicy tare at the table so you can spice up tonkotsu, shoyu, or any base to your exact preference. This is the safest approach when you are unsure about a shop\'s heat levels.' },
            ],
          },
          {
            h2: 'Ordering for the right heat level',
            body: (
              <p>
                Some shops let you choose a spice level from a numbered scale or descriptive options, and I
                always start one notch below where I think I want to be — you can always add more chili oil at
                the table, but you cannot take heat out once it is in the broth. This is especially important at
                a new shop where you do not yet know how they measure their levels, because heat scales vary
                enormously between kitchens. A "medium" at one shop might be a "mild plus" at another and a
                genuine challenge at a third. Building your way up to your preferred level at any new shop is
                smarter than committing to maximum heat before you know what that means. If you genuinely chase
                serious burn, look for shops known for extreme heat or check the "Extra Spicy" filter on the
                map. And remember that good spicy ramen should always still taste like ramen first — the heat
                is there to enhance the broth, not bury it under a wall of capsaicin.
              </p>
            ),
          },
          {
            h2: 'How to handle the heat',
            body: (
              <p>
                When a bowl is genuinely fiery, the fat in the broth and a soft egg help mellow it because
                capsaicin is fat-soluble rather than water-soluble — the fat binds to the capsaicin molecules
                and reduces their impact. A cold drink on the side helps too, especially something slightly sweet
                like a crisp lager or a highball, which both cool the mouth without washing away the flavor. Eat
                the noodles and broth together rather than chasing the noodles separately, so no single bite is
                concentrated pure chili. Pace yourself through the bowl: spicy ramen is not a race, and the
                steady warmth that builds over ten minutes of eating is the goal, not an immediate overload. If
                the heat is genuinely overwhelming, lean into the broth's fat content and the egg rather than
                reaching for your water glass.
              </p>
            ),
          },
          {
            h2: 'Korean-influenced spicy ramen',
            body: (
              <p>
                One spicy ramen direction I have come to love deeply is the Korean-influenced bowl, which uses
                gochugaru (Korean red pepper flakes) or gochujang (fermented chili paste) to build a different
                kind of heat from Japanese chili preparations. Where rayu and Japanese chili pastes tend toward
                pure, clean capsaicin heat, gochugaru brings a fruity, slightly smoky warmth and gochujang
                adds a fermented, savory depth that makes the heat feel fuller and more complex. Bowls using
                these ingredients often have a reddish-orange broth with a rich, slightly sweet base that
                complements the pepper's natural fruitiness. These bowls have grown in popularity significantly
                as ramen culture has expanded and cross-cultural influences have become more common in ramen
                kitchens, and they are worth seeking out specifically if you want heat with more dimension.
              </p>
            ),
            points: [
              { h3: 'Gochugaru for fruity heat', text: 'Korean red pepper flakes bring a bright, slightly smoky warmth with a fruity edge that is distinct from the cleaner, more direct burn of Japanese chili oils.' },
              { h3: 'Gochujang for depth', text: 'Fermented chili paste adds savory complexity and a rounded, layered heat to ramen broth — it is not just spicy but deeply flavored in a way that straightforward chili oil is not.' },
              { h3: 'Often served over rich bases', text: 'Korean-influenced spicy ramen frequently uses a rich tonkotsu or creamy broth base that carries the pepper\'s flavor and softens its burn in the way fat always does.' },
            ],
          },
          ...(cityLinks.length > 0 ? [{
            h2: 'Spicy Ramen by City',
            body: (
              <>
                <p>
                  Want a deeper dive into a specific city&apos;s spicy ramen scene? I have written dedicated
                  guides for these cities, each with its own map, top picks, and local notes:
                </p>
                <ServiceCityLinks links={cityLinks} />
              </>
            ),
          }] : []),
        ]}
        tipsHeading="My spicy ramen tips"
        tips={[
          'Filter to spicy ramen first, then sort by distance for the nearest fiery bowl — the map does the heavy lifting so you can focus on choosing the right style.',
          'Start one heat level below your usual limit at any new shop; heat scales vary enormously between kitchens, and you can always add chili oil at the table.',
          'Spicy miso is the most balanced and accessible starting point for spicy ramen; tantanmen is the rich, nutty choice if you want heat woven into a creamy base.',
          'Want serious burn? Check the "Extra Spicy" filter on the map for shops known for the boldest, most extreme heat levels.',
          'A soft egg and the broth\'s own fat are your best tools against overwhelming heat — capsaicin is fat-soluble, so the richness of a good broth actively works in your favor.',
          'Korean-influenced gochugaru and gochujang bowls offer a different kind of heat — more complex, fruity, and fermented — worth seeking out specifically if you want more dimension than pure capsaicin.',
          'Eat noodles and broth together throughout the bowl rather than separating them; this distributes the heat evenly and prevents any single bite from being pure concentrated chili.',
          'A slightly sweet cold drink — a crisp lager, a highball, or a sweet iced tea — soothes the burn more effectively than ice water, which just spreads capsaicin around without binding to it.',
        ]}
        faqs={[
          { q: 'What is spicy ramen?', a: 'Spicy ramen is any bowl built around chili heat as a central flavor element — most often spicy miso (kara miso), tantanmen (sesame-and-chili broth), or a standard bowl boosted with chili oil or a spicy tare. The heat can come from Japanese chili preparations, Korean gochugaru, or various other pepper-based seasonings.' },
          { q: 'What is the best spicy ramen for beginners?', a: 'Spicy miso is the most approachable entry point — the natural sweetness and savory depth of miso balances the chili so the heat feels warm and integrated rather than sharp. Start at a moderate spice level, eat it with the soft egg, and add chili oil at the table if you want more burn.' },
          { q: 'What is tantanmen?', a: 'Tantanmen is the Japanese version of Chinese dan dan noodles — a creamy, nutty sesame-and-chili broth topped with seasoned ground pork. It is rich and spicy at the same time, with heat that builds gradually through the bowl as the sesame base carries the capsaicin into a smooth, coating warmth.' },
          { q: 'How do I handle very spicy ramen?', a: 'Lean on the broth\'s fat content and a soft egg to mellow the heat — capsaicin is fat-soluble, so the richness of a good ramen broth actively works against it. Keep a cold, slightly sweet drink handy, eat noodles and broth together throughout the bowl, and pace yourself for a steady warmth rather than pushing through overload.' },
          { q: 'How do I find spicy ramen near me?', a: 'The map above is filtered to spicy ramen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance. Add the "Extra Spicy" filter if you want only the most intense heat options. Both the style filters and the distance sorting update in real time as you navigate the map.' },
          { q: 'What makes Korean-influenced spicy ramen different from Japanese spicy ramen?', a: 'Korean preparations use gochugaru (red pepper flakes) or gochujang (fermented chili paste), which bring fruity, smoky, or fermented dimensions to the heat. Japanese spicy preparations like rayu tend toward cleaner, more direct capsaicin heat. The Korean-influenced version has more complexity and a rounded warmth rather than pure burn.' },
          { q: 'Why does spicy ramen taste better with a soft egg?', a: 'The egg yolk is rich in fat, and since capsaicin is fat-soluble rather than water-soluble, mixing yolk into a spicy broth actively reduces the perceived burn. It also adds a creamy richness that rounds out the heat and makes the whole bowl more balanced.' },
          { q: 'Can I add heat to any ramen bowl, or only specific styles?', a: 'Most shops that serve spicy options also offer chili oil (rayu) or a spicy tare at the table that can be added to any bowl. This lets you build heat into a tonkotsu, shoyu, or shio base at your own pace. It is the safest approach when you are unsure about a shop\'s heat calibration.' },
        ]}
      />
    </main>
  )
}
