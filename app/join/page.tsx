import { redirect } from 'next/navigation'

// /join?ref=CODE — referral landing. Forwards to /pass, preserving the code so
// the checkout flow can attribute the referral.
export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  redirect(ref ? `/pass?ref=${encodeURIComponent(ref)}` : '/pass')
}
