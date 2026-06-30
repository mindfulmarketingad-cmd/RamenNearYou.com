// ──────────────────────────────────────────────────────────────────────────────
// Programmatic SEO: ramen broth-type comparison pages.
//
// Each unique pair of broth types (Tonkotsu, Shoyu, Miso, Shio, Spicy, Vegan)
// generates a long-form "X Ramen vs. Y Ramen" page at
//   /comparisons/{a}-ramen-vs-{b}-ramen
// with 1,000+ words of genuinely useful, non-templated comparison content.
//
// The two per-broth blocks differ on every page, so each comparison reads as a
// distinct article rather than a thin spun template.
// ──────────────────────────────────────────────────────────────────────────────

export interface BrothProfile {
  key: string
  name: string            // "Tonkotsu"
  tagline: string         // one-liner for cards / meta
  base: string            // what the stock is built from
  tare: string            // the seasoning that defines the style
  origin: string          // where the style comes from
  flavorProfile: string   // short flavor descriptor
  bodyWord: string        // "light" | "medium-bodied" | "rich" …
  colorWord: string       // visual descriptor
  intensity: number       // 1 (most delicate) … 5 (most rich) — drives guidance
  whatIs: string[]        // 2–3 paragraphs of HTML prose
  seasoning: string       // 1–2 sentence detail
  preparation: string     // 1–2 sentence detail
  noodles: string         // 1–2 sentence detail
  toppings: string        // 1–2 sentence detail
  bestFor: string         // who/when it suits
  nearMePath: string      // internal link to the "near me" search page
  image: string           // /images/comparisons/{key}-bowl.jpg
  imageAlt: string        // descriptive alt text
}

// Fixed display order — also determines which broth appears first in a pair slug
// (so the canonical URL for the Tonkotsu/Miso pair is tonkotsu-ramen-vs-miso-ramen).
export const BROTH_ORDER = ['tonkotsu', 'shoyu', 'miso', 'shio', 'spicy', 'vegan'] as const
export type BrothKey = typeof BROTH_ORDER[number]

