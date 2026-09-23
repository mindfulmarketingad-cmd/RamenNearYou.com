import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { approvePendingContribution, rejectPendingContribution } from '@/lib/rewards'

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !data.user?.email) return false
  return data.user.email === adminEmail
}

// PATCH /api/admin/contributions/[id]  { action: 'approve' | 'reject' }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { action } = await request.json().catch(() => ({}))

  if (action === 'approve') {
    const result = await approvePendingContribution(id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ ok: true, ...result })
  }

  if (action === 'reject') {
    await rejectPendingContribution(id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
