import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ListForm from './list-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Your Ramen Restaurant',
  description: 'Submit your ramen restaurant to the Ramen Near You directory. Free listing, reviewed within 2–3 business days.',
}

export default function ListPage() {
  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Free Listing</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Submit Your Restaurant</h1>
          <p className="text-[#B0B3BB] mb-8 leading-relaxed">
            Fill out the form below to submit your ramen restaurant. We review every submission before it goes live — usually within 2–3 business days.
          </p>
          <ListForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
