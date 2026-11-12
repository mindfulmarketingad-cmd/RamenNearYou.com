// Scoped copy for four high-impression pages. Titles stay at or under 60
// characters and descriptions at or under 155. Every rating, hour, and
// address below is taken from lib/restaurants.json or the Places supplements.
// Snapshot date is the visible "updated" line on each page.

export const CTR_UPDATED_ISO = '2026-11-12'
export const CTR_UPDATED_LABEL = 'Updated November 12, 2026'

export type CtrFaq = { q: string; a: string }
export type CtrLink = { href: string; label: string }

export type CtrPageCopy = {
  /** Document title. Rendered with `title.absolute` so the layout template does not push it past 60 characters. */
  title: string
  description: string
  h1: string
  sectionTitle: string
  url: string
  paragraphs: string[]
  faqs: CtrFaq[]
  links: CtrLink[]
}

export const mobileBestCopy: CtrPageCopy = {
  title: 'Best Ramen Near Me in Mobile, AL (Updated Nov 2026)',
  description:
    'Best ramen near you in Mobile, AL — 2 spots, updated Nov 2026. Happy Sushi (4.4, 440 reviews, Mon–Sat 11AM–9PM) and Kai Restaurant (4.4, 372 reviews).',
  h1: 'Best Ramen Near Me in Mobile, AL',
  sectionTitle: 'Ratings, hours, and what the Mobile listings say',
  url: 'https://www.ramennearyou.com/find/best-ramen-mobile-al',
  paragraphs: [
    'We track 2 ramen restaurants in Mobile, Alabama, and both rate 4.4 stars. Happy Sushi Yester Oaks location has 440 reviews at 3662 Airport Blvd. Kai Restaurant has 372 reviews at 5045 Cottage Hill Rd.',
    'Happy Sushi is listed Monday through Saturday 11AM–9PM and closed Sunday. It is categorized as a ramen, Asian fusion, bubble tea, Korean, Japanese, and sushi restaurant, with vegetarian options and a full bar. Kai Restaurant has no posted hours in our data. It is categorized as a ramen and Japanese restaurant, with vegan options, vegetarian options, delivery, and outdoor seating.',
  ],
  faqs: [
    {
      q: 'What is the best ramen near me in Mobile, AL?',
      a: 'Both spots we track rate 4.4 stars. Happy Sushi Yester Oaks location has the larger sample, with 440 reviews at 3662 Airport Blvd, Mobile, AL 36608. Kai Restaurant has 372 reviews at 5045 Cottage Hill Rd, Mobile, AL 36609.',
    },
    {
      q: 'What are the hours for ramen in Mobile?',
      a: 'Happy Sushi Yester Oaks is listed Monday–Saturday 11AM–9PM and closed Sunday. Kai Restaurant does not have posted hours in our data, so check that listing before you go. When hours are on file, the map’s Open Now filter compares them to the current time.',
    },
    {
      q: 'What should I order at the Mobile ramen spots?',
      a: 'Neither listing includes a dish-by-dish menu. Happy Sushi is categorized as ramen, Asian fusion, bubble tea, Korean, Japanese, and sushi, and it lists vegetarian options and a full bar. Kai is categorized as a ramen and Japanese restaurant, and it lists vegan options, vegetarian options, delivery, and outdoor seating.',
    },
    {
      q: 'How many ramen restaurants are in Mobile, AL?',
      a: 'Two. Both are rated 4.4 with more than 20 reviews, so both appear on this best-ramen page: Happy Sushi Yester Oaks location (440 reviews) and Kai Restaurant (372 reviews).',
    },
  ],
  links: [
    { href: '/', label: 'Ramen near you' },
    { href: '/alabama', label: 'Best ramen in Alabama' },
    { href: '/find/mobile-al', label: 'All ramen in Mobile on the map' },
  ],
}

