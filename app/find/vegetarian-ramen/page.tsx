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

export default async function VegetarianRamenPage() {
  const NATIONWIDE_FILTER = { initialFlags: ["vegetarian"] }
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
        initialFlags={['vegetarian']}
        pageTitle="Vegetarian Ramen Near Me"
        pageDescription="Find ramen restaurants with vegetarian options near you — meat-free broths and toppings packed with umami. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Vegetarian Ramen Near Me" }]}
        title={`Vegetarian Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/vegetarian-ramen"
        heading="How I Find Vegetarian Ramen That Actually Delivers"
        intro={[
          'Vegetarian ramen has come a long way from the sad "just hold the pork" days. Done right, a meat-free bowl is every bit as deep, rich, and satisfying as a traditional one. The map above is filtered to ramen restaurants near you that offer vegetarian options — enter your ZIP or use your location to sort the closest spots to the top and start narrowing down your next bowl.',
          'I eat a lot of vegetarian ramen, and the single most important thing I have learned is that the best meat-free bowls are not just ramen with the pork left out — they are thoughtfully constructed from the ground up using plant-based ingredients that genuinely replace the umami and body that meat provides. Kitchens that treat vegetarian ramen seriously invest in their dashi, their miso, and their topping seasoning just as much as any other bowl on the menu.',
          'The single most important thing I have learned is to ask the right questions, because "vegetarian" can be a moving target in a ramen kitchen. Many shops use the word to mean "no visible meat" while still finishing the broth with a fish-based tare or using chicken stock as a base. Understanding what to look for and what to ask separates a truly satisfying meat-free experience from a frustrating one.',
          'Whether you avoid meat for health reasons, ethical reasons, or simply because you feel like a lighter bowl today, vegetarian ramen offers a range of styles from delicate clear broths to rich creamy ones. The key is finding a kitchen that has actually put thought into it — and this guide will help you do exactly that.',
        ]}
        sections={[
          {
            h2: 'What makes a great vegetarian ramen broth',
            body: (
              <p>
                The magic is umami without meat, and the best vegetarian broths build serious depth through
                careful ingredient selection and technique. A great meat-free broth draws from kombu (dried kelp),
                dried shiitake mushrooms, roasted vegetables, and miso or soy tare, layered together until the
                result rivals a meat-based bowl in richness and complexity. When a kitchen takes vegetarian ramen
                seriously, the broth is savory, layered, and full-bodied rather than thin or watery. I have had
                vegetarian broths that tasted more complex and developed than some meat broths I have tried,
                precisely because the kitchen could not rely on pork fat or chicken collagen to do the heavy
                lifting and had to work harder for the depth.
              </p>
            ),
            points: [
              { h3: 'Kombu and shiitake dashi', text: 'This kelp-and-mushroom base is the backbone of great vegetarian broth, delivering savory glutamates that create real depth without any meat. When simmered gently, kombu releases a subtle oceanic umami and shiitake adds a rich, earthy note that keeps the broth feeling substantial.' },
              { h3: 'Miso and sesame', text: 'Miso ramen and creamy sesame tantanmen-style bowls are naturally suited to going meat-free and tend to be the most satisfying options on a vegetarian menu. Fermented miso brings complexity and salt in one, while tahini or sesame paste gives the broth a creamy, nutty richness that feels genuinely indulgent.' },
              { h3: 'Toppings that carry weight', text: 'Marinated mushrooms, corn, bamboo shoots, tofu, nori, and a soft-boiled egg (if you eat eggs) make the bowl feel complete and hearty. The best vegetarian shops season each topping individually so every component adds its own distinct flavor rather than just filling space.' },
            ],
          },
          {
            h2: 'Vegetarian vs. vegan ramen — the key difference',
            body: (
              <p>
                This distinction trips people up constantly, and it matters a great deal depending on your diet.
                Vegetarian ramen may still include eggs, dairy like butter or cream, or a fish-based tare or dashi
                made from bonito or niboshi. Vegan ramen excludes all animal products entirely, including those
                ingredients. So a vegetarian bowl is not automatically vegan, and a bowl that looks plant-based at
                first glance may still use a fish-derived seasoning in the tare. If you are strictly vegan, use
                the dedicated vegan filter on this site and still confirm the bowl is fully plant-based before
                ordering. If you are vegetarian but do eat eggs and dairy, a vegetarian filter is the right
                starting point for you.
              </p>
            ),
          },
          {
            h2: 'What to ask before you order',
            body: (
              <p>
                Two questions clear up almost everything before I sit down. First: "Is the broth made with a
                vegetable base, or does it use fish or chicken stock?" Second: "Is the tare or seasoning
                fish-based?" Many shops make a genuinely vegetarian broth but finish it with a fish tare out of
                habit, because that is how the recipe was originally written. Most kitchens are happy to swap the
                tare or clarify the situation if you ask politely. A quick check before ordering means you get
                exactly the bowl you want without any surprises.
              </p>
            ),
          },
          {
            h2: 'The best vegetarian ramen styles to order',
            body: (
              <p>
                Not every ramen style adapts equally well to going meat-free, and knowing which ones work best
                saves me a lot of trial and error. Miso ramen is my first choice for vegetarian, because the
                fermented paste carries so much natural flavor that the absence of meat is barely noticeable when
                the bowl is well made. Sesame tantanmen is a close second — the ground sesame and chili oil
                create a rich, spicy broth that is deeply satisfying without any pork. Clear shio and shoyu
                styles can also be excellent if the kitchen has invested in a really good vegetable dashi, though
                they have less margin for error since there is nowhere for a thin broth to hide.
              </p>
            ),
            points: [
              { h3: 'Vegetarian miso ramen', text: 'Miso paste is one of the most forgiving and delicious ways to build a meat-free broth. The fermentation does much of the flavor work, and a good vegetable dashi beneath it pushes the bowl into genuinely great territory.' },
              { h3: 'Sesame tantanmen', text: 'A creamy, spicy sesame broth with chili oil and ground sesame is one of those styles that almost seems designed for vegetarian preparation. The richness comes from the sesame rather than from bone collagen, which means the texture is naturally full without any meat.' },
              { h3: 'Clear vegetable shio', text: 'When a kitchen has invested in a clean, deep vegetable dashi, a clear shio bowl can be a revelation — delicate but savory, and a perfect canvas for seasonal vegetable toppings. It is the most refined end of the vegetarian spectrum.' },
            ],
          },
          {
            h2: 'How I read a menu to find the best meat-free option',
            body: (
              <p>
                When I look at a ramen menu for vegetarian options, I start by scanning for any bowl that is
                explicitly labeled vegetarian or plant-based, then I cross-reference it with the broth description
                to understand what the kitchen has actually done. A bowl described as "kombu dashi with roasted
                vegetable tare" tells me the kitchen has thought through every component. A bowl described simply
                as "vegetable broth" with no further detail is a prompt for me to ask more questions. I also look
                at what toppings are on the bowl — a vegetarian bowl loaded with three kinds of mushrooms and
                braised tofu is a sign the kitchen cares about the experience, while a bowl with just corn and
                nori suggests it was an afterthought.
              </p>
            ),
          },
        ]}
        tipsHeading="My vegetarian ramen tips"
        tips={[
          'Filter to "Vegetarian Options," then sort by distance for the nearest meat-free bowls — it is the fastest way to see what is available near you.',
          'Lean toward miso and sesame tantanmen-style bowls first; they shine without meat because the fermented paste and sesame provide enough richness and umami to make up the difference.',
          'Ask whether the broth and the tare are both vegetable-based; fish stock and fish tare are easy to miss and are the most common reasons a "vegetarian" bowl is not actually meat-free.',
          'Strictly vegan? Use the vegan filter instead of the vegetarian one, and still confirm there are no eggs, dairy, or fish-derived ingredients in any component of the bowl.',
          'Load up on mushrooms, corn, tofu, and nori to make the bowl hearty and complete — the right toppings are often what separates a satisfying meat-free bowl from one that leaves you wanting more.',
          'Read recent reviews specifically for vegetarian mentions; other diners who avoid meat will flag whether a shop is genuinely reliable or inconsistent about keeping the broth plant-based.',
          'If you are new to a shop, a quick call to confirm the broth base is worth the two minutes; a kitchen that answers vegetarian questions confidently is one worth visiting.',
          'Ask about customization — many shops will let you swap toppings or add extra protein like tofu, which makes a good vegetarian bowl into a filling one.',
        ]}
        faqs={[
          { q: 'What is vegetarian ramen?', a: 'Vegetarian ramen uses a broth made without meat — typically from kombu, shiitake mushrooms, and roasted vegetables — topped with plant-based or egg-based toppings. It can range from light and clear to rich and deeply savory depending on the style and how much effort the kitchen has put into building umami without pork or chicken.' },
          { q: 'Is vegetarian ramen the same as vegan ramen?', a: 'No, and the difference is important. Vegetarian ramen may include eggs, dairy like butter, or fish-based tare or dashi made from bonito or niboshi. Vegan ramen excludes all animal products. If you need a fully vegan bowl, use the vegan filter on this site and confirm with the restaurant that no fish, eggs, or dairy appear in any component of the bowl.' },
          { q: 'What makes a good vegetarian ramen broth?', a: 'Deep umami from kombu (kelp), dried shiitake mushrooms, and roasted vegetables, seasoned with miso or soy tare. The best versions rival meat-based broths in richness because the kitchen has stacked multiple umami sources — mushrooms, fermented miso, roasted aromatics — rather than relying on a single ingredient. A great vegetarian broth should taste full-bodied, not thin or watery.' },
          { q: 'What should I ask before ordering vegetarian ramen?', a: 'Ask whether the broth uses a vegetable base or fish and chicken stock, and whether the tare is fish-based. Many shops use a fish tare by default even when the broth itself is plant-based. Most kitchens are happy to clarify or substitute if you ask politely, so a quick question before ordering saves a lot of disappointment.' },
          { q: 'Which ramen styles are best for vegetarians?', a: 'Miso and creamy sesame tantanmen-style bowls adapt best to going meat-free, and they tend to be the most satisfying because the fermented paste and sesame provide enough natural richness to replace what meat usually delivers. Loaded toppings like mushrooms, corn, tofu, and nori make them hearty and filling. Clear shio bowls can also be excellent when the kitchen has invested in a quality vegetable dashi.' },
          { q: 'How do I spot a shop that takes vegetarian ramen seriously?', a: 'Look for menus that describe the broth in detail — "kombu and shiitake dashi with roasted vegetable tare" suggests a kitchen that has thought through every component. Also check toppings: a vegetarian bowl loaded with multiple kinds of mushrooms and seasoned tofu is a sign of care, while a bowl with just corn and nori suggests it was an afterthought added to the menu without much thought.' },
          { q: 'Can I eat vegetarian ramen if I have a fish allergy?', a: 'Not automatically. Many vegetarian ramen bowls still use fish-derived tare or dashi, which would be a problem for someone with a fish allergy. Always confirm explicitly that no fish products appear anywhere in the bowl — broth, tare, toppings, or finishing oil — before ordering if you have an allergy.' },
          { q: 'How do I find vegetarian ramen near me?', a: 'The map above is filtered to ramen restaurants that offer vegetarian options. Enter your ZIP or tap "Use my location" to sort the closest spots by distance. From there I recommend reading recent reviews for vegetarian mentions and calling ahead to confirm the broth base if the menu is not explicit — it takes two minutes and ensures you get exactly what you are looking for.' },
        ]}
      />
    </main>
  )
}
