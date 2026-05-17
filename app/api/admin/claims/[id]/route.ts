import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()
  if (!supabase) return false
  const { data } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !data.user?.email) return false
  return data.user.email === adminEmail
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, admin_note } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error } = await supabase
    .from('claims')
    .update({ status, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