export const siouxFallsBlogCopy: CtrPageCopy = {
  title: 'Best Ramen Near Me in Sioux Falls (Updated Nov 2026)',
  description:
    'Best ramen near you in Sioux Falls, SD — 13 spots, updated Nov 2026. Four shops at 4.7 stars, including Taichi and Ichifuji, with hours and what to order.',
  h1: 'Best Ramen Near Me in Sioux Falls, SD',
  sectionTitle: 'Hours, best-rated spots, and what to order in Sioux Falls',
  url: 'https://www.ramennearyou.com/blog/best-ramen-restaurants-sioux-falls-sd',
  paragraphs: [
    'We track 13 ramen spots in Sioux Falls. Four tie at 4.7 stars. By review count they are Oshima Sushi Japanese Cuisine (1,085 reviews, 109 E 10th St), Sakura Sushi (319 reviews, 2400 S Marion Rd), Taichi Bubble Tea, Ramen and Poke Bowl (302 reviews, 4107 W 41st St), and Ichifuji Ramen and Korean Fried Chicken (123 reviews, 1609 E 10th St).',
    'Google describes Oshima as a casual nook with inventive sushi rolls and classic Japanese entrees, plus lunch specials and bubble tea. Taichi’s name lists bubble tea, ramen, and poke. Ichifuji’s name lists ramen and Korean fried chicken. No listing includes a specific ramen bowl, so those names and descriptions are what we can confirm.',
  ],
  faqs: [
    {
      q: 'What is the best ramen near me in Sioux Falls?',
      a: 'Four of the 13 spots we track tie at 4.7 stars. Sorted by review count: Oshima Sushi Japanese Cuisine (1,085 reviews), Sakura Sushi (319), Taichi Bubble Tea, Ramen and Poke Bowl (302), and Ichifuji Ramen and Korean Fried Chicken (123). Fancy bowl is next at 4.6 from 324 reviews.',
    },
    {
      q: 'Which Sioux Falls ramen shops are open, and what are the hours?',
      a: 'Ichifuji is closed Monday, then Tuesday–Thursday 11AM–9PM, Friday–Saturday 11AM–10PM, and Sunday 11AM–9PM. Taichi is closed Monday, then Tuesday–Saturday 11AM–9:30PM and Sunday 11AM–9PM. Ramen Fuji (4.5 from 773 reviews, 2300 S Minnesota Ave C) is closed Tuesday, open Monday and Wednesday–Thursday 11AM–9PM, Friday–Saturday 11AM–10PM, and Sunday 11AM–9PM. Ninja Ramen & Thai (4.3 from 372 reviews) is closed Tuesday and stays open until 10:30PM Friday and Saturday. None of these four list hours past midnight. The map’s Open Now filter checks these posted hours against the current time.',
    },
    {
      q: 'What should I order in Sioux Falls?',
      a: 'The dataset does not list individual bowls. Google’s description of Oshima Sushi Japanese Cuisine is: “Casual nook with inventive sushi rolls & classic Japanese entrees, plus lunch specials & bubble tea.” Taichi Bubble Tea, Ramen and Poke Bowl lists bubble tea, ramen, and poke in its name, and it lists vegan and vegetarian options. Ichifuji lists ramen and Korean fried chicken in its name and is priced at $. Google describes Tokyo | Japanese Cuisine (4.5 from 797 reviews) as: “Laid-back Japanese option featuring sashimi, unique maki rolls, bento boxes & traditional entrees.”',
    },
    {
      q: 'How many ramen spots are near Sioux Falls, SD?',
      a: 'Thirteen. The five on this page are the highest-rated by Google rating, with review count as the tiebreaker. The full set, including Ramen Fuji and Ninja Ramen & Thai, is on the Sioux Falls map.',
    },
  ],
  links: [
    { href: '/', label: 'Ramen near you' },
    { href: '/south-dakota', label: 'Best ramen in South Dakota' },
    { href: '/find/sioux-falls-sd', label: 'All ramen in Sioux Falls on the map' },
  ],
}

