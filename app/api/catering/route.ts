import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, eventType, guestCount, eventDate, location, budget, notes } = body

    if (!name || !email || !eventType || !guestCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store in Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      await supabase.from('catering_leads').insert({
        name,
        email,
        phone: phone || null,
        event_type: eventType,
        guest_count: guestCount,
        event_date: eventDate || null,
        location: location || null,
        budget: budget || null,
        notes: notes || null,
        status: 'new',
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Catering lead error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