export const BROTHS: Record<BrothKey, BrothProfile> = {
  tonkotsu: {
    key: 'tonkotsu',
    name: 'Tonkotsu',
    tagline: 'Rich, creamy pork-bone broth from Kyushu',
    base: 'pork bones (trotters, femurs and neck bones)',
    tare: 'usually a salt (shio) or soy (shoyu) tare added to the pork base',
    origin: 'Fukuoka on the southern island of Kyushu, where the Hakata style was born',
    flavorProfile: 'deeply porky, fatty and intensely savory',
    bodyWord: 'thick and creamy',
    colorWord: 'opaque, milky off-white',
    intensity: 5,
    whatIs: [
      `<p>Tonkotsu ramen is built on one of the most labor-intensive broths in all of Japanese cooking. The name literally means "pork bone," and that is exactly what it is — pork bones boiled hard for anywhere from eight to more than twenty hours. The violent, rolling boil is the whole point: it breaks down collagen, marrow and fat from the bones and emulsifies them into the water, producing a broth that is thick, cloudy and almost milky in both color and texture.</p>`,
      `<p>The result is the richest, most indulgent bowl in the mainstream ramen canon. A good tonkotsu coats your lips and the back of a spoon, carrying a porky depth that lighter broths simply cannot reach. Tonkotsu is often confused with a flavor, but it is really a <em>broth base</em> — the actual seasoning still comes from a separate tare, most often salt or soy, which is why you will sometimes see "shio tonkotsu" or "shoyu tonkotsu" on a menu.</p>`,
      `<p>The style is forever associated with Hakata in Fukuoka, where it is served with ultra-thin straight noodles and a kaedama (noodle refill) culture that lets you keep eating while the broth is still hot. From there it spread across Japan and became, for many people outside the country, the default mental image of "real" ramen.</p>`,
    ],
    seasoning: 'Tonkotsu itself is a broth base rather than a seasoning, so it is finished with a salt or soy tare; garlic oil (mayu) and a hit of grated garlic are common boosters.',
    preparation: 'Pork bones are blanched, then boiled at a hard rolling boil for 8–20+ hours so collagen and fat emulsify into the water, turning it opaque and creamy.',
    noodles: 'Classic Hakata-style tonkotsu uses very thin, firm, straight noodles that cook in seconds — perfect for the kaedama (noodle refill) tradition.',
    toppings: 'Chashu pork, wood-ear mushrooms (kikurage), pickled red ginger (beni shoga), sesame seeds and scallion are the signatures; a marinated egg is a frequent add-on.',
    bestFor: 'anyone who wants the richest, most filling bowl on the menu and loves pork-forward, fatty depth',
    nearMePath: '/tonkotsu-ramen-near-me',
    image: '/images/comparisons/tonkotsu-bowl.jpg',
    imageAlt: 'A rich, creamy tonkotsu ramen bowl with chashu pork, soft-boiled egg and kikurage mushrooms',
  },
  shoyu: {
    key: 'shoyu',
    name: 'Shoyu',
    tagline: 'Clear, soy-seasoned broth — the original Tokyo ramen',
    base: 'a clear chicken stock, often blended with dashi (kombu and bonito) and sometimes pork',
    tare: 'a soy-sauce-based tare, which is what defines the style',
    origin: 'Tokyo, where the first bowls of ramen in Japan were served in the early 1900s',
    flavorProfile: 'savory, tangy and balanced with a clean soy backbone',
    bodyWord: 'light to medium-bodied',
    colorWord: 'clear amber-brown',
    intensity: 2,
    whatIs: [
      `<p>Shoyu ramen is the original — the bowl most food historians point to when ramen first took hold in Tokyo in the early twentieth century. The word shoyu means soy sauce, and that soy-based tare is what defines the style. Unlike tonkotsu, the defining feature here is the <em>seasoning</em>, not the stock, so the same shoyu tare can sit on top of a chicken, pork or seafood broth.</p>`,
      `<p>The classic shoyu broth is clear and brown, typically a light chicken stock rounded out with dashi made from kombu (kelp) and dried bonito. It is savory and aromatic with a gentle tang and a clean finish, letting the quality of the stock and the soy sauce shine rather than burying them under fat. It is the most "drinkable" of the foundational styles and a favorite of people who find tonkotsu too heavy.</p>`,
      `<p>Because it is balanced rather than intense, shoyu ramen is endlessly versatile and is the bowl most likely to feature picture-perfect, classic toppings: a slice of fish cake, a sheet of nori, bright green scallion and a jammy marinated egg arranged with care.</p>`,
    ],
    seasoning: 'A soy-sauce tare is the heart of the style, frequently deepened with mirin, sake and a kombu-bonito dashi for layered umami.',
    preparation: 'The stock is simmered gently to stay clear, then seasoned in the bowl with the soy tare — a much faster, cleaner process than the hard boil of tonkotsu.',
    noodles: 'Medium-thickness noodles, often slightly curly or wavy, hold the lighter broth well without overwhelming it.',
    toppings: 'Chashu, bamboo shoots (menma), nori, fish cake (naruto), a marinated egg and scallion are the textbook garnishes.',
    bestFor: 'people who want a balanced, savory, soup-forward bowl that is satisfying without being heavy',
    nearMePath: '/shoyu-ramen-near-me',
    image: '/images/comparisons/shoyu-bowl.jpg',
    imageAlt: 'A clear amber shoyu ramen bowl with chashu, bamboo shoots, nori and a marinated egg',
  },
  miso: {
    key: 'miso',
    name: 'Miso',
    tagline: 'Hearty, earthy fermented-soybean broth from Hokkaido',
    base: 'a chicken or pork stock enriched with fermented soybean paste (miso)',
    tare: 'miso paste itself, which acts as both seasoning and body',
    origin: 'Sapporo, Hokkaido, where it was invented in the mid-twentieth century',
    flavorProfile: 'nutty, earthy and savory-sweet with a fermented depth',
    bodyWord: 'medium-thick and hearty',
    colorWord: 'opaque tan to deep brown',
    intensity: 4,
    whatIs: [
      `<p>Miso ramen is the youngest of the four classic styles and the only one whose defining ingredient is fermented. Invented in Sapporo, Hokkaido, in the 1950s and 60s, it blends miso — a paste of fermented soybeans — into a chicken or pork stock to create a broth that is hearty, earthy and complex in a way the others are not.</p>`,
      `<p>The fermentation gives miso ramen a nutty, savory-sweet depth and a fuller body than shoyu or shio. It is the broth built for cold weather: warming, robust and a little rich, often finished with a knob of butter and sweet corn in the Hokkaido tradition. Many shops stir-fry aromatics, ground pork and vegetables in a hot wok before adding the broth, which gives the bowl a toasty, almost smoky edge.</p>`,
      `<p>Because the miso paste contributes real body and not just flavor, miso ramen sits comfortably between the lightness of shoyu and the richness of tonkotsu. It is bold and substantial without the heavy fat content of a pork-bone broth.</p>`,
    ],
    seasoning: 'Miso paste is the star — white (shiro), red (aka) or a blend — often combined with garlic, ginger, sesame and a little chili for roundness.',
    preparation: 'Aromatics and sometimes ground pork are stir-fried, then miso is whisked into the stock; the paste both seasons and thickens the broth.',
    noodles: 'Thick, wavy, chewy noodles are the standard — sturdy enough to stand up to the hearty broth and to grab onto it.',
    toppings: 'Sweet corn, a pat of butter, bean sprouts, ground pork, scallion and chashu are the Hokkaido-style classics.',
    bestFor: 'anyone craving a warming, robust, full-flavored bowl — especially in cold weather',
    nearMePath: '/miso-ramen-near-me',
    image: '/images/comparisons/miso-bowl.jpg',
    imageAlt: 'A hearty miso ramen bowl with sweet corn, butter, bean sprouts and ground pork',
  },
  shio: {
    key: 'shio',
    name: 'Shio',
    tagline: 'Light, clean salt-seasoned broth — the oldest tare',
    base: 'a clear, delicate chicken and/or seafood stock, often with dashi',
    tare: 'a simple salt-based tare, the lightest of all the seasonings',
    origin: 'Hakodate, Hokkaido, home of the original salt-seasoned style',
    flavorProfile: 'light, clean and delicate with a gentle briny savoriness',
    bodyWord: 'the lightest and most delicate',
    colorWord: 'pale gold, nearly translucent',
    intensity: 1,
    whatIs: [
      `<p>Shio ramen is the lightest and arguably the oldest of the seasoning styles — "shio" simply means salt. Associated with Hakodate in Hokkaido, it uses a salt-based tare instead of soy or miso, which keeps the broth pale, clear and remarkably clean on the palate.</p>`,
      `<p>Because salt adds seasoning without color or heaviness, shio ramen puts the spotlight squarely on the quality of the stock. A great shio broth — usually built from chicken, and often seafood and kombu dashi — tastes delicate, faintly briny and deeply savory all at once. There is nowhere to hide: if the stock is thin or under-seasoned, you will taste it immediately, which is why a beautifully made shio bowl is a real mark of a skilled kitchen.</p>`,
      `<p>For diners who find tonkotsu or miso too rich, shio is the most refreshing bowl on the menu. It is the ramen equivalent of a clear consommé — elegant, restrained and all about purity of flavor.</p>`,
    ],
    seasoning: 'A salt tare seasons the broth without adding color or weight; sea salt, kombu and dried fish are common to deepen the savoriness.',
    preparation: 'The stock is simmered gently and kept scrupulously clear, then seasoned with the salt tare so the broth itself stays the focus.',
    noodles: 'Thin, straight noodles are typical, matching the broth’s delicacy without weighing it down.',
    toppings: 'Restrained, classic garnishes — chashu, menma, scallion, nori and sometimes seafood — keep the focus on the clean broth.',
    bestFor: 'diners who prefer a light, refined, soup-forward bowl that showcases a pristine stock',
    nearMePath: '/shio-ramen-near-me',
    image: '/images/comparisons/shio-bowl.jpg',
    imageAlt: 'A pale golden shio ramen bowl with chashu, scallion and a soft-boiled egg in clear broth',
  },
  spicy: {
    key: 'spicy',
    name: 'Spicy',
    tagline: 'Chili-charged broths for heat seekers',
    base: 'any base — often tonkotsu, chicken or miso — amped up with chili',
    tare: 'a chili-forward seasoning: chili oil (rayu), spicy bean paste (doubanjiang) or a house spice blend',
    origin: 'a modern, Chinese-influenced category — tantanmen descends from Sichuan dan dan noodles',
    flavorProfile: 'bold and fiery, often with a nutty sesame or deep miso backbone',
    bodyWord: 'varies from medium to rich depending on the base',
    colorWord: 'red-orange, slicked with chili oil',
    intensity: 4,
    whatIs: [
      `<p>Spicy ramen is less a single broth than a family of bowls united by heat. The category spans Japanese spicy miso, fiery tonkotsu, and tantanmen — the Japanese take on Sichuan dan dan noodles, built on sesame paste, chili oil and ground pork. What ties them together is a chili-forward seasoning layered on top of an underlying broth.</p>`,
      `<p>Because the heat is added rather than fermented or boiled in, a spicy bowl inherits the character of its base: a spicy tonkotsu stays rich and creamy under the chili, while a spicy shoyu stays lighter and tangier. The best versions balance the burn with real depth — nutty sesame, savory miso or porky tonkotsu — so the bowl is craveable rather than just punishing.</p>`,
      `<p>Heat levels are often adjustable, which makes spicy ramen a flexible choice: you can dial it from a gentle warmth to a serious sweat. It is the go-to bowl for anyone who believes a little capsaicin makes everything taste more alive.</p>`,
    ],
    seasoning: 'Chili oil (rayu), spicy bean paste (doubanjiang), chili flakes and, in tantanmen, sesame paste provide the heat and the backbone.',
    preparation: 'A base broth is built first, then chili oil and spice paste are bloomed and added; tantanmen layers in a sesame-chili sauce and stir-fried ground pork.',
    noodles: 'Medium straight or wavy noodles are standard, sturdy enough to carry clingy, oily, spiced broths.',
    toppings: 'Ground pork, chili oil, scallion, leafy greens like bok choy and a shower of sesame are typical.',
    bestFor: 'heat seekers who want a bold, warming, adrenaline-spiking bowl with adjustable spice',
    nearMePath: '/spicy-ramen-near-me',
    image: '/images/comparisons/spicy-bowl.jpg',
    imageAlt: 'A fiery red spicy ramen pot with green onions, chili oil and ramen noodles',
  },
  vegan: {
    key: 'vegan',
    name: 'Vegan',
    tagline: 'Plant-based broths with deep, animal-free umami',
    base: 'kombu, dried shiitake and roasted vegetables, sometimes enriched with soy milk',
    tare: 'a vegan shoyu or miso tare for seasoning',
    origin: 'a modern, plant-based evolution rooted in Japan’s shojin (Buddhist temple) cooking',
    flavorProfile: 'clean, earthy and surprisingly rich in umami',
    bodyWord: 'light to medium-bodied',
    colorWord: 'clear amber, or tan when miso-based',
    intensity: 2,
    whatIs: [
      `<p>Vegan ramen proves that you do not need pork bones or chicken to build a deeply savory bowl. Drawing on Japan’s tradition of shojin ryori (Buddhist temple cuisine), it leans on umami-rich plants — kombu (kelp), dried shiitake mushrooms and roasted vegetables — to create a stock with genuine depth.</p>`,
      `<p>The broth is then seasoned with a vegan tare, usually a soy (shoyu) or miso base, so vegan ramen can lean light and clear or hearty and earthy depending on the kitchen. Some shops blend in soy milk or nut milk to mimic the creamy body of tonkotsu, producing a "creamy vegan" bowl that is genuinely satisfying. The result is far more than a compromise — a well-made vegan ramen stands on its own next to any animal-based bowl.</p>`,
      `<p>Beyond being the obvious choice for plant-based diners, vegan ramen is a clean, vegetable-forward option that appeals to anyone looking for a lighter, mushroom-and-kelp-driven take on the dish.</p>`,
    ],
    seasoning: 'A vegan shoyu or miso tare does the seasoning, with mushroom and kombu dashi supplying the umami that meat broths get from bones.',
    preparation: 'Kombu and shiitake are steeped, vegetables are often roasted for depth, and soy milk is sometimes added for a creamy, tonkotsu-like body.',
    noodles: 'Medium noodles are standard — just check that they are egg-free, as many ramen noodles contain egg.',
    toppings: 'Tofu, sautéed or marinated mushrooms, corn, leafy greens, bamboo shoots and nori replace the usual meat and egg.',
    bestFor: 'plant-based diners and anyone wanting a lighter, vegetable- and mushroom-driven bowl with real umami',
    nearMePath: '/vegan-ramen-near-me',
    image: '/images/comparisons/vegan-bowl.jpg',
    imageAlt: 'A vegan ramen bowl with tofu, mushrooms, bok choy, corn and nori in clear umami broth',
  },
}

