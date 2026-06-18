import { redirect } from 'next/navigation'

// Canonical Ramen Pass landing now lives at /ramen-pass. Preserve any ?ref= code.
export default async function PassRedirect({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  redirect(ref ? `/ramen-pass?ref=${encodeURIComponent(ref)}` : '/ramen-pass')
}
