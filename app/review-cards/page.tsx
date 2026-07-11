import type { Metadata } from 'next'
import { QrCode, Star, Printer, LineChart } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import ReviewCardOrderForm from './review-card-order-form'
import { PRICE_LABEL } from './config'
import { getRestaurantBySlug } from '@/lib/restaurants'

export const metadata: Metadata = {
  title: 'Google Review Cards for Ramen Restaurants | Ramen Near You',
  description:
    'Turn happy customers into 5-star Google reviews. Get a print-ready QR review kit for your ramen restaurant — table tents, counter cards, and sticker-size QR codes that open your Google review page in one scan.',
  alternates: { canonical: 'https://www.ramennearyou.com/review-cards' },
}

const STEPS = [
  { icon: QrCode, title: 'We build your QR kit', text: 'Your card gets a QR code linked straight to your restaurant\'s "Write a review" popup on Google — one scan, zero typing.' },
  { icon: Printer, title: 'You print & place it', text: 'A print-ready kit: table tent, counter card, and small stickers for takeout bags and receipts. Print at home or any print shop.' },
  { icon: Star, title: 'Customers review in seconds', text: 'Happy diners scan at the table while the experience is fresh — the moment reviews actually get written.' },
  { icon: LineChart, title: 'We track your scans', text: 'Your QR routes through RamenNearYou, so we can count scans and fix or update the destination without you ever reprinting.' },
]

export default async function ReviewCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ restaurant?: string }>
}) {
  const { restaurant: restaurantSlug } = await searchParams
  const preselected = restaurantSlug ? getRestaurantBySlug(restaurantSlug) : null
  const initialPicked = preselected
    ? { slug: preselected.slug, name: preselected.name, city: preselected.city, stateCode: preselected.stateCode }
    : null

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden mb-6">
            <RestaurantImage src={pickStockPhoto('review-cards')} alt="A bowl of ramen" fill className="object-cover" sizes="672px" priority />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-4">
            <span className="text-[#B57F50] text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Google Review Cards
          </h1>
          <p className="text-[#6B6862] leading-relaxed max-w-md mx-auto">
            More Google reviews, without awkward asks. A print-ready QR kit that takes your
            customers straight to your review page — <strong className="text-[#1E2026]">{PRICE_LABEL}</strong>, one-time.
          </p>
        </div>

        {/* How it works */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-black/8 p-5">
              <Icon className="w-6 h-6 text-[#B57F50] mb-3" />
              <p className="font-semibold text-[#1E2026] text-sm mb-1">{title}</p>
              <p className="text-[#6B6862] text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <ReviewCardOrderForm initialPicked={initialPicked} />

        <p className="text-center text-xs text-[#9B9490] mt-6 max-w-md mx-auto">
          Every card sends every customer to the same public Google review page — no filtering,
          no gating, fully within Google&apos;s review policies.
        </p>
      </div>
      <Footer />
    </main>
  )
}