const AUTHORS = [
  { name: 'Jackson Hewitt', avatar: '/authors/jackson-hewitt.svg' },
  { name: 'Maya Chen', avatar: '/authors/maya-chen.svg' },
  { name: 'Marcus Rivera', avatar: '/authors/marcus-rivera.svg' },
]

export interface BrothComparison {
  slug: string
  a: BrothProfile
  b: BrothProfile
  title: string       // title tag
  h1: string
  description: string // meta description
  author: { name: string; avatar: string }
  faqs: { q: string; a: string }[]
  content: string     // composed HTML body
  featuredImage: { src: string; alt: string }
}

function intensityWord(n: number): string {
  return ['', 'very delicate', 'light', 'moderately rich', 'rich', 'very rich'][n] ?? 'balanced'
}

function buildFaqs(a: BrothProfile, b: BrothProfile): { q: string; a: string }[] {
  const richer = a.intensity >= b.intensity ? a : b
  const lighter = a.intensity >= b.intensity ? b : a
  return [
    {
      q: `What is the main difference between ${a.name.toLowerCase()} and ${b.name.toLowerCase()} ramen?`,
      a: `The core difference is the broth. ${a.name} ramen is built on ${a.base} and is ${a.bodyWord} with a ${a.flavorProfile} character, while ${b.name} ramen is built on ${b.base} and is ${b.bodyWord} with a ${b.flavorProfile} character. In short, ${richer.name.toLowerCase()} is the richer, more intense bowl and ${lighter.name.toLowerCase()} is the lighter one.`,
    },
    {
      q: `Which is richer, ${a.name.toLowerCase()} or ${b.name.toLowerCase()} ramen?`,
      a: `${richer.name} ramen is the richer of the two — it is ${intensityWord(richer.intensity)} compared with ${lighter.name.toLowerCase()}, which is ${intensityWord(lighter.intensity)}. If you want the more filling, intense bowl, go with ${richer.name.toLowerCase()}; if you want something cleaner and lighter, choose ${lighter.name.toLowerCase()}.`,
    },
    {
      q: `Do ${a.name.toLowerCase()} and ${b.name.toLowerCase()} ramen use the same noodles?`,
      a: `Not necessarily. ${a.name}: ${a.noodles} ${b.name}: ${b.noodles} As a rule, richer and miso-style broths pair with thicker, chewier noodles, while lighter, clearer broths pair with thinner ones.`,
    },
    {
      q: `Which should a first-timer try, ${a.name.toLowerCase()} or ${b.name.toLowerCase()}?`,
      a: `If you are new to ramen and want the boldest, most crowd-pleasing introduction, start with ${richer.name.toLowerCase()}. If you prefer to ease in with something more balanced and broth-forward, ${lighter.name.toLowerCase()} is the gentler entry point. Both are worth ordering — many fans rotate between them depending on their mood and the weather.`,
    },
  ]
}

