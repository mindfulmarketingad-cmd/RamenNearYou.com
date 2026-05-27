'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Camera, LogIn, Trash2, X, ChevronLeft, ChevronRight, Upload, Loader2, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Photo = {
  id: string
  user_id: string
  user_display_name: string
  url: string
  created_at: string
}

interface Props {
  restaurantSlug: string
  restaurantName: string
}

export default function PhotoSection({ restaurantSlug, restaurantName }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fetchPhotos = useCallback(() => {
    fetch(`/api/photos?slug=${restaurantSlug}`)
      .then(r => r.json())
      .then(({ photos }) => setPhotos(photos ?? []))
      .finally(() => setLoading(false))
  }, [restaurantSlug])

  useEffect(() => {
    fetchPhotos()
    import('@/lib/supabase/client').then(({ createClient }) => {
      const client = createClient()
      if (!client) return
      client.auth.getUser().then(({ data: { user } }) => {
        setUserId(user?.id ?? null)
      })
    })
  }, [fetchPhotos])

  function handleAddPhotos() {
    if (!userId) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (files.length > 8) {
      setUploadError('Max 8 photos at a time')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      // Upload to storage
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')

      // Save to DB
      const saveRes = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_slug: restaurantSlug, urls: uploadData.urls }),
      })
      const saveData = await saveRes.json()
      if (!saveRes.ok) throw new Error(saveData.error || 'Save failed')

      fetchPhotos()
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    await fetch(`/api/photos?id=${id}`, { method: 'DELETE' })
    fetchPhotos()
  }

  const visible = showAll ? photos : photos.slice(0, 9)

  return (
    <section>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-[#1E2026]">
            Community Photos
          </h2>
          {photos.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 text-[#B57F50] text-xs font-semibold">
              {photos.length}
            </span>
          )}
        </div>
        <button
          onClick={handleAddPhotos}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] transition-colors border border-[#B57F50]/20 disabled:opacity-50"
        >
          {uploading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
          ) : userId ? (
            <><Camera className="w-3.5 h-3.5" /> Add Photos</>
          ) : (
            <><LogIn className="w-3.5 h-3.5" /> Sign in to Add Photos</>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="text-red-500 text-xs mb-4">{uploadError}</p>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="text-[#6B6862] text-sm">Loading photos…</div>
      ) : photos.length === 0 ? (
        <div className="bg-[#F5F4F0] rounded-xl border border-black/5 p-8 text-center">
          <p className="text-[#6B6862] text-sm mb-3">
            No community photos yet. Be the first to share a photo of {restaurantName}!
          </p>
          <button
            onClick={handleAddPhotos}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Add Photos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {visible.map((photo, idx) => (
              <div key={photo.id} className="relative group aspect-square">
                <button
                  onClick={() => setLightboxIndex(idx)}
                  className="w-full h-full rounded-xl overflow-hidden bg-[#F5F4F0] hover:opacity-90 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={`Photo by ${photo.user_display_name}`}
                    className="w-full h-full object-cover"
                  />
                </button>
                {userId === photo.user_id && (
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-1.5 py-0.5 bg-black/60 rounded text-white text-[10px] truncate max-w-[100px] block">
                    {photo.user_display_name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {photos.length > 9 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-2.5 flex items-center justify-center gap-1.5 text-[#6B6862] hover:text-[#1E2026] text-sm transition-colors border border-black/5 rounded-xl hover:bg-black/5"
            >
              <ChevronDown className="w-4 h-4" />
              Show all {photos.length} photos
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1) }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIndex].url}
              alt=""
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
            <p className="text-white/50 text-xs text-center mt-2">
              Photo by {photos[lightboxIndex].user_display_name} · {new Date(photos[lightboxIndex].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Next */}
          {lightboxIndex < photos.length - 1 && (
            <button
              className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1) }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  )
}
