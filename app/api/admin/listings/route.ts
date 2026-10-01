import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidateApprovedListing } from '@/lib/revalidate'
import type { ApprovedListingRow } from '@/lib/approved-listings'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status } = await request.json()
  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { data: row, error } = await admin
      .from('listings')
      .update({ status })
      .eq('id', id)
      .select('id, name, address, city, state, zip, phone, website, description')
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Approving makes this listing's page start existing; rejecting a
    // previously approved one makes it stop. Either way that one page is the
    // only thing that changes — purge it, nothing else.
    if (row) revalidateApprovedListing(row as ApprovedListingRow)
  }

  return NextResponse.json({ ok: true })
}