function comparisonTable(a: BrothProfile, b: BrothProfile): string {
  const row = (label: string, av: string, bv: string) =>
    `<tr><td><strong>${label}</strong></td><td>${av}</td><td>${bv}</td></tr>`
  return `
<div class="overflow-x-auto">
<table>
<thead><tr><th>Attribute</th><th>${a.name} Ramen</th><th>${b.name} Ramen</th></tr></thead>
<tbody>
${row('Broth base', a.base, b.base)}
${row('Defining seasoning (tare)', a.tare, b.tare)}
${row('Flavor profile', a.flavorProfile, b.flavorProfile)}
${row('Body', a.bodyWord, b.bodyWord)}
${row('Appearance', a.colorWord, b.colorWord)}
${row('Richness (1–5)', `${a.intensity} / 5`, `${b.intensity} / 5`)}
${row('Typical noodles', a.noodles, b.noodles)}
${row('Origin', a.origin, b.origin)}
</tbody>
</table>
</div>`
}

function inlineImg(src: string, alt: string, caption: string): string {
  return `<figure class="comparison-figure">
  <img src="${src}" alt="${alt}" loading="lazy" class="comparison-img" />
  <figcaption>${caption}</figcaption>
</figure>`
}

function buildContent(a: BrothProfile, b: BrothProfile, faqs: { q: string; a: string }[]): string {
  const richer = a.intensity >= b.intensity ? a : b
  const lighter = a.intensity >= b.intensity ? b : a
  const sameishBody = Math.abs(a.intensity - b.intensity) <= 1

  const faqHtml = faqs
    .map(
      (f) =>
        `<h3>${f.q}</h3><p>${f.a}</p>`,
    )
    .join('\n')

  return `
<p>${a.name} and ${b.name} are two of the most talked-about styles of ramen, and if you have ever stared at a menu wondering which to order, you are not alone. Although both arrive as a steaming bowl of noodles in broth, they are genuinely different experiences — from the way the broth is built to the noodles, the seasoning and the toppings. This guide breaks down exactly what sets ${a.name.toLowerCase()} ramen and ${b.name.toLowerCase()} ramen apart, where they overlap, and how to choose between them.</p>

<p>The short version: ${a.name.toLowerCase()} ramen is ${a.bodyWord} and ${a.flavorProfile}, while ${b.name.toLowerCase()} ramen is ${b.bodyWord} and ${b.flavorProfile}. But the details are where it gets interesting.</p>

<h2>Understanding Ramen Broth</h2>
<p>Every bowl of ramen is really two things working together: a <strong>broth</strong> (the soup base, often simmered from bones, dashi or vegetables) and a <strong>tare</strong> (the concentrated seasoning that flavors it). It is easy to assume that names like "tonkotsu" and "miso" describe the same kind of thing, but they don't — some styles are named for the <em>stock</em> they are made from, and others are named for the <em>seasoning</em> that defines them.</p>
<p>That distinction is the key to understanding any ramen comparison. ${a.name} ramen is defined by ${a.tare === a.base ? 'its base and seasoning together' : a.key === 'tonkotsu' || a.key === 'vegan' || a.key === 'spicy' ? 'its broth base' : 'its seasoning (tare)'}, while ${b.name} ramen is defined by ${b.key === 'tonkotsu' || b.key === 'vegan' || b.key === 'spicy' ? 'its broth base' : 'its seasoning (tare)'}. Keep that in mind and the differences below will make a lot more sense.</p>

<h2>What is ${a.name} ramen?</h2>
${a.whatIs.join('\n')}
${inlineImg(a.image, a.imageAlt, `A classic ${a.name.toLowerCase()} ramen bowl — ${a.colorWord} broth, ${a.bodyWord}.`)}
<p><strong>Seasoning.</strong> ${a.seasoning}</p>
<p><strong>Preparation.</strong> ${a.preparation}</p>
<p><strong>Noodles.</strong> ${a.noodles}</p>
<p><strong>Toppings.</strong> ${a.toppings}</p>

<h2>What is ${b.name} ramen?</h2>
${b.whatIs.join('\n')}
${inlineImg(b.image, b.imageAlt, `A classic ${b.name.toLowerCase()} ramen bowl — ${b.colorWord} broth, ${b.bodyWord}.`)}
<p><strong>Seasoning.</strong> ${b.seasoning}</p>
<p><strong>Preparation.</strong> ${b.preparation}</p>
<p><strong>Noodles.</strong> ${b.noodles}</p>
<p><strong>Toppings.</strong> ${b.toppings}</p>

<h2>${a.name} vs. ${b.name} ramen: the key differences</h2>
<p>Here is how the two styles stack up side by side, from the broth base all the way to the bowl in front of you.</p>
${comparisonTable(a, b)}
<p><strong>Broth and body.</strong> The biggest difference you will notice is weight. ${richer.name} ramen is ${richer.bodyWord} (${intensityWord(richer.intensity)}), built from ${richer.base}, while ${lighter.name.toLowerCase()} ramen is ${lighter.bodyWord} (${intensityWord(lighter.intensity)}), built from ${lighter.base}. ${sameishBody ? 'The two are closer in richness than many pairings, so the contrast is more about flavor character than sheer heaviness.' : `That is a real gap in richness — ${richer.name.toLowerCase()} coats the palate while ${lighter.name.toLowerCase()} stays cleaner and more refreshing.`}</p>
<p><strong>Seasoning.</strong> ${a.name} gets its character from ${a.tare}, whereas ${b.name} relies on ${b.tare}. This is why the two taste distinct even when the underlying stock is similar — the tare steers the whole bowl.</p>
<p><strong>Noodles and toppings.</strong> The styles even differ down to the strands. ${a.name} typically comes with: ${a.noodles.toLowerCase()} ${b.name} leans toward: ${b.noodles.toLowerCase()} Toppings follow suit, with ${a.name.toLowerCase()} favoring ${a.toppings.toLowerCase()} and ${b.name.toLowerCase()} favoring ${b.toppings.toLowerCase()}</p>

<h2>What ${a.name} and ${b.name} ramen have in common</h2>
<p>For all their differences, these two share the same DNA. Both are authentic, time-honored bowls of ramen built on the same fundamental structure — a savory broth, a seasoning tare, springy wheat noodles and a thoughtful set of toppings. Both deliver the deep umami satisfaction that makes ramen so crave-worthy, and both are traditionally finished with familiar garnishes like chashu pork, scallions and a marinated egg.</p>
<p>Both are also best eaten immediately, while the noodles are still firm and the broth is piping hot, and both reward a good slurp — pulling air across the noodles cools them and amplifies the aroma. Whichever you choose, you are getting a genuine bowl of ramen; the question is simply which flavor and weight you are in the mood for.</p>

<h2>${a.name} or ${b.name}: which should you order?</h2>
<p>It comes down to how rich and bold you want your bowl. Choose <strong>${richer.name.toLowerCase()} ramen</strong> when you want the more intense, filling experience — it is ${richer.bestFor}. Choose <strong>${lighter.name.toLowerCase()} ramen</strong> when you are after a ${intensityWord(lighter.intensity)} bowl — it is ${lighter.bestFor}.</p>
<p>Weather and appetite matter too. On a cold day or when you are truly hungry, the richer ${richer.name.toLowerCase()} bowl hits hardest. When you want something you can finish without feeling weighed down, ${lighter.name.toLowerCase()} is the smarter pick. And honestly? The best way to settle the ${a.name.toLowerCase()}-versus-${b.name.toLowerCase()} debate is to try both. Most ramen lovers keep both in rotation and order by mood.</p>
<p>Ready to taste the difference for yourself? Find <a href="${a.nearMePath}">${a.name.toLowerCase()} ramen near you</a> or track down <a href="${b.nearMePath}">${b.name.toLowerCase()} ramen near you</a>, and explore every style on our <a href="/broth">ramen by broth type</a> guide.</p>

<h2>Frequently asked questions</h2>
${faqHtml}
`.trim()
}

