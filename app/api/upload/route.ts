import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
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

  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'jpg'
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
