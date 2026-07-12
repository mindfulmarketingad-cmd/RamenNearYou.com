'use client'

import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { UGC_VIDEOS, type UgcVideo } from '@/lib/ugc-videos'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-1.02-.88-1.66-2.18-1.66-3.62h-3.06v13.44c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.3 0 .59.05.86.13V9.63a6.15 6.15 0 0 0-.86-.06 6.06 6.06 0 1 0 6.06 6.06V8.28a8.16 8.16 0 0 0 4.78 1.53V6.75a5.06 5.06 0 0 1-3.12-.93z"/>
    </svg>
  )
}

// TikTok's oEmbed endpoint is public (no key), used only to fetch a
// thumbnail + title for TikTok entries client-side. YouTube thumbnails are
// a static, keyless URL so they need no fetch at all.
function useTikTokMeta(url: string, enabled: boolean) {
  const [meta, setMeta] = useState<{ thumbnail_url?: string; title?: string } | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setMeta(d) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [url, enabled])
  return meta
}

function VideoTile({ video }: { video: UgcVideo }) {
  const [playing, setPlaying] = useState(false)
  const tiktokMeta = useTikTokMeta(video.url, video.platform === 'tiktok' && !playing)

  const thumbnail = video.platform === 'youtube'
    ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
    : tiktokMeta?.thumbnail_url

  const embedSrc = video.platform === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1`
    : null

  if (playing && embedSrc) {
    return (
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black">
        <iframe
          src={embedSrc}
          title={video.caption}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  function handleClick() {
    if (embedSrc) {
      setPlaying(true)
    } else {
      // TikTok has no lightweight iframe-only embed — send the click
      // straight to the app/site instead of loading TikTok's heavier
      // embed script.
      window.open(video.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#1E2026] block w-full text-left"
    >
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={video.caption}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#B57F50]/30 to-[#1E2026]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Platform badge */}
      <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide">
        {video.platform === 'tiktok' ? <TikTokIcon className="w-3 h-3" /> : null}
        {video.platform === 'youtube' ? 'Shorts' : 'TikTok'}
      </span>

      {/* Play button */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg group-hover:scale-110 group-hover:bg-white transition-all">
          <Play className="w-6 h-6 text-[#1E2026] fill-[#1E2026] ml-0.5" />
        </span>
      </span>

      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-snug line-clamp-2">
        {tiktokMeta?.title ?? video.caption}
      </p>
    </button>
  )
}

export default function UgcGrid() {
  if (UGC_VIDEOS.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">From the community</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">Ramen Near You, in the wild</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {UGC_VIDEOS.map((video) => (
            <VideoTile key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
