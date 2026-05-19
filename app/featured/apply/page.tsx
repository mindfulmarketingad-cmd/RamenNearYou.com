import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FeaturedApplyForm from './featured-form'

export const metadata = {
  title: 'Get a Featured Listing | Ramen Near You',
  description: 'Promote your ramen restaurant on the Ramen Near You homepage for only $29.99/month.',
}

export default async function FeaturedApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { cancelled } = await searchParams

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">Featured Listing</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">
            Put Your Restaurant on the Map
          </h1>
          <p className="text-[#B0B3BB] leading-relaxed">
            Featured listings appear prominently on the Ramen Near You homepage and reach thousands of ramen lovers every month. Upload up to 8 photos, add your story, and get in front of customers actively searching for ramen.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[#B0B3BB]">
            {[
              'Homepage placement — visible to all visitors',
              'Up to 8 high-quality photos of your restaurant',
              'Featured badge on your listing',
              'Cancel anytime — no long-term commitment',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 inline-flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">$29.99</span>
            <span className="text-[#B0B3BB]">/ month</span>
          </div>
        </div>

        {cancelled === '1' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            Payment was cancelled. Your information is saved — complete checkout when you&apos;re ready.
          </div>
        )}

        <FeaturedApplyForm />
      </div>
      <Footer />
    </main>
  )
}