// All unique unordered pairs, in canonical (BROTH_ORDER) order.
export function getAllComparisons(): BrothComparison[] {
  const list: BrothComparison[] = []
  let idx = 0
  for (let i = 0; i < BROTH_ORDER.length; i++) {
    for (let j = i + 1; j < BROTH_ORDER.length; j++) {
      const a = BROTHS[BROTH_ORDER[i]]
      const b = BROTHS[BROTH_ORDER[j]]
      const slug = `${a.key}-ramen-vs-${b.key}-ramen`
      const faqs = buildFaqs(a, b)
      // Featured image: use the richer broth's photo so the hero is always the bolder bowl
      const heroProfile = a.intensity >= b.intensity ? a : b
      list.push({
        slug,
        a,
        b,
        title: `${a.name} Ramen vs. ${b.name} Ramen | Know The Difference`,
        h1: `${a.name} Ramen vs. ${b.name} Ramen`,
        description: `${a.name} vs. ${b.name} ramen explained: how the broth, seasoning, noodles and toppings differ — and which bowl to order. A clear, complete side-by-side comparison.`,
        author: AUTHORS[idx % AUTHORS.length],
        faqs,
        content: buildContent(a, b, faqs),
        featuredImage: { src: heroProfile.image, alt: heroProfile.imageAlt },
      })
      idx++
    }
  }
  return list
}

export function getComparison(slug: string): BrothComparison | null {
  return getAllComparisons().find((c) => c.slug === slug) ?? null
}
