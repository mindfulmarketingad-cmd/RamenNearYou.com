// Centralized admin check. Case-insensitive (OAuth/Supabase may store the email
// with different casing) and honors the ADMIN_EMAIL env var — the same source
// the admin API routes use — with a fallback to the known owner address so the
// bypass keeps working even if the env var is unset.
const FALLBACK_ADMIN_EMAIL = 'mindfulmarketingad@gmail.com'

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const e = email.trim().toLowerCase()
  const envAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  return e === FALLBACK_ADMIN_EMAIL || (!!envAdmin && e === envAdmin)
}