export const topekaBlogCopy: CtrPageCopy = {
  title: 'Best Ramen Near Me in Topeka, KS (Updated Nov 2026)',
  description:
    'Best ramen near you in Topeka, KS — 7 spots we track, updated Nov 2026. Compare ratings and posted hours for Yuki (4.6) and Tuptim Thai (4.6).',
  h1: 'Best Ramen Near Me in Topeka, KS',
  sectionTitle: 'Topeka ratings, posted hours, and which addresses are in town',
  url: 'https://www.ramennearyou.com/blog/best-ramen-restaurants-topeka-ks',
  paragraphs: [
    'We track 7 restaurants under Topeka, Kansas. The highest rating in the file is Mirai ramen & sushi at 4.7 from 352 reviews, but the address stored on that listing is 6254 E 37th St N Ste #180, Wichita, KS. Hagaya Ramen Shop (4.4 from 493 reviews) is stored at 1111 Commercial St, Emporia, KS.',
    'Among listings with a Topeka street address, Tuptim Thai Restaurant rates 4.6 from 1,325 reviews at 220 SW 29th St, and Yuki Restaurant of Japan rates 4.6 from 807 reviews at 5632 SW 29th St. Kiku Japanese Steak House is 4.4 from 1,097 reviews at 5331 SW 22nd Pl #46. No listing includes a dish-level menu.',
  ],
  faqs: [
    {
      q: 'What is the best-rated restaurant we list for Topeka?',
      a: 'Mirai ramen & sushi is the highest rating in the Topeka file, at 4.7 from 352 reviews, but its stored address is 6254 E 37th St N Ste #180, Wichita, KS 67220. Among listings with a Topeka street address, Tuptim Thai Restaurant (4.6 from 1,325 reviews, 220 SW 29th St) and Yuki Restaurant of Japan (4.6 from 807 reviews, 5632 SW 29th St) rank highest.',
    },
    {
      q: 'What hours are posted for Topeka restaurants?',
      a: 'Yuki Restaurant of Japan is listed Sunday 12PM–9PM, Monday–Thursday 4:30PM–9:30PM, Friday 4:30PM–10PM, and Saturday 11:30AM–10PM. Tuptim Thai Restaurant is listed Sunday 12PM–8PM, Monday–Friday 11AM–2:30PM and 5PM–9PM, and Saturday 12PM–9PM. Noodles and Company at 2110 SW Wanamaker Rd is listed 10:30AM–10PM every day. Mizu Sushi (4.1 from 1,260 reviews, 1320 SW Ashworth Pl) is closed Tuesday. The map’s Open Now filter uses these posted hours.',
    },
    {
      q: 'Where can I get ramen in Topeka, and what should I order?',
      a: 'Two names in this file include the word ramen, and neither stored address is in Topeka: Mirai ramen & sushi (Wichita) and Hagaya Ramen Shop (Emporia, 4.4 from 493 reviews, closed Sunday). The Topeka street addresses are Tuptim Thai Restaurant, Yuki Restaurant of Japan, Kiku Japanese Steak House, Mizu Sushi, and Noodles and Company (4.0 from 701 reviews, price $). None of the listings include a dish menu, so we can’t name a specific bowl to order.',
    },
    {
      q: 'How many spots do you track for Topeka, KS?',
      a: 'Seven. This page ranks the top five by rating and review count. The Topeka map lists all seven, including the Wichita and Emporia addresses stored on the Mirai and Hagaya listings.',
    },
  ],
  links: [
    { href: '/', label: 'Ramen near you' },
    { href: '/kansas', label: 'Best ramen in Kansas' },
    { href: '/find/topeka-ks', label: 'All ramen in Topeka on the map' },
  ],
}

