// Hidden marker that tells lib/analytics-client.ts this page is a listing, so
// the site-wide pageview is recorded as a listing_view for this restaurant.
export default function PageViewTracker({ slug, name, city }: { slug: string; name: string; city: string }) {
  return <span hidden data-rny-listing-slug={slug} data-rny-listing-name={name} data-rny-listing-city={city} />
}
