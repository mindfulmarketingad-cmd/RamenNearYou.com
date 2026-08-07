// Client-safe. Just the table name, split out of lib/analytics.ts so the
// browser (the dashboard's Realtime subscription) can import it without
// pulling in the restaurant/pho datasets that module needs for path
// classification.
//
// This Supabase project is shared across several directory sites, so the
// table is namespaced per site rather than a generic `analytics_events`.
export const ANALYTICS_TABLE = 'ramennearyou_dashboard'
