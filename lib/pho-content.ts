// Builds the long-form editorial body for a /partners/{slug} pho listing.
//
// Every restaurant-specific sentence here is derived from a real field on the
// scraped record — rating, the 1–5 star distribution, the weekly hours grid,
// Google's amenity flags, review tags, and the Google-supplied description.
// Nothing about a specific business is invented. The general pho explainer
// sections are cuisine background (true of pho broadly, not claims about this
// restaurant), which is why they read as education rather than description.
import type { PhoRestaurant } from './pho'
import { countActiveAmenities } from './pho'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

// Paragraphs are HTML strings so the copy can carry inline internal links.
// Every value interpolated from the dataset goes through esc() first.
export type PhoSection = { id: string; heading: string; paragraphs: string[] }

import { esc, link, list, pct } from './content-helpers'

function has(p: PhoRestaurant, k: string): boolean {
  return p.amenities?.[k] === true
}

/** Parse "11AM-8:30PM" into minutes-from-midnight for open and close. */
function parseRange(s: string): { open: number; close: number } | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[-–]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(s.trim())
  if (!m) return null
  const to24 = (h: string, mm: string | undefined, ap: string) => {
    let hh = parseInt(h, 10) % 12
    if (/pm/i.test(ap)) hh += 12
    return hh * 60 + (mm ? parseInt(mm, 10) : 0)
  }
  const open = to24(m[1], m[2], m[3])
  let close = to24(m[4], m[5], m[6])
  if (close <= open) close += 24 * 60
  return { open, close }
}

function fmtMinutes(min: number): string {
  const m = min % (24 * 60)
  const h24 = Math.floor(m / 60)
  const mm = m % 60
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return mm === 0 ? `${h12} ${ap}` : `${h12}:${String(mm).padStart(2, '0')} ${ap}`
}

type HoursFacts = {
  openDays: string[]
  closedDays: string[]
  earliestOpen: number | null
  latestClose: number | null
  weeklyHours: number
  opensBefore11: boolean
  closesAfter21: boolean
  openSaturday: boolean
  openSunday: boolean
}

function hoursFacts(p: PhoRestaurant): HoursFacts | null {
  if (!p.hours) return null
  const openDays: string[] = []
  const closedDays: string[] = []
  let earliestOpen: number | null = null
  let latestClose: number | null = null
  let weeklyMinutes = 0

  for (const day of DAYS) {
    const slots = p.hours[day]
    if (!slots || slots.length === 0) continue
    if (slots.some(s => /closed/i.test(s))) {
      closedDays.push(day)
      continue
    }
    let dayCounted = false
    for (const slot of slots) {
      const r = parseRange(slot)
      if (!r) continue
      dayCounted = true
      weeklyMinutes += r.close - r.open
      if (earliestOpen === null || r.open < earliestOpen) earliestOpen = r.open
      if (latestClose === null || r.close > latestClose) latestClose = r.close
    }
    if (dayCounted) openDays.push(day)
  }
  if (openDays.length === 0 && closedDays.length === 0) return null

  return {
    openDays,
    closedDays,
    earliestOpen,
    latestClose,
    weeklyHours: Math.round(weeklyMinutes / 60),
    opensBefore11: earliestOpen !== null && earliestOpen < 11 * 60,
    closesAfter21: latestClose !== null && latestClose > 21 * 60,
    openSaturday: openDays.includes('Saturday'),
    openSunday: openDays.includes('Sunday'),
  }
}

