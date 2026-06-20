// Free monthly use allowance for signed-in, non-subscribed members.
// Enforced server-side (see supabase/feature_usage.sql + /api/usage). Shared by
// the gate hook, the API routes, and the gate modals — keep them in sync here.
export const FREE_MONTHLY_LIMIT = 3
