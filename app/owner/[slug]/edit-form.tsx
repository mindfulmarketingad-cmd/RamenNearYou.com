'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Star, Upload, Loader2 } from 'lucide-react'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  slug: string
  restaurantName: string
  initial: {
    description: string
    phone: string
    website: string
    menu_link: string
    hours: Record<string, string[] | string>
  }
}

interface Review {
  id: string
  rating: number
  body: string | null
  user_display_name: string
  created_at: string
}

interface ReviewWithResponse extends Review {
  pendingResponse?: string | null
  approvedResponse?: string | null
}

function hoursToString(slots: string[] | string | undefined): string {
  if (!slots) return ''
  if (typeof slots === 'string') return slots
  if (Array.isArray(slots)) {
    if (slots[0] === 'Closed') return 'Closed'
    return slots.join(' · ')
  }
  return ''
}

function stringToSlots(s: string): string[] {
  const trimmed = s.trim()
  if (!trimmed) return []
  if (trimmed.toLowerCase() === 'closed') return ['Closed']
  return trimmed.split(/\s*[·,|]\s*/).filter(Boolean)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </span>
  )
}

export default function OwnerEditForm({ slug, restaurantName, initial }: Props) {
  const initHours: Record<string, string> = Object.fromEntries(
    DAY_ORDER.map(d => [d, hoursToString(initial.hours[d])])
  )

  const [description, setDescription] = useState(initial.description)
  const [phone, setPhone] = useState(initial.phone)
  const [website, setWebsite] = useState(initial.website)
  const [menuLink, setMenuLink] = useState(initial.menu_link)
  const [hours, setHours] = useState<Record<string, string>>(initHours)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Photo upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoSuccess, setPhotoSuccess] = useState('')
  const [photoError, setPhotoError] = useState('')

  // Review responses state
  const [reviews, setReviews] = useState<ReviewWithResponse[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [openResponseId, setOpenResponseId] = useState<string | null>(null)
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({})
  const [responseSubmitting, setResponseSubmitting] = useState<string | null>(null)
  const [responseMessages, setResponseMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    setReviewsLoading(true)
    fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(async (data) => {
        const rawReviews: Review[] = data.reviews ?? []
        if (!rawReviews.length) {
          setReviews([])
          return
        }
        // Load pending/approved responses for this slug
        const editRes = await fetch(`/api/owner/listing-edit-requests?slug=${encodeURIComponent(slug)}&type=review_response`)
        let pendingMap: Record<string, { status: string; response: string }> = {}
        if (editRes.ok) {
          const editData = await editRes.json()
          const edits: Array<{ payload: { review_id: string; response: string }; status: string }> = editData.edits ?? []
          for (const e of edits) {
            pendingMap[e.payload.review_id] = { status: e.status, response: e.payload.response }
          }
        }
        setReviews(rawReviews.map(r => ({
          ...r,
          pendingResponse: pendingMap[r.id]?.status === 'pending' ? pendingMap[r.id].response : null,
          approvedResponse: pendingMap[r.id]?.status === 'approved' ? pendingMap[r.id].response : null,
        })))
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const hoursPayload: Record<string, string[]> = {}
    for (const day of DAY_ORDER) {
      const slots = stringToSlots(hours[day] ?? '')
      if (slots.length > 0) hoursPayload[day] = slots
    }

    try {
      const res = await fetch('/api/owner/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          restaurant_name: restaurantName,
          description: description.trim(),
          phone: phone.trim(),
          website: website.trim(),
          menu_link: menuLink.trim(),
          hours: hoursPayload,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 5000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPhotoUploading(true)
    setPhotoError('')
    setPhotoSuccess('')
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed')

      const submitRes = await fetch('/api/owner/submit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, restaurant_name: restaurantName, urls: uploadData.urls }),
      })
      const submitData = await submitRes.json()
      if (!submitRes.ok) throw new Error(submitData.error ?? 'Submit failed')
      setPhotoSuccess(`${files.length} photo${files.length === 1 ? '' : 's'} submitted for review.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleResponseSubmit(review: ReviewWithResponse) {
    const response = responseDrafts[review.id]?.trim()
    if (!response) return
    setResponseSubmitting(review.id)
    try {
      const res = await fetch('/api/owner/review-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          restaurant_name: restaurantName,
          review_id: review.id,
          review_body: review.body ?? '',
          response,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResponseMessages(prev => ({ ...prev, [review.id]: data.error ?? 'Failed to submit' }))
      } else {
        setResponseMessages(prev => ({ ...prev, [review.id]: 'Response pending approval' }))
        setOpenResponseId(null)
        setReviews(prev =>
          prev.map(r => r.id === review.id ? { ...r, pendingResponse: response } : r)
        )
      }
    } catch {
      setResponseMessages(prev => ({ ...prev, [review.id]: 'Network error' }))
    } finally {
      setResponseSubmitting(null)
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}
        {saved && (
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Submitted for review — your edits will go live once approved by our team.
          </div>
        )}

        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Listing Content</h2>

          <div>
            <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell customers what makes your ramen special…"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 555-123-4567"
                className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Website</label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://yourrestaurant.com"
                className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Menu Link</label>
            <input
              type="url"
              value={menuLink}
              onChange={e => setMenuLink(e.target.value)}
              placeholder="https://yourrestaurant.com/menu"
              className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Business Hours</h2>
          <p className="text-[#6B6862] text-xs">Format: <span className="text-[#1E2026]">11AM-10PM</span> or use <span className="text-[#1E2026]">Closed</span>. Separate multiple shifts with <span className="text-[#1E2026]">·</span></p>
          <div className="space-y-2 pt-1">
            {DAY_ORDER.map(day => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-[#6B6862] text-sm w-24 flex-shrink-0">{day}</span>
                <input
                  value={hours[day]}
                  onChange={e => setHours(prev => ({ ...prev, [day]: e.target.value }))}
                  placeholder="11AM-10PM"
                  className="flex-1 px-3 py-2 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/40 text-sm outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Submit for Review'}
        </button>
      </form>

      {/* Photos section */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#1E2026]">Photos</h2>
        <p className="text-[#6B6862] text-xs">Upload photos to showcase your restaurant. Photos are reviewed by our team before going live.</p>

        {photoError && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{photoError}</div>
        )}
        {photoSuccess && (
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {photoSuccess}
          </div>
        )}

        <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-black/15 bg-white cursor-pointer hover:border-sky-400 transition-colors ${photoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={photoUploading}
          />
          {photoUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <Upload className="w-4 h-4 text-[#6B6862]" />
          )}
          <span className="text-sm text-[#6B6862]">
            {photoUploading ? 'Uploading…' : 'Choose photos to upload (max 8)'}
          </span>
        </label>
      </div>

      {/* Review Responses section */}
      <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#1E2026]">Review Responses</h2>
        <p className="text-[#6B6862] text-xs">Respond to customer reviews. Responses are reviewed by our team before going live.</p>

        {reviewsLoading && (
          <div className="flex items-center gap-2 text-[#9B9490] text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading reviews…
          </div>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <p className="text-[#9B9490] text-sm py-4">No reviews yet.</p>
        )}

        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg border border-black/5 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <StarRating rating={review.rating} />
                    <span className="text-[#1E2026] text-sm font-medium">{review.user_display_name}</span>
                  </div>
                  <p className="text-[#9B9490] text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {review.body && (
                <p className="text-[#1E2026] text-sm mb-3">{review.body}</p>
              )}

              {review.approvedResponse && (
                <div className="mt-2 border-l-2 border-sky-300 pl-3">
                  <p className="text-[#9B9490] text-xs mb-0.5">Your response</p>
                  <p className="text-[#1E2026] text-sm">{review.approvedResponse}</p>
                </div>
              )}

              {review.pendingResponse && !review.approvedResponse && (
                <div className="mt-2 border-l-2 border-amber-300 pl-3">
                  <p className="text-amber-600 text-xs font-medium">Response pending approval</p>
                  <p className="text-[#6B6862] text-sm italic">{review.pendingResponse}</p>
                </div>
              )}

              {!review.approvedResponse && !review.pendingResponse && (
                <div className="mt-2">
                  {openResponseId === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={responseDrafts[review.id] ?? ''}
                        onChange={e => setResponseDrafts(prev => ({ ...prev, [review.id]: e.target.value }))}
                        placeholder="Write your response to this review…"
                        className="w-full px-3 py-2 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-sky-500 transition-colors resize-none"
                      />
                      {responseMessages[review.id] && (
                        <p className="text-sm text-emerald-600">{responseMessages[review.id]}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleResponseSubmit(review)}
                          disabled={responseSubmitting === review.id || !responseDrafts[review.id]?.trim()}
                          className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {responseSubmitting === review.id && <Loader2 className="w-3 h-3 animate-spin" />}
                          Submit Response
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenResponseId(null)}
                          className="px-4 py-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-[#6B6862] text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenResponseId(review.id)}
                      className="text-sky-500 hover:text-sky-400 text-xs font-medium transition-colors"
                    >
                      Respond to this review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
