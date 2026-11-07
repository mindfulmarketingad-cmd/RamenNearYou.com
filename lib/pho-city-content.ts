// Builds the long-form editorial body for a /find/pho-restaurants-{city}-{state}
// page. Every restaurant-specific claim (name, rating, review count, hours,
// amenities) is pulled from the real per-restaurant record; the cuisine
// background sections are general pho/ramen education, not claims about any
// one business.
import type { PhoCity } from './pho'
import type { PhoRestaurant } from './pho'
import { esc, link, list } from './content-helpers'
import { buildPhoSections } from './pho-content'

export type PhoCitySection = { id: string; heading: string; paragraphs: string[] }

function avgRating(listings: PhoRestaurant[]): number | null {
  const rated = listings.filter(l => l.rating != null)
  if (rated.length === 0) return null
  return rated.reduce((s, l) => s + (l.rating ?? 0), 0) / rated.length
}

export function buildPhoCitySections(c: PhoCity, nearbyCities: Array<{ city: string; citySlug: string; stateCode: string; count: number }>): PhoCitySection[] {
  const sections: PhoCitySection[] = []
  const { cityName, stateName, stateCode, listings } = c
  const count = listings.length
  const top = listings[0]
  const runnerUp = listings[1]
  const avg = avgRating(listings)
  const withWebsite = listings.filter(l => l.website).length
  const withDelivery = listings.filter(l => l.amenities?.delivery).length
  const withTakeout = listings.filter(l => l.amenities?.takeout).length
  const withVegetarian = listings.filter(l => l.amenities?.vegetarianOptions || l.amenities?.veganOptions).length
  const cashOnly = listings.filter(l => l.amenities?.cashOnly).length

  // -------------------------------------------------------------- overview
  {
    const paras: string[] = []
    paras.push(
      `${esc(cityName)}, ${esc(stateName)} has ${count} pho ${count === 1 ? 'restaurant' : 'restaurants'} in our directory` +
        (avg != null ? `, averaging ${avg.toFixed(1)} stars across every listing with a Google rating.` : '.')
    )
    if (top) {
      paras.push(
        `${esc(top.name)} currently leads the list${top.rating != null ? ` at ${top.rating.toFixed(1)} stars${top.reviewCount > 0 ? ` across ${top.reviewCount.toLocaleString()} reviews` : ''}` : ''}${
          runnerUp ? `, with ${esc(runnerUp.name)} close behind` : ''
        }. You can read the full profile — hours, amenities, and the complete rating breakdown — on its ${link(`/partners/${top.slug}`, 'listing page')}.`
      )
    }
    if (count === 1) {
      paras.push(
        `That is a single listing rather than a large directory, which is exactly why the profile below goes deep on the one restaurant we do have — real hours, real amenities, and its full rating history — rather than padding this page out with restaurants that aren't actually in ${esc(cityName)}.`
      )
    }
    sections.push({ id: 'overview', heading: `Pho in ${cityName}, ${stateCode}`, paragraphs: paras })
  }

  // -------------------------------------------------------- what the data shows
  if (count >= 2) {
    const paras: string[] = []
    paras.push(
      `Some quick facts pulled straight from these listings' Google Business Profiles: ${withWebsite} of ${count} have a website on file, ${withDelivery} offer delivery, ${withTakeout} offer takeout, and ${withVegetarian} list vegetarian or vegan options. ${
        cashOnly > 0 ? `${cashOnly} ${cashOnly === 1 ? 'is' : 'are'} cash-only, worth knowing before you go.` : ''
      }`
    )
    sections.push({ id: 'facts', heading: `What the Data Shows`, paragraphs: paras })
  }

  // ---------------------------------------------------------------- listing
  {
    const paras: string[] = [
      `Every pin below opens a full profile: verified hours, the amenities the restaurant actually lists on Google, a complete star-by-star rating breakdown, and driving directions. Nothing is invented — it&rsquo;s all pulled from each restaurant&rsquo;s own business profile, the same way every listing works on this site.`,
    ]
    sections.push({ id: 'listings', heading: `${count} Pho ${count === 1 ? 'Restaurant' : 'Restaurants'} in ${cityName}`, paragraphs: paras })
  }

  // -------------------------------------------------------------- spotlight
  // The top pick gets its full profile depth (overview, rating breakdown,
  // hours, amenities) embedded right here — real per-restaurant facts, not
  // filler — so single-restaurant cities aren't thin. The runner-up (if any)
  // gets a lighter version (overview + rating breakdown only) so multi-listing
  // cities don't repeat the full hours/amenities treatment for every entry.
  if (top) {
    const full = buildPhoSections(top)
    const keep = full.filter(s => ['overview', 'ratings', 'hours', 'practical', 'atmosphere'].includes(s.id))
    for (const s of keep) {
      sections.push({ id: `spotlight-${s.id}`, heading: `${s.heading} — ${top.name}`, paragraphs: s.paragraphs })
    }
  }
  if (runnerUp) {
    const full = buildPhoSections(runnerUp)
    const keep = full.filter(s => ['overview', 'ratings'].includes(s.id))
    for (const s of keep) {
      sections.push({ id: `runner-up-${s.id}`, heading: `${s.heading} — ${runnerUp.name}`, paragraphs: s.paragraphs })
    }
  }

  // --------------------------------------------------------- what to order
  {
    const paras: string[] = [
      `If you&rsquo;re new to pho, the broth is what separates a serious kitchen from an average one: beef bones (often with oxtail or brisket) simmered for hours with charred onion and ginger, then seasoned with star anise, cinnamon, clove, coriander, and fennel. It should read clear and deeply aromatic rather than cloudy or simply salty — a cloudy, flat broth is usually the tell that a kitchen is working from a concentrate rather than a real simmer.`,
      `On most menus you&rsquo;ll see pho bo (beef) and pho ga (chicken). Within beef pho, the cuts matter: tai is rare steak that finishes cooking in the hot broth, chin is well-done brisket, nam is flank, gau is fatty brisket, gan is tendon, and sach is tripe. A &ldquo;special&rdquo; or &ldquo;dac biet&rdquo; bowl combines several, which is the usual first-visit recommendation so you can find the cut you actually like before committing to it on a return visit.`,
      `The herb plate — Thai basil, bean sprouts, lime, chili, sometimes culantro — is meant to be added gradually rather than all at once, since herbs wilt fast and lime shifts the whole balance of the broth once it's in. Hoisin and sriracha work best as a dip for the meat on the side rather than stirred straight into the broth, which mutes a stock the kitchen spent hours building.`,
      `A quick note on ordering for a group in ${esc(cityName)}: pho scales well for a table because everyone can order a different cut or size without the kitchen needing to coordinate a shared dish, and the garnish plate lets each person season their own bowl to taste rather than negotiating one spice level for the whole table.`,
    ]
    sections.push({ id: 'what-to-order', heading: 'What to Order', paragraphs: paras })
  }

  // ------------------------------------------------------- pho versus ramen
  {
    const paras: string[] = [
      `Since this is primarily a ramen directory, it&rsquo;s worth being upfront about the difference. Pho uses flat rice noodles in a clear, aromatic beef or chicken broth finished by the diner with fresh herbs and lime. Ramen uses wheat-and-kansui alkaline noodles in a broth that&rsquo;s usually richer and arrives already composed. Pho generally runs lighter; ramen&rsquo;s richer styles, especially ${link('/blog/what-is-tonkotsu-ramen', 'tonkotsu')}, carry more fat. If pho is your baseline, ${link('/blog/what-is-shio-ramen', 'shio')} and ${link('/blog/what-is-shoyu-ramen', 'shoyu')} ramen are the closest in weight — see the ${link('/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen', 'full four-style comparison')}.`,
      `For the deeper nutrition comparison, I cover it in ${link('/blog/is-ramen-healthier-than-pasta', 'is ramen healthier than pasta')} and ${link('/blog/what-are-the-healthiest-noodles-you-can-eat', 'the healthiest noodles you can eat')}. If you want ramen in ${esc(cityName)} specifically, browse the ${link(`/find/${c.citySlug}-${c.stateCode.toLowerCase()}`, `ramen restaurants in ${cityName}, ${stateCode}`)} search map — pho and ramen often cluster in the same neighborhoods, since both cuisines tend to open where there's already foot traffic for Asian food generally.`,
      `If you like one, the other is worth trying on a different visit rather than treating them as competitors for the same meal. A shio or shoyu ramen and a beef pho solve slightly different cravings even though they look similar on a menu photo — one leans toward miso and tare-driven umami, the other toward star anise and charred aromatics.`,
    ]
    sections.push({ id: 'pho-vs-ramen', heading: 'Pho vs. Ramen', paragraphs: paras })
  }

  // ------------------------------------------------------------ nearby / cross-links
  {
    const paras: string[] = []
    if (nearbyCities.length > 0) {
      paras.push(
        `Looking beyond ${esc(cityName)}? ${esc(stateName)} also has pho in ${list(nearbyCities.map(n => `${link(`/find/${(('pho-restaurants-' + n.citySlug + '-' + n.stateCode.toLowerCase()))}`, `${n.city} (${n.count})`)}`))}.`
      )
    }
    paras.push(
      `You can also browse every pho restaurant we track on the ${link('/find/pho-restaurants', 'national pho map')}, or the full ${link('/partners', 'partners directory')}.`
    )
    sections.push({ id: 'nearby', heading: 'More Pho Nearby', paragraphs: paras })
  }

  return sections
}

export function phoCityWordCount(sections: PhoCitySection[]): number {
  return sections.reduce((n, s) => n + s.heading.split(/\s+/).length + s.paragraphs.reduce((m, p) => m + p.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, 0), 0)
}
