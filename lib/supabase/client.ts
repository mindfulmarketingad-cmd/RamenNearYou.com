import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ucqlkhhjoriakjyeogbx.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWxraGhqb3JpYWtqeWVvZ2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjQ3MTMsImV4cCI6MjA5NDU0MDcxM30.gczEiOrXeym_pflc473bp-ct3cuo0_XyRAB0XY9gVPs'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
