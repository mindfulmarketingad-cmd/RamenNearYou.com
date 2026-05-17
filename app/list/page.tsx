import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ListForm from './list-form'

export const metadata = { title: 'List Your Restaurant — RamenNearYou' }

export default async function ListPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/auth/login?redirectTo=/list')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/list')

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Free Listing</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">List Your Restaurant</h1>
          <p className="text-[#B0B3BB] mb-8">Add your ramen restaurant to the directory. Listings are reviewed before going live.</p>
          <ListForm userId={user.id} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
