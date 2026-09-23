# RamenNearYou — Project Notes

## Ad network compliance — REQUIRED footer links

The site's ads are served by **Mediavine** (it moved off Google AdSense; the AdSense
loader and ad units are gone). Mediavine requires the same set of policy pages AdSense
did, so this requirement is unchanged: the footer (`components/footer.tsx`) **must
always** include these links. Do not remove them:

- Home → `/`
- About → `/about`
- Contact → `/contact`
- Disclaimer → `/disclaimer`
- Privacy → `/privacy-policy`
- Terms → `/terms-of-service`
- Sitemap → `/sitemap.xml`

If asked to trim or restructure the footer, preserve all of the above (they currently
live in the footer bottom bar).
