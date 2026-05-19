import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, city, instagram, why_apply, experience } = body

  if (!name || !email || !city || !why_apply || !experience) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ambassador_applications')
    .insert({
      user_id: user.id,
      name,
      email,
      city,
      instagram: instagram || null,
      why_apply,
      experience,
      status: 'pending',
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
