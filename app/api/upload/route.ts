import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'upload', 20, 600_000)
  if (limited) return limited
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Prefer the service-role client (bypasses RLS), but fall back to the user's
  // authenticated client — the restaurant-photos bucket allows authenticated
  // uploads, so photos still work when SUPABASE_SERVICE_ROLE_KEY isn't set.
  const storageClient = createAdminClient() ?? supabase

  const form = await request.formData()
  const files = form.getAll('files') as File[]

  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 })
  if (files.length > 8) return NextResponse.json({ error: 'Max 8 photos' }, { status: 400 })

  // Only accept real image files, and derive the extension from the validated
  // MIME type rather than the client-supplied filename — so nobody can upload
  // an HTML/SVG/script payload (stored-XSS risk on a public bucket) or smuggle
  // a path via a crafted filename.
  const ALLOWED_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'image/heif': 'heif',
  }
  const MAX_BYTES = 10 * 1024 * 1024 // 10 MB per photo

  const urls: string[] = []

  for (const file of files) {
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })
    }
    const ext = ALLOWED_EXT[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF, or HEIC images are allowed' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Each photo must be between 1 byte and 10MB' }, { status: 400 })
    }
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const bytes = await file.arrayBuffer()
    const { error } = await storageClient.storage
      .from('restaurant-photos')
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (error) {
      console.error('[upload] storage upload failed:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = storageClient.storage
      .from('restaurant-photos')
      .getPublicUrl(path)

    urls.push(publicUrl)
  }

  return NextResponse.json({ urls })
}
