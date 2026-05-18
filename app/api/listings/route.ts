import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, address, city, state, zip, phone, website, description, brothTypes, hours, ownerName, ownerEmail } = body

  if (!name?.trim() || !address?.trim() || !city?.trim() || !state?.trim()) {
    return NextResponse.json({ error: 'Name, address, city, and state are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()

    const { error: dbError } = await supabase.from('listings').insert({
      user_id: user?.id ?? null,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip?.trim() || null,
      phone: phone?.trim() || null,
      website: website?.trim() || null,
      description: description?.trim() || null,
      broth_types: brothTypes || null,
      hours: hours?.trim() || null,
      owner_name: ownerName?.trim() || null,
      owner_email: ownerEmail?.trim() || null,
      status: 'pending',
    })

    if (dbError) console.error('Listing insert error:', dbError.message)
  }

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Ramen Near You <notifications@ramennearyou.com>',
      to: process.env.ADMIN_EMAIL,
      replyTo: ownerEmail || undefined,
      subject: `🍜 New Restaurant Submission — ${name} (${city}, ${state})`,
      html: `
        <h2>New Restaurant Listing Submission</h2>
        <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>Restaurant Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Address</strong></td><td>${address}, ${city}, ${state} ${zip || ''}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
          <tr><td><strong>Website</strong></td><td>${website ? `<a href="${website}">${website}</a>` : '—'}</td></tr>
          <tr><td><strong>Broth Types</strong></td><td>${brothTypes?.join(', ') || '—'}</td></tr>
          <tr><td><strong>Hours</strong></td><td>${hours || '—'}</td></tr>
          <tr><td><strong>Owner Name</strong></td><td>${ownerName || '—'}</td></tr>
          <tr><td><strong>Owner Email</strong></td><td>${ownerEmail || '—'}</td></tr>
        </table>
        ${description ? `<h3>Description</h3><p>${description}</p>` : ''}
        <hr />
        <p style="color:#888;font-size:12px">Review and approve this listing in your Supabase dashboard under the <code>listings</code> table.</p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}
