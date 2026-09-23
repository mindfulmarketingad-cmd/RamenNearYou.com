import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { restaurants as ALL } from '@/lib/restaurants'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Prefer service-role client (bypasses RLS); fall back to admin session
  // (requires "Admin manages all overrides/edit requests" RLS policies)
  const admin = createAdminClient() ?? supabase!

  const { action, admin_note } = await request.json()
  if (!['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  const { data: edit, error: fetchErr } = await admin
    .from('listing_edit_requests')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchErr || !edit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (edit.status !== 'pending') return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })

  const newStatus = action === 'approve' ? 'approved' : 'rejected'

  // If approving, apply the change
  if (action === 'approve') {
    const { type, payload, restaurant_slug } = edit as {
      type: string
      payload: Record<string, unknown>
      restaurant_slug: string
    }

    if (type === 'info') {
      const field = payload.field as string
      const new_value = payload.new_value as string
      let value: unknown = new_value
      if (field === 'hours') {
        try { value = JSON.parse(new_value) } catch { value = {} }
      }

      const { error: upsertErr } = await admin
        .from('restaurant_overrides')
        .upsert({
          restaurant_slug,
          [field]: value || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'restaurant_slug' })

      if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 })

      const base = ALL.find(r => r.slug === restaurant_slug)
      if (base) {
        try { revalidatePath(`/${base.citySlug}/${base.stateSlug}/${restaurant_slug}`) } catch {}
      }
    }

    if (type === 'photo') {
      const url = payload.url as string
      const caption = payload.caption as string | undefined
      // Insert into photos table (same as community photos)
      await admin.from('photos').insert({
        restaurant_slug,
        user_id: edit.user_id,
        url,
        caption: caption || null,
      }).select()
    }

    if (type === 'review_response') {
      const review_id = payload.review_id as string
      const response = payload.response as string
      await admin.from('review_responses').upsert({
        review_id,
        restaurant_slug,
        user_id: edit.user_id,
        response,
      }, { onConflict: 'review_id' })
    }
  }

  // Mark as reviewed
  await admin
    .from('listing_edit_requests')
    .update({ status: newStatus, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true, status: newStatus })
}