export const mississippiCopy: CtrPageCopy = {
  title: 'Best Ramen Near Me in Mississippi (Updated Nov 2026)',
  description:
    'Best ramen near you in Mississippi — 103 spots across 10 cities, updated Nov 2026. Zundo Ramen Bar in Jackson is 4.8 stars from 309 reviews.',
  h1: 'Best Ramen Near Me in Mississippi',
  sectionTitle: 'Best-rated ramen names, and what this directory does not include',
  url: 'https://www.ramennearyou.com/mississippi',
  paragraphs: [
    'This Mississippi directory lists 103 restaurants across 10 cities: Gulfport, Hattiesburg, Meridian, Jackson, Biloxi, Oxford, Olive Branch, Southaven, Starkville, and Tupelo. Seven of those listings have ramen in the name and a Mississippi street address.',
    'Zundo Ramen Bar rates 4.8 from 309 reviews at 3100 N State St Unit 102, Jackson, MS 39216. Xian Ramen is also 4.8, from 152 reviews, at 96 Laurel Park Dr, Flowood, MS 39232. Miss Thai & Ramen Noodles Café in Gulfport rates 4.7 from 329 reviews. These listings include a name, address, rating, and review count. They do not include a weekly hours schedule or a dish menu.',
  ],
  faqs: [
    {
      q: 'What is the best ramen near me in Mississippi?',
      a: 'Among listings with ramen in the name and a Mississippi address, Zundo Ramen Bar rates 4.8 from 309 reviews at 3100 N State St Unit 102, Jackson. Xian Ramen is also 4.8, from 152 reviews, at 96 Laurel Park Dr, Flowood. Miss Thai & Ramen Noodles Café at 14451 Dedeaux Rd, Gulfport, rates 4.7 from 329 reviews.',
    },
    {
      q: 'Is ramen open now in Mississippi, and where are the hours?',
      a: 'The Mississippi listings in this directory do not include a weekly hours schedule, so we can’t say which kitchen is open right now from this data. Confirm hours on the restaurant’s own page before you drive.',
    },
    {
      q: 'What should I order at Mississippi ramen shops?',
      a: 'No dish menu is stored for these places. Ramen-named listings with a Mississippi address also include Chidoriya Ramen & Poke (4.7 from 110 reviews, 1801 Jackson Ave W, Oxford), Takumi Ramen (4.5 from 281 reviews, 3356 N Gloster St, Tupelo), Kyuramen x TBaar in Southaven (4.4 from 275 reviews, 6221 Getwell Rd), and Kyuramen x Tbaar in Jackson (4.1 from 205 reviews, 1220 E Northside Dr Ste 230). Miss Thai & Ramen Noodles Café is listed at Google price level 1; Zundo and Xian are price level 2.',
    },
    {
      q: 'How many ramen restaurants are in Mississippi?',
      a: 'The directory lists 103 restaurants across 10 cities. Seven have ramen in the name and a Mississippi street address. Jackson’s map is the fastest way to narrow that list to one city.',
    },
  ],
  links: [
    { href: '/', label: 'Ramen near you' },
    { href: '/find/jackson-ms', label: 'Ramen in Jackson, MS' },
    { href: '/find/best-ramen-jackson-ms', label: 'Best ramen in Jackson, MS' },
  ],
}

const PAGE_COPY: CtrPageCopy[] = [mobileBestCopy, siouxFallsBlogCopy, topekaBlogCopy, mississippiCopy]

for (const page of PAGE_COPY) {
  if (page.title.length > 60) {
    throw new Error(`${page.url} title is ${page.title.length} characters`)
  }
  if (page.description.length > 155) {
    throw new Error(`${page.url} description is ${page.description.length} characters`)
  }
  if (page.faqs.length < 3 || page.faqs.length > 4) {
    throw new Error(`${page.url} should have 3 or 4 FAQs`)
  }
}

const BLOG_COPY: Record<string, CtrPageCopy> = {
  'best-ramen-restaurants-sioux-falls-sd': siouxFallsBlogCopy,
  'best-ramen-restaurants-topeka-ks': topekaBlogCopy,
}

export function getBlogCtr(slug: string): CtrPageCopy | null {
  return BLOG_COPY[slug] ?? null
}

export function getBlogCtrForCity(citySlug: string, stateCode: string): CtrPageCopy | null {
  if (citySlug === 'sioux-falls' && stateCode === 'SD') return siouxFallsBlogCopy
  if (citySlug === 'topeka' && stateCode === 'KS') return topekaBlogCopy
  return null
}

