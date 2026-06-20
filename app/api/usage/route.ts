import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/usage — sign-in state for the current visitor.
// { signedIn }
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return NextResponse.json({ signedIn: !!user })
}
