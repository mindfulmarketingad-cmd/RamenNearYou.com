'use client'

import { useState, useRef } from 'react'
import { X, Star, ImagePlus, Loader2, Trash2 } from 'lucide-react'

interface Props {
  restaurantSlug: string
  restaurantName: string
  onClose: () => void
  onSubmitted: () => void
}

export default function ReviewModal({ restaurantSlug, restaurantName, onClose, onSubmitted }: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [body, setBody] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 5 - photoFiles.length)
    setPhotoFiles(prev => [...prev, ...newFiles].slice(0, 5))
    newFiles.forEach(f => {
      const url = URL.createObjectURL(f)
      setPreviews(prev => [...prev, url].slice(0, 5))
    })
  }

  function removePhoto(i: number) {
    setPhotoFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    setSubmitting(true)
    setError('')

    try {
      let uploadedUrls: string[] = []

      if (photoFiles.length > 0) {
        const fd = new FormData()
        photoFiles.forEach(f => fd.append('files', f))
        const up = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!up.ok) {
          const { error: upErr } = await up.json()
          throw new Error(upErr || 'Photo upload failed')
        }
        const { urls } = await up.json()
        uploadedUrls = urls
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_slug: restaurantSlug,
          rating,
          body: body.trim() || null,
          photos: uploadedUrls,
        }),
      })

      if (!res.ok) {
        const { error: err } = await res.json()
        throw new Error(err || 'Failed to submit review')
      }

      onSubmitted()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-[#F5F4F0] rounded-t-2xl sm:rounded-2xl border border-black/8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <h2 className="text-[#1E2026] font-semibold">Write a Review</h2>
            <p className="text-[#6B6862] text-xs mt-0.5 truncate">{restaurantName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
          {/* Star rating */}
          <div>
            <label className="text-[#6B6862] text-xs font-medium mb-2 block">Your Rating *</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      s <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-[#1E2026]/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="text-[#6B6862] text-xs font-medium mb-2 block">
              Your Review <span className="text-[#1E2026]/30">(optional)</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your experience — broth, noodles, service, atmosphere…"
              rows={4}
              maxLength={1000}
              className="w-full bg-[#ffffff] border border-black/8 rounded-lg px-4 py-3 text-[#1E2026] text-sm placeholder-[#9B9490]/40 outline-none focus:border-[#B57F50]/50 resize-none"
            />
            <p className="text-[#1E2026]/30 text-xs text-right mt-1">{body.length}/1000</p>
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-[#6B6862] text-xs font-medium mb-2 block">
              Photos <span className="text-[#1E2026]/30">(up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#ffffff] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-[#1E2026]" />
                  </button>
                </div>
              ))}
              {photoFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 rounded-lg border border-dashed border-black/12 hover:border-[#B57F50]/50 flex flex-col items-center justify-center gap-1 text-[#6B6862] hover:text-[#B57F50] transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[10px]">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#B57F50] hover:bg-[#c8934f] disabled:opacity-50 disabled:cursor-not-allowed text-[#1E2026] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
