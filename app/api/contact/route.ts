import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'contact', 5, 600_000)
  if (limited) return limited
  const body = await request.json()
  const { name, email, subject, message } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Ramen Near You <notifications@ramennearyou.com>',
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `📬 Contact Form — ${subject || 'General inquiry'} (from ${name})`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || '—'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}
