import { createAdminClient } from '@/lib/supabase-admin'
import type { RamenRank } from '@/lib/ramen-pass'

const FROM = 'Ramen Near You <notifications@ramennearyou.com>'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ramennearyou.com'

async function getUserEmail(userId: string): Promise<string | null> {
  const admin = createAdminClient()
  if (!admin) return null
  const { data } = await admin.auth.admin.getUserById(userId)
  return data.user?.email ?? null
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('Ramen Pass email failed:', err)
  }
}

function shell(heading: string, bodyHtml: string, ctaLabel?: string, ctaHref?: string) {
  const cta =
    ctaLabel && ctaHref
      ? `<p style="margin:28px 0 0"><a href="${ctaHref}" style="display:inline-block;background:#B57F50;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px">${ctaLabel}</a></p>`
      : ''
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1E2026">
    <h1 style="font-size:22px;margin:0 0 16px">${heading}</h1>
    <div style="font-size:15px;line-height:1.6;color:#3a3a3a">${bodyHtml}</div>
    ${cta}
    <p style="margin:32px 0 0;font-size:12px;color:#9B9490">Ramen Near You · You're receiving this because you have a Ramen Pass.</p>
  </div>`
}

export async function sendWelcomeEmail(userId: string) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    "Welcome to Ramen Pass — here's how to earn credits",
    shell(
      'Welcome to Ramen Pass 🍜',
      `<p>You're in! Your $9.99/month membership is active.</p>
       <p>Here's the best part: you can earn up to <strong>$5.00 in credit every month</strong> just by contributing to the directory — leave reviews with photos ($5), add missing restaurants ($3), check in ($0.50), and more. Earned credit comes straight off your next bill.</p>`,
      'Open your dashboard',
      `${BASE_URL}/dashboard`,
    ),
  )
}

export async function sendFirstCreditEmail(userId: string, amount: number) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    'You earned your first credit 🍜',
    shell(
      'Your first credit is in 🎉',
      `<p>Nice work — you just earned <strong>$${amount.toFixed(2)}</strong> in Ramen Pass credit.</p>
       <p>Keep contributing this month and you can earn up to $5.00, applied automatically to your next bill.</p>`,
      'See your credits',
      `${BASE_URL}/dashboard`,
    ),
  )
}

export async function sendCapReachedEmail(userId: string) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    "You've maxed your credits this month — applied to next bill",
    shell(
      "You've maxed your credits this month 🏆",
      `<p>You've hit the <strong>$5.00 monthly credit cap</strong> — the most you can earn in a billing period.</p>
       <p>That credit will be applied automatically to your next invoice, bringing your Ramen Pass down to as little as $4.99 this cycle. Thanks for being an active part of the community!</p>`,
      'View your dashboard',
      `${BASE_URL}/dashboard`,
    ),
  )
}

export async function sendCreditAppliedEmail(userId: string, amount: number) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    `Your $${amount.toFixed(2)} credit has been applied to your next bill`,
    shell(
      'Your credit has been applied ✅',
      `<p>We've applied <strong>$${amount.toFixed(2)}</strong> in contribution credit to your account.</p>
       <p>It will automatically reduce your next Ramen Pass invoice. No action needed.</p>`,
      'View your dashboard',
      `${BASE_URL}/dashboard`,
    ),
  )
}

export async function sendPaymentFailedEmail(userId: string) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    "We couldn't process your payment — update your card",
    shell(
      'Payment issue with your Ramen Pass',
      `<p>We weren't able to process your latest Ramen Pass payment. To keep your membership and credits active, please update your payment method.</p>`,
      'Update payment method',
      `${BASE_URL}/api/ramen-pass/portal`,
    ),
  )
}

export async function sendRankUpEmail(userId: string, rank: RamenRank) {
  const email = await getUserEmail(userId)
  if (!email) return
  await send(
    email,
    `You're now a ${rank} 🍜`,
    shell(
      `You ranked up to ${rank}! 🍜`,
      `<p>Your contributions just earned you a new rank: <strong>${rank}</strong>.</p>
       <p>Keep reviewing, checking in, and adding restaurants to climb toward Ramen Master.</p>`,
      'See your rank',
      `${BASE_URL}/dashboard`,
    ),
  )
}
