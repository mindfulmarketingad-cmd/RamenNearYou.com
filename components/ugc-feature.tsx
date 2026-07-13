'use client'

import { VideoTile } from '@/components/ugc-grid'
import { UGC_VIDEOS } from '@/lib/ugc-videos'

// Deterministic pick so a given page always shows the same clip, but
// different pages get variety across the curated set.
function pickVideoIndex(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return hash % UGC_VIDEOS.length
}

// A single featured UGC clip, used on the individual /find pages (one video
// each rather than the full homepage grid).
export default function UgcFeature({ seed }: { seed: string }) {
  if (UGC_VIDEOS.length === 0) return null
  const video = UGC_VIDEOS[pickVideoIndex(seed)]

  return (
    <section className="py-12 px-4 sm:px-6 bg-[#F5F4F0] border-t border-black/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">From the community</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-6">See ramen in the wild</h2>
        <div className="max-w-[280px]">
          <VideoTile video={video} />
        </div>
      </div>
    </section>
  )
}
