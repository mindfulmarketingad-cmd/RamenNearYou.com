'use client'

import { useEffect, useState, useCallback } from 'react'
import { Star, ImageIcon, PenLine, Trash2, LogIn, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const ReviewModal = dynamic(() => import('./review-modal'), { ssr: false })

type Review = {
  id: string
  user_display_name: string
  rating: number
  body: string | null
  photos: string[]
  created_at: string
  user_id: string
}

interface Props {
  restaurantSlug: string
  restaurantName: string
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#1E2026]/20'}`}
        />
      ))}
    </span>
  )
}

export default function ReviewSection({ restaurantSlug, restaurantName }: Props) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const fetchReviews = useCallback(() => {
    fetch(`/api/reviews?slug=${restaurantSlug}`)
      .then(r => r.json())
      .then(({ reviews }) => setReviews(reviews ?? []))
      .finally(() => setLoading(false))
  }, [restaurantSlug])

  useEffect(() => {
    fetchReviews()
    // Check auth
    import('@/lib/supabase/client').then(({ createClient }) => {
      const client = createClient()
      if (!client) return
      client.auth.getUser().then(({ data: { user } }) => {
        setUserId(user?.id ?? null)
      })
    })
  }, [fetchReviews])

  async function handleDelete(id: string) {
    if (!confirm('Delete your review?')) return
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  function handleWriteReview() {
    if (!userId) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setShowModal(true)
  }

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const visible = showAll ? reviews : reviews.slice(0, 3)

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-[#1E2026]">
            Community Reviews
          </h2>
          {avgRating && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 text-xs font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-[#1E2026]/40 text-xs">({reviews.length})</span>
            </span>
          )}
        </div>
        <button
          onClick={handleWriteReview}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] transition-colors border border-[#B57F50]/20"
        >
          {userId ? (
            <><PenLine className="w-3.5 h-3.5" /> Write a Review</>
          ) : (
            <><LogIn className="w-3.5 h-3.5" /> Sign in to Review</>
          )}
        </button>
      </div>

      {/* Review cards */}
      {loading ? (
        <div className="text-[#6B6862] text-sm">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-8 text-center">
          <p className="text-[#6B6862] text-sm mb-3">No reviews yet. Be the first!</p>
          <button
            onClick={handleWriteReview}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <PenLine className="w-4 h-4" />
            Write a Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(review => (
            <article key={review.id} className="bg-[#F5F4F0] rounded-xl border border-black/5 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#1E2026] text-sm font-medium">{review.user_display_name}</span>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <p className="text-[#1E2026]/30 text-xs">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                {userId === review.user_id && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 text-[#1E2026]/20 hover:text-red-400 transition-colors rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {review.body && (
                <p className="text-[#6B6862] text-sm leading-relaxed mb-3">{review.body}</p>
              )}

              {review.photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.photos.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(src)}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#ffffff] hover:opacity-80 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 && review.photos.length > 1 && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-[#1E2026]/70" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}

          {reviews.length > 3 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-2.5 flex items-center justify-center gap-1.5 text-[#6B6862] hover:text-[#1E2026] text-sm transition-colors border border-black/5 rounded-xl hover:bg-black/5"
            >
              <ChevronDown className="w-4 h-4" />
              Show all {reviews.length} reviews
            </button>
          )}
        </div>
      )}

      {/* Review modal */}
      {showModal && (
        <ReviewModal
          restaurantSlug={restaurantSlug}
          restaurantName={restaurantName}
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setShowModal(false)
            fetchReviews()
          }}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  )
}
