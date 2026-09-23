// SERVER-ONLY. Thin GoHighLevel (GHL) REST API v2 client used to push a
// contact + tag whenever a business claims their listing — the tag is what
// triggers the "Premium Upgrade Offer" workflow on the GHL side. Requires
// two env vars:
//
//   GHL_API_KEY      — a GHL Private Integration token
//   GHL_LOCATION_ID  — the GHL sub-account (location) ID; find it in the
//                       URL of your GHL dashboard when viewing Contacts
//
// Both must be set or every call here becomes a silent no-op (mirrors the
// "best-effort, never blocks the real submission" pattern used for the
// Resend email notifications elsewhere in this codebase).
const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'

export function isGhlConfigured(): boolean {
  return !!(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID)
}

function ghlHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
    Version: GHL_VERSION,
  }
}

export interface GhlContactInput {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  city?: string
  tags?: string[]
}

// Upserts a contact (matched by email/phone within the location) and, if
// tags are given, adds them via the dedicated tags endpoint — upsert's own
// `tags` field REPLACES a contact's existing tags rather than adding to
// them, which would be dangerous for a contact GHL already tagged from
// another workflow (e.g. an outbound campaign tag).
export async function upsertGhlContact(input: GhlContactInput): Promise<string | null> {
  if (!isGhlConfigured()) return null
  if (!input.email && !input.phone) return null

  try {
    const body: Record<string, unknown> = {
      locationId: process.env.GHL_LOCATION_ID,
      firstName: input.firstName || undefined,
      lastName: input.lastName || undefined,
      email: input.email || undefined,
      phone: input.phone || undefined,
      companyName: input.companyName || undefined,
      city: input.city || undefined,
    }
    Object.keys(body).forEach((k) => body[k] === undefined && delete body[k])

    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: ghlHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error('GHL upsert contact failed:', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = await res.json()
    const contactId: string | undefined = data?.contact?.id
    if (!contactId) return null

    if (input.tags && input.tags.length > 0) {
      await addGhlTags(contactId, input.tags)
    }
    return contactId
  } catch (err) {
    console.error('GHL upsert contact threw:', err)
    return null
  }
}

export async function addGhlTags(contactId: string, tags: string[]): Promise<boolean> {
  if (!isGhlConfigured()) return false
  try {
    const res = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: ghlHeaders(),
      body: JSON.stringify({ tags }),
    })
    if (!res.ok) {
      console.error('GHL add tags failed:', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error('GHL add tags threw:', err)
    return false
  }
}
