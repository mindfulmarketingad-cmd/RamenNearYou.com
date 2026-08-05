import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, NATIONWIDE_LISTICLE_CAP } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Halal Ramen Near Me | Find Halal Ramen Restaurants | RamenNearYou',
  description: 'Find halal ramen near you — ramen restaurants serving chicken, beef, or vegetarian bowls with no pork or alcohol. Browse nearby spots and learn how to order halal ramen.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/halal-ramen' },
  openGraph: {
    title: 'Halal Ramen Near Me',
    description: 'Find ramen restaurants near you that serve halal-friendly bowls, and how to order one.',
    url: 'https://www.ramennearyou.com/find/halal-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function HalalRamenPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, NATIONWIDE_LISTICLE_CAP), { verifiedSlugs })
  const count = matched.length

  const mapSlot = (
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
        pageTitle="Halal Ramen Near Me"
        pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap &quot;Use my location,&quot; then check menus and reviews for halal chicken, beef, or vegetarian bowls."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Halal Ramen Near Me" }]}
        title={`Halal Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track that matches this, ranked by rating and review volume. Search by name or city, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <FindPageContent
        currentHref="/find/halal-ramen"
        heading="How I Find Halal Ramen Near Me"
        intro={[
          'Most classic ramen is built on pork — tonkotsu broth, chashu, and sometimes a splash of cooking sake — which puts it off the table if you eat halal. The good news is that halal ramen is growing fast, with shops serving rich chicken, beef, and vegetarian bowls that skip pork and alcohol entirely and deliver every bit of the depth and satisfaction you would expect from a great bowl. The map above shows ramen restaurants near you, and this guide explains how to find the halal-friendly ones.',
          'I started researching halal ramen because friends who eat halal were missing out on one of my favorite foods, and I wanted to understand what to look for so I could recommend places with confidence. What I found is that halal ramen is not a lesser version of the real thing — it is a different branch of the same tradition, and when a kitchen commits to it fully, the results are genuinely outstanding. A rich chicken paitan broth built with care and finished with halal-certified toppings is a bowl that stands on its own merits.',
          'The challenge is that pork and alcohol hide in ramen in ways that are easy to miss. Lard is sometimes stirred into the broth as a finishing fat, sake and mirin appear in the tare and in braised meat toppings, and chashu pork shows up as a default topping even on bowls that would otherwise be halal-friendly. Understanding what to ask and what to look for makes the difference between finding a genuinely suitable bowl and being surprised after the fact.',
          'Whether you are searching for a fully certified halal restaurant or looking for a shop that can prepare a pork-free, alcohol-free bowl on request, this guide covers the full range of approaches and what to confirm at each step.',
        ]}
        sections={[
          {
            h2: 'What makes ramen halal?',
            body: (
              <p>
                Halal ramen avoids pork in every form — no tonkotsu broth, no chashu pork, no lard stirred in
                as a finishing fat — and skips alcohol like sake and mirin in both the broth and the tare.
                Instead it leans on chicken paitan, beef, or vegetable broths, with halal-certified meat
                toppings where offered. A bowl is only truly halal when the meat used is sourced from a
                halal-certified supplier and the kitchen keeps halal and non-halal ingredients genuinely
                separate during preparation. That is why certification or a clear, confident statement from the
                shop matters more than simply looking at the menu description. Menus can be misleading in ways
                that a direct conversation usually is not.
              </p>
            ),
            points: [
              { h3: 'No pork in any form', text: 'Chicken, beef, or vegetable broth in place of pork-bone tonkotsu, and no chashu pork or lard in the broth or as a topping. Lard as a finishing fat is the most common hidden pork product in otherwise non-pork bowls.' },
              { h3: 'No alcohol', text: 'Broth and tare made without sake, mirin, or other alcohol. Both sake and mirin are common in braised toppings and in the tare, so confirming the kitchen avoids them throughout is important.' },
              { h3: 'Halal-sourced and separated meat', text: 'Certified halal chicken or beef, sourced from a halal supplier and prepared separately from non-halal ingredients. Certification is the clearest signal, but a direct conversation with the kitchen can also establish what practices are in place.' },
            ],
          },
          {
            h2: 'How to find halal ramen nearby',
            body: (
              <p>
                I use the map to see ramen spots near me, then check menus and recent reviews for halal mentions.
                Chicken and beef ramen specialists, vegetarian-friendly shops, and restaurants in areas with a
                large Muslim community are the most likely to offer halal bowls or at least halal-friendly
                options. When a menu is not explicit about halal status, a quick call to ask about pork, alcohol,
                and halal certification usually clears things up. I also look at whether the restaurant has any
                kind of certification displayed on their website or in their Google listing — not every halal
                ramen shop is certified, but those that are have already done the work of verifying their
                ingredients and processes.
              </p>
            ),
          },
          {
            h2: 'What to order at a halal ramen spot',
            body: (
              <p>
                I start with the house chicken paitan or a beef bowl — both deliver the rich, savory depth that
                people love about tonkotsu without any pork. A well-made chicken paitan broth is creamy from
                collagen, golden from the chicken fat, and deeply satisfying in a way that does not feel like a
                compromise at all. A miso or shoyu base made with halal-friendly seasoning is another great
                option, and vegetable broths are a naturally safe fallback when certification is unclear. Adding
                a seasoned egg, extra vegetables, and bamboo shoots rounds out the bowl and adds texture. If the
                shop offers a house spice blend or chili oil that is confirmed alcohol-free, that is a great way
                to add another dimension of flavor.
              </p>
            ),
          },
          {
            h2: 'How to confirm a bowl is suitable before ordering',
            body: (
              <p>
                My approach is to ask four questions that cover the main halal concerns in a ramen bowl. First:
                does the broth contain any pork or pork-derived ingredients, including lard? Second: does the
                tare or seasoning contain sake, mirin, or other alcohol? Third: is the meat halal-certified and
                kept separate during preparation? Fourth: are any of the standard toppings pork-based, and can
                they be omitted or substituted? Kitchens that offer halal ramen as a genuine option will answer
                all four questions readily and specifically. If the answers are vague or the staff are unsure,
                a vegetarian or vegan bowl is almost always the safest way to enjoy ramen at a non-halal shop
                while still getting a satisfying bowl.
              </p>
            ),
            points: [
              { h3: 'Ask about lard', text: 'Lard is sometimes stirred into ramen broth as a finishing fat to add richness, and it often does not appear on the menu. Asking specifically about lard — not just chashu pork — catches this hidden ingredient.' },
              { h3: 'Ask about sake and mirin', text: 'Both sake and mirin appear in braised meat toppings and in many tare recipes. A kitchen making a genuinely halal bowl will have substituted these with non-alcoholic alternatives like apple juice or omitted them entirely.' },
              { h3: 'Vegetarian as a fallback', text: 'A well-made vegetarian or vegan ramen is a naturally halal-friendly option at shops that do not carry certified halal meat. The broth and toppings avoid pork by definition, and confirming no alcohol is used in the seasoning is the only additional check needed.' },
            ],
          },
          {
            h2: 'Chicken paitan — the best halal alternative to tonkotsu',
            body: (
              <p>
                If you love the thick, creamy, indulgent quality of tonkotsu but need a halal option, chicken
                paitan is the answer. It is made by boiling chicken bones hard for a long time until the collagen
                and fat emulsify into the broth, creating a milky, rich, deeply savory liquid that behaves almost
                identically to tonkotsu in the bowl. When topped with halal-certified chicken chashu, a seasoned
                egg, bamboo shoots, and a drizzle of house oil, a chicken paitan bowl is one of the most
                satisfying things I have ever eaten. It is not a pork substitute — it is its own thing, and a
                genuinely outstanding one when the kitchen has put the time into it.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for halal ramen"
        tips={[
          'Look for chicken or beef ramen specialists first — they are the most likely to have built a halal-friendly menu from the ground up rather than as an afterthought.',
          'Confirm the broth has no pork in any form, including lard stirred in as a finishing fat, before ordering; it is the hidden ingredient most likely to be overlooked.',
          'Ask whether sake and mirin appear in the tare or in any braised toppings; both are common in ramen seasoning and are often missed when checking for alcohol.',
          'Ask whether the meat is halal-certified and kept separate from non-halal ingredients during preparation; certification is the clearest signal but a direct conversation also works.',
          'Vegetarian and vegan ramen bowls are a naturally halal-friendly fallback at shops that do not carry certified halal meat — confirm only that no alcohol is used in the seasoning.',
          'Shops in areas with a large Muslim community often advertise halal options prominently in their listings and on their menus, which makes them easier to identify with a quick search.',
          'Read reviews and check Google listings for halal mentions from other diners before visiting; community knowledge is often the most reliable source for confirming a shop is genuinely halal.',
          'Call ahead when you are unsure rather than arriving and discovering the details at the counter; a two-minute phone call saves a wasted trip and tells you a lot about how seriously the kitchen takes it.',
        ]}
        faqs={[
          { q: 'Is ramen halal?', a: 'Traditional ramen usually is not. It is most often built on pork-bone tonkotsu broth or seasoned with chashu pork, and the tare commonly contains sake or mirin. Halal ramen replaces pork with chicken, beef, or vegetable broths and avoids alcohol throughout the seasoning and toppings.' },
          { q: 'How do I find halal ramen near me?', a: 'Use the map above to see ramen restaurants nearby, then check menus and reviews for halal options. Chicken and beef ramen specialists and vegetarian-friendly shops are the best bets. Restaurants in areas with large Muslim communities often advertise halal status clearly. Calling ahead to confirm pork, alcohol, and certification is the most reliable approach.' },
          { q: 'What ramen broth is halal?', a: 'Chicken paitan, beef, and vegetable broths can all be halal when made without pork or alcohol. Chicken paitan in particular is an outstanding halal alternative to tonkotsu — it is made by hard-simmering chicken bones into a rich, creamy, emulsified broth that rivals pork tonkotsu in body and depth. Pork-based tonkotsu is not halal.' },
          { q: 'Is tonkotsu ramen halal?', a: 'No — tonkotsu broth is made by boiling pork bones for many hours to extract their collagen and fat, so it is not halal. Look for chicken paitan, beef broth, or vegetable-based bowls instead. A well-made chicken paitan bowl delivers comparable richness and depth without any pork.' },
          { q: 'What hidden ingredients should I ask about when ordering halal ramen?', a: 'Three things that often go unnoticed: lard stirred into the broth as a finishing fat for richness; sake and mirin in the tare or braised meat toppings; and chashu pork used as a default topping. Asking specifically about each of these — not just about the broth — ensures you catch all the common sources of non-halal ingredients.' },
          { q: 'Does halal ramen taste different from regular ramen?', a: 'A well-made halal ramen tastes genuinely excellent, not like a lesser version of the original. Chicken paitan has its own distinctive richness that is actually preferable to tonkotsu for many diners. Beef broth brings a different kind of depth and savoriness. The experience is different rather than worse, and kitchens that specialize in halal ramen treat it as a cuisine in its own right.' },
          { q: 'Can I eat ramen at a non-halal shop?', a: 'Possibly, if the shop offers a vegetarian or vegan bowl made without alcohol in the seasoning. Vegetarian and vegan ramen avoids pork by definition, and if the kitchen can confirm no sake or mirin appears in the tare or any topping, the bowl is halal-friendly even without formal certification. It is always worth asking directly.' },
          { q: 'Is vegetarian ramen halal?', a: 'It can be, if the seasoning is free of alcohol and no animal-derived non-halal ingredients are used. Vegetarian ramen avoids pork, but sake and mirin can still appear in the tare or broth seasoning of a vegetarian bowl. Confirming the broth and tare are alcohol-free is the additional step needed to make a vegetarian bowl suitable for halal diners.' },
        ]}
      />
    </main>
  )
}
