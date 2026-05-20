import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CateringForm from './catering-form'

export const metadata: Metadata = {
  title: 'Ramen Catering Quotes',
  description: 'Need ramen catering for your event? Tell us your details and we\'ll personally match you with the best ramen caterers in your city — free, no commitment.',
}

export default function CateringPage() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Event Catering</p>
          <h1 className="font-serif text-4xl font-bold text-[#1E2026] mb-3">
            Ramen Catering Quotes
          </h1>
          <p className="text-[#6B6862] leading-relaxed mb-8">
            Tell us about your event and we&apos;ll personally match you with the best ramen caterers available in your area — free, no commitment.
          </p>
          <CateringForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
