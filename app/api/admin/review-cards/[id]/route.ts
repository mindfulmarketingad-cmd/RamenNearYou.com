import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Prefer service-role client (bypasses RLS); fall back to admin session
  // (requires the "Admin manages review card orders" RLS policy).
  const admin = createAdminClient() ?? supabase

  const { action, admin_note } = await request.json()
  if (!['fulfill', 'cancel', 'reopen'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const status = action === 'fulfill' ? 'fulfilled' : action === 'cancel' ? 'cancelled' : 'pending'
  const { error } = await admin
    .from('review_card_orders')
    .update({
      status,
      admin_note: admin_note || null,
      fulfilled_at: action === 'fulfill' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, status })
}
