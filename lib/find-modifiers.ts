// Registry of /find "{modifier}-in-{city}-{state}" page types. Each modifier is
// matched as a URL prefix inside the /find/[cityState] catch-all route, so we
// never rely on (unsupported) partial dynamic route segments.

export interface ModifierFilter {
  initialBowls?: string[]
  initialFlags?: string[]
  initialQuery?: string
}

export interface FindModifier {
  /** URL prefix, e.g. "tonkotsu-ramen-in" → /find/tonkotsu-ramen-in-dallas-tx */
  prefix: string
  /** Map filter applied on load */
  filter: ModifierFilter
  /** H1 + <title> base, e.g. "Tonkotsu Ramen In Dallas, Texas" */
  title: (city: string, stateName: string) => string
  /** Lowercase noun used in meta descriptions, e.g. "tonkotsu ramen" */
  metaNoun: string
  /** Breadcrumb hub link */
  hubHref: string
  hubLabel: string
  /** Intro paragraph */
  about: string
  /** FAQ entries (cityName, stateCode interpolated) */
  faqs: (cityName: string, stateCode: string) => Array<{ q: string; a: string }>
}

export const FIND_MODIFIERS: FindModifier[] = [
  {
    prefix: 'vegan-ramen-in',
    filter: { initialBowls: ['vegan'] },
    title: (c, s) => `Vegan Ramen In ${c}, ${s}`,
    metaNoun: 'vegan ramen',
    hubHref: '/vegan-ramen-near-me',
    hubLabel: 'Vegan Ramen',
    about:
      'Vegan ramen swaps pork- or chicken-based stock for a plant-based broth — usually built on kombu, dried shiitake, and roasted vegetables — while keeping the same springy noodles and layered umami of a classic bowl. The best versions do not taste like a compromise.',
    faqs: (city, st) => [
      { q: `Where can I find vegan ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving vegan ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'Is vegan ramen actually good?', a: 'Yes — the best shops build a genuinely rich, umami-deep broth from kombu, dried mushrooms, and roasted vegetables rather than just serving a thin vegetable stock. Many vegan bowls now rival their pork-based counterparts.' },
      { q: 'Are ramen noodles themselves vegan?', a: 'Traditional ramen noodle dough (wheat flour, water, salt, kansui) contains no animal products, so the noodles are almost always vegan — it is the broth and toppings you need to check.' },
    ],
  },
  {
    prefix: 'best-ramen',
    filter: { initialFlags: ['top-rated'] },
    title: (c, s) => `Best Ramen In ${c}, ${s}`,
    metaNoun: 'best ramen',
    hubHref: '/find/best-ramen-near-me',
    hubLabel: 'Best Ramen',
    about:
      'The best ramen restaurants share a few traits: a broth simmered in-house rather than shortcuts, noodles with real bite, and a rating that holds up across a large number of reviews rather than a handful of lucky five-stars. This map is sorted so the highest-rated, most-reviewed spots near you rank first.',
    faqs: (city, st) => [
      { q: `What is the best ramen in ${city}?`, a: `The map above is sorted so the highest-rated ramen restaurants in ${city}, ${st} rank first, with review count as the tiebreaker. Enter your ZIP or click "Use my location" to see the best bowl closest to you.` },
      { q: `How is "best" ranked on this page?`, a: `Rating first, review count as the tiebreaker, and a minimum review threshold so a perfect score from only a few reviews doesn't outrank a proven favorite with thousands behind it.` },
      { q: `Is the top-ranked spot in ${city} always the right pick?`, a: `It's a strong default, but layering on a broth filter — tonkotsu, miso, shoyu, or shio — helps you find the best option within the specific style you're craving that day.` },
    ],
  },
  {
    prefix: 'tonkotsu-ramen-in',
    filter: { initialBowls: ['tonkotsu'] },
    title: (c, s) => `Ramen Tonkotsu In ${c}, ${s}`,
    metaNoun: 'tonkotsu ramen',
    hubHref: '/find/tonkotsu-ramen',
    hubLabel: 'Tonkotsu Ramen',
    about:
      'Tonkotsu is the rich, creamy pork-bone broth from Fukuoka (Hakata) on the island of Kyushu, simmered for 12 to 18 hours until the collagen melts into a milky, opaque stock. It is typically served with thin, firm noodles and chashu pork.',
    faqs: (city, st) => [
      { q: `Where can I find tonkotsu ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving tonkotsu ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is tonkotsu ramen?', a: 'Tonkotsu ramen is built on a rich, creamy broth made by simmering pork bones for 12 to 18 hours until the collagen breaks down into a milky stock. Originating in Fukuoka (Hakata), it is served with thin, firm noodles and chashu pork.' },
      { q: 'Is tonkotsu ramen pork?', a: 'Yes — tonkotsu literally means "pork bone." The broth is made entirely from pork bones and the bowl is usually topped with chashu pork, so it is not vegetarian unless a shop offers a plant-based version.' },
    ],
  },
  {
    prefix: 'miso-ramen-in',
    filter: { initialBowls: ['miso'] },
    title: (c, s) => `Ramen Miso In ${c}, ${s}`,
    metaNoun: 'miso ramen',
    hubHref: '/find/miso-ramen',
    hubLabel: 'Miso Ramen',
    about:
      'Miso ramen is built on a broth seasoned with fermented soybean paste (miso). Originating in Sapporo, Hokkaido, it is rich, savory, and slightly sweet — often topped with corn, butter, bean sprouts, and ground pork.',
    faqs: (city, st) => [
      { q: `Where can I find miso ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving miso ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is miso ramen?', a: 'Miso ramen is built on a broth seasoned with fermented soybean paste (miso). Originating in Sapporo, Hokkaido, it is rich, savory, and slightly sweet — often topped with corn, butter, bean sprouts, and ground pork.' },
      { q: 'Is miso ramen spicy?', a: 'Classic miso ramen is savory rather than spicy, but spicy miso (kara miso) adds chili paste or oil for heat. Many shops offer both versions.' },
    ],
  },
  {
    prefix: 'ramen-spicy-miso',
    filter: { initialBowls: ['spicy-miso'] },
    title: (c, s) => `Ramen Spicy Miso ${c}, ${s}`,
    metaNoun: 'spicy miso ramen',
    hubHref: '/find/ramen-spicy-miso-near-me',
    hubLabel: 'Ramen Spicy Miso',
    about:
      'Spicy miso (kara miso) is classic Sapporo-style miso ramen with chili paste or chili oil blended directly into the tare, keeping the fermented, savory-sweet miso character while adding real, building heat.',
    faqs: (city, st) => [
      { q: `Where can I find spicy miso ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving spicy miso ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is spicy miso ramen?', a: 'Spicy miso ramen — often called kara miso — is classic miso ramen with chili paste or chili oil blended into the tare, combining fermented, savory-sweet miso broth with real, building heat.' },
      { q: 'Is spicy miso ramen the same as Korean spicy ramen?', a: 'No. Spicy miso uses a Japanese miso tare with Japanese chili preparations, while Korean-influenced spicy ramen typically uses gochugaru or gochujang on a different broth base, giving a fruitier, smokier heat.' },
    ],
  },
  {
    prefix: 'shoyu-ramen-in',
    filter: { initialBowls: ['shoyu'] },
    title: (c, s) => `Ramen Shoyu In ${c}, ${s}`,
    metaNoun: 'shoyu ramen',
    hubHref: '/find/shoyu-ramen',
    hubLabel: 'Shoyu Ramen',
    about:
      'Shoyu ramen is the original Tokyo style — a clear, brown broth seasoned with soy sauce (shoyu). It is light yet deeply savory, balancing a chicken or pork-and-dashi base with the umami of soy, usually served with curly noodles.',
    faqs: (city, st) => [
      { q: `Where can I find shoyu ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving shoyu ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is shoyu ramen?', a: 'Shoyu ramen is a Japanese ramen style with a clear, soy-sauce-seasoned broth. Originating in Tokyo, it is light, clean, and savory — typically built on a chicken or pork-and-dashi base and served with curly noodles.' },
      { q: 'What is the difference between shoyu and shio ramen?', a: 'Both are clear, light broths. Shoyu is seasoned with soy sauce, giving it a brown color and deeper umami, while shio is seasoned with salt, producing a paler, more delicate broth.' },
    ],
  },
  {
    prefix: 'shio-ramen-in',
    filter: { initialBowls: ['shio'] },
    title: (c, s) => `Shio Ramen In ${c}, ${s}`,
    metaNoun: 'shio ramen',
    hubHref: '/find/shio-ramen',
    hubLabel: 'Shio Ramen',
    about:
      'Shio ramen is the lightest, most delicate of the classic styles — a clear, pale broth seasoned simply with salt (shio). Associated with Hakodate in Hokkaido, it lets the quality of the chicken, seafood, or dashi base shine through.',
    faqs: (city, st) => [
      { q: `Where can I find shio ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving shio ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is shio ramen?', a: 'Shio ramen is a Japanese ramen style with a clear, salt-seasoned broth. It is the lightest and most delicate of the classic styles, associated with Hakodate, and lets the chicken, seafood, or dashi base shine.' },
      { q: 'Is shio ramen healthy?', a: 'Shio ramen tends to be lighter and lower in fat than rich styles like tonkotsu, since the broth is clear and salt-seasoned. That said, it can still be high in sodium, so it is moderate rather than strictly "healthy."' },
    ],
  },
  {
    prefix: 'beef-ramen-in',
    filter: { initialQuery: 'beef' },
    title: (c, s) => `Beef Ramen In ${c}, ${s}`,
    metaNoun: 'beef ramen',
    hubHref: '/find/beef-ramen',
    hubLabel: 'Beef Ramen',
    about:
      'Beef ramen features a beef-based broth or beef toppings such as braised short rib, brisket, or thin-sliced steak. It offers a deep, hearty, savory flavor and has grown in popularity alongside traditional pork ramen.',
    faqs: (city, st) => [
      { q: `Where can I find beef ramen in ${city}?`, a: `The map above shows ${city}, ${st} restaurants serving beef ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is beef ramen?', a: 'Beef ramen features a beef-based broth or beef toppings such as braised short rib, brisket, or thin-sliced steak. It offers a deep, hearty, savory flavor and has grown in popularity alongside traditional pork ramen.' },
      { q: 'Is beef ramen the same as Lanzhou beef noodle soup?', a: 'Related but distinct. Lanzhou beef noodle soup is a Chinese hand-pulled dish with a clear beef broth, while beef ramen usually means Japanese-style ramen with a beef broth or beef toppings.' },
    ],
  },
  {
    prefix: 'ramen-open-late-in',
    filter: { initialFlags: ['open-late'] },
    title: (c, s) => `Ramen Open Late In ${c}, ${s}`,
    metaNoun: 'ramen open late',
    hubHref: '/find/ramen-open-late',
    hubLabel: 'Ramen Open Late',
    about:
      'Late-night ramen cravings are real. These restaurants stay open until 10 PM or later, so you can get a hot bowl when most kitchens have already closed for the night.',
    faqs: (city, st) => [
      { q: `What ramen restaurants are open late in ${city}?`, a: `The map above shows ${city}, ${st} ramen spots open until 10 PM or later. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: `Does ${city} have late-night ramen?`, a: `Yes — the map is pre-filtered to show ${city} ramen restaurants that stay open late. Availability varies by neighborhood, so use the location search to find the closest one.` },
      { q: 'What time do ramen restaurants usually close?', a: 'Most ramen restaurants close between 9 PM and 10 PM. Late-night spots typically stay open until 11 PM, midnight, or beyond — especially in larger cities.' },
    ],
  },
  {
    prefix: 'ramen-open-now-in',
    filter: { initialFlags: ['open-now'] },
    title: (c, s) => `Ramen Open Now In ${c}, ${s}`,
    metaNoun: 'ramen open now',
    hubHref: '/find/ramen-open-now',
    hubLabel: 'Ramen Open Now',
    about:
      'No more showing up to a closed door. These restaurants are open right now, pre-filtered so you can find a hot bowl of ramen and head straight there.',
    faqs: (city, st) => [
      { q: `What ramen restaurants are open now in ${city}?`, a: `The map above shows ${city}, ${st} ramen spots that are open right now. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: `How do I find ramen open right now in ${city}?`, a: `The map is pre-filtered to show only currently-open ramen restaurants in ${city}. Enter your ZIP or use your location and the list sorts by distance so you can get to a bowl fast.` },
      { q: 'Are the open hours accurate?', a: 'Open-now status is based on each restaurant\'s posted hours. Hours can change for holidays or special events, so it\'s always smart to call ahead before a long trip.' },
    ],
  },
  {
    prefix: 'traditional-ramen-in',
    filter: {},
    title: (c, s) => `Traditional Ramen In ${c}, ${s}`,
    metaNoun: 'traditional ramen',
    hubHref: '/find/traditional-ramen',
    hubLabel: 'Traditional Ramen',
    about:
      'Traditional ramen is made the classic Japanese way — a broth simmered in-house for hours (tonkotsu, shoyu, shio, or miso), fresh noodles, and a few balanced toppings rather than a pile of gimmicks. Filter by a classic broth to find the most authentic bowls.',
    faqs: (city, st) => [
      { q: `Where can I find traditional ramen in ${city}?`, a: `The map above shows ${city}, ${st} ramen restaurants. Enter your ZIP or click "Use my location," then filter by a classic broth like tonkotsu or shoyu to surface the most traditional bowls.` },
      { q: 'What is traditional ramen?', a: 'Traditional ramen is a bowl made the classic Japanese way — a house-simmered broth (tonkotsu, shoyu, shio, or miso), fresh noodles, and balanced toppings like chashu, egg, and scallion.' },
      { q: 'How can I tell if a ramen shop is authentic?', a: 'Look for house-made broth, a focused menu, and classic toppings. Reviews that praise the broth and noodles specifically are a strong sign of a traditional kitchen.' },
    ],
  },
  {
    prefix: 'chicken-katsu-ramen-in',
    filter: {},
    title: (c, s) => `Chicken Katsu Ramen In ${c}, ${s}`,
    metaNoun: 'chicken katsu ramen',
    hubHref: '/find/chicken-katsu-ramen',
    hubLabel: 'Chicken Katsu Ramen',
    about:
      'Chicken katsu ramen tops a hot bowl of ramen with a crispy, panko-breaded fried chicken cutlet. It is a hearty, modern, crowd-pleasing twist on classic ramen that pairs especially well with a rich tonkotsu or chicken paitan broth.',
    faqs: (city, st) => [
      { q: `Where can I find chicken katsu ramen in ${city}?`, a: `The map above shows ${city}, ${st} ramen restaurants. Enter your ZIP or click "Use my location," then open nearby listings to find spots serving chicken katsu ramen.` },
      { q: 'What is chicken katsu ramen?', a: 'Chicken katsu ramen is a ramen bowl topped with a crispy, panko-breaded fried chicken cutlet over noodles and broth — a hearty, modern twist on classic ramen.' },
      { q: 'What broth pairs best with chicken katsu?', a: 'A rich broth like tonkotsu or creamy chicken paitan pairs best, giving the fried cutlet something substantial to sit in.' },
    ],
  },
  {
    prefix: 'ramen-open-24-hours-in',
    filter: { initialFlags: ['open-midnight'] },
    title: (c, s) => `Ramen Open 24 Hours In ${c}, ${s}`,
    metaNoun: 'late-night ramen',
    hubHref: '/find/ramen-open-24-hours',
    hubLabel: 'Ramen Open 24 Hours',
    about:
      'True 24-hour ramen is rare in the US, so this map is filtered to spots that serve past midnight — the closest thing to all-night ramen in most cities. It surfaces the latest-serving bowls when a late-night craving hits.',
    faqs: (city, st) => [
      { q: `Is there ramen open 24 hours in ${city}?`, a: `In most cities, "24 hours" really means open very late. The map above shows ${city}, ${st} ramen spots serving past midnight — the most realistic late-night options. Add "Open Now" to confirm a spot is serving.` },
      { q: `How do I find late-night ramen in ${city}?`, a: `The map is pre-filtered to ramen open past midnight in ${city}. Enter your ZIP or use your location to sort by distance, and call ahead late at night since hours can change.` },
      { q: 'What time do most ramen shops close?', a: 'Most close between 9 and 10 PM, while late-night spots run to 11 PM, midnight, or beyond — especially in larger cities.' },
    ],
  },
  {
    prefix: 'ramen-shop-in',
    filter: {},
    title: (c, s) => `Ramen Shops In ${c}, ${s}`,
    metaNoun: 'ramen shops',
    hubHref: '/find/ramen-shop',
    hubLabel: 'Ramen Shops',
    about:
      'A great ramen shop (ramen-ya) does a few things obsessively well — a house-simmered broth, noodles with real bite, and consistency every visit. Browse the local shops near you by rating, broth, hours, and distance.',
    faqs: (city, st) => [
      { q: `How do I find a ramen shop in ${city}?`, a: `The map above shows ${city}, ${st} ramen shops. Enter your ZIP or click "Use my location," and the closest, best-rated shops sort to the top.` },
      { q: 'What makes a great ramen shop?', a: 'House-made broth and noodles, a focused menu, consistent quality every visit, and a loyal local following are the clearest signs of a great ramen shop.' },
      { q: 'What is a ramen-ya?', a: 'Ramen-ya is the Japanese term for a ramen shop — typically a focused spot, often with counter seating, that specializes in noodles and broth.' },
    ],
  },
  {
    prefix: 'new-ramen-near-me-in',
    filter: { initialFlags: ['new-ramen'] },
    title: (c, s) => `New Ramen Places In ${c}, ${s}`,
    metaNoun: 'new ramen places',
    hubHref: '/find/new-ramen-near-me',
    hubLabel: 'New Ramen Places',
    about:
      'Newly opened ramen shops have not racked up many reviews yet, so this map surfaces the rated-but-early spots near you — the latest places to try before the crowds find them.',
    faqs: (city, st) => [
      { q: `What new ramen places are in ${city}?`, a: `The map above shows ${city}, ${st} ramen spots that are still early in their run — fewer reviews usually means a newer opening. Enter your ZIP or click "Use my location" to sort by distance, then check the earliest review dates to confirm how new each one is.` },
      { q: 'How do you know which ramen spots are new?', a: 'Newly opened shops have far fewer reviews than long-established ones, so this page surfaces rated spots with a low review count. Checking the dates on the earliest reviews confirms how new a place really is.' },
      { q: 'Is it worth trying a brand-new ramen shop?', a: 'Often yes — new spots bring fresh ideas and shorter waits. Order the signature bowl, go at an off-peak time while the kitchen settles in, and call ahead since hours can be incomplete early on.' },
    ],
  },
  {
    prefix: 'fish-ramen-near-me-in',
    filter: { initialFlags: ['fish-ramen'] },
    title: (c, s) => `Fish Ramen In ${c}, ${s}`,
    metaNoun: 'fish ramen',
    hubHref: '/find/fish-ramen-near-me',
    hubLabel: 'Fish Ramen',
    about:
      'Fish ramen leans on seafood for its flavor — a savory gyokai (seafood) broth built on dried fish like niboshi, or a bowl topped with fresh fish and shellfish. This map surfaces the seafood-forward ramen spots near you.',
    faqs: (city, st) => [
      { q: `Where can I find fish ramen in ${city}?`, a: `The map above shows ${city}, ${st} seafood-forward ramen spots. Enter your ZIP or click "Use my location" to sort by distance, then check menus and reviews for gyokai or niboshi to confirm a true seafood bowl.` },
      { q: 'What is fish ramen?', a: 'Fish ramen gets its flavor from seafood — usually a gyokai broth built on dried fish like niboshi (sardines), bonito, and kombu, or a bowl topped with fresh fish and shellfish.' },
      { q: 'What is gyokai ramen?', a: 'Gyokai means "seafood" in Japanese. Gyokai ramen uses a broth made from dried fish and seaweed for a deep, savory, umami-rich flavor.' },
    ],
  },
  {
    prefix: 'ramen-sushi-in',
    filter: { initialFlags: ['ramen-sushi'] },
    title: (c, s) => `Ramen and Sushi In ${c}, ${s}`,
    metaNoun: 'ramen and sushi',
    hubHref: '/find/ramen-sushi-near-me',
    hubLabel: 'Ramen and Sushi',
    about:
      'When you want both ramen and sushi in one sitting, full-service Japanese restaurants and izakaya are the move — they serve hot bowls alongside fresh sushi and sashimi. This map is filtered to the spots near you most likely to do both.',
    faqs: (city, st) => [
      { q: `Where can I find ramen and sushi in ${city}?`, a: `The map above shows ${city}, ${st} Japanese restaurants and izakaya likely to serve both ramen and sushi. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'Do restaurants serve both ramen and sushi?', a: 'Yes — full-service Japanese restaurants and izakaya commonly serve both ramen and sushi, plus sashimi and small plates. Dedicated ramen shops and sushi bars usually specialize in one.' },
      { q: 'What should I order at a ramen and sushi spot?', a: 'Start with a few pieces of nigiri or a roll while the kitchen fires your ramen, then eat the bowl while it is hot. It is the best way to sample the kitchen’s range.' },
    ],
  },
  {
    prefix: 'sushi-near-in',
    filter: { initialFlags: ['sushi'] },
    title: (c, s) => `Sushi Near ${c}, ${s}`,
    metaNoun: 'sushi',
    hubHref: '/find/sushi-near-me',
    hubLabel: 'Sushi',
    about:
      'Great sushi comes down to rice temperature, fish freshness, and knife work — this map is filtered to the sushi bars and Japanese restaurants near you most likely to deliver all three.',
    faqs: (city, st) => [
      { q: `Where can I find sushi in ${city}?`, a: `The map above shows ${city}, ${st} sushi bars and Japanese restaurants. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What should I order first at a new sushi spot?', a: 'Order a few pieces of nigiri à la carte before committing to omakase — it is the fastest way to judge rice temperature and knife work.' },
      { q: 'What is omakase?', a: 'Omakase is a chef\'s-choice tasting menu where the sushi chef selects each piece based on what is freshest that day.' },
    ],
  },
  {
    prefix: 'lo-mein-near-in',
    filter: { initialFlags: ['lo-mein'] },
    title: (c, s) => `Lo Mein Near ${c}, ${s}`,
    metaNoun: 'lo mein',
    hubHref: '/find/lo-mein-near-me',
    hubLabel: 'Lo Mein',
    about:
      'Great lo mein comes down to wok technique — soft, lightly sauced noodles with a faint charred "wok hei" aroma. This map is filtered to the Chinese restaurants and noodle houses near you most likely to serve it well.',
    faqs: (city, st) => [
      { q: `Where can I find lo mein in ${city}?`, a: `The map above shows ${city}, ${st} Chinese restaurants and noodle houses. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is the difference between lo mein and chow mein?', a: 'Lo mein noodles are boiled then tossed with sauce for a soft, silky texture. Chow mein noodles are pan-fried, so some strands turn crisp.' },
      { q: 'What protein goes best with lo mein?', a: 'Shrimp, beef, and chicken are the most common and reliable choices at most Chinese restaurants.' },
    ],
  },
  {
    prefix: 'ramen-karaoke-bar-in',
    filter: { initialFlags: ['full-bar'] },
    title: (c, s) => `Ramen Karaoke Bars In ${c}, ${s}`,
    metaNoun: 'ramen karaoke bars',
    hubHref: '/find/ramen-karaoke-bar',
    hubLabel: 'Ramen Karaoke Bars',
    about:
      'A ramen karaoke bar pairs hot bowls and small plates with drinks and karaoke — usually an izakaya or Japanese pub. This map is filtered to ramen spots with a bar, your best candidates for a ramen-and-karaoke night.',
    faqs: (city, st) => [
      { q: `Where can I find a ramen karaoke bar in ${city}?`, a: `The map above shows ${city}, ${st} ramen spots with a full bar — your best candidates for karaoke. Open listings and check reviews for karaoke or izakaya mentions.` },
      { q: 'What is a ramen karaoke bar?', a: 'A ramen karaoke bar serves ramen and small plates alongside drinks and karaoke — often an izakaya or Japanese pub with private rooms or a stage.' },
      { q: 'Are ramen karaoke bars good for groups?', a: 'Yes — they are built for groups. Look for spots with private karaoke rooms, bring friends, and share plates and songs.' },
    ],
  },
  {
    prefix: 'ramen-spots-near-me-in',
    filter: {},
    title: (c, s) => `Ramen Spots In ${c}, ${s}`,
    metaNoun: 'ramen spots',
    hubHref: '/find/ramen-spots-near-me',
    hubLabel: 'Ramen Spots',
    about:
      'The best ramen spots focus on a few things and do them obsessively well — a house-simmered broth, noodles with real bite, and consistency every visit. Browse the ramen places near you by rating, broth, hours, and distance.',
    faqs: (city, st) => [
      { q: `What are the best ramen spots in ${city}?`, a: `The map above shows ${city}, ${st} ramen spots sorted by rating and distance. Enter your ZIP or click "Use my location," then open a couple of listings to skim recent reviews and photos before you go.` },
      { q: `How do I find a ramen spot near me in ${city}?`, a: `Use the map above — set your location and the closest, best-rated ramen places in ${city} sort to the top. Add filters like "Open Now" to narrow it down.` },
      { q: 'What makes a great ramen spot?', a: 'House-made broth and noodles, a focused menu, consistent quality across many reviews, and a loyal local following are the clearest signs of a great ramen spot.' },
    ],
  },
  {
    prefix: 'ramen-noodles-in',
    filter: {},
    title: (c, s) => `Ramen Noodles In ${c}, ${s}`,
    metaNoun: 'ramen noodles',
    hubHref: '/find/ramen-noodles',
    hubLabel: 'Ramen Noodles',
    about:
      'Real ramen noodles are wheat noodles made with kansui, giving them a springy, chewy bite — a world away from instant. This map shows ramen noodle restaurants near you serving fresh noodles in house-made broth.',
    faqs: (city, st) => [
      { q: `Where can I find ramen noodles in ${city}?`, a: `The map above shows ${city}, ${st} ramen noodle restaurants. Enter your ZIP or click "Use my location" to sort by distance, then check menus and reviews for fresh or house-made noodles.` },
      { q: 'What are ramen noodles made of?', a: 'Authentic ramen noodles are wheat noodles made with kansui, an alkaline mineral water that gives them their signature springy, chewy texture and pale yellow color.' },
      { q: 'Are restaurant ramen noodles different from instant?', a: 'Very — restaurant ramen noodles are cooked to order and served firm in a long-simmered broth, while instant noodles are pre-fried and dried. The texture and flavor are in a different league.' },
    ],
  },
  {
    prefix: 'gluten-free-ramen-in',
    filter: {},
    title: (c, s) => `Gluten-Free Ramen In ${c}, ${s}`,
    metaNoun: 'gluten-free ramen',
    hubHref: '/find/gluten-free-ramen',
    hubLabel: 'Gluten-Free Ramen',
    about:
      'Traditional ramen is wheat-based, but gluten-free ramen — rice or buckwheat noodles in a tamari-based broth — is increasingly available. This map shows ramen restaurants near you; check menus and reviews for gluten-free options.',
    faqs: (city, st) => [
      { q: `Where can I find gluten-free ramen in ${city}?`, a: `The map above shows ${city}, ${st} ramen restaurants. Enter your ZIP or click "Use my location," then check each menu and recent reviews for gluten-free noodle and broth options — and call ahead to confirm.` },
      { q: 'Is ramen gluten-free?', a: 'Traditional ramen is not — the noodles are wheat-based and most broths use soy sauce containing wheat. Gluten-free ramen swaps in rice or buckwheat noodles and uses tamari or certified gluten-free soy sauce.' },
      { q: 'Can celiacs eat ramen?', a: 'Only if the bowl is prepared gluten-free with certified GF noodles, a tamari-based broth, and no cross-contamination. Always confirm with the restaurant directly before ordering.' },
    ],
  },
  {
    prefix: 'halal-ramen-in',
    filter: {},
    title: (c, s) => `Halal Ramen In ${c}, ${s}`,
    metaNoun: 'halal ramen',
    hubHref: '/find/halal-ramen',
    hubLabel: 'Halal Ramen',
    about:
      'Classic ramen is usually pork-based, but halal ramen — built on chicken, beef, or vegetable broth with no pork or alcohol — is growing fast. This map shows ramen restaurants near you; check menus and reviews for halal options.',
    faqs: (city, st) => [
      { q: `Where can I find halal ramen in ${city}?`, a: `The map above shows ${city}, ${st} ramen restaurants. Enter your ZIP or click "Use my location," then check menus and reviews for halal chicken, beef, or vegetarian bowls — and call ahead to confirm.` },
      { q: 'Is ramen halal?', a: 'Traditional ramen usually is not — it is often built on pork broth and chashu pork, sometimes with sake in the seasoning. Halal ramen replaces these with chicken, beef, or vegetable broths and avoids alcohol.' },
      { q: 'What ramen broth is halal?', a: 'Chicken paitan, beef, and vegetable broths can all be halal when made without pork or alcohol. Pork-based tonkotsu is not halal.' },
    ],
  },
  {
    prefix: 'hanabi-ramen-in',
    filter: { initialFlags: ['hanabi'] },
    title: (c, s) => `Hanabi Ramen In ${c}, ${s}`,
    metaNoun: 'Hanabi Ramen',
    hubHref: '/find/hanabi-ramen-near-me',
    hubLabel: 'Hanabi Ramen',
    about:
      'Hanabi Ramen ("fireworks" in Japanese) serves vibrant, boldly flavored bowls of Japanese ramen. This map is filtered to Hanabi Ramen locations near you.',
    faqs: (city, st) => [
      { q: `Is there a Hanabi Ramen in ${city}?`, a: `The map above shows Hanabi Ramen locations in ${city}, ${st}. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is Hanabi Ramen?', a: 'Hanabi Ramen is a Japanese ramen restaurant — "hanabi" means fireworks in Japanese, reflecting the vibrant flavors in every bowl. They serve a range of ramen styles with classic toppings.' },
      { q: 'What broth does Hanabi Ramen serve?', a: 'Hanabi Ramen typically offers multiple broth styles including tonkotsu, shoyu, miso, and spicy. Menu offerings vary by location.' },
    ],
  },
  {
    prefix: 'shokku-ramen-in',
    filter: { initialFlags: ['shokku'] },
    title: (c, s) => `Shokku Ramen In ${c}, ${s}`,
    metaNoun: 'Shokku Ramen',
    hubHref: '/find/shokku-ramen-near-me',
    hubLabel: 'Shokku Ramen',
    about:
      'Shokku Ramen ("impact" or "shock" in Japanese) serves bold, intensely flavored ramen with a modern take on Japanese classics. This map is filtered to Shokku Ramen locations near you.',
    faqs: (city, st) => [
      { q: `Is there a Shokku Ramen in ${city}?`, a: `The map above shows Shokku Ramen locations in ${city}, ${st}. Enter your ZIP or click "Use my location" to sort by distance from your current location.` },
      { q: 'What is Shokku Ramen?', a: 'Shokku Ramen is a Japanese ramen concept built around bold, impactful flavors — "shokku" means shock or impact in Japanese. They serve curated ramen styles with modern presentation.' },
      { q: 'What should I order at Shokku Ramen?', a: 'Start with the house signature bowl to taste what the kitchen is best known for. The spicy option is also a popular choice at Shokku locations.' },
    ],
  },
  {
    prefix: 'tonkatsu-ramen-in',
    filter: {},
    title: (c, s) => `Tonkatsu Ramen In ${c}, ${s}`,
    metaNoun: 'tonkatsu ramen',
    hubHref: '/find/tonkatsu-ramen',
    hubLabel: 'Tonkatsu Ramen',
    about:
      'Tonkatsu ramen tops a hot bowl with a crispy, panko-breaded pork cutlet — a hearty twist that pairs especially well with a rich tonkotsu or chicken paitan broth. Note: tonkatsu is the fried cutlet, not tonkotsu the pork-bone broth.',
    faqs: (city, st) => [
      { q: `Where can I find tonkatsu ramen in ${city}?`, a: `The map above shows ${city}, ${st} ramen restaurants. Enter your ZIP or click "Use my location," then check menus and reviews for katsu or pork cutlet ramen.` },
      { q: 'What is tonkatsu ramen?', a: 'Tonkatsu ramen is a bowl of ramen topped with a crispy, panko-breaded and deep-fried pork cutlet, usually served over a rich tonkotsu or chicken paitan broth.' },
      { q: 'Is tonkatsu the same as tonkotsu?', a: 'No. Tonkatsu is a breaded, fried pork cutlet, while tonkotsu is a rich pork-bone broth. Tonkatsu ramen often uses a tonkotsu broth, so one bowl can feature both.' },
    ],
  },
]

export interface ModifierMatch {
  modifier: FindModifier
  /** Remaining "{city}-{state}" portion after the prefix */
  rest: string
}

export function matchModifier(cityState: string | undefined): ModifierMatch | null {
  if (!cityState) return null
  for (const m of FIND_MODIFIERS) {
    const p = `${m.prefix}-`
    if (cityState.startsWith(p) && cityState.length > p.length) {
      return { modifier: m, rest: cityState.slice(p.length) }
    }
  }
  return null
}
