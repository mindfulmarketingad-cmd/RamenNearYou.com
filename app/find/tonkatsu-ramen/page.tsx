import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Tonkatsu Ramen Near Me | Crispy Pork Cutlet Ramen | RamenNearYou',
  description: 'Find tonkatsu ramen near you — a hot bowl of ramen topped with a crispy, panko-breaded pork cutlet. Browse nearby ramen spots by rating and distance.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tonkatsu-ramen' },
  openGraph: {
    title: 'Tonkatsu Ramen Near Me',
    description: 'Find ramen topped with a crispy panko pork cutlet, near you.',
    url: 'https://www.ramennearyou.com/find/tonkatsu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function TonkatsuRamenPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, 48), { verifiedSlugs })
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
        pageTitle="Tonkatsu Ramen Near Me"
        pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap &quot;Use my location,&quot; then open nearby listings to find spots serving tonkatsu (crispy pork cutlet) ramen."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Tonkatsu Ramen Near Me" }]}
        title={`Tonkatsu Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/tonkatsu-ramen"
        heading="How I Find Tonkatsu Ramen Near Me"
        intro={[
          'Tonkatsu ramen is comfort food turned up a notch — a hot bowl of ramen crowned with a crispy, panko-breaded pork cutlet that delivers crunch, richness, and protein all in one go. The contrast of the golden, shattering crust against the silky broth and tender noodles is what makes this bowl so deeply satisfying. The map above shows ramen restaurants near you, and below I explain how to track down the ones serving a genuinely great katsu bowl.',
          'I have had many tonkatsu ramen bowls over the years, and the difference between a great one and a mediocre one comes down almost entirely to the quality of the katsu itself. A properly fried pork cutlet with a thick, airy panko crust is a revelation. A thin, pre-made cutlet that arrives having been sitting under a heat lamp is a disappointment. Knowing what to look for before you walk in makes all the difference.',
          'A quick but important note that trips up a lot of people: tonkatsu — the crispy pork cutlet — is not the same as tonkotsu — the creamy pork-bone broth from Fukuoka. They sound nearly identical, and they are both pork-related, but they refer to completely different things. Here is how to tell them apart, and here is how to find the cutlet version specifically.',
          'Once you understand the difference, ordering becomes easy and the whole world of katsu ramen opens up. And if you find a shop that does both tonkotsu broth and tonkatsu topping in the same bowl, you are in for one of the most indulgent, over-the-top ramen experiences possible.',
        ]}
        sections={[
          {
            h2: 'What is tonkatsu ramen?',
            body: (
              <p>
                Tonkatsu ramen tops a bowl of ramen with tonkatsu — a pork cutlet that has been breaded in
                panko breadcrumbs and deep-fried until golden and deeply crisp. Panko is key here: these
                Japanese-style breadcrumbs are larger, lighter, and airier than Western breadcrumbs, which is
                what gives tonkatsu its distinctive shatter-and-crunch texture. The cutlet is usually sliced
                into pieces and laid over the noodles so it stays crunchy above the broth rather than soaking
                in it from the start. It pairs especially well with a rich tonkotsu or chicken paitan base,
                which gives the fried pork something substantial to sit in. It is a hearty, modern,
                crowd-pleasing twist on a classic bowl, and one that I find myself craving regularly.
              </p>
            ),
            points: [
              { h3: 'Crispy panko cutlet', text: 'A pork cutlet breaded in panko and fried until deeply golden, sliced and laid over the noodles. The panko creates a lighter, airier crust than regular breadcrumbs, with more surface area for crunch and a texture that holds up better against steam and broth.' },
              { h3: 'Rich broth pairing', text: 'Best over a creamy tonkotsu or chicken paitan base that stands up to the fried pork. The richness of the broth and the richness of the fried cutlet speak the same flavor language, creating a cohesive and deeply satisfying bowl.' },
              { h3: 'Served crunchy', text: 'The cutlet sits on top so it keeps its crunch instead of going soggy in the broth. Shops that understand the dish serve it this way; the eating experience should involve you choosing when to dip each bite.' },
            ],
          },
          {
            h2: 'Tonkatsu vs. tonkotsu — do not mix them up',
            body: (
              <p>
                The names are one letter apart but they mean completely different things, and the confusion
                is understandable. Tonkatsu — spelled with an "a" in the middle — is the breaded, deep-fried
                pork cutlet, the same one that stars in katsu curry, katsu don, and katsu sando. Tonkotsu —
                spelled with an "o" in the middle — is the rich, milky, creamy pork-bone broth from Fukuoka
                that is one of the most famous ramen styles in Japan. Tonkatsu ramen often uses a tonkotsu
                broth as its base, so you can absolutely have both in one bowl — crispy fried cutlet over
                creamy pork-bone soup. But when you are searching a menu, make sure you are finding the
                crispy cutlet, not just the broth. The dish you want will say "katsu" or "pork cutlet," not
                just "tonkotsu."
              </p>
            ),
          },
          {
            h2: 'How to find tonkatsu ramen nearby',
            body: (
              <p>
                Use the map to see ramen spots near you, then check the menu for katsu, tonkatsu, or "pork
                cutlet ramen" specifically. I also browse photos — a properly fried tonkatsu cutlet is visually
                unmistakable when it appears in a listing photo, golden and substantial on top of the bowl.
                Shops that serve katsu curry or katsu don on their regular menu often bring the same expertise
                to their katsu ramen, because the frying technique transfers directly. Chicken katsu ramen is
                also widely available and a close cousin if you prefer poultry. Recent customer reviews and
                photos showing a thick, breaded cutlet on top are the strongest possible confirmation that you
                have found the right place.
              </p>
            ),
          },
          {
            h2: 'What makes a great tonkatsu ramen',
            body: (
              <p>
                I have eaten enough tonkatsu ramen to have strong opinions about what separates a great bowl
                from a disappointing one. The cutlet must be thick — thin pork has no structural integrity
                when it meets a hot bowl, and the eating experience suffers. The panko coating should be light
                and airy, not dense and greasy, which comes down to oil temperature and technique. The broth
                must have enough body to complement rather than be overwhelmed by the fried pork — a watery
                broth under a rich katsu creates an incoherent bowl. And the timing matters: a freshly fried
                cutlet served immediately has a completely different texture from one that has been sitting.
                When all these elements come together, tonkatsu ramen is one of the most satisfying bowls
                in the ramen world.
              </p>
            ),
            points: [
              { h3: 'Thickness of the cutlet', text: 'A thick pork cutlet holds its structure and juiciness against the heat of the bowl. Thin katsu collapses quickly and loses the contrast of crispy exterior and tender interior that makes the dish great.' },
              { h3: 'Freshness of the fry', text: 'Tonkatsu fried to order is noticeably better than one that has been pre-made. The crust is crispier, the pork is juicier, and the whole bowl feels more alive and intentional.' },
              { h3: 'Broth with real body', text: 'A tonkotsu or chicken paitan broth with genuine depth and richness is the right foundation for a fried pork cutlet. The broth should feel like it belongs under the katsu, not like an afterthought.' },
            ],
          },
        ]}
        tipsHeading="My tips for tonkatsu ramen"
        tips={[
          'Search the menu for "katsu" or "pork cutlet ramen" specifically — not "tonkotsu," which refers to the pork-bone broth, not the fried cutlet.',
          'Shops that serve katsu curry or katsu don have usually mastered the fry, and that expertise transfers directly to their katsu ramen.',
          'Order it over a rich tonkotsu or chicken paitan broth for the most satisfying and cohesive flavor pairing.',
          'Eat the cutlet early and dip it bite by bite rather than letting the whole piece soak, to preserve the crunch that makes the dish special.',
          'Prefer poultry? Look for chicken katsu ramen — it is a popular and delicious variation that offers the same textural contrast with a slightly leaner protein.',
          'Look at customer photo reviews rather than just official restaurant images — real diners capture what the bowl actually looks like when it arrives, which reveals the thickness and quality of the cutlet clearly.',
          'Ask whether the katsu is fried to order if you get the chance — fresh-fried is significantly better than pre-made, and shops that fry to order are proud of it.',
          'A bowl that features both tonkotsu broth and tonkatsu cutlet gives you the full pork experience — indulgent, deeply savory, and completely satisfying on a day when you want to go all in.',
        ]}
        faqs={[
          { q: 'What is tonkatsu ramen?', a: 'Tonkatsu ramen is a bowl of ramen topped with a crispy, panko-breaded and deep-fried pork cutlet, usually sliced and rested over the noodles so it stays crunchy. It is often served over a rich tonkotsu or chicken paitan broth and is a hearty, modern twist on classic ramen.' },
          { q: 'How do I find tonkatsu ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" — then check nearby menus and reviews for katsu or pork cutlet ramen. Customer photos showing a thick, breaded cutlet resting on top of the bowl are the clearest confirmation.' },
          { q: 'Is tonkatsu the same as tonkotsu?', a: 'No — they sound alike but mean different things. Tonkatsu is the breaded, deep-fried pork cutlet. Tonkotsu is the rich, creamy pork-bone broth from Fukuoka. Tonkatsu ramen often uses a tonkotsu broth as its base, so a single bowl can feature both — but they are distinct things.' },
          { q: 'What is the difference between tonkatsu and chicken katsu ramen?', a: 'Tonkatsu ramen uses a fried pork cutlet, while chicken katsu ramen uses a fried chicken cutlet. Both are panko-breaded and served crispy over the noodles. Tonkatsu has a richer, fattier character from the pork; chicken katsu is slightly leaner and a bit more delicate.' },
          { q: 'What broth works best under a tonkatsu cutlet?', a: 'A rich, creamy broth like tonkotsu or chicken paitan works best, providing a substantial base that complements the richness of the fried pork. Lighter broths like shio or shoyu can also work if you want the crunch of the katsu to be the dominant element of the bowl.' },
          { q: 'How do I keep the tonkatsu crust crispy?', a: 'Eat the cutlet relatively early in the meal, dipping each bite into the broth rather than letting the whole piece soak. The longer the katsu sits in contact with the steam and soup, the softer the crust becomes. Good shops serve it with the crust above the broth line to give you time.' },
          { q: 'Is freshly fried tonkatsu noticeably better?', a: 'Yes, significantly. A cutlet fried to order has a lighter, crispier crust and a juicier interior than one that has been pre-made and held. If a shop fries to order, they will usually say so, and the quality difference is immediately apparent.' },
          { q: 'Can I have tonkatsu ramen with a tonkotsu broth?', a: 'Absolutely — and it is one of the most indulgent combinations in ramen. Crispy fried pork cutlet over creamy pork-bone broth means you are getting pork in two completely different forms and textures. Many shops that specialize in tonkotsu also offer a katsu version for exactly this reason.' },
        ]}
      />
    </main>
  )
}