export function buildPhoSections(p: PhoRestaurant): PhoSection[] {
  const sections: PhoSection[] = []
  const where = `${p.city}, ${p.stateCode}`
  const hf = hoursFacts(p)
  const amenityCount = countActiveAmenities(p)

  // ---------------------------------------------------------------- overview
  {
    const paras: string[] = []
    const typeLabel = p.type && !/^restaurant$/i.test(p.type) ? p.type.toLowerCase() : 'Vietnamese restaurant'
    let lead = `${esc(p.name)} is a ${esc(typeLabel)} in ${esc(where)}`
    if (p.street) lead += `, located at ${esc(p.street)}`
    lead += '.'
    if (p.rating != null && p.reviewCount > 0) {
      lead += ` It holds a ${p.rating.toFixed(1)}-star rating on Google across ${p.reviewCount.toLocaleString()} review${p.reviewCount === 1 ? '' : 's'}`
      lead += p.reviewCount >= 500
        ? ', which is a substantial sample — enough that the score reflects consistent day-to-day performance rather than a handful of good or bad visits.'
        : p.reviewCount >= 150
          ? ', a large enough sample to be a genuinely reliable signal.'
          : '.'
    }
    paras.push(lead)

    if (p.description) {
      paras.push(`Google describes it this way: &ldquo;${esc(p.description)}&rdquo; That summary is short, so the rest of this page fills in what the listing data actually shows — the hours, the service options, the accessibility details, and how diners have rated it over time.`)
    } else {
      paras.push(`There is no editorial blurb attached to this listing, so everything below is drawn straight from the restaurant's own Google Business Profile data: verified hours, service options, accessibility details, and the full rating history from diners who have eaten here.`)
    }

    if (p.verified) {
      paras.push(`This listing is verified on Google, meaning the business itself has claimed and confirmed the profile. In practice that makes the hours and contact details more trustworthy than an unclaimed listing, though it is still worth calling ahead before a long drive.`)
    }

    if (p.subtypes) {
      const cats = p.subtypes.split(',').map(s => s.trim()).filter(Boolean)
      if (cats.length > 1) {
        paras.push(`Google categorizes ${esc(p.name)} under ${esc(list(cats.map(c => c.toLowerCase())))}. Multiple categories usually mean the menu runs broader than a single-dish shop — worth scanning the full menu rather than assuming pho is the only thing worth ordering.`)
      }
    }

    sections.push({ id: 'overview', heading: `About ${p.name}`, paragraphs: paras })
  }

  // ------------------------------------------------------- rating breakdown
  if (p.reviewsPerScore && p.reviewCount > 0) {
    const rps = p.reviewsPerScore
    const five = rps['5'] ?? 0
    const four = rps['4'] ?? 0
    const three = rps['3'] ?? 0
    const two = rps['2'] ?? 0
    const one = rps['1'] ?? 0
    const total = five + four + three + two + one
    const paras: string[] = []

    if (total > 0) {
      const p5 = pct(five, total)
      const p45 = pct(five + four, total)
      const plow = pct(one + two, total)
      paras.push(
        `A star average hides more than it reveals, so here is the actual distribution behind ${esc(p.name)}&rsquo;s score. Of ${total.toLocaleString()} rated reviews, ${five.toLocaleString()} are 5-star (${p5}%), ${four.toLocaleString()} are 4-star (${pct(four, total)}%), ${three.toLocaleString()} are 3-star (${pct(three, total)}%), ${two.toLocaleString()} are 2-star (${pct(two, total)}%), and ${one.toLocaleString()} are 1-star (${pct(one, total)}%).`
      )
      paras.push(
        p45 >= 90
          ? `That means ${p45}% of diners rated it four stars or better — a strongly positive distribution with very little of the polarization you often see at busy restaurants. When almost nine in ten reviewers land in the top two buckets, it usually points to consistency rather than a single standout dish carrying the score.`
          : p45 >= 75
            ? `That puts ${p45}% of reviews in the top two buckets, with ${plow}% at one or two stars. That is a healthy spread for a working restaurant — most people leave happy, and the minority of low scores is worth a skim to see whether the complaints are about food or about service and wait times, which are very different problems.`
            : `That leaves ${plow}% of reviews at one or two stars, which is a meaningful minority. I would read a sample of those directly before going, since a cluster of low scores concentrated in recent months tells a very different story than the same number spread over several years.`
      )
      paras.push(
        `You can read the full review history on ${p.reviewsLink ? 'Google' : 'Google Maps'} and judge for yourself — I always skim the most recent ten or fifteen rather than relying on the lifetime average, because a restaurant's kitchen can change substantially in a year.`
      )
    }
    if (paras.length > 0) {
      sections.push({ id: 'ratings', heading: 'What the Ratings Actually Show', paragraphs: paras })
    }
  }

  // --------------------------------------------------------- what to order
  {
    const paras: string[] = []
    if (p.reviewTags.length > 0) {
      paras.push(
        `Reviewers most often mention ${esc(list(p.reviewTags.slice(0, 8)))}. Those tags come from Google surfacing the terms that recur across this restaurant's reviews, so they are a decent proxy for what regulars actually order rather than what the menu pushes hardest.`
      )
    }
    paras.push(
      `If you are new to pho, the core of the dish is the broth: beef bones (and often oxtail, brisket, or knuckle) simmered for hours with charred onion and ginger, then seasoned with star anise, cinnamon, clove, coriander, and fennel. A good pho broth is clear rather than cloudy, deeply aromatic, and savory without tasting heavily salted. That long simmer is the single thing that separates a serious pho kitchen from one cutting corners with a base concentrate.`
    )
    paras.push(
      `On most Vietnamese menus you will see pho bo (beef) and pho ga (chicken) as the two anchors. Within beef pho, the cuts matter: tai is rare steak that finishes cooking in the hot broth at the table, chin is well-done brisket, nam is flank, gau is fatty brisket, gan is tendon, and sach is tripe. A "special" or "dac biet" bowl combines several of them, which is the usual recommendation for a first visit because it lets you find the cut you actually like.`
    )
    paras.push(
      `The plate of garnishes that arrives alongside — Thai basil, bean sprouts, lime, sliced chili, sometimes culantro — is not decoration. Add them gradually rather than all at once: the herbs wilt fast, the lime shifts the whole balance of the broth, and once you have over-acidified a bowl there is no walking it back. Hoisin and sriracha are best used in a side dish for dipping meat rather than squeezed straight into the broth, which muddies a stock the kitchen spent hours clarifying.`
    )
    if (p.menuLink) {
      paras.push(`${esc(p.name)} publishes a menu online, linked at the top of this page, so you can check the specific cuts and sizes offered before you go.`)
    }
    sections.push({ id: 'what-to-order', heading: 'What to Order and How to Eat It', paragraphs: paras })
  }

  // --------------------------------------------------------------- hours
  if (hf) {
    const paras: string[] = []
    if (hf.closedDays.length > 0) {
      paras.push(
        `${esc(p.name)} is open ${hf.openDays.length} day${hf.openDays.length === 1 ? '' : 's'} a week and closed on ${esc(list(hf.closedDays))}. That is the single most common reason for a wasted trip, so it is worth checking before you drive out — especially if you are planning around a weekend.`
      )
    } else {
      paras.push(`${esc(p.name)} is open all seven days of the week, which makes it an easy default when other Vietnamese kitchens in the area take a midweek day off.`)
    }

    if (hf.earliestOpen !== null && hf.latestClose !== null) {
      paras.push(
        `Across the week the kitchen runs from about ${fmtMinutes(hf.earliestOpen)} at the earliest to ${fmtMinutes(hf.latestClose)} at the latest, totaling roughly ${hf.weeklyHours} service hours. ${
          hf.opensBefore11
            ? 'Opening before 11 AM matters more for pho than for most cuisines — pho is a breakfast dish in Vietnam, and an early-opening kitchen is often one that takes that tradition seriously.'
            : 'Service starts at lunch rather than breakfast, which is typical for Vietnamese restaurants operating in the US.'
        }`
      )
      paras.push(
        hf.closesAfter21
          ? `With service running past 9 PM, this is a workable late option — useful, because a hot bowl of pho is one of the better late-evening meals available.`
          : `The kitchen closes before 9 PM, so plan on an earlier dinner. Arriving within the last half hour of service is a gamble at any restaurant that simmers its broth in daily batches, since the best cuts and the freshest garnishes tend to go first.`
      )
    }

    const weekend = hf.openSaturday && hf.openSunday
      ? 'It is open both Saturday and Sunday'
      : hf.openSaturday
        ? 'It is open Saturday but closed Sunday'
        : hf.openSunday
          ? 'It is open Sunday but closed Saturday'
          : 'It is closed both weekend days'
    paras.push(`${weekend}. Full day-by-day hours are listed above, pulled from the restaurant's Google Business Profile.`)

    if (p.typicalTimeSpent) {
      paras.push(`Google's visit data indicates ${esc(p.typicalTimeSpent.toLowerCase().replace(/^people typically spend/, 'diners typically spend'))}. That is a useful planning signal — a pho lunch is usually a quicker meal than a comparable sit-down dinner, since the bowl arrives fast once ordered.`)
    }
    sections.push({ id: 'hours', heading: 'Hours and When to Go', paragraphs: paras })
  }

  // ------------------------------------------------------- service options
  {
    const paras: string[] = []
    const svc: string[] = []
    if (has(p, 'dineIn')) svc.push('dine-in')
    if (has(p, 'takeout')) svc.push('takeout')
    if (has(p, 'delivery')) svc.push('delivery')
    if (has(p, 'outdoorSeating')) svc.push('outdoor seating')
    if (has(p, 'catering')) svc.push('catering')

    if (svc.length > 0) {
      paras.push(`${esc(p.name)} offers ${esc(list(svc))}.`)
    }
    if (has(p, 'takeout') || has(p, 'delivery')) {
      paras.push(
        `A note on pho to go, because it is easy to get wrong: the noodles keep absorbing liquid the moment they sit in hot broth. A kitchen that cares packs the broth, the noodles, the meat, and the herb plate in separate containers so you assemble at home. If your order arrives pre-combined, eat it immediately — reheating a bowl whose noodles have already gone soft does not recover the texture. This is the same problem ramen has with delivery, and the same fix applies — I go through it in detail on the ${link('/find/ramen-takeout', 'ramen takeout')} guide.`
      )
    }
    if (has(p, 'acceptsReservations')) {
      paras.push(`Reservations are accepted, which is somewhat unusual for a casual pho shop and useful if you are bringing a group.`)
    } else if (has(p, 'counterService')) {
      paras.push(`Service is counter-style rather than full table service, so expect to order at the register. That format usually means a faster turnaround, which suits a lunch break.`)
    }
    if (has(p, 'tableService')) {
      paras.push(`Table service is offered, so you will be seated and served rather than ordering at a counter.`)
    }

    const orderLinks = [p.orderLinks, p.reservationLinks].filter(Boolean)
    if (orderLinks.length > 0) {
      paras.push(`Online ordering or booking links are attached to this listing and surfaced in the action buttons above.`)
    }
    if (paras.length > 0) {
      sections.push({ id: 'service', heading: 'Ordering, Takeout, and Delivery', paragraphs: paras })
    }
  }

  // ------------------------------------------------------------ atmosphere
  {
    const paras: string[] = []
    const vibe: string[] = []
    if (has(p, 'casual')) vibe.push('casual')
    if (has(p, 'cozy')) vibe.push('cozy')
    if (has(p, 'quiet')) vibe.push('quiet')
    if (has(p, 'trendy')) vibe.push('trendy')
    if (has(p, 'historic')) vibe.push('historic')

    if (vibe.length > 0) {
      paras.push(`Diners describe the room as ${esc(list(vibe))}. ${
        has(p, 'quiet')
          ? 'A quiet room is worth noting — it makes this a realistic option for a conversation or for eating alone with a book, which is not true of every busy noodle shop.'
          : 'That is the typical register for a neighborhood pho restaurant: comfortable rather than formal, and built around turning out bowls quickly.'
      }`)
    }

    const who: string[] = []
    if (has(p, 'soloDining')) who.push('solo diners')
    if (has(p, 'groups')) who.push('groups')
    if (has(p, 'familyFriendly')) who.push('families with kids')
    if (has(p, 'collegeStudents')) who.push('college students')
    if (who.length > 0) {
      paras.push(`Google&rsquo;s listing data flags it as good for ${esc(list(who))}.${
        has(p, 'familyFriendly') && (has(p, 'highChairs') || has(p, 'kidsMenu'))
          ? ` ${has(p, 'highChairs') && has(p, 'kidsMenu') ? 'High chairs and a kids menu are both available' : has(p, 'highChairs') ? 'High chairs are available' : 'A kids menu is available'}, which is the practical detail that actually matters when you are deciding where to take a toddler.`
          : ''
      }`)
    }
    if (has(p, 'fastService')) {
      paras.push(`Fast service is called out as a highlight on the listing — consistent with pho's format, where the broth is already made and the bowl is assembled to order.`)
    }
    if (has(p, 'localSpecialty')) {
      paras.push(`The listing also flags it as serving a local specialty, meaning reviewers associate this restaurant with a dish the area is known for.`)
    }
    if (paras.length > 0) {
      sections.push({ id: 'atmosphere', heading: 'Atmosphere and Who It Suits', paragraphs: paras })
    }
  }

  // ---------------------------------------------- accessibility & practical
  {
    const paras: string[] = []
    const acc: string[] = []
    if (has(p, 'wheelchairAccessible')) acc.push('a wheelchair accessible entrance')
    if (has(p, 'wheelchairRestroom')) acc.push('a wheelchair accessible restroom')
    if (has(p, 'wheelchairParking')) acc.push('wheelchair accessible parking')
    if (acc.length > 0) {
      paras.push(`On accessibility, ${esc(p.name)} lists ${esc(list(acc))}. ${
        acc.length >= 3
          ? 'That is a full set of accessibility features, which is worth knowing in advance rather than discovering at the door.'
          : 'If you need a feature not listed here, calling ahead is the reliable way to confirm.'
      }`)
    }

    const park: string[] = []
    if (has(p, 'parking')) park.push('a free parking lot')
    if (has(p, 'freeStreetParking')) park.push('free street parking')
    if (has(p, 'paidParking')) park.push('paid parking')
    if (park.length > 0) {
      paras.push(`Parking: ${esc(list(park))} ${park.length === 1 ? 'is' : 'are'} available.`)
    }

    const pay: string[] = []
    if (has(p, 'cashOnly')) {
      paras.push(`This is a cash-only restaurant. That catches people out constantly, so bring cash or find an ATM before you sit down.`)
    } else {
      if (has(p, 'creditCards')) pay.push('credit cards')
      if (has(p, 'debitCards')) pay.push('debit cards')
      if (has(p, 'mobilePayments')) pay.push('NFC mobile payments')
      if (pay.length > 0) paras.push(`Payment: ${esc(list(pay))} accepted.`)
    }

    const diet: string[] = []
    if (has(p, 'vegetarianOptions')) diet.push('vegetarian options')
    if (has(p, 'veganOptions')) diet.push('vegan options')
    if (has(p, 'healthyOptions')) diet.push('healthy options')
    if (has(p, 'halal')) diet.push('halal food')
    if (diet.length > 0) {
      paras.push(`Dietary options: the listing flags ${esc(list(diet))}. Worth a specific question when you order, though — traditional pho broth is beef-based, so a vegetarian bowl needs to be built on a separate vegetable stock rather than simply served without meat. Any kitchen that takes it seriously will make that distinction clearly.`)
    }

    if (paras.length > 0) {
      sections.push({ id: 'practical', heading: 'Accessibility, Parking, and Payment', paragraphs: paras })
    }
  }

  // ------------------------------------------------------- pho versus ramen
  {
    const paras: string[] = [
      `Since this is primarily a ramen directory, the obvious question is how pho compares — and the two dishes are genuinely different despite both being noodle soups. Pho uses flat rice noodles (banh pho) in a clear, aromatic beef or chicken broth built on charred aromatics and warm spices. Ramen uses wheat-and-kansui alkaline noodles in a broth that is usually richer and more heavily seasoned with a concentrated tare. Pho is finished by the diner at the table with fresh herbs and lime; ramen arrives composed and is meant to be eaten as the chef assembled it.`,
      `Nutritionally they diverge too. A standard pho bowl is generally lighter — a clear broth, rice noodles, and lean sliced beef, with the fresh herb plate adding bulk without much else. Ramen&rsquo;s richer broths, especially ${link('/blog/what-is-tonkotsu-ramen', 'tonkotsu')}, carry more fat and calories. Both can run high in sodium, which is the honest caveat for either dish. If you want that comparison in more depth, my guide on ${link('/blog/is-ramen-healthier-than-pasta', 'whether ramen is healthier than pasta')} and the breakdown of ${link('/blog/what-are-the-healthiest-noodles-you-can-eat', 'the healthiest noodles you can eat')} both cover the same ground for ramen specifically, and ${link('/blog/what-are-ramen-noodles-made-of', 'what ramen noodles are made of')} explains the alkaline-noodle difference in detail.`,
      `The broth styles are worth knowing if you are moving between the two cuisines. Ramen splits into four classic families — ${link('/blog/what-is-tonkotsu-ramen', 'tonkotsu')}, ${link('/blog/what-is-shoyu-ramen', 'shoyu')}, ${link('/blog/what-is-shio-ramen', 'shio')}, and ${link('/blog/what-is-miso-ramen', 'miso')} — which run from very rich to very light. Pho&rsquo;s clear beef broth sits closest to shio and shoyu in weight, so if pho is your baseline, those are the ramen styles most likely to feel familiar. The ${link('/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen', 'full four-style comparison')} walks through each one.`,
      `If you like one, the other is a reasonable next stop, and the two often appear in the same neighborhoods — Vietnamese and Japanese restaurants tend to cluster in the same commercial districts. Our ${link('/find', 'search map')} shows both cuisines together, so you can see what else is within walking distance of ${esc(p.name)}.`,
    ]
    sections.push({ id: 'pho-vs-ramen', heading: 'Pho vs. Ramen: How They Differ', paragraphs: paras })
  }

  // ------------------------------------------------------------- location
  {
    const paras: string[] = []
    let loc = `${esc(p.name)} is at ${esc(p.address || `${p.street}, ${where}`)}`
    if (p.county) loc += `, in ${esc(p.county)}`
    loc += '.'
    paras.push(`${loc} The map on this page pins the exact location, and the address links straight to Google Maps driving directions. To see what else is nearby — including ramen restaurants — browse the ${link('/find', 'main search map')}, where pho spots appear with green pins.`)
    if (p.phone) {
      paras.push(`You can reach the restaurant at ${esc(p.phone)}. For a cash-only or limited-hours kitchen, a quick call is the most reliable way to confirm before heading over — Google hours are usually right but not always current around holidays.`)
    }
    if (p.photosCount > 0) {
      paras.push(`There ${p.photosCount === 1 ? 'is' : 'are'} ${p.photosCount.toLocaleString()} photo${p.photosCount === 1 ? '' : 's'} attached to the Google listing, which is the fastest way to judge portion size and how the broth actually looks before committing to a drive.`)
    }
    paras.push(
      `A closing note on how I read a listing like this one: ${
        amenityCount >= 20
          ? `${esc(p.name)} has ${amenityCount} attributes filled in on its profile, which is a well-maintained listing. Businesses that keep their profile current tend to keep their hours current too.`
          : `${esc(p.name)} has ${amenityCount} attributes filled in on its profile. A sparser profile is not a knock on the food — plenty of excellent family-run kitchens never touch their Google listing — but it does mean calling ahead is worth the thirty seconds.`
      }`
    )
    sections.push({ id: 'location', heading: `Location and Contact`, paragraphs: paras })
  }

  return sections
}

export function sectionWordCount(sections: PhoSection[]): number {
  return sections.reduce((n, s) => n + s.heading.split(/\s+/).length + s.paragraphs.reduce((m, p) => m + p.split(/\s+/).length, 0), 0)
}
