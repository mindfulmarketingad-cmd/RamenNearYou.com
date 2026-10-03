// Normalises a caller-supplied post-login destination down to a path on this
// site, or "/" if it isn't one.
//
// Why this exists: /auth/login?redirectTo=... is attacker-controllable, and it
// used to be handed straight to router.push(). An absolute URL there is an
// open redirect — someone sends a link to the real ramennearyou.com, the
// victim signs in for real, and lands on a lookalike that asks them to "log in
// again". The link looks legitimate the whole way, which is what makes it
// work. Automated scanners probe login pages for exactly this.
//
// Rejected shapes, all of which navigate off-site:
//   https://evil.com          absolute URL
//   //evil.com                protocol-relative
//   /\evil.com and /\/evil.com  browsers fold the backslash to "/"
//   javascript:alert(1)       scheme that isn't navigation at all
//   \t/\evil.com              control characters are stripped before parsing
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g

export function safeRedirectPath(value: string | null | undefined, fallback = '/'): string {
  if (!value) return fallback

  // Browsers ignore embedded tabs/newlines when resolving a URL, so strip them
  // before deciding — otherwise "/\tevil.com" is judged on text the browser
  // will never see.
  const raw = value.replace(CONTROL_CHARS, '').trim()
  if (!raw) return fallback

  // Must be a rooted path.
  if (!raw.startsWith('/')) return fallback

  // "//host" and "/\host" (and mixed "/\/") are protocol-relative — they leave
  // the site even though they start with a slash.
  const second = raw[1]
  if (second === '/' || second === '\\') return fallback

  return raw
}
