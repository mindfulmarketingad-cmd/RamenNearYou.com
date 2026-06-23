import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Family-Friendly Ramen Near Me | Ramen for Kids | RamenNearYou',
  description: 'Find family-friendly ramen restaurants near you — kid-welcoming spots with mild bowls and casual seating. Plus how I order ramen the whole family will eat.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-family-friendly' },
  openGraph: {
    title: 'Family-Friendly Ramen Near Me',
    description: 'Find kid-welcoming, family-friendly ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/ramen-family-friendly',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenFamilyFriendlyPage() {
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
          initialFlags={['family-friendly']}
          pageTitle="Family-Friendly Ramen Near Me"
          pageDescription="Showing family-friendly ramen restaurants. Enter your ZIP or use your location to find kid-welcoming spots near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-family-friendly"
        heading="How I Take the Whole Family Out for Ramen"
        intro={[
          'Ramen is honestly one of the easiest meals to take kids to. Noodles are a universal kid-pleaser, the bowls are endlessly customizable, and most shops are casual enough that nobody worries about a little noise or a dropped spoon. The map above is filtered to family-friendly ramen restaurants near you — enter your ZIP or use your location to find the closest welcoming spots.',
          'After plenty of family ramen nights, I have figured out how to keep everyone happy, from the picky six-year-old to the adult who wants the spicy bowl. Here is how I pick the right restaurant and order so it actually works for kids.',
        ]}
        sections={[
          {
            h2: 'What makes a ramen spot good for families',
            body: (
              <p>
                I look for a few practical things: casual seating with tables (not just a tight counter),
                a relaxed atmosphere, and a menu with mild options. Booth or table seating matters more than
                people expect — wrangling kids onto tall counter stools is a workout. The filter above surfaces
                spots flagged as family-friendly, which usually means they check these boxes.
              </p>
            ),
            points: [
              { h3: 'Table seating', text: 'Tables and booths beat counters for families. If you can, call ahead or check the listing to confirm they have them.' },
              { h3: 'Mild menu options', text: 'Shoyu and shio bowls are gentle and approachable. Many shops will also do plain noodles with broth, or let you dial spice down to zero.' },
              { h3: 'Quick service', text: 'Ramen comes out fast, which is a quiet superpower with hungry kids. Less waiting means fewer meltdowns.' },
            ],
          },
          {
            h2: 'How to order ramen kids will actually eat',
            body: (
              <p>
                The beauty of ramen is how customizable it is. For younger kids I order a mild shoyu or chicken
                bowl, ask for no spice, and have them keep toppings simple — noodles, broth, maybe a soft egg
                and some corn. Many shops are happy to serve plain buttered or broth-only noodles for the
                littlest eaters, and gyoza or edamame make easy, familiar sides everyone can share.
              </p>
            ),
            points: [
              { h3: 'Start mild', text: 'A no-spice shoyu, shio, or chicken paitan bowl is the safest bet for new ramen eaters.' },
              { h3: 'Share sides', text: 'Gyoza, edamame, and rice are familiar, low-risk orders that fill in around the noodles.' },
              { h3: 'Customize freely', text: 'Ask for noodles cut, toppings on the side, or broth-only — most shops will happily adjust for kids.' },
            ],
          },
          {
            h2: 'Making the outing smooth',
            body: (
              <p>
                Timing helps a lot. Going a little before the dinner rush means quieter rooms, faster food, and
                easier seating. If you need a high chair or a big table, open the listing and call ahead — it is
                the only sure way to confirm. And if you want a guaranteed table for a bigger crew, stack the
                “Takes Reservations” filter with this one.
              </p>
            ),
          },
        ]}
        tipsHeading="My family ramen tips"
        tips={[
          'Filter to “Family-Friendly,” then sort by distance for the nearest welcoming spot.',
          'Go a little before the dinner rush for quieter rooms and faster food.',
          'Order mild shoyu, shio, or chicken bowls with no spice for younger kids.',
          'Lean on gyoza, edamame, and rice as familiar shared sides.',
          'Call ahead to confirm high chairs or a big table — stack “Takes Reservations” for groups.',
        ]}
        faqs={[
          { q: 'Which ramen restaurants are family-friendly near me?', a: 'The map above is filtered to family-friendly spots. Enter your ZIP or tap “Use my location” to find kid-welcoming restaurants nearby.' },
          { q: 'Is ramen good for kids?', a: 'Yes — noodles are a kid favorite, and many shops offer mild shoyu, shio, or chicken bowls, plain noodles, and no-spice options. Gyoza and edamame round out an easy, familiar meal.' },
          { q: 'Do ramen restaurants have high chairs?', a: 'Many casual ones do, but it varies. Open the listing, call ahead, and confirm high chairs and table seating before you go.' },
          { q: 'What ramen should I order for a picky eater?', a: 'Start with a mild, no-spice shoyu or chicken bowl and keep toppings simple. Many shops will also do broth-only or plain noodles for the youngest eaters.' },
          { q: 'When is the best time to bring kids for ramen?', a: 'A bit before the dinner rush. You get quieter rooms, faster service, and easier seating, which makes the whole outing smoother with kids.' },
        ]}
      />
    </main>
  )
}
