import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import CateringForm from './catering-form'

export const metadata: Metadata = {
  title: 'Ramen Catering Near Me | Get Free Ramen Catering Quotes | RamenNearYou',
  description: 'Need ramen catering for your event? Tell us your details and we\'ll match you with the best ramen caterers in your city — free, no commitment. Plus how ramen catering works, formats, and what it costs.',
  alternates: { canonical: 'https://www.ramennearyou.com/catering' },
  openGraph: {
    title: 'Ramen Catering Near Me | Free Quotes',
    description: 'Get matched with the best ramen caterers near you for your event — free and no commitment.',
    url: 'https://www.ramennearyou.com/catering',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'How does ramen catering work?',
    a: 'Most ramen caterers offer one of a few formats: a live ramen bar where a chef assembles bowls to order, pre-portioned bowls or DIY kits, or large-batch broth and noodles served buffet-style. You tell us your event details and we match you with caterers near you who fit your headcount, budget, and style — then they send you quotes directly.',
  },
  {
    q: 'How much does ramen catering cost?',
    a: 'It varies widely by format, headcount, and location, but live ramen-bar service generally runs more per head than buffet or drop-off because it includes on-site chefs and equipment. Toppings, premium broths, dietary accommodations, travel, and staffing all affect the price. The fastest way to get a real number is to request quotes through the form above.',
  },
  {
    q: 'Is ramen good food for events?',
    a: 'Ramen is a fantastic event food — it is interactive, customizable for dietary needs, and memorable in a way standard catering rarely is. A build-your-own ramen bar especially is a crowd-pleaser at weddings, corporate events, and parties because guests get a hot, fresh bowl tailored to their taste.',
  },
  {
    q: 'Can ramen catering accommodate vegan, vegetarian, and allergies?',
    a: 'Yes. Most ramen caterers can offer vegan and vegetarian broths (mushroom, kombu, miso) and gluten-free noodle options with notice. Always list your dietary needs when you request quotes so caterers can confirm they can accommodate them.',
  },
  {
    q: 'How far in advance should I book ramen catering?',
    a: 'For small gatherings, a couple of weeks is often enough. For weddings, large corporate events, or popular dates, book four to eight weeks ahead. Submitting your details early gives caterers time to plan a live bar, staffing, and equipment.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function CateringPage() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-8">
            <RestaurantImage src={pickStockPhoto('catering')} alt="Ramen bowls for a catered event" fill className="object-cover" sizes="672px" priority />
          </div>
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Event Catering</p>
          <h1 className="font-serif text-4xl font-bold text-[#1E2026] mb-3">
            Ramen Catering Near Me
          </h1>
          <p className="text-[#6B6862] leading-relaxed mb-8">
            Tell us about your event and we&apos;ll personally match you with the best ramen caterers available in your area — free, no commitment.
          </p>
          <CateringForm />
        </div>
      </section>

      {/* SEO article — first-person, genuinely useful guide to ramen catering */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-4">
            Why I think ramen is the best catering you can book
          </h2>
          <p className="text-[#6B6862] text-[15px] leading-relaxed mb-4">
            I have sat through a lot of forgettable catered meals — the lukewarm trays, the sad
            sandwich platters. Ramen is the opposite of that. It shows up hot, it is built to each
            guest&apos;s taste, and there is something about a steaming bowl with the toppings you chose
            that makes an event feel special. Whether it is a wedding, an office lunch, or a birthday,
            ramen catering turns the food into part of the experience instead of an afterthought.
          </p>
          <p className="text-[#6B6862] text-[15px] leading-relaxed mb-4">
            Use the form above to tell us your date, headcount, location, and budget, and we&apos;ll
            match you with caterers near you who fit. Below is what I have learned about how ramen
            catering actually works so you know what to ask for.
          </p>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3 mt-10">
            The main ramen catering formats
          </h2>
          <p className="text-[#6B6862] text-[15px] leading-relaxed mb-4">
            Not all ramen catering looks the same. Knowing the formats helps you pick what fits your
            venue and vibe.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-[#1E2026] font-semibold text-base mb-1">Live ramen bar</h3>
              <p className="text-[#6B6862] text-[15px] leading-relaxed">
                A chef assembles bowls to order on-site, often letting guests choose broth, noodles, and
                toppings. It is the most interactive and memorable option — my favorite for weddings and
                bigger celebrations — though it costs more because it includes staff and equipment.
              </p>
            </div>
            <div>
              <h3 className="text-[#1E2026] font-semibold text-base mb-1">Buffet or family-style</h3>
              <p className="text-[#6B6862] text-[15px] leading-relaxed">
                Large batches of broth, noodles, and toppings set out so guests serve themselves. Great
                for offices and casual parties where you want volume and value without on-site chefs.
              </p>
            </div>
            <div>
              <h3 className="text-[#1E2026] font-semibold text-base mb-1">Drop-off and DIY kits</h3>
              <p className="text-[#6B6862] text-[15px] leading-relaxed">
                Pre-portioned bowls or assemble-at-home kits with broth, noodles, and toppings packed
                separately. The most budget-friendly route, and a fun option for smaller groups or
                hybrid events.
              </p>
            </div>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3 mt-10">
            Events ramen catering is perfect for
          </h2>
          <p className="text-[#6B6862] text-[15px] leading-relaxed mb-4">
            I have seen ramen work beautifully across all kinds of occasions. A few where it really
            shines:
          </p>
          <ul className="space-y-2.5 mb-4">
            {[
              'Weddings and rehearsal dinners — a late-night ramen bar is an unforgettable touch.',
              'Corporate lunches and team events — interactive, fast, and accommodating of dietary needs.',
              'Birthdays and house parties — a build-your-own bar everyone gathers around.',
              'Graduations and holidays — hearty, comforting, and easy to scale to a crowd.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[#6B6862] text-[15px] leading-relaxed">
                <span className="text-[#B57F50] shrink-0 mt-0.5">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3 mt-10">
            What I&apos;d ask before booking
          </h2>
          <p className="text-[#6B6862] text-[15px] leading-relaxed mb-4">
            To get an accurate quote and avoid surprises, I always nail down a few things up front: the
            final headcount and service style, whether vegan, vegetarian, and gluten-free options are
            available, how setup and cleanup are handled, whether staffing and equipment are included,
            and the travel radius. Spelling these out when you request quotes lets caterers price the
            job accurately the first time.
          </p>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-5 mt-10">
            Ramen catering FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                  {q}
                  <span className="text-[#B57F50] shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </article>
      </section>
      <Footer />
    </main>
  )
}
