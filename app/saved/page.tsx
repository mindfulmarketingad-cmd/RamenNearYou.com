import Link from 'next/link'
import { Heart } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SavedList from './saved-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saved Restaurants',
  description: 'Your saved ramen restaurants on Ramen Near You.',
}

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest">Your List</p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">Saved Restaurants</h1>
          <p className="text-[#B0B3BB] text-sm">
            Saved restaurants are stored in your browser.{' '}
            <Link href="/auth/login" className="text-[#77567A] hover:underline">Sign in</Link>{' '}
            to sync across devices.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <SavedList />
        </div>
      </section>

      <Footer />
    </main>
  )
}