export function getFindModifierCtr(cityState: string): CtrPageCopy | null {
  if (cityState === 'best-ramen-mobile-al') return mobileBestCopy
  return null
}

export function getStateCtr(stateSlug: string): CtrPageCopy | null {
  if (stateSlug === 'mississippi') return mississippiCopy
  return null
}

/** Inbound links from a state directory page to a high-impression city guide. */
export function stateSpotlightLinks(stateSlug: string): { intro: string; links: CtrLink[] } | null {
  if (stateSlug === 'alabama') {
    return {
      intro: 'In Mobile we track 2 ramen restaurants, both rated 4.4.',
      links: [
        { href: '/find/best-ramen-mobile-al', label: 'Best ramen near me in Mobile, AL' },
        { href: '/find/mobile-al', label: 'All ramen in Mobile on the map' },
      ],
    }
  }
  if (stateSlug === 'south-dakota') {
    return {
      intro: 'Sioux Falls is the city we track most closely in South Dakota, with 13 ramen spots.',
      links: [
        { href: '/blog/best-ramen-restaurants-sioux-falls-sd', label: 'Best ramen near me in Sioux Falls' },
        { href: '/find/sioux-falls-sd', label: 'All ramen in Sioux Falls on the map' },
      ],
    }
  }
  if (stateSlug === 'kansas') {
    return {
      intro: 'Topeka’s guide covers the 7 restaurants we file under the city, with ratings and posted hours.',
      links: [
        { href: '/blog/best-ramen-restaurants-topeka-ks', label: 'Best ramen near me in Topeka, KS' },
        { href: '/find/topeka-ks', label: 'All ramen in Topeka on the map' },
      ],
    }
  }
  return null
}

/** Inbound links from a city map page to its sibling guide. */
export function citySpotlightLinks(cityState: string): { intro: string; links: CtrLink[] } | null {
  if (cityState === 'mobile-al') {
    return {
      intro: 'Happy Sushi and Kai Restaurant are the two Mobile spots on the best-ramen guide.',
      links: [
        { href: '/find/best-ramen-mobile-al', label: 'Best ramen near me in Mobile, AL' },
        { href: '/alabama', label: 'Best ramen in Alabama' },
      ],
    }
  }
  if (cityState === 'sioux-falls-sd') {
    return {
      intro: 'The Sioux Falls guide ranks the highest-rated of the 13 spots on this map.',
      links: [
        { href: '/blog/best-ramen-restaurants-sioux-falls-sd', label: 'Best ramen near me in Sioux Falls' },
        { href: '/south-dakota', label: 'Best ramen in South Dakota' },
      ],
    }
  }
  if (cityState === 'topeka-ks') {
    return {
      intro: 'The Topeka guide ranks the highest-rated of the restaurants on this map and notes which addresses are actually in Topeka.',
      links: [
        { href: '/blog/best-ramen-restaurants-topeka-ks', label: 'Best ramen near me in Topeka, KS' },
        { href: '/kansas', label: 'Best ramen in Kansas' },
      ],
    }
  }
  if (cityState === 'jackson-ms') {
    return {
      intro: 'Jackson is part of the statewide directory of 103 restaurants across Mississippi.',
      links: [
        { href: '/mississippi', label: 'Best ramen near me in Mississippi' },
        { href: '/find/best-ramen-jackson-ms', label: 'Best ramen in Jackson, MS' },
      ],
    }
  }
  return null
}

export const HOMEPAGE_CTR_LINKS: CtrLink[] = [
  { href: '/find/best-ramen-mobile-al', label: 'Best ramen near me in Mobile, AL' },
  { href: '/blog/best-ramen-restaurants-sioux-falls-sd', label: 'Best ramen near me in Sioux Falls' },
  { href: '/blog/best-ramen-restaurants-topeka-ks', label: 'Best ramen near me in Topeka, KS' },
  { href: '/mississippi', label: 'Best ramen near me in Mississippi' },
]
