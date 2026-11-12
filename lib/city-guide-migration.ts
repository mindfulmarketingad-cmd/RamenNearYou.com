// Legacy "Best Ramen in [City]" /blog/ listicles are being consolidated into
// the live /find/ searchmap pages (HomeMapHero) instead of a static Top-10
// grid, so the map, filters, and location search all work on what used to be
// a fixed list. The original editorial content (intro + outro) is preserved
// by splicing it into the corresponding /find/ page rather than deleting it.
//
// CITY_GUIDE_CONTENT_SOURCE: /find/ page slug (the part after "/find/") ->
//   the blog post whose .content/.outroContent gets rendered on that page.
// CITY_GUIDE_REDIRECTS: every migrated blog slug -> its new /find/ URL.
//   Some slugs covered the same city from a slightly different angle (e.g.
//   three separate "best ramen in Atlanta" posts) — those redirect to the
//   same target as the canonical post rather than each getting their own
//   content slot, consolidating what was duplicate content.

export const CITY_GUIDE_CONTENT_SOURCE: Record<string, string> = {
  'atlanta-ga': 'best-ramen-in-atlanta-georgia',
  'duluth-ga': 'ramen-duluth-ga',
  'houston-tx': 'best-ramen-in-houston-tx',
  'sacramento-ca': 'best-ramen-in-sacramento-ca',
  'detroit-mi': 'best-ramen-in-detroit',
  'providence-ri': 'best-ramen-in-providence',
  'las-vegas-nv': 'best-ramen-in-las-vegas',
  'brooklyn-ny': 'best-ramen-in-brooklyn',
  'rochester-ny': 'best-ramen-in-rochester',
  'new-york-ny': 'best-ramen-in-new-york-city',
  'sioux-falls-sd': 'best-ramen-in-sioux-falls-south-dakota',
  'san-francisco-ca': 'best-ramen-in-san-francisco-california',
  'chicago-il': 'best-ramen-in-chicago-illinois',
  'denver-co': 'best-ramen-in-denver-colorado',
  'washington-dc': 'best-ramen-in-washington-dc',
  'portland-or': 'best-ramen-in-portland-oregon',
  'seattle-wa': 'best-ramen-in-seattle-washington',
  'nashville-tn': 'best-ramen-in-nashville-tennessee',
  'honolulu-hi': 'best-ramen-in-honolulu-hawaii',
  'charlotte-nc': 'best-ramen-in-charlotte-north-carolina',
  'los-angeles-ca': 'best-ramen-in-los-angeles-california',
  'oklahoma-city-ok': 'best-ramen-in-oklahoma-city-oklahoma',
  'colorado-springs-co': 'best-ramen-in-colorado-springs-colorado',
  'indianapolis-in': 'best-ramen-in-indianapolis-indiana',
  'raleigh-nc': 'best-ramen-in-raleigh-north-carolina',
  'flint-mi': 'best-ramen-in-flint-michigan',
  'everett-wa': 'best-ramen-in-everett-washington',
  'ann-arbor-mi': 'best-ramen-in-ann-arbor-michigan',
  'vancouver-wa': 'best-ramen-in-vancouver-washington',
  'vegan-ramen-in-atlanta-ga': 'vegan-ramen-atlanta',
  'tonkotsu-ramen-in-atlanta-ga': 'tonkotsu-ramen-atlanta',
}

export const CITY_GUIDE_REDIRECTS: Record<string, string> = {
  'best-ramen-in-atlanta-georgia': '/find/atlanta-ga',
  'best-ramen-noodles-in-atlanta': '/find/atlanta-ga',
  'best-ramen-in-atlanta': '/find/atlanta-ga',
  'ramen-duluth-ga': '/find/duluth-ga',
  'best-ramen-in-houston-tx': '/find/houston-tx',
  'best-ramen-in-sacramento-ca': '/find/sacramento-ca',
  'best-ramen-in-detroit': '/find/detroit-mi',
  'best-ramen-in-providence': '/find/providence-ri',
  'best-ramen-in-las-vegas': '/find/las-vegas-nv',
  'best-ramen-in-las-vegas-nevada': '/find/las-vegas-nv',
  'best-ramen-in-brooklyn': '/find/brooklyn-ny',
  'best-ramen-in-rochester': '/find/rochester-ny',
  'best-ramen-in-new-york-city': '/find/new-york-ny',
  'best-ramen-in-new-york-new-york': '/find/new-york-ny',
  'best-ramen-in-sioux-falls-south-dakota': '/find/sioux-falls-sd',
  'best-ramen-in-san-francisco-california': '/find/san-francisco-ca',
  'best-ramen-in-chicago-illinois': '/find/chicago-il',
  'best-ramen-in-denver-colorado': '/find/denver-co',
  'best-ramen-in-washington-dc': '/find/washington-dc',
  'best-ramen-in-portland-oregon': '/find/portland-or',
  'best-ramen-in-seattle-washington': '/find/seattle-wa',
  'best-ramen-in-nashville-tennessee': '/find/nashville-tn',
  'best-ramen-in-honolulu-hawaii': '/find/honolulu-hi',
  'best-ramen-in-charlotte-north-carolina': '/find/charlotte-nc',
  'best-ramen-in-los-angeles-california': '/find/los-angeles-ca',
  'best-ramen-in-sacramento-california': '/find/sacramento-ca',
  'best-ramen-in-oklahoma-city-oklahoma': '/find/oklahoma-city-ok',
  'best-ramen-in-colorado-springs-colorado': '/find/colorado-springs-co',
  'best-ramen-in-indianapolis-indiana': '/find/indianapolis-in',
  'best-ramen-in-raleigh-north-carolina': '/find/raleigh-nc',
  'best-ramen-in-flint-michigan': '/find/flint-mi',
  'best-ramen-in-everett-washington': '/find/everett-wa',
  'best-ramen-in-ann-arbor-michigan': '/find/ann-arbor-mi',
  'best-ramen-in-vancouver-washington': '/find/vancouver-wa',
  'vegan-ramen-atlanta': '/find/vegan-ramen-in-atlanta-ga',
  'tonkotsu-ramen-atlanta': '/find/tonkotsu-ramen-in-atlanta-ga',
}
