import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Per-visitor claim relationship for one listing. Listing and review pages
// are statically cached (ISR), so anything that depends on WHO is looking —
// "do I own this claim?" / "does my email match it?" — is resolved here,
// client-side, instead of forcing those ~20k pages to render per-request.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const none = { isOwner: false, canSelfLink: false }

  const supabase = await createClient()
  if (!supabase) return NextResponse.json(none)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(none)

  const admin = createAdminClient() ?? supabase
  const { data: claim } = await admin
    .from('claims')
    .select('user_id, contact_email')
    .eq('restaurant_slug', slug)
    .eq('status', 'approved')
    .maybeSingle()
  if (!claim) return NextResponse.json(none)

  const isOwner = user.id === claim.user_id
  const canSelfLink =
    !isOwner &&
    !!claim.contact_email &&
    claim.contact_email.toLowerCase() === user.email?.toLowerCase()

  return NextResponse.json({ isOwner, canSelfLink })
}
