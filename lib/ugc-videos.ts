// Curated UGC video grid for the homepage. Add/remove entries here — no
// live API polling (YouTube quota, no public TikTok API for arbitrary
// content), just a hand-picked list you update as you get new clips.
export interface UgcVideo {
  platform: 'youtube' | 'tiktok'
  // YouTube: the 11-character video ID (e.g. from /shorts/{id}).
  // TikTok: the full video URL (used directly as the link + embed source).
  id: string
  url: string
  caption: string
}

export const UGC_VIDEOS: UgcVideo[] = [
  { platform: 'youtube', id: 'W7QlBmEMbls', url: 'https://www.youtube.com/shorts/W7QlBmEMbls', caption: 'Ramen Near You' },
  { platform: 'youtube', id: 'ep7YtrgYZ1Y', url: 'https://www.youtube.com/shorts/ep7YtrgYZ1Y', caption: 'Ramen Near You' },
  { platform: 'youtube', id: 'B9x4Vz32TXQ', url: 'https://www.youtube.com/shorts/B9x4Vz32TXQ', caption: 'Ramen Near You' },
  { platform: 'youtube', id: 't7nimNlPM10', url: 'https://www.youtube.com/shorts/t7nimNlPM10', caption: 'Ramen Near You' },
]
