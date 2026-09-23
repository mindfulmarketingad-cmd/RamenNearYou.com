import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
