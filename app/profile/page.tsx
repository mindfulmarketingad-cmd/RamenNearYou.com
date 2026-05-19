'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const inputClass =
  'w-full px-4 py-3 bg-[#1E2026] border border-white/10 rounded-lg text-white text-sm outline-none focus:border-[#77567A] transition-colors'

const brothOptions = ['Tonkotsu', 'Miso', 'Shoyu', 'Shio', 'Tsukemen', 'Chicken', 'All of them!']

interface Profile {
  display_name?: string
  bio?: string
  avatar_url?: string
  instagram?: string
  tiktok?: string
  twitter?: string
  favorite_broth?: string
  ramen_count?: number
}

function formatMemberSince(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savesCount, setSavesCount] = useState<number | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [twitter, setTwitter] = useState('')
  const [favoriteBroth, setFavoriteBroth] = useState('')
  const [ramenCount, setRamenCount] = useState<number | ''>('')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUser(u)
      setAuthChecked(true)
      if (!u) {
        router.push('/auth/login?redirectTo=/profile')
      }
    })
  }, [router])

  useEffect(() => {
    if (!user) return

    fetch('/api/profile')
      .then((r) => r.json())
      .then(({ profile: p }) => {
        if (p) {
          setProfile(p)
          setDisplayName(p.display_name ?? '')
          setBio(p.bio ?? '')
          setAvatarUrl(p.avatar_url ?? '')
          setInstagram(p.instagram ?? '')
          setTiktok(p.tiktok ?? '')
          setTwitter(p.twitter ?? '')
          setFavoriteBroth(p.favorite_broth ?? '')
          setRamenCount(p.ramen_count ?? '')
        }
      })

    fetch('/api/saves')
      .then((r) => r.json())
      .then(({ saves }) => setSavesCount(Array.isArray(saves) ? saves.length : 0))
  }, [user])

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const form = new FormData()
      form.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.urls?.[0]) {
        setAvatarUrl(data.urls[0])
      }
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          instagram,
          tiktok,
          twitter,
          favorite_broth: favoriteBroth,
          ramen_count: ramenCount === '' ? null : Number(ramenCount),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Failed to save.')
      } else {
        setProfile(data.profile)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      setSaveError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#2F323A] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#B0B3BB] text-sm">Loading&hellip;</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#2F323A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl font-bold text-white mb-8">My Profile</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#1E2026] border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Photo</h2>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#77567A]/20 border-2 border-[#77567A]/30 flex items-center justify-center text-2xl font-bold text-[#77567A]">
                      {userInitial}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors disabled:opacity-60"
                  >
                    <Camera className="w-4 h-4" />
                    {uploadingPhoto ? 'Uploading…' : 'Change photo'}
                  </button>
                  <p className="text-[#B0B3BB] text-xs mt-1.5">JPG, PNG or GIF, max 8 MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div className="bg-[#1E2026] border border-white/10 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Profile Info</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-white text-sm font-medium">Bio</label>
                  <span className="text-[#B0B3BB] text-xs">{bio.length}/200</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A few words about you and your love of ramen…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Favorite Broth</label>
                <select
                  value={favoriteBroth}
                  onChange={(e) => setFavoriteBroth(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select a broth…</option>
                  {brothOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Ramen Restaurants Visited</label>
                <input
                  type="number"
                  min={0}
                  value={ramenCount}
                  onChange={(e) => setRamenCount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-[#1E2026] border border-white/10 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Social Links</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BB] text-sm select-none">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">TikTok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BB] text-sm select-none">T@</span>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">Twitter / X</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BB] text-sm select-none">@</span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
            </div>

            {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
            {saveSuccess && <p className="text-green-400 text-sm">Profile saved successfully.</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 rounded-lg bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>

          <div className="mt-6 bg-[#1E2026] border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{savesCount ?? '—'}</p>
                <p className="text-[#B0B3BB] text-xs mt-1">Saved Restaurants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {ramenCount !== '' && ramenCount !== null ? ramenCount : (profile?.ramen_count ?? '—')}
                </p>
                <p className="text-[#B0B3BB] text-xs mt-1">Ramen Visited</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-snug">
                  {user.created_at ? formatMemberSince(user.created_at) : '—'}
                </p>
                <p className="text-[#B0B3BB] text-xs mt-1">Member Since</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
