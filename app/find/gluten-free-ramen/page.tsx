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
  title: 'Gluten-Free Ramen Near Me | Find GF Ramen Restaurants | RamenNearYou',
  description: 'Find gluten-free ramen near you — restaurants offering rice or buckwheat noodles and tamari-based broths. Browse nearby ramen spots and learn how to order gluten-free.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/gluten-free-ramen' },
  openGraph: {
    title: 'Gluten-Free Ramen Near Me',
    description: 'Find ramen restaurants near you that can do a gluten-free bowl, and how to order one.',
    url: 'https://www.ramennearyou.com/find/gluten-free-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function GlutenFreeRamenPage() {
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
        pageTitle="Gluten-Free Ramen Near Me"
        pageDescription="Showing ramen restaurants near you, sorted by rating and distance. Enter your ZIP or tap &quot;Use my location,&quot; then check menus and reviews for gluten-free noodle and broth options."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Gluten-Free Ramen Near Me" }]}
        title={`Gluten-Free Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/gluten-free-ramen"
        heading="How I Find Gluten-Free Ramen Near Me"
        intro={[
          'Traditional ramen is not gluten-free — the noodles are wheat-based and most broths are seasoned with soy sauce that contains wheat. But gluten-free ramen does exist, and more shops offer it every year as awareness of celiac disease and gluten sensitivity has grown. The map above shows ramen restaurants near you; from there I read menus, scan recent reviews, and sometimes call ahead to find the ones that can do a true gluten-free bowl.',
          'I started paying close attention to gluten-free ramen because I have friends and family who need to avoid gluten, and I wanted to be able to take them somewhere they could actually eat freely and enjoy themselves. What I found surprised me: a well-made gluten-free ramen with rice noodles and tamari broth is genuinely delicious, not just a workaround. The noodles behave differently from wheat ramen noodles, but they absorb broth beautifully and satisfy in their own right.',
          'The challenge is that gluten hides in ramen in ways that are not always obvious. The noodles are the most visible source, but soy sauce in the broth and tare is equally important — standard soy sauce contains wheat as a fermenting agent, and it appears in almost every ramen seasoning by default. Confirming that a kitchen uses tamari (which is either wheat-free or very low in wheat) throughout the bowl is the critical step that separates a truly safe gluten-free bowl from one that is only partially adapted.',
          'Here is exactly what to look for when searching for a great gluten-free bowl, how to order safely whether you have celiac disease or a sensitivity, and which shops are most likely to get it right.',
        ]}
        sections={[
          {
            h2: 'What makes ramen gluten-free?',
            body: (
              <p>
                Two things have to change for ramen to be gluten-free: the noodles and the seasoning. Standard
                ramen noodles are made from wheat flour, so a gluten-free bowl swaps in rice, 100% buckwheat
                (soba), or other certified gluten-free noodles. The broth and tare also matter just as much —
                regular soy sauce contains wheat as a fermenting ingredient, so the kitchen needs to use tamari
                or a certified gluten-free soy sauce throughout. Cross-contamination in shared pots and utensils
                is a third concern, particularly for people with celiac disease, where even trace amounts of
                gluten can cause a reaction. A bowl that covers all three of these areas — gluten-free noodles,
                tamari seasoning, and separate cooking equipment — is a genuinely safe and satisfying bowl.
              </p>
            ),
            points: [
              { h3: 'Gluten-free noodles', text: 'Rice noodles, certified 100% buckwheat soba, or other gluten-free alternatives in place of standard wheat ramen noodles. Rice noodles are the most common substitution and work well in most broth styles.' },
              { h3: 'Tamari-based broth', text: 'Broth and tare seasoned with tamari or certified gluten-free soy sauce instead of regular shoyu, which contains wheat. This is the step that many kitchens overlook even when they offer gluten-free noodles, so it is always worth confirming explicitly.' },
              { h3: 'No cross-contamination', text: 'Separate water, pots, and utensils so that gluten-free noodles are not cooked in the same water as wheat noodles. This matters most for people with celiac disease, where even shared cooking water can contain enough gluten to cause a reaction.' },
            ],
          },
          {
            h2: 'How to find gluten-free ramen nearby',
            body: (
              <p>
                I use the map to see ramen spots near me, then check each menu for a gluten-free or GF label and
                scan recent reviews for mentions of gluten-free options. Modern, health-forward shops and places
                that already cater to vegan or vegetarian diners are the most likely to offer gluten-free
                noodles and tamari-based seasoning, because those kitchens are already in the habit of thinking
                carefully about ingredients and substitutions. Japanese ramen shops that specialize in shio or
                clear broths are also promising, because a clean, naturally simple broth is easier to adapt than
                a complex tonkotsu seasoned with multiple layers of soy-based tare. When in doubt, I call ahead
                and ask directly about noodles, soy sauce, and shared cooking water before making the trip.
              </p>
            ),
          },
          {
            h2: 'How to order gluten-free ramen safely',
            body: (
              <p>
                If you have celiac disease, being specific and direct is essential. I ask three questions: whether
                the noodles are certified gluten-free, whether the broth and tare use tamari or gluten-free soy
                sauce throughout (including any finishing oils or condiments), and whether gluten-free noodles
                are cooked in separate water with separate utensils. A shop that answers all three confidently
                and specifically is one I trust. If the answers are vague or the staff seem uncertain, a clear
                shio-style broth with rice noodles from a kitchen that knows its ingredients is often the safest
                bet. Sensitivity (rather than celiac) allows a bit more flexibility, but the same questions are
                still worth asking to understand exactly what you are getting.
              </p>
            ),
          },
          {
            h2: 'Gluten-free ramen styles worth knowing',
            body: (
              <p>
                Not all ramen styles adapt equally well to gluten-free preparation, and knowing which ones tend
                to work best saves time and disappointment. Shio (salt) ramen is often the easiest to adapt
                because the broth is naturally cleaner and simpler, with fewer layers of soy-based seasoning that
                need to be replaced with tamari. Tonkotsu (pork bone) broth is also relatively friendly because
                the richness comes from collagen and fat rather than from soy, though the tare still needs to be
                tamari-based. Shoyu ramen is the trickiest because soy sauce is central to both the broth and the
                tare, and replacing it entirely with tamari changes the flavor profile noticeably. That said, a
                kitchen that has invested in a good tamari-based shoyu tare can produce a genuinely excellent
                gluten-free version.
              </p>
            ),
            points: [
              { h3: 'Shio (salt) ramen', text: 'The most adaptable style for gluten-free preparation. The broth relies on salt and aromatics rather than soy, which means less replacement work for the kitchen and a cleaner result for the diner. A great shio bowl with rice noodles is a genuinely satisfying gluten-free meal.' },
              { h3: 'Tonkotsu ramen', text: 'The richness in tonkotsu comes from pork bone collagen rather than from wheat-based seasoning, making it a natural candidate for gluten-free adaptation. The tare still needs to be tamari-based, but the broth itself is usually simpler to adapt than a shoyu style.' },
              { h3: 'Miso ramen', text: 'Miso is naturally gluten-free in its pure form (though some commercial miso blends contain barley), and a kitchen using a certified gluten-free miso with tamari can produce a deeply satisfying bowl. It is worth confirming the miso itself is wheat-free, which is easy to overlook.' },
            ],
          },
          {
            h2: 'Why rice noodles work well in ramen',
            body: (
              <p>
                One of my biggest surprises when I started eating gluten-free ramen was how well rice noodles
                work in a ramen broth. They behave differently from wheat noodles — they do not have the same
                springy, chewy texture, and they absorb broth a bit faster — but they soak up flavor beautifully
                and hold up well in a rich soup. In a bold tonkotsu or a creamy miso, the noodles take on the
                character of the broth and become something genuinely delicious rather than just a compromise.
                My tip is to eat a gluten-free ramen at a slightly faster pace than a wheat-noodle bowl so the
                noodles do not soften too much in the hot broth before you finish. That one adjustment makes the
                experience significantly better.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for gluten-free ramen"
        tips={[
          'Scan the menu or call ahead for a "gluten-free" or "GF" label before visiting — shops that advertise it clearly are the ones most likely to have thought it through properly.',
          'Ask if the broth and tare use tamari or certified gluten-free soy sauce throughout; a kitchen that swaps the noodles but keeps regular soy sauce in the broth has only solved half the problem.',
          'Confirm that gluten-free noodles are boiled in separate water with clean utensils to avoid cross-contamination, which is critical for celiac disease.',
          'Shio ramen is often the easiest style to adapt gluten-free because the broth relies on salt rather than soy, giving the kitchen fewer components to substitute.',
          'Vegan and health-forward ramen shops are the most likely to offer a genuinely careful gluten-free bowl, because those kitchens are already practiced at ingredient-level thinking.',
          'Call ahead if you have celiac disease rather than a sensitivity — a confident, specific answer from the kitchen tells you they know their process and takes two minutes of your time.',
          'Ask about the miso if you are ordering miso ramen; some commercial miso blends contain barley, so a shop using certified gluten-free miso is the detail that separates a safe bowl from a risky one.',
          'Eat your gluten-free bowl a bit faster than usual — rice noodles absorb broth more quickly than wheat noodles and can soften if left to sit too long in the hot soup.',
        ]}
        faqs={[
          { q: 'Is ramen gluten-free?', a: 'Traditional ramen is not. The noodles are made from wheat flour and most broths and tares are seasoned with regular soy sauce, which contains wheat. Gluten-free ramen swaps in rice or 100% buckwheat noodles and uses tamari or certified gluten-free soy sauce instead. When done carefully, the result is a genuinely satisfying bowl rather than a compromise.' },
          { q: 'How do I find gluten-free ramen near me?', a: 'Use the map above to see ramen restaurants nearby, then check menus and recent reviews for gluten-free options. Health-forward and vegan-friendly shops are the most likely candidates. Calling ahead to ask about noodles, broth, and cross-contamination is the surest way to confirm before you make the trip.' },
          { q: 'What noodles are used in gluten-free ramen?', a: 'Gluten-free ramen typically uses rice noodles, certified 100% buckwheat soba noodles, or other certified gluten-free alternatives in place of standard wheat ramen noodles. Rice noodles are the most common substitution and behave well in most broth styles, absorbing flavor beautifully even if the texture is slightly different from wheat noodles.' },
          { q: 'Can people with celiac disease eat ramen?', a: 'Only if the bowl is carefully prepared as gluten-free from start to finish — certified gluten-free noodles, tamari-based broth and tare, and no cross-contamination from shared cooking water or utensils. Always confirm all three points explicitly with the restaurant before ordering, and choose shops that can answer your questions with confidence and specificity.' },
          { q: 'What is tamari and why does it matter for gluten-free ramen?', a: 'Tamari is a Japanese soy sauce traditionally brewed with little or no wheat, making it naturally lower in gluten than regular shoyu. Certified tamari is wheat-free and is the standard substitute for regular soy sauce in gluten-free cooking. It matters for ramen because soy sauce appears in almost every broth and tare recipe, so replacing it with tamari throughout is the key step that makes a bowl genuinely gluten-free.' },
          { q: 'Which ramen style is easiest to order gluten-free?', a: 'Shio (salt) ramen is generally the easiest to adapt because the broth is cleaner and relies less on soy-based seasoning. Tonkotsu is also relatively straightforward because the richness comes from pork collagen rather than soy. Shoyu ramen is the trickiest because soy sauce is central to both the broth and the seasoning, though a kitchen using a quality tamari-based tare can produce an excellent gluten-free version.' },
          { q: 'Is buckwheat (soba) ramen gluten-free?', a: 'Only if the buckwheat noodles are made from 100% buckwheat with no wheat blended in. Many commercial soba noodles are a blend of buckwheat and wheat flour. Look for noodles specifically labeled as 100% buckwheat or certified gluten-free, and confirm with the shop what brand or source they use.' },
          { q: 'What should I ask a ramen shop before ordering gluten-free?', a: 'Three questions cover the essentials: first, are the noodles certified gluten-free; second, does the broth and tare use tamari or gluten-free soy sauce throughout; third, are gluten-free noodles cooked in separate water with clean utensils. A shop that can answer all three confidently has thought through their gluten-free preparation properly and is worth trusting.' },
        ]}
      />
    </main>
  )
}
