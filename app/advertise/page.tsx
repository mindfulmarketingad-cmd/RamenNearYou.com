import Link from 'next/link'
import { BarChart3, Megaphone, MapPin, PenLine, Mail } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CONTACT_EMAIL } from '@/lib/mailto'

export const metadata = {
  title: 'Advertise on RamenNearYou | Ramen Near You',
  description:
    'Reach diners looking for ramen: city and state page banners from $100 per 6 months and sponsored blog posts from $150. Email us for availability.',
  alternates: { canonical: 'https://www.ramennearyou.com/advertise' },
}

// Brand / sponsor advertising (the HappyCow-style rate card). There is no
// self-serve checkout: every placement is quoted and placed by hand, so the
// CTA is an email. Restaurant owners are pointed at /featured-listing.
const OPTIONS = [
  {
    icon: MapPin,
    name: 'City or state page banner',
    price: 'From $100 per 6 months',
    detail: 'A banner on a city or state ramen page — about $100–$300 per 6 months depending on the market. Good for ramen brands, noodle makers, Asian grocers and local food businesses.',
    subject: 'Advertising: city/state banner',
  },
  {
    icon: PenLine,
    name: 'Sponsored blog post',
    price: 'From $150 per post',
    detail: 'A post on the RamenNearYou blog about your product, event or restaurant, clearly labelled as sponsored. You review it before it goes live.',
    subject: 'Advertising: sponsored post',
  },
]

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <Megaphone className="w-3.5 h-3.5 text-brand-ink" />
            <span className="text-brand-ink text-xs font-medium uppercase tracking-widest">Advertise</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">Advertise on RamenNearYou</h1>
          <p className="text-ink-soft leading-relaxed">
            Put your brand in front of people actively looking for ramen, city by city.
            Every placement is labelled as advertising.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {OPTIONS.map(({ icon: Icon, name, price, detail, subject }) => (
            <div key={name} className="flex flex-col rounded-2xl border border-line/10 bg-sunken p-6">
              <Icon className="w-5 h-5 text-brand-ink mb-3" />
              <h2 className="font-semibold text-ink mb-1">{name}</h2>
              <p className="font-serif text-2xl font-bold text-ink mb-3">{price}</p>
              <p className="text-ink-soft text-sm leading-relaxed mb-5 flex-1">{detail}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hi RamenNearYou — I’d like to ask about advertising.\n\nCompany:\nPlacement / city:\nDates:\n')}`}
                className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
              >
                <Mail className="w-4 h-4" /> Ask about availability
              </a>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-4 p-5 mb-10 rounded-2xl border border-line/10 bg-sunken hover:border-brand/40 transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-brand-ink shrink-0" />
          <span className="text-sm text-ink">
            <strong>See our traffic first.</strong>{' '}
            <span className="text-ink-soft">Our analytics dashboard is public — visitors, searches and listing clicks.</span>
          </span>
        </Link>

        <p className="text-center text-ink-soft text-sm leading-relaxed">
          Own a ramen restaurant? Get placed first in your city with a{' '}
          <Link href="/featured-listing" className="text-brand-ink font-semibold hover:underline">Featured or Premium listing</Link>.
          <br />
          Anything else:{' '}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Advertising`} className="text-brand-ink font-semibold hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </div>
      <Footer />
    </main>
  )
}
