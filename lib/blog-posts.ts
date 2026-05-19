export type RestaurantCard = {
  rank: number
  name: string
  rating: number
  reviewCount: number
  address: string
  phone: string
  description: string
  photo: string
  slug: string
  citySlug: string
  stateSlug: string
  tags: string[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: string
  restaurantCards?: RestaurantCard[]
  outroContent?: string
}

const atlantaTop10: RestaurantCard[] = [
  {
    rank: 1,
    name: 'Okiboru Tsukemen & Ramen',
    rating: 4.8,
    reviewCount: 1099,
    address: '2277 Peachtree Rd NE B, Atlanta, GA 30309',
    phone: '+1 404-941-7469',
    description: "Atlanta's highest-rated ramen restaurant. Specializing in tsukemen — thick noodles served alongside a concentrated dipping broth — every component is housemade with exceptional precision. If you visit one ramen spot in Atlanta, make it this one.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFV-ir1WWoRunbC7WyOC76EfAEIJ9F0vxc_5dP29_YZQBQNdju9browSuXjCMRV9lGeT9BUHnBj5lyg7NvdZRD0VW28NK303hkY9tIvOvtYYMuUMZ8Ho6p7vCll_mPLEDXItNpphMds2RCL=w800-h500-k-no',
    slug: 'okiboru-tsukemen-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tsukemen', 'Japanese', 'Ramen Bar'],
  },
  {
    rank: 2,
    name: 'JINYA Ramen Bar – Buckhead',
    rating: 4.7,
    reviewCount: 2959,
    address: '3714 Roswell Rd #35, Atlanta, GA 30342',
    phone: '+1 404-254-4770',
    description: "Modern chain serving ramen noodle varieties & other traditional Japanese fare, with a large bar. Atlanta's most-reviewed ramen restaurant at nearly 3,000 Google reviews — consistency is the hallmark here.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGC7BquBSpHmTj4A8C9y4_0GU_48lDrJIRb7XtmeT962wpNby2bXoxLC7DkyFvMOWeMBRK5yP4jg5IWvZPKFM3qXbfY0qug4GTJEzbvgzlnFCTl4Qnd3ovRg3BnxmgyKbRp2uJW=w800-h500-k-no',
    slug: 'jinya-ramen-bar-buckhead',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Bar'],
  },
  {
    rank: 3,
    name: 'Kin NoTori Ramen Bar – Midtown Atlanta',
    rating: 4.7,
    reviewCount: 835,
    address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308',
    phone: '+1 470-312-2964',
    description: 'Casual spot for classic ramen noodle dishes like spicy tori paitan, plus gyoza, chicken & pork buns. One of Midtown Atlanta\'s best-kept secrets with a consistently loyal following.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGZaHLoocLVF-Z13GRsgZYmgu23DzJLabBTrLWcxtA9xRu6nXt-UmSG7k9EIiMja2TzMIYVTT3mljDKDTe_cvIjoUsRvKuHZLjeyn7Q1KkeiZeqzcr3xU6o3SEqNGRij0hlso6V-Q=w800-h500-k-no',
    slug: 'kin-notori-ramen-bar-midtown-atlanta',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Chicken Broth', 'Japanese', 'Ramen Bar'],
  },
  {
    rank: 4,
    name: 'JINYA Ramen Bar – Poncey Highland',
    rating: 4.6,
    reviewCount: 1086,
    address: '676 N Highland Ave NE Suite #3-ABC, Atlanta, GA 30306',
    phone: '+1 404-748-4520',
    description: "JINYA's neighborhood location in Poncey Highland. The spicy chicken bowl draws regulars back weekly, and a full bar makes it a natural spot to extend the evening. Over 1,000 reviews at 4.6 stars.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFoRlFIOWCXK0poL8Bz0Aa0Rqt6EbvlMsZymbuGpei5coa5w0yzsPN3LGfVPhL04IqlPzzWgb-rk6zlyZ2G3QtYBTpjKRe9C5hQYpLHbn-PeXNrRwNuZ6jwRFlFRjQdGfsGExll=w800-h500-k-no',
    slug: 'jinya-ramen-bar-poncey-highland',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Bar'],
  },
  {
    rank: 5,
    name: 'E Ramen +',
    rating: 4.6,
    reviewCount: 1056,
    address: '1110 W Peachtree St NW #300, Atlanta, GA 30309',
    phone: '+1 404-913-4142',
    description: 'Homemade ramen served in a contemporary eatery with an extensive sake & cocktail menu. Noodles are made from scratch daily — you can taste the difference. One of Midtown Atlanta\'s most trusted spots.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
    slug: 'e-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Housemade Noodles', 'Japanese', 'Sake Bar'],
  },
  {
    rank: 6,
    name: 'TENSAN Ramen',
    rating: 4.6,
    reviewCount: 59,
    address: '475 Bill Kennedy Wy SE B, Atlanta, GA 30316',
    phone: '+1 404-815-8882',
    description: "East Atlanta Village's newest serious ramen contender. Already holding a 4.6 rating with focused, well-executed bowls. Worth visiting now before the lines catch up with the quality.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEOyWxmTVwGcfzUTsStQaSoX1kRshXAy0Zunkr5qBHpAxreePviIAXtQtFk8_egFlMuhR5Hg4q2DqgAojI8zkki1JbPz0X9lnVbM1xbTLfh4W2GeNgsc6sDQqatw8Id5JJFIg3_Rg=w800-h500-k-no',
    slug: 'tensan-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Ramen Bar', 'Japanese'],
  },
  {
    rank: 7,
    name: 'Hikaru Ramen & Sushi Rolls',
    rating: 4.5,
    reviewCount: 355,
    address: '2014 Powers Ferry Rd UNIT 400, Atlanta, GA 30339',
    phone: '+1 678-888-2070',
    description: 'The best ramen option in the Powers Ferry and Vinings area. In-house broth paired with a solid sushi menu makes it a practical choice for groups with mixed preferences. Reliably rated 4.5.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFsYtPy9Vup4ZA0mmrhpF9Bj3cqIpeF_KgoeYnlKssTS-RYlZKbxsSBkTAGmZ_tt9bl6xwl54t-Y9FWAija1lXrbj_9bQPZuk3bmASYZ1b2lJAN4wPm1_VLAUA6QPCMkbKP05hECA=w800-h500-k-no',
    slug: 'hikaru-ramen-sushi-rolls',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Ramen', 'Sushi', 'Japanese'],
  },
  {
    rank: 8,
    name: 'Lifting Noodles Ramen',
    rating: 4.5,
    reviewCount: 308,
    address: '477 Flat Shoals Ave SE, Atlanta, GA 30316',
    phone: '+1 470-800-2735',
    description: 'A Glenwood Park institution with a casual atmosphere and serious ramen. Rich broth, springy noodles, thoughtfully sourced toppings. A second location near Truist Park proves the formula travels.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEflRV6rZG9Sl1Cbcsbq_pB4P1d3pAX1cqKuC8FsHKF0baY9HMvBwP5yPM0vSkwUK5-6gAoefgDnmbXkbfBGu_xakcwWqsV7ItAgfmHHko1Z-WLIav6yWHW7D-C3aEIL1PtNuVEGA=w800-h500-k-no',
    slug: 'lifting-noodles-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Ramen Bar', 'Casual'],
  },
  {
    rank: 9,
    name: 'PaoPao Ramen Factory & BoBa',
    rating: 4.4,
    reviewCount: 1293,
    address: '2929 N Druid Hills Rd NE C, Atlanta, GA 30329',
    phone: '+1 678-973-0613',
    description: 'One of Atlanta\'s most popular ramen spots by review volume — over 1,200 Google reviews at 4.4 stars. A fusion-leaning menu with ramen, bubble tea, and dumplings. Great for groups who want variety.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEreM2SNPzqw8AJZSFIfILPu7m1jeBDRu2dZ6gDCDeigH-MpkVzaCbPO1shM937ezBHwg-PKEM3Mdzv0xGPwxg0_Nrx5Qehuz0VJtWaIiC7kDy2qMRjLRIPH10UczufCyTJnXQh=w800-h500-k-no',
    slug: 'paopao-ramen-factory-boba',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Ramen', 'Bubble Tea', 'Asian'],
  },
  {
    rank: 10,
    name: 'Hajime',
    rating: 4.4,
    reviewCount: 756,
    address: '2345 Cheshire Bridge Rd NE #101, Atlanta, GA 30324',
    phone: '+1 470-428-2388',
    description: 'Multiple styles of traditional ramen served alongside Japanese small plates in spacious surrounds. A reliable anchor of Atlanta\'s Japanese dining scene on Cheshire Bridge with years of community trust.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJL9wC8zwjxS1BPz-gBPdCcidcE-6IXr287EsPvq2vfrwYMwCBhWk_kwqDm6WCpH8J_pqJQsNfOgqrDKUsmRPaOAvgn_OjxAxyFnorSb7UZ31ssGW9ypkhNEliQKIi-TD_GkUZ=w800-h500-k-no',
    slug: 'hajime',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Miso Ramen', 'Japanese', 'Small Plates'],
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-low-sodium-instant-ramen',
    title: '5 Best Low Sodium Instant Ramen (Ranked by Taste & Health)',
    description: 'Looking for low sodium instant ramen that actually tastes good? We ranked the 5 best options — with sodium counts, honest taste notes, and where to buy them on Amazon.',
    date: 'May 19, 2026',
    readTime: '6 min read',
    category: 'Buying Guides',
    content: `<p>Regular instant ramen is one of the saltiest foods on the planet — a single packet can pack anywhere from <strong>1,000 to over 1,700mg of sodium</strong>, nearly your entire daily recommended limit in one bowl. But the good news? A new generation of better-for-you ramen brands has arrived, and the best ones taste genuinely great. Whether you're watching your blood pressure, cutting back on processed foods, or just want a clean weeknight meal, these five picks deliver real ramen flavor without the sodium overload.</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />

<div style="margin-bottom:2.5rem;">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#77567A;margin-bottom:0.25rem;">#1 — Best Overall</p>
  <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1rem;">Lotus Foods Organic Millet &amp; Brown Rice Ramen</h2>
  <a href="https://amzn.to/4fxcIUd" target="_blank" rel="noopener sponsored" style="display:block;margin-bottom:1.25rem;">
    <img src="https://m.media-amazon.com/images/I/71OZzGpJekL._SL1200_.jpg" alt="Lotus Foods Organic Millet &amp; Brown Rice Ramen" style="width:100%;max-width:480px;border-radius:12px;display:block;" onerror="this.src='/images/hero-ramen.jpg'" />
  </a>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:600;">🧂 470mg sodium per serving</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Gluten-Free</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">USDA Organic</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Vegan</span>
  </div>
  <p>Lotus Foods makes some of the most thoughtfully crafted instant noodles on the market, and their Millet &amp; Brown Rice Ramen is the standout pick for anyone serious about reducing sodium without giving up convenience or flavor. At just <strong>470mg per serving</strong> — less than a third of what you'd get in a standard Maruchan packet — this is genuinely low-sodium ramen.</p>
  <p>The noodles are made from a blend of organic millet and brown rice, giving them a slightly chewy, satisfying texture that holds up well in broth. The seasoning packets come in several flavors (Jade Pearl Rice, Miso, Wakame Tamari), and each delivers a clean umami depth without the artificial aftertaste common in budget instant ramen. It's also certified gluten-free, making it a reliable option for anyone with gluten sensitivities.</p>
  <p>The only tradeoff: at roughly $3–4 per pack, it costs more than conventional instant ramen. But for the quality, ingredient list, and sodium reduction, it's worth every cent.</p>
  <ul style="padding-left:1.25rem;margin:1rem 0;color:#b0b3bb;">
    <li style="margin-bottom:0.4rem;">✅ Lowest sodium on this list at 470mg</li>
    <li style="margin-bottom:0.4rem;">✅ Certified gluten-free &amp; USDA organic</li>
    <li style="margin-bottom:0.4rem;">✅ Multiple flavor options, including miso and wakame</li>
    <li style="margin-bottom:0.4rem;">⚠️ Pricier than conventional instant ramen</li>
  </ul>
  <a href="https://amzn.to/4fxcIUd" target="_blank" rel="noopener sponsored" style="display:inline-block;background:#77567A;color:white;font-weight:600;font-size:0.875rem;padding:0.6rem 1.25rem;border-radius:8px;text-decoration:none;margin-top:0.5rem;">Check Price on Amazon →</a>
</div>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />

<div style="margin-bottom:2.5rem;">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#77567A;margin-bottom:0.25rem;">#2 — Best Plant-Based</p>
  <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1rem;">Dr. McDougall's Right Foods Ramen Noodle Soup</h2>
  <a href="https://amzn.to/4dQLd6S" target="_blank" rel="noopener sponsored" style="display:block;margin-bottom:1.25rem;">
    <img src="https://m.media-amazon.com/images/I/81QjR1P7fCL._SL1200_.jpg" alt="Dr. McDougall's Right Foods Ramen Noodle Soup" style="width:100%;max-width:480px;border-radius:12px;display:block;" onerror="this.src='/images/hero-ramen.jpg'" />
  </a>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:600;">🧂 510mg sodium per serving</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">100% Vegan</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Non-GMO</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Cup Format</span>
  </div>
  <p>Dr. McDougall's has been making whole-food, plant-based convenience meals since the 1990s, and their ramen noodle soup cups are among the best-tasting low-sodium instant noodles available. At around <strong>510mg of sodium</strong> per serving and with a short, recognizable ingredient list, these cups are a go-to for health-conscious ramen lovers who still want something quick.</p>
  <p>The cup format is a major convenience win — just add boiling water, stir, and you're done in 5 minutes. Flavors like Miso, Pad Thai, and Chicken-Style (vegan) are consistently well-seasoned, with a soup base that tastes noticeably more complex than typical budget brands. The noodles are thinner than restaurant ramen but cook evenly and have a pleasant bite.</p>
  <p>These cups are widely available in natural grocery stores like Whole Foods and Sprouts, and they ship well on Amazon. If you're stocking up for work lunches or a pantry staple, buying a 6-pack drops the per-cup cost significantly.</p>
  <ul style="padding-left:1.25rem;margin:1rem 0;color:#b0b3bb;">
    <li style="margin-bottom:0.4rem;">✅ Convenient cup format — no pot needed</li>
    <li style="margin-bottom:0.4rem;">✅ Fully vegan with clean ingredients</li>
    <li style="margin-bottom:0.4rem;">✅ Multiple bold flavors including Pad Thai</li>
    <li style="margin-bottom:0.4rem;">⚠️ Thinner noodles than traditional ramen</li>
  </ul>
  <a href="https://amzn.to/4dQLd6S" target="_blank" rel="noopener sponsored" style="display:inline-block;background:#77567A;color:white;font-weight:600;font-size:0.875rem;padding:0.6rem 1.25rem;border-radius:8px;text-decoration:none;margin-top:0.5rem;">Check Price on Amazon →</a>
</div>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />

<div style="margin-bottom:2.5rem;">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#77567A;margin-bottom:0.25rem;">#3 — Best for Purists</p>
  <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1rem;">Koyo Organic Ramen (Reduced Sodium)</h2>
  <a href="https://amzn.to/4tOYHFd" target="_blank" rel="noopener sponsored" style="display:block;margin-bottom:1.25rem;">
    <img src="https://m.media-amazon.com/images/I/71p7OA0HJXL._SL1200_.jpg" alt="Koyo Organic Ramen Reduced Sodium" style="width:100%;max-width:480px;border-radius:12px;display:block;" onerror="this.src='/images/hero-ramen.jpg'" />
  </a>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:600;">🧂 390mg sodium per serving</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">USDA Organic</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">No MSG</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Vegan</span>
  </div>
  <p>If you want the lowest sodium count on this list without sacrificing a traditional ramen noodle experience, Koyo is your brand. Their Reduced Sodium line comes in at an impressive <strong>390mg of sodium per serving</strong> — less than a quarter of what you'd find in standard instant ramen — while still delivering a savory, satisfying broth.</p>
  <p>Koyo uses USDA-certified organic ingredients and avoids MSG, artificial flavors, and preservatives entirely. The noodles themselves are made from organic wheat flour and have a pleasantly firm texture that's closer to restaurant ramen than most instant options. Flavors like Garlic Pepper, Mushroom, and Tofu Miso each have a distinct, balanced profile that doesn't taste watered-down or bland despite the lower salt content.</p>
  <p>Koyo is the pick for the health-focused ramen enthusiast who treats instant noodles as a canvas to build on — add a soft-boiled egg, some roasted nori, and a drizzle of sesame oil and you have a genuinely impressive bowl.</p>
  <ul style="padding-left:1.25rem;margin:1rem 0;color:#b0b3bb;">
    <li style="margin-bottom:0.4rem;">✅ Second-lowest sodium on this list at 390mg</li>
    <li style="margin-bottom:0.4rem;">✅ No MSG, no artificial ingredients</li>
    <li style="margin-bottom:0.4rem;">✅ Great base for building up your own toppings</li>
    <li style="margin-bottom:0.4rem;">⚠️ Less widely available in stores — best ordered online</li>
  </ul>
  <a href="https://amzn.to/4tOYHFd" target="_blank" rel="noopener sponsored" style="display:inline-block;background:#77567A;color:white;font-weight:600;font-size:0.875rem;padding:0.6rem 1.25rem;border-radius:8px;text-decoration:none;margin-top:0.5rem;">Check Price on Amazon →</a>
</div>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />

<div style="margin-bottom:2.5rem;">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#77567A;margin-bottom:0.25rem;">#4 — Best Korean Style</p>
  <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1rem;">Nongshim Soon Veggie Noodle Soup</h2>
  <a href="https://amzn.to/4dQLd6S" target="_blank" rel="noopener sponsored" style="display:block;margin-bottom:1.25rem;">
    <img src="https://m.media-amazon.com/images/I/71yEhiAzeyL._SL1200_.jpg" alt="Nongshim Soon Veggie Noodle Soup" style="width:100%;max-width:480px;border-radius:12px;display:block;" onerror="this.src='/images/hero-ramen.jpg'" />
  </a>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:600;">🧂 860mg sodium per serving</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Vegan</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Korean Style</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Mild Heat</span>
  </div>
  <p>Nongshim's Shin Ramyun is one of the world's best-selling instant ramen — but it packs a punishing 1,790mg of sodium per serving. Enter the <strong>Soon Veggie Noodle Soup</strong>: Nongshim's milder, veggie-forward, lower-sodium alternative. At <strong>860mg per serving</strong>, it's still higher than the other picks on this list, but it's dramatically cleaner than regular Korean ramyun and remains one of the most flavorful instant noodles you can buy.</p>
  <p>Soon Veggie has a light, clean broth — slightly savory with gentle heat and a hint of mushroom. The noodles are thick, springy, and satisfying in the characteristic Korean ramyun style. It's fully vegan, making it one of the few mainstream Korean instant noodles that doesn't use any animal-derived ingredients in the seasoning.</p>
  <p>If you're transitioning from full-sodium Korean ramen and want something that still delivers that same chewy noodle satisfaction and bold broth energy but with a bit more restraint, Soon Veggie is the most natural step down. It's also the easiest pick on this list to find at most grocery stores.</p>
  <ul style="padding-left:1.25rem;margin:1rem 0;color:#b0b3bb;">
    <li style="margin-bottom:0.4rem;">✅ Best Korean-style noodle texture on the list</li>
    <li style="margin-bottom:0.4rem;">✅ Widely available in grocery stores nationwide</li>
    <li style="margin-bottom:0.4rem;">✅ Fully vegan — no animal-derived ingredients</li>
    <li style="margin-bottom:0.4rem;">⚠️ Higher sodium than others on this list (860mg)</li>
  </ul>
  <a href="https://amzn.to/4dQLd6S" target="_blank" rel="noopener sponsored" style="display:inline-block;background:#77567A;color:white;font-weight:600;font-size:0.875rem;padding:0.6rem 1.25rem;border-radius:8px;text-decoration:none;margin-top:0.5rem;">Check Price on Amazon →</a>
</div>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />

<div style="margin-bottom:2.5rem;">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#77567A;margin-bottom:0.25rem;">#5 — Best Craft Pick</p>
  <h2 style="font-size:1.5rem;font-weight:700;margin:0 0 1rem;">Mike's Mighty Good Craft Ramen</h2>
  <a href="https://amzn.to/4tOYHFd" target="_blank" rel="noopener sponsored" style="display:block;margin-bottom:1.25rem;">
    <img src="https://m.media-amazon.com/images/I/91a-P7mBXqL._SL1200_.jpg" alt="Mike's Mighty Good Craft Ramen" style="width:100%;max-width:480px;border-radius:12px;display:block;" onerror="this.src='/images/hero-ramen.jpg'" />
  </a>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
    <span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:600;">🧂 630mg sodium per serving</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Organic</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Air-Dried Noodles</span>
    <span style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#b0b3bb;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.75rem;">Cup &amp; Pack Format</span>
  </div>
  <p>Mike's Mighty Good positioned itself from day one as the "craft" alternative to budget instant ramen — and the branding holds up. At <strong>630mg of sodium per serving</strong> and made with organic, non-GMO ingredients, it hits a sweet spot between health-conscious eating and genuine ramen enjoyment.</p>
  <p>What sets Mike's apart is the <strong>air-dried noodle process</strong>. Unlike the fried noodles in most instant ramen (which adds fat and changes the texture), Mike's noodles are dried with air, producing a cleaner ingredient list and a lighter, more authentic noodle texture. The broth options — Pork Tonkotsu, Spicy Beef, Chicken, and Vegetarian Miso — each taste noticeably more developed than comparable price-range competitors.</p>
  <p>Available in both cup and packet format, Mike's is a strong everyday option for someone who wants the ease of instant ramen with ingredient quality they can feel good about. The Spicy Beef and Pork Tonkotsu varieties in particular punch well above their weight class in terms of depth of flavor.</p>
  <ul style="padding-left:1.25rem;margin:1rem 0;color:#b0b3bb;">
    <li style="margin-bottom:0.4rem;">✅ Air-dried noodles for better texture and fewer calories</li>
    <li style="margin-bottom:0.4rem;">✅ Solid flavor variety including a proper Tonkotsu</li>
    <li style="margin-bottom:0.4rem;">✅ Available in cups and packets</li>
    <li style="margin-bottom:0.4rem;">⚠️ Slightly pricier than mainstream brands</li>
  </ul>
  <a href="https://amzn.to/4tOYHFd" target="_blank" rel="noopener sponsored" style="display:inline-block;background:#77567A;color:white;font-weight:600;font-size:0.875rem;padding:0.6rem 1.25rem;border-radius:8px;text-decoration:none;margin-top:0.5rem;">Check Price on Amazon →</a>
</div>`,
    outroContent: `<h2>The Verdict: Which Low Sodium Instant Ramen Should You Buy?</h2>
<p>If we had to pick just one, <strong>Lotus Foods Organic Millet &amp; Brown Rice Ramen</strong> is the best all-around low sodium instant ramen you can buy today. At just 470mg of sodium per serving — paired with organic, gluten-free ingredients and genuinely satisfying flavor — it beats the competition on every metric that matters for health-conscious eaters. It costs a bit more than your average $0.25 packet, but the difference in quality and the savings on sodium make it the clear winner.</p>
<p>For those who want the convenience of a cup, <strong>Dr. McDougall's</strong> is the closest runner-up. And if you're not ready to leave Korean-style noodles behind, <strong>Nongshim Soon Veggie</strong> is the smartest reduction — still half the sodium of regular ramyun with all the chewy noodle satisfaction intact.</p>
<p>However you like your ramen, there's never been a better time to go lower sodium. These brands prove that eating well and eating deliciously aren't mutually exclusive — even when dinner comes out of a packet.</p>
<p style="font-size:0.75rem;color:#6b7280;margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);">This post contains affiliate links. If you purchase through our links, we may earn a small commission at no extra cost to you. We only recommend products we genuinely believe in.</p>`,
  },
  {
    slug: 'ramen-catering-near-me',
    title: 'Ramen Catering Near Me — 10 Atlanta Spots Worth Calling',
    description: 'Looking for ramen catering near me? These 10 Atlanta ramen restaurants are your best bets for events, corporate lunches, and private parties. Call ahead to confirm availability.',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>Searching for <strong>ramen catering near me</strong> is harder than it should be — most ramen restaurants don't advertise catering prominently, but many will accommodate events, corporate lunches, office orders, and private parties when you reach out directly. Below are 10 Atlanta ramen spots worth calling first. Availability varies by location and event size, so always confirm directly with the restaurant.</p>`,
    outroContent: `<h2>How to Book Ramen Catering in Atlanta</h2>
<p>Most ramen restaurants don't list catering on their websites — the best approach is to call directly, describe your event size, and ask about large-order or catering options. JINYA locations have the most established catering infrastructure. For smaller office orders or pickup-style catering, almost any restaurant on this list can accommodate with enough notice. Give at least 48–72 hours lead time for best results.</p>`,
    restaurantCards: [
      {
        rank: 1,
        name: 'JINYA Ramen Bar – Buckhead',
        rating: 4.7,
        reviewCount: 2959,
        address: '3714 Roswell Rd #35, Atlanta, GA 30342',
        phone: '+1 404-254-4770',
        description: "JINYA is the most catering-ready ramen chain in Atlanta. With established corporate catering programs, packaging designed for large orders, and a streamlined menu built for volume, Buckhead is the top call for office events and corporate lunches in the north Atlanta area.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGC7BquBSpHmTj4A8C9y4_0GU_48lDrJIRb7XtmeT962wpNby2bXoxLC7DkyFvMOWeMBRK5yP4jg5IWvZPKFM3qXbfY0qug4GTJEzbvgzlnFCTl4Qnd3ovRg3BnxmgyKbRp2uJW=w800-h500-k-no',
        slug: 'jinya-ramen-bar-buckhead',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Catering-Friendly', 'Tonkotsu', 'Bar'],
      },
      {
        rank: 2,
        name: 'JINYA Ramen Bar – Poncey Highland',
        rating: 4.6,
        reviewCount: 1086,
        address: '676 N Highland Ave NE Suite #3-ABC, Atlanta, GA 30306',
        phone: '+1 404-748-4520',
        description: "The Poncey Highland JINYA serves the same catering-capable menu as Buckhead, in a more central intown location. Well-suited for events in the Virginia-Highland, Midtown, and Inman Park corridor. Contact the location directly to discuss event size and lead time.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFoRlFIOWCXK0poL8Bz0Aa0Rqt6EbvlMsZymbuGpei5coa5w0yzsPN3LGfVPhL04IqlPzzWgb-rk6zlyZ2G3QtYBTpjKRe9C5hQYpLHbn-PeXNrRwNuZ6jwRFlFRjQdGfsGExll=w800-h500-k-no',
        slug: 'jinya-ramen-bar-poncey-highland',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Catering-Friendly', 'Tonkotsu', 'Bar'],
      },
      {
        rank: 3,
        name: 'Okiboru Tsukemen & Ramen',
        rating: 4.8,
        reviewCount: 1099,
        address: '2277 Peachtree Rd NE B, Atlanta, GA 30309',
        phone: '+1 404-941-7469',
        description: "Atlanta's highest-rated ramen restaurant. Call ahead about large group orders and private event accommodations. The tsukemen format — noodles and broth served separately — actually travels particularly well for catered setups where guests serve themselves.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFV-ir1WWoRunbC7WyOC76EfAEIJ9F0vxc_5dP29_YZQBQNdju9browSuXjCMRV9lGeT9BUHnBj5lyg7NvdZRD0VW28NK303hkY9tIvOvtYYMuUMZ8Ho6p7vCll_mPLEDXItNpphMds2RCL=w800-h500-k-no',
        slug: 'okiboru-tsukemen-ramen',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Tsukemen', 'Japanese', 'Top Rated'],
      },
      {
        rank: 4,
        name: 'Kin NoTori Ramen Bar – Midtown Atlanta',
        rating: 4.7,
        reviewCount: 835,
        address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308',
        phone: '+1 470-312-2964',
        description: "Located at Ponce City Market, Kin NoTori is ideally positioned for Midtown corporate events and office catering. Their chicken-forward broth is crowd-pleasing and approachable for guests unfamiliar with ramen. Call to ask about large group menus and advance ordering.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGZaHLoocLVF-Z13GRsgZYmgu23DzJLabBTrLWcxtA9xRu6nXt-UmSG7k9EIiMja2TzMIYVTT3mljDKDTe_cvIjoUsRvKuHZLjeyn7Q1KkeiZeqzcr3xU6o3SEqNGRij0hlso6V-Q=w800-h500-k-no',
        slug: 'kin-notori-ramen-bar-midtown-atlanta',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Chicken Broth', 'Japanese', 'Group-Friendly'],
      },
      {
        rank: 5,
        name: 'PaoPao Ramen Factory & BoBa',
        rating: 4.4,
        reviewCount: 1293,
        address: '2929 N Druid Hills Rd NE C, Atlanta, GA 30329',
        phone: '+1 678-973-0613',
        description: "With over 1,200 reviews and a wide menu that includes ramen, bubble tea, and dumplings, PaoPao is a strong choice for events where guests have varied tastes. The broad menu makes it easy to accommodate dietary preferences across a group. Call ahead for large orders.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEreM2SNPzqw8AJZSFIfILPu7m1jeBDRu2dZ6gDCDeigH-MpkVzaCbPO1shM937ezBHwg-PKEM3Mdzv0xGPwxg0_Nrx5Qehuz0VJtWaIiC7kDy2qMRjLRIPH10UczufCyTJnXQh=w800-h500-k-no',
        slug: 'paopao-ramen-factory-boba',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Ramen', 'Bubble Tea', 'Group-Friendly'],
      },
      {
        rank: 6,
        name: 'E Ramen +',
        rating: 4.6,
        reviewCount: 1056,
        address: '1110 W Peachtree St NW #300, Atlanta, GA 30309',
        phone: '+1 404-913-4142',
        description: "A Midtown staple with housemade noodles, E Ramen+ is a strong pick for upscale office events or client lunches where food quality matters. Their sake and cocktail program can extend into event beverage service. Inquire directly about private dining and catering options.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
        slug: 'e-ramen',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Housemade Noodles', 'Sake Bar', 'Midtown'],
      },
      {
        rank: 7,
        name: 'Hajime',
        rating: 4.4,
        reviewCount: 756,
        address: '2345 Cheshire Bridge Rd NE #101, Atlanta, GA 30324',
        phone: '+1 470-428-2388',
        description: "Hajime's spacious dining room and established reputation make it one of the better options for sit-down group dining near Buckhead and Midtown. Traditional ramen with multiple broth styles, alongside a full Japanese small plates menu, gives groups plenty of choice.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJL9wC8zwjxS1BPz-gBPdCcidcE-6IXr287EsPvq2vfrwYMwCBhWk_kwqDm6WCpH8J_pqJQsNfOgqrDKUsmRPaOAvgn_OjxAxyFnorSb7UZ31ssGW9ypkhNEliQKIi-TD_GkUZ=w800-h500-k-no',
        slug: 'hajime',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Traditional', 'Japanese', 'Group Dining'],
      },
      {
        rank: 8,
        name: 'Lifting Noodles Ramen',
        rating: 4.5,
        reviewCount: 308,
        address: '477 Flat Shoals Ave SE, Atlanta, GA 30316',
        phone: '+1 470-800-2735',
        description: "Lifting Noodles is a neighborhood favorite in Glenwood Park with a casual atmosphere well-suited for team lunches and informal events. Two locations (Glenwood Park and Truist Park) give you options depending on where your group is located. Call directly for large order arrangements.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEflRV6rZG9Sl1Cbcsbq_pB4P1d3pAX1cqKuC8FsHKF0baY9HMvBwP5yPM0vSkwUK5-6gAoefgDnmbXkbfBGu_xakcwWqsV7ItAgfmHHko1Z-WLIav6yWHW7D-C3aEIL1PtNuVEGA=w800-h500-k-no',
        slug: 'lifting-noodles-ramen',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Ramen Bar', 'Casual', 'Two Locations'],
      },
      {
        rank: 9,
        name: 'Hikaru Ramen & Sushi Rolls',
        rating: 4.5,
        reviewCount: 355,
        address: '2014 Powers Ferry Rd UNIT 400, Atlanta, GA 30339',
        phone: '+1 678-888-2070',
        description: "For groups in the Vinings, Cumberland, or Smyrna area, Hikaru is the most convenient ramen catering option. The combined ramen and sushi menu is an advantage for mixed groups. Their location near the Cobb Galleria makes it a practical choice for conference and convention catering.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFsYtPy9Vup4ZA0mmrhpF9Bj3cqIpeF_KgoeYnlKssTS-RYlZKbxsSBkTAGmZ_tt9bl6xwl54t-Y9FWAija1lXrbj_9bQPZuk3bmASYZ1b2lJAN4wPm1_VLAUA6QPCMkbKP05hECA=w800-h500-k-no',
        slug: 'hikaru-ramen-sushi-rolls',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Ramen & Sushi', 'Japanese', 'Vinings Area'],
      },
      {
        rank: 10,
        name: 'Hotto Hotto Ramen & Teppanyaki',
        rating: 4.2,
        reviewCount: 893,
        address: '1039 Grant St SE Suite B10, Atlanta, GA 30315',
        phone: '+1 404-624-6868',
        description: "Hotto Hotto combines ramen with a teppanyaki program, making it one of the more versatile event dining options in South Atlanta. With nearly 900 reviews and a Grant Park location, it's well-regarded for group dinners and has the kitchen capacity to handle larger party orders.",
        photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFOUIh4wPe7h3Lp3hjG6n1Wr1o0mz6KlOVroGHCedTT1DVYIcZQfwpopcyTrYCW86ZKhvRKdkAnyZlhZn2GdeS3wXVBfrvGmFsYMQCMqlpOXl54v4aMQbmFlpYisin9DF2PJE_W=w800-h500-k-no',
        slug: 'hotto-hotto-ramen-teppanyaki',
        citySlug: 'atlanta',
        stateSlug: 'ga',
        tags: ['Ramen', 'Teppanyaki', 'Grant Park'],
      },
    ],
  },
  {
    slug: 'how-to-make-noodles-taste-like-ramen',
    title: 'How to Make Noodles Taste Like Ramen',
    description: 'Turn any plain noodles into rich, restaurant-quality ramen at home. Learn the secrets behind broth, tare, and toppings that make the difference.',
    date: 'May 17, 2026',
    readTime: '6 min read',
    category: 'Cooking Tips',
    content: `
<p>You've got a pack of plain noodles and you want that deep, savory ramen flavor — the kind that makes you close your eyes after the first sip. The good news: you don't need a 18-hour tonkotsu broth to get there. You just need to understand what actually makes ramen taste like ramen.</p>

<h2>It's All About the Broth Base</h2>
<p>Ramen flavor lives in the broth. Plain water won't cut it. Start with one of these:</p>
<ul>
  <li><strong>Chicken stock</strong> — the most versatile base. Use store-bought or simmer chicken bones for 2 hours.</li>
  <li><strong>Pork broth</strong> — richer and fattier, closer to tonkotsu. Simmer pork neck bones or trotters.</li>
  <li><strong>Dashi</strong> — a Japanese stock made from kombu (dried kelp) and bonito flakes. Ready in 20 minutes, tastes deeply umami.</li>
  <li><strong>Mushroom stock</strong> — dried shiitake mushrooms steeped in hot water for 30 minutes give an earthy, savory base.</li>
</ul>
<p>Even store-bought chicken stock upgraded with a few add-ins beats plain water every time.</p>

<h2>Add Tare — The Secret Seasoning Sauce</h2>
<p>Tare (pronounced "tah-reh") is the concentrated seasoning that gets added to the broth right before serving. This is what makes each bowl of ramen distinctly itself. There are three classic types:</p>
<ul>
  <li><strong>Shoyu tare</strong> — soy sauce, mirin, sake, and a little sugar. Salty, complex, slightly sweet. Stir 2–3 tablespoons into your broth per bowl.</li>
  <li><strong>Miso tare</strong> — white or red miso paste whisked with a bit of sesame paste, garlic, and ginger. Rich, fermented, deeply savory.</li>
  <li><strong>Shio tare</strong> — salt-based with yuzu juice, sake, and kombu. Lighter and cleaner tasting.</li>
</ul>
<p>A quick shoyu tare you can make in 5 minutes: combine ¼ cup soy sauce, 2 tbsp mirin, 1 tbsp sake (or dry sherry), and 1 tsp sugar in a small saucepan. Simmer for 3 minutes until slightly thickened. Use 2–3 tbsp per bowl.</p>

<h2>Build Aromatics Into the Broth</h2>
<p>Before adding your stock, bloom aromatics in a little sesame oil or neutral oil:</p>
<ul>
  <li>Garlic (2–3 cloves, minced or crushed)</li>
  <li>Fresh ginger (1 tsp grated)</li>
  <li>Scallion whites (chopped)</li>
  <li>Optional: dried chili flakes for heat, or a tablespoon of white miso stirred in at the end</li>
</ul>
<p>Sauté these for 60–90 seconds, then pour in your stock. Simmer for 10 minutes. This alone transforms plain broth into something that smells like a ramen shop.</p>

<h2>Choose the Right Noodles</h2>
<p>Traditional ramen noodles are wheat noodles made with kansui (an alkaline salt), which gives them their springy texture and slightly yellow color. If you can find fresh or dried ramen noodles, use them. But here's what works as substitutes:</p>
<ul>
  <li><strong>Fresh yakisoba noodles</strong> — nearly identical to ramen noodles, found in the refrigerated section</li>
  <li><strong>Sun Noodle brand</strong> — used by many restaurant-quality ramen shops</li>
  <li><strong>Instant ramen noodles (noodles only)</strong> — discard the seasoning packet, use just the curly noodles</li>
  <li><strong>Spaghetti hack</strong> — add ½ tsp baking soda to boiling pasta water, then cook spaghetti. The alkaline environment mimics kansui and gives pasta a chewier, more ramen-like bite.</li>
</ul>

<h2>Don't Skip the Fat</h2>
<p>Real ramen has a layer of fat on top that carries aroma and richness. Add one of these right before serving:</p>
<ul>
  <li>A drizzle of toasted sesame oil</li>
  <li>Mayu (blackened garlic oil) — blend 5 cloves of garlic charred in oil with the cooking oil itself</li>
  <li>Chili oil or rayu</li>
  <li>Rendered pork fat (if you're making chashu pork, save the drippings)</li>
</ul>

<h2>Top It Right</h2>
<p>Toppings aren't optional decoration — they're part of the flavor profile:</p>
<ul>
  <li><strong>Soft-boiled ramen egg (ajitsuke tamago)</strong>: boil 6 minutes, ice bath, peel, and marinate in 2 tbsp soy sauce + 1 tbsp mirin + ½ cup water for at least 1 hour</li>
  <li><strong>Chashu pork</strong>: pork belly rolled, tied, and braised in soy, mirin, sake, and sugar</li>
  <li><strong>Bamboo shoots (menma)</strong>: found canned at Asian grocery stores</li>
  <li><strong>Nori</strong>: a sheet of dried seaweed placed on the side</li>
  <li><strong>Scallions</strong>: sliced green tops</li>
  <li><strong>Corn and butter</strong>: classic Hokkaido miso ramen topping</li>
  <li><strong>Bean sprouts</strong>: quick sauté in sesame oil with a pinch of salt</li>
</ul>

<h2>The Assembly Order Matters</h2>
<p>Ramen bowls are assembled in a specific order for a reason:</p>
<ol>
  <li>Add your tare to the bottom of a warmed bowl</li>
  <li>Ladle in hot broth and stir briefly to combine</li>
  <li>Add a drizzle of aromatic fat</li>
  <li>Add freshly cooked (and drained) noodles</li>
  <li>Arrange toppings neatly on top</li>
</ol>
<p>Warm your bowls in advance by filling them with hot water for a minute, then dumping it out. A warm bowl keeps ramen hotter longer — which matters because ramen gets worse as it cools.</p>

<h2>The Fastest Version (Under 20 Minutes)</h2>
<p>If you want ramen flavor right now with minimal shopping:</p>
<ol>
  <li>Sauté garlic and ginger in sesame oil for 90 seconds</li>
  <li>Add 2 cups chicken stock + 1 cup water</li>
  <li>Stir in 2 tbsp soy sauce, 1 tbsp mirin, 1 tsp white miso</li>
  <li>Simmer 5 minutes</li>
  <li>Cook noodles separately, drain, add to bowl</li>
  <li>Pour broth over, top with scallions and a soft-boiled egg</li>
</ol>
<p>Not 48-hour tonkotsu — but genuinely good ramen you made in 20 minutes from things you probably have at home.</p>

<p>The gap between instant noodles and restaurant ramen is mostly technique and layering. Add the right stock, season with tare, bloom your aromatics, finish with fat, and top it properly. That's the formula.</p>
    `.trim(),
  },
  {
    slug: 'how-to-make-ramen-like-naruto',
    title: 'How to Make Ramen Like Naruto (Ichiraku Miso Chashu Ramen)',
    description: "Naruto's favorite food is miso chashu pork ramen from Ichiraku Ramen. Here's how to make it at home — step by step, exactly like the show.",
    date: 'May 17, 2026',
    readTime: '8 min read',
    category: 'Recipes',
    content: `
<p>Naruto Uzumaki's love for ramen is one of the most iconic details in anime. From his very first bowl as a child — sitting alone at Teuchi's Ichiraku Ramen stand — to celebrating victories with his friends, ramen is woven into who he is. His go-to order: <strong>miso chashu pork ramen with extra servings</strong>. Sometimes he'd get four or five extra helpings in a sitting.</p>

<p>So what exactly is Naruto's ramen? It's a Hokkaido-style miso ramen with thick, springy noodles, a rich cloudy broth, sliced chashu pork belly, narutomaki fish cake (the spiral pink and white slice — fittingly named after him), and a soft-boiled egg. This guide walks you through making it at home.</p>

<h2>What Is Ichiraku Ramen?</h2>
<p>Ichiraku Ramen is a real restaurant. It exists in Fukuoka, Japan, near the Kyushu University campus where Masashi Kishimoto (Naruto's creator) studied. The fictional stand in the Hidden Leaf Village is based directly on it. The owner, Teuchi, and his daughter Ayame serve Naruto throughout the entire series.</p>
<p>The ramen style served at Ichiraku is a miso-based broth — hearty, warming, and deeply savory. This is classic Hokkaido ramen territory: a pork or chicken base, seasoned with miso tare, topped generously with chashu, corn, butter, green onions, and narutomaki.</p>

<h2>Ingredients (Serves 4)</h2>

<h3>Chashu Pork (make this first — it takes 2–3 hours)</h3>
<ul>
  <li>1.5 lbs (700g) pork belly, skin-on</li>
  <li>¼ cup soy sauce</li>
  <li>¼ cup mirin</li>
  <li>¼ cup sake (or dry sherry)</li>
  <li>2 tbsp sugar</li>
  <li>1 cup water</li>
  <li>3 garlic cloves, smashed</li>
  <li>1-inch piece of ginger, sliced</li>
  <li>2 scallions</li>
</ul>

<h3>Miso Tare</h3>
<ul>
  <li>3 tbsp white miso (shiro miso)</li>
  <li>1 tbsp red miso (aka miso) — optional but adds depth</li>
  <li>2 tbsp soy sauce</li>
  <li>2 tbsp mirin</li>
  <li>1 tbsp sake</li>
  <li>1 tbsp sesame paste (or tahini)</li>
  <li>1 tsp toasted sesame oil</li>
  <li>1 tsp sugar</li>
</ul>

<h3>Broth</h3>
<ul>
  <li>6 cups chicken stock (homemade or good-quality store-bought)</li>
  <li>2 cups pork stock (or use all chicken stock, 8 cups total)</li>
  <li>3 garlic cloves, minced</li>
  <li>1-inch ginger, grated</li>
  <li>1 tbsp sesame oil</li>
  <li>2 tbsp neutral oil (vegetable or canola)</li>
</ul>

<h3>Ramen Eggs (Ajitsuke Tamago)</h3>
<ul>
  <li>4 large eggs</li>
  <li>3 tbsp soy sauce</li>
  <li>2 tbsp mirin</li>
  <li>1 tbsp sake</li>
  <li>½ cup water</li>
</ul>

<h3>Noodles & Toppings</h3>
<ul>
  <li>4 portions fresh or dried ramen noodles (or yakisoba noodles)</li>
  <li>1 can corn (drained) or fresh corn kernels</li>
  <li>2 tbsp butter</li>
  <li>4 scallions, green parts sliced thin</li>
  <li>4 slices narutomaki (fish cake — find at Asian grocery stores)</li>
  <li>Nori sheets</li>
  <li>Bean sprouts, optional</li>
  <li>Toasted sesame seeds</li>
</ul>

<h2>Step 1: Make the Chashu Pork</h2>
<p>This is the centerpiece. Start here because it needs time.</p>
<ol>
  <li>Roll the pork belly tightly lengthwise, fat-side out. Tie with kitchen twine every inch to hold the roll.</li>
  <li>Sear it in a Dutch oven or heavy pot over high heat with a bit of oil. Brown it on all sides — 3–4 minutes per side. This step builds flavor, don't skip it.</li>
  <li>Combine soy sauce, mirin, sake, sugar, water, garlic, ginger, and scallions in the pot. Bring to a simmer.</li>
  <li>Cover and cook on low heat for 2–2.5 hours, turning the roll every 30 minutes.</li>
  <li>Remove pork and let cool. Slice into ½-inch rounds when ready to serve. (Even better: refrigerate overnight — the fat firms up and it slices perfectly.)</li>
  <li><strong>Save the braising liquid.</strong> Use it to marinate your ramen eggs and drizzle on top of finished bowls.</li>
</ol>

<h2>Step 2: Make the Ramen Eggs</h2>
<ol>
  <li>Bring a pot of water to a rolling boil. Gently lower eggs in and cook exactly 6 minutes 30 seconds for jammy, custard-like yolks.</li>
  <li>Transfer immediately to an ice bath. Let sit 5 minutes, then peel.</li>
  <li>Combine soy sauce, mirin, sake, and water (or use the chashu braising liquid diluted 1:2 with water) in a zip-lock bag or container.</li>
  <li>Add peeled eggs and marinate at least 2 hours, or overnight. The eggs will turn a beautiful amber color.</li>
</ol>

<h2>Step 3: Make the Miso Tare</h2>
<p>Whisk all tare ingredients together until smooth. This makes enough for 4 bowls. Store extra in the fridge up to 2 weeks.</p>

<h2>Step 4: Build the Broth</h2>
<ol>
  <li>Heat oils in a large pot over medium heat. Add garlic and ginger, stir for 90 seconds until fragrant.</li>
  <li>Pour in the chicken and pork stock. Bring to a simmer.</li>
  <li>Simmer for 10–15 minutes. Do not boil aggressively — that makes the broth cloudy and bitter.</li>
  <li>Taste and adjust salt. The broth should be slightly underseasoned on its own because the tare adds significant saltiness.</li>
</ol>

<h2>Step 5: Cook the Noodles</h2>
<p>Cook noodles according to package directions in a separate pot of unsalted boiling water. Ramen noodles cook fast — usually 1–3 minutes for fresh, 3–5 for dried. Drain well and shake off excess water.</p>

<h2>Step 6: Assemble the Bowl</h2>
<p>This step is fast, so have everything ready before you start:</p>
<ol>
  <li>Warm your bowls (fill with boiling water for 1 minute, discard).</li>
  <li>Add 2–3 tablespoons of miso tare to the bottom of each bowl.</li>
  <li>Ladle 1.5 cups of hot broth over it and stir to combine.</li>
  <li>Add a small knob of butter and let it melt into the broth.</li>
  <li>Add a portion of cooked, drained noodles.</li>
  <li>Arrange on top: 2–3 slices chashu, 1 halved ramen egg, corn, narutomaki, a sheet of nori tucked against the noodles, and scallions.</li>
  <li>Drizzle lightly with sesame oil and sprinkle sesame seeds.</li>
</ol>

<h2>The Naruto Touch: Narutomaki</h2>
<p>The spiral fish cake slice that appears in nearly every bowl of anime ramen is called <strong>narutomaki</strong> — and yes, it's named after the same whirlpool (Naruto Strait) that the character is named after. It's a processed fish cake (surimi) with a pink spiral inside. You'll find it refrigerated or frozen at any Japanese or Korean grocery store. Slice it ½-inch thick and place it prominently on top of the bowl.</p>

<h2>Naruto's Eating Style</h2>
<p>Naruto famously eats fast and orders multiple bowls. In ramen culture, this is called <em>kaedama</em> — ordering extra noodles to add to your remaining broth. If you want to eat like Naruto, finish your noodles first, then ask for more. The broth is meant to be sipped to the last drop.</p>

<p>Ichiraku Ramen is about more than food in the series — it's where Naruto finds belonging. He ate his first bowl there alone as a child, ignored and lonely. By the final arc, he's at that same counter surrounded by the people who became his family. That's the ramen. Make it right.</p>

<h2>Quick Reference: Naruto's Order</h2>
<ul>
  <li>Style: Miso ramen</li>
  <li>Protein: Chashu pork</li>
  <li>Toppings: Narutomaki, scallions, soft-boiled egg, corn, butter, nori</li>
  <li>Quantity: Multiple servings (don't be shy)</li>
</ul>
    `.trim(),
  },
  {
    slug: 'best-ramen-in-atlanta-georgia',
    title: 'Best Ramen in Atlanta Georgia — Top 10 Restaurants',
    description: 'Discover the best ramen in Atlanta Georgia with our ranked list of the top 10 restaurants. From rich tonkotsu to housemade tsukemen, these are the bowls worth driving for.',
    date: 'May 18, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>If you're looking for the best ramen in Atlanta Georgia, the city has more to offer than most people expect. Georgia's largest city has quietly built a ramen scene that rivals much bigger markets — with housemade noodles, scratch broths, and dedicated chefs who take the bowl seriously. Below are the top 10 restaurants in Atlanta GA ranked by Google rating and review count.</p>`,
    restaurantCards: atlantaTop10,
    outroContent: `<h2>Final Thoughts on Ramen in Atlanta Georgia</h2><p>Atlanta Georgia's ramen scene rewards exploration. Start at Okiboru for the best single bowl in the city, hit JINYA Buckhead when you want reliability and volume, and work your way through Midtown and East Atlanta for the neighborhoods' best. Every restaurant on this list earns its place — the only question is which broth style you're craving today.</p>`,
  },
  {
    slug: 'best-ramen-noodles-in-atlanta',
    title: 'Best Ramen Noodles in Atlanta — Top 10 Bowls Worth Ordering',
    description: 'Searching for the best ramen noodles in Atlanta? These 10 restaurants serve the city\'s top-rated bowls — ranked by Google rating, review count, and noodle quality.',
    date: 'May 18, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>Finding the best ramen noodles in Atlanta means knowing where the broth is housemade, the noodles are cooked to order, and the toppings are worth the price. Atlanta's ramen scene has matured fast — the city now has enough standout spots that choosing the right bowl takes some research. We ranked the top 10 based on Google ratings, review volume, and what keeps regulars coming back.</p>`,
    restaurantCards: atlantaTop10,
    outroContent: `<h2>The Bottom Line on Atlanta Ramen Noodles</h2><p>The best ramen noodles in Atlanta come from kitchens that treat the noodle as seriously as the broth — and the restaurants on this list all do. Okiboru leads on craft, JINYA Buckhead leads on consistency, and spots like Kin NoTori and TENSAN are raising the city's overall standard. Wherever you land, Atlanta's ramen scene is worth exploring bowl by bowl.</p>`,
  },
  {
    slug: 'best-ramen-in-atlanta',
    title: 'Best Ramen In Atlanta - Top 10 Restaurants',
    description: 'Looking for the best ramen in Atlanta? We ranked the top 10 ramen restaurants in the city by rating, reviews, and broth quality — from Buckhead to Midtown.',
    date: 'May 18, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>If you're searching for the best ramen in Atlanta, you're in luck — Atlanta's ramen scene has grown into one of the strongest in the South. Whether you want a rich tonkotsu, a housemade tsukemen, or a classic miso bowl, these ten spots consistently deliver. We ranked them using Google ratings, review volume, and what locals keep coming back for.</p>`,
    restaurantCards: atlantaTop10,
    outroContent: `<h2>Where to Find the Best Ramen in Atlanta</h2><p>Atlanta's best ramen is spread across several neighborhoods — Midtown, Buckhead, Poncey Highland, East Atlanta Village, and Glenwood Park each have strong contenders. Okiboru leads the pack on pure quality, JINYA Buckhead wins on consistency and volume, and Kin NoTori is the best-kept Midtown secret. Whether you want rich tonkotsu, tsukemen, or something lighter, Atlanta delivers.</p>`,
  },
]

const veganAtlantaTop10: RestaurantCard[] = [
  {
    rank: 1,
    name: 'Okiboru Tsukemen & Ramen',
    rating: 4.8,
    reviewCount: 1099,
    address: '2277 Peachtree Rd NE B, Atlanta, GA 30309',
    phone: '+1 404-941-7469',
    description: "Atlanta's top-rated ramen restaurant offers dedicated vegan broth options alongside its signature tsukemen. Every component is housemade — ask for the vegan dipping broth and you won't miss a thing.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFV-ir1WWoRunbC7WyOC76EfAEIJ9F0vxc_5dP29_YZQBQNdju9browSuXjCMRV9lGeT9BUHnBj5lyg7NvdZRD0VW28NK303hkY9tIvOvtYYMuUMZ8Ho6p7vCll_mPLEDXItNpphMds2RCL=w800-h500-k-no',
    slug: 'okiboru-tsukemen-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Tsukemen', 'Top-Rated'],
  },
  {
    rank: 2,
    name: 'JINYA Ramen Bar – Buckhead',
    rating: 4.7,
    reviewCount: 2959,
    address: '3714 Roswell Rd #35, Atlanta, GA 30342',
    phone: '+1 404-254-4770',
    description: "JINYA's most-reviewed Atlanta location explicitly features vegan ramen on the menu — rich, kombu-and-shiitake broth with tofu, corn, bamboo, and green onion. Nearly 3,000 Google reviews back it up.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFOUIh4wPe7h3Lp3hjG6n1Wr1o0mz6KlOVroGHCedTT1DVYIcZQfwpopcyTrYCW86ZKhvRKdkAnyZlhZn2GdeS3wXVBfrvGmFsYMQCMqlpOXl54v4aMQbmFlpYisin9DF2PJE_W=w800-h500-k-no',
    slug: 'jinya-ramen-bar-buckhead',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Menu', 'Japanese', 'Bar'],
  },
  {
    rank: 3,
    name: 'Kin NoTori Ramen Bar – Midtown Atlanta',
    rating: 4.7,
    reviewCount: 835,
    address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308',
    phone: '+1 470-312-2964',
    description: "One of Midtown's best ramen spots with strong plant-based options. Their vegetable tori paitan broth is creamy, deeply savory, and fully satisfying — proof that great ramen doesn't require pork.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHl0s8TDu8hFUbcFhXiLJeymsWhZrv8Tp8kSY1V92UKV0EHxEpQyoz9eTpzu9nB50rwGxcJ34T70aimvKOTkPFg6KH65m6EJ-faSph7uvz7re6fVVIKidOd4888pDRzsaf9ujZY=w800-h500-k-no',
    slug: 'kin-notori-ramen-bar-midtown-atlanta',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Chicken Broth', 'Ramen Bar'],
  },
  {
    rank: 4,
    name: 'E Ramen +',
    rating: 4.6,
    reviewCount: 1056,
    address: '1110 W Peachtree St NW #300, Atlanta, GA 30309',
    phone: '+1 404-913-4142',
    description: 'Midtown staple with housemade noodles and a genuine commitment to plant-based dining. Their vegan shoyu broth is clean and layered — noodles made fresh daily make all the difference.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
    slug: 'e-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Housemade Noodles', 'Sake Bar'],
  },
  {
    rank: 5,
    name: 'JINYA Ramen Bar – Poncey Highland',
    rating: 4.6,
    reviewCount: 1086,
    address: '676 N Highland Ave NE Suite #3-ABC, Atlanta, GA 30306',
    phone: '+1 404-748-4520',
    description: "JINYA's neighborhood Poncey Highland location carries the same vegan menu as Buckhead in a more intimate setting. Perfect for date nights or solo bowls — the bar menu rounds out the experience.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
    slug: 'jinya-ramen-bar-poncey-highland',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Menu', 'Japanese', 'Bar'],
  },
  {
    rank: 6,
    name: 'Hikaru Ramen & Sushi Rolls',
    rating: 4.5,
    reviewCount: 355,
    address: '2014 Powers Ferry Rd UNIT 400, Atlanta, GA 30339',
    phone: '+1 678-888-2070',
    description: 'Serving multiple ramen styles with vegan and vegetarian-friendly options in a spacious, welcoming space near Vinings. Solid 4.5 stars across 355 reviews makes it the best plant-based pick in West Atlanta.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJL9wC8zwjxS1BPz-gBPdCcidcE-6IXr287EsPvq2vfrwYMwCBhWk_kwqDm6WCpH8J_pqJQsNfOgqrDKUsmRPaOAvgn_OjxAxyFnorSb7UZ31ssGW9ypkhNEliQKIi-TD_GkUZ=w800-h500-k-no',
    slug: 'hikaru-ramen-sushi-rolls',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Ramen & Sushi', 'Japanese'],
  },
  {
    rank: 7,
    name: 'Hajime',
    rating: 4.4,
    reviewCount: 756,
    address: '2345 Cheshire Bridge Rd NE #101, Atlanta, GA 30324',
    phone: '+1 470-428-2388',
    description: 'A Cheshire Bridge institution serving multiple ramen styles with plant-based options alongside Japanese small plates. The miso broth adapts beautifully to vegan preparation — years of community trust behind every bowl.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFoRlFIOWCXK0poL8Bz0Aa0Rqt6EbvlMsZymbuGpei5coa5w0yzsPN3LGfVPhL04IqlPzzWgb-rk6zlyZ2G3QtYBTpjKRe9C5hQYpLHbn-PeXNrRwNuZ6jwRFlFRjQdGfsGExll=w800-h500-k-no',
    slug: 'hajime',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Miso Ramen', 'Japanese'],
  },
  {
    rank: 8,
    name: 'Nagomiya',
    rating: 4.5,
    reviewCount: 448,
    address: '1010 W Peachtree St NW Ste 400, Atlanta, GA 30309',
    phone: '+1 404-975-3851',
    description: 'Midtown ramen and Japanese comfort food with genuine vegan-friendly options. A quieter, more intimate alternative to the busier spots on this list — great broth, attentive service, and a 4.5 rating.',
    photo: 'https://lh3.googleusercontent.com/gps-proxy/ALd4DhHPHZHbTxSNGNpcqEM9T-HqGhpK5PDmMCxnFOCQr6_SbPA4T5ftSLrJWqw6NwWefCxUcYfa_mPh-feBi0OhzwiMnrZn-O5LDZ2mVXDqzJQiQei_6IXixHQXeiR7CPg7THfIDTkUhLlWXSPUZs8CtZWGzl6bSWJ8kuR0fEsinHUcFw7Q4dEidBKIeg=w800-h500-k-no',
    slug: 'nagomiya',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Japanese', 'Midtown'],
  },
  {
    rank: 9,
    name: 'Momonoki',
    rating: 4.2,
    reviewCount: 1436,
    address: '95 8th St NW #100, Atlanta, GA 30309',
    phone: '+1 404-390-3025',
    description: "Modern Japanese chain with over 1,400 reviews and a dedicated plant-based section on the menu. The sheer volume of reviews makes Momonoki one of Atlanta's most reliable vegan ramen options.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGC7BquBSpHmTj4A8C9y4_0GU_48lDrJIRb7XtmeT962wpNby2bXoxLC7DkyFvMOWeMBRK5yP4jg5IWvZPKFM3qXbfY0qug4GTJEzbvgzlnFCTl4Qnd3ovRg3BnxmgyKbRp2uJW=w800-h500-k-no',
    slug: 'momonoki',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Japanese', 'Bar'],
  },
  {
    rank: 10,
    name: 'Silverlake Ramen',
    rating: 4.1,
    reviewCount: 382,
    address: '1080 Peachtree St NE Ste 9, Atlanta, GA 30309',
    phone: '+1 404-390-3362',
    description: "An airy, contemporary Peachtree Street spot with poke bowls, ramen, and Japanese eats — all with solid vegan and vegetarian flexibility. Atlanta's most accessible entry point for plant-based ramen exploration.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFarGQB7eupFhn8Pa092xst7fIBnc8I1bWOz9qxQ1z0BqvSIaarPBufCdw57l5dWf9nj_BLaKcT-SyX0VPE6su-C18bQlXtJV16VXwUqRbWw4wSiaTcM8S63WNHKi0e32jWEW5f=w800-h500-k-no',
    slug: 'silverlake-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Ramen', 'Poke'],
  },
]

const tonkotsuAtlantaTop10: RestaurantCard[] = [
  {
    rank: 1,
    name: 'Okiboru Tsukemen & Ramen',
    rating: 4.8,
    reviewCount: 1099,
    address: '2277 Peachtree Rd NE B, Atlanta, GA 30309',
    phone: '+1 404-941-7469',
    description: "Atlanta's highest-rated ramen restaurant, Okiboru's specialty is tonkotsu-based tsukemen — a concentrated pork bone dipping broth with housemade thick noodles. The richest, most technically precise bowl in the city.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFV-ir1WWoRunbC7WyOC76EfAEIJ9F0vxc_5dP29_YZQBQNdju9browSuXjCMRV9lGeT9BUHnBj5lyg7NvdZRD0VW28NK303hkY9tIvOvtYYMuUMZ8Ho6p7vCll_mPLEDXItNpphMds2RCL=w800-h500-k-no',
    slug: 'okiboru-tsukemen-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Tsukemen', 'Top-Rated'],
  },
  {
    rank: 2,
    name: 'JINYA Ramen Bar – Buckhead',
    rating: 4.7,
    reviewCount: 2959,
    address: '3714 Roswell Rd #35, Atlanta, GA 30342',
    phone: '+1 404-254-4770',
    description: "Atlanta's most-reviewed ramen restaurant, JINYA Buckhead is known nationally for its tonkotsu bowls — slow-simmered pork bone broth, thin noodles, chashu pork, and ajitsuke tamago. A benchmark for consistency.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFOUIh4wPe7h3Lp3hjG6n1Wr1o0mz6KlOVroGHCedTT1DVYIcZQfwpopcyTrYCW86ZKhvRKdkAnyZlhZn2GdeS3wXVBfrvGmFsYMQCMqlpOXl54v4aMQbmFlpYisin9DF2PJE_W=w800-h500-k-no',
    slug: 'jinya-ramen-bar-buckhead',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Bar'],
  },
  {
    rank: 3,
    name: 'Kin NoTori Ramen Bar – Midtown Atlanta',
    rating: 4.7,
    reviewCount: 835,
    address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308',
    phone: '+1 470-312-2964',
    description: "Midtown's best-kept ramen secret. Kin NoTori's tori paitan is a rich, creamy white chicken broth that rivals tonkotsu in depth and unctuousness — clean, protein-heavy, and deeply satisfying.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHl0s8TDu8hFUbcFhXiLJeymsWhZrv8Tp8kSY1V92UKV0EHxEpQyoz9eTpzu9nB50rwGxcJ34T70aimvKOTkPFg6KH65m6EJ-faSph7uvz7re6fVVIKidOd4888pDRzsaf9ujZY=w800-h500-k-no',
    slug: 'kin-notori-ramen-bar-midtown-atlanta',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Rich Broth', 'Chicken Paitan', 'Ramen Bar'],
  },
  {
    rank: 4,
    name: 'Wagaya – Westside',
    rating: 4.6,
    reviewCount: 1837,
    address: '339 14th St NW, Atlanta, GA 30318',
    phone: '+1 470-575-5799',
    description: "Westside Atlanta's most beloved Japanese spot serves classic tonkotsu alongside sushi, grilled skewers, and sake. Nearly 1,900 reviews at 4.6 stars — the tonkotsu here is rich, creamy, and never disappoints.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAENWRX0cMjFQczRrgryXMPathT1uCKvuidmOGf-PXdN5ApB5oHkZNlW3_ZlwM8yL5Cpy_6vvQMwu-2xF3gKzJ9nC41sAVgHrWhYhbV3ViFpsAl45DU2hFNw4kW0YjCUDtD72qGLIGtxigp2=w800-h500-k-no',
    slug: 'wagaya-westside',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Izakaya', 'Sake Bar'],
  },
  {
    rank: 5,
    name: 'E Ramen +',
    rating: 4.6,
    reviewCount: 1056,
    address: '1110 W Peachtree St NW #300, Atlanta, GA 30309',
    phone: '+1 404-913-4142',
    description: "Housemade noodles and from-scratch tonkotsu broth in the heart of Midtown. E Ramen+ makes everything in-house — the pork bone broth simmers for hours and it shows. Over 1,000 reviews at 4.6 stars.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
    slug: 'e-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Housemade Noodles', 'Sake Bar'],
  },
  {
    rank: 6,
    name: 'JINYA Ramen Bar – Poncey Highland',
    rating: 4.6,
    reviewCount: 1086,
    address: '676 N Highland Ave NE Suite #3-ABC, Atlanta, GA 30306',
    phone: '+1 404-748-4520',
    description: "The Poncey Highland JINYA location serves the same acclaimed tonkotsu in a neighborhood setting with a full sake and cocktail bar. More intimate than Buckhead but equally reliable — 1,000+ reviews confirm it.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no',
    slug: 'jinya-ramen-bar-poncey-highland',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Bar'],
  },
  {
    rank: 7,
    name: 'TENSAN Ramen',
    rating: 4.6,
    reviewCount: 59,
    address: '475 Bill Kennedy Wy SE B, Atlanta, GA 30316',
    phone: '+1 404-815-8882',
    description: "East Atlanta Village's serious newcomer with a 4.6 rating right out of the gate. TENSAN's focused menu centers on rich, properly made tonkotsu — a spot to visit now before the city catches on fully.",
    photo: 'https://lh3.googleusercontent.com/gps-proxy/ALd4DhHfs7mqdj_sbSz2d-aE84IDrgDirZZXRuAEUJC8hMxvUAmTCaHfS1gIMqRi1JS1fYNvo7lXDli_TkslcQMnZOWYGYYLZmYJm9n9_-doRoTDh0hq8K1HOJcc9eigVTuXVLj9iGKHk1W_sego4w-6zIaOHlKiHHdGoBuMl38z7AMPruZnNJq83gaGRw=w800-h500-k-no',
    slug: 'tensan-ramen',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Ramen Bar', 'East Atlanta'],
  },
  {
    rank: 8,
    name: 'Hikaru Ramen & Sushi Rolls',
    rating: 4.5,
    reviewCount: 355,
    address: '2014 Powers Ferry Rd UNIT 400, Atlanta, GA 30339',
    phone: '+1 678-888-2070',
    description: 'Multiple tonkotsu and shoyu styles with a sushi menu that broadens the appeal for groups. The best option for tonkotsu ramen on the northwest side of Atlanta — consistently 4.5 stars.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJL9wC8zwjxS1BPz-gBPdCcidcE-6IXr287EsPvq2vfrwYMwCBhWk_kwqDm6WCpH8J_pqJQsNfOgqrDKUsmRPaOAvgn_OjxAxyFnorSb7UZ31ssGW9ypkhNEliQKIi-TD_GkUZ=w800-h500-k-no',
    slug: 'hikaru-ramen-sushi-rolls',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Ramen & Sushi', 'Japanese'],
  },
  {
    rank: 9,
    name: 'Hajime',
    rating: 4.4,
    reviewCount: 756,
    address: '2345 Cheshire Bridge Rd NE #101, Atlanta, GA 30324',
    phone: '+1 470-428-2388',
    description: 'Traditional Japanese ramen on Cheshire Bridge — multiple broth styles including tonkotsu, miso, and shoyu. One of Atlanta\'s longer-tenured ramen spots with years of loyal regulars behind its 4.4 rating.',
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFoRlFIOWCXK0poL8Bz0Aa0Rqt6EbvlMsZymbuGpei5coa5w0yzsPN3LGfVPhL04IqlPzzWgb-rk6zlyZ2G3QtYBTpjKRe9C5hQYpLHbn-PeXNrRwNuZ6jwRFlFRjQdGfsGExll=w800-h500-k-no',
    slug: 'hajime',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Miso', 'Japanese'],
  },
  {
    rank: 10,
    name: 'Hotto Hotto Ramen & Teppanyaki',
    rating: 4.2,
    reviewCount: 893,
    address: '1039 Grant St SE Suite B10, Atlanta, GA 30315',
    phone: '+1 404-963-2937',
    description: "Grant Park's spirited ramen and teppanyaki hybrid — almost 900 Google reviews at 4.2 stars. The tonkotsu is rich and unapologetically indulgent. The teppanyaki add-ons make it one of Atlanta's most fun dinner outings.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH3ekJV9EmysdycLlgUifD5l8fLixzAJjHsfjY9toFkUt8weUy_u46LR9u1fQgVi-i3VGOGFCOMoN7Sfbp54J0_wbjH1rpYamJ-Q6Mp_0yV6bUsDe8HiJt7lPo6rZDS29ZcWas=w800-h500-k-no',
    slug: 'hotto-hotto-ramen-teppanyaki',
    citySlug: 'atlanta',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Teppanyaki', 'Grant Park'],
  },
]

const duluthTop10: RestaurantCard[] = [
  {
    rank: 1,
    name: 'Ramyun Gallery',
    rating: 4.9,
    reviewCount: 396,
    address: '2645 N Berkeley Lake Rd NW Ste E233, Duluth, GA 30096',
    phone: '+1 678-336-9334',
    description: "Duluth's highest-rated ramen restaurant at a stunning 4.9 stars. Ramyun Gallery treats Korean ramyun as fine craft — expect bold, complex broths and precision in every bowl. This is the first stop in Duluth.",
    photo: 'https://lh3.googleusercontent.com/gps-proxy/ALd4DhFkGnzEDtoT8uhK6d95PyJQdzLsyx0HtWAgLjhPJSOGJAV1Ic0kwUlRTGW7NByuSZ1d6DwWRFShlk-0vYr7OYIM3zwC5yQFm5MGYNdpxwBSgF48iY77IGFP1SR97AyDRE-AsArPvgf3IWCr1TXoOt6MgZ1EwSe9Xs_UgtIYs7RIraPAWMBOLtum=w800-h500-k-no',
    slug: 'ramyun-gallery-duluth',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Korean Ramen', 'Top-Rated', 'Craft Ramen'],
  },
  {
    rank: 2,
    name: 'Umai Ramen',
    rating: 4.8,
    reviewCount: 851,
    address: 'Duluth, GA 30096',
    phone: '',
    description: "Umai Ramen is one of Duluth's most praised bowls — 4.8 stars across 851 reviews. Japanese-style broth craftsmanship with noodles made to order. A must-visit for any serious ramen hunter in the Duluth area.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAElWTAXu3zyyuIz8soiXrkPpOlFMzmpysKH5P13o1NMpOKnOW_L3tpabV48cgWFkJi-zMdD93a6FJF3j9lrircfZWzsDIlLqWj_j0iarFkF93ekHjWd__e_QNA5tmdMHUNv5rVXrA=w800-h500-k-no',
    slug: 'umai-ramen',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Japanese Ramen', 'Top-Rated', 'Duluth'],
  },
  {
    rank: 3,
    name: 'RINOO',
    rating: 4.6,
    reviewCount: 99,
    address: '3455 Peachtree Industrial Blvd STE 230, Duluth, GA 30096',
    phone: '+1 678-242-8363',
    description: "A newer Duluth entry that's already racking up strong reviews at 4.6 stars. RINOO's focused ramen menu leans into bold, carefully constructed broths. A rising star worth watching — and eating at now.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH-Rc2X97PJqvy3lnZzmT7OgWfkbp9kMwmoFWQ88Dr2yprNTP7xy6XWPHf0tvD1AQ6lP1tdYU77NsbuKXA9kQk7woGqBsIl1TjTBEYOPHhsMzWEWpZ8xnAKG7Ez6BgWO5CCJkDE6A=w800-h500-k-no',
    slug: 'rinoo',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Ramen Bar', 'Duluth', 'Rising Star'],
  },
  {
    rank: 4,
    name: 'JINYA Ramen Bar – Duluth',
    rating: 4.5,
    reviewCount: 1438,
    address: '2200 Duluth Hwy, Duluth, GA 30097',
    phone: '+1 678-691-3101',
    description: "Duluth's most-reviewed ramen restaurant with nearly 1,500 Google reviews at 4.5 stars. JINYA's signature tonkotsu and spicy chicken bowls draw consistent crowds. Reliable, well-executed Japanese ramen every time.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGvEazADDGeHO31gCvekMfOQGWJxeCi_Z8Csa3u-4qG08gpA47iUb1HQOrm-IXcADZznpgQOvXI1_bYpydAWuu44ZsdFJpH4_PoOJMEBecqnWCWw53aKe0Z8tNaSV_WFnw8uAwk=w800-h500-k-no',
    slug: 'jinya-ramen-bar-duluth',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Bar'],
  },
  {
    rank: 5,
    name: 'Okiboru – Duluth',
    rating: 4.5,
    reviewCount: 428,
    address: '3614 Satellite Blvd, Duluth, GA 30096',
    phone: '+1 470-550-1953',
    description: "The Duluth outpost of Atlanta's legendary Okiboru brand. Same tsukemen craft, same dense tonkotsu dipping broth — now in Gwinnett County. If you loved the Buckhead original, this location delivers the identical experience.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH1J1PIWPT2LI7xfPC2QZtnRMCRI4euP6u2rKy3CrOjG8XkPT04ppFqrFHB2M-he8MUKCIajDl7gFsOfCvMBpTbhSnX84tG2dYusoqwkRq--VcUqdBJV0KjMJtpp4bfuvxQhDLmB9io6BEI=w800-h500-k-no',
    slug: 'okiboru-duluth',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Tsukemen', 'Korean Fusion'],
  },
  {
    rank: 6,
    name: 'Kyuramen x TBaar – Duluth',
    rating: 4.4,
    reviewCount: 258,
    address: '3780 Old Norcross Rd #108, Duluth, GA 30096',
    phone: '+1 678-587-5853',
    description: "A unique Duluth hybrid pairing Japanese ramen with Taiwanese bubble tea. Kyuramen's broth is rich and layered, and the boba pairing turns a bowl into a full experience. Vegan-friendly options available.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEJgbkNKCq3ByEWYpqQamVsvKisNW3ZeVCnF1V-OOIdrCmh5ifKgEwt0ZjNtiZEMJYDf5pZqhiRbc5tzcIvekXog21N74zua7S8CblvzfogNBkmWX_3Pa9Wg2n4Bu9cRSOsoQbeKGRaTdyA=w800-h500-k-no',
    slug: 'kyuramen-x-tbaar-duluth',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Vegan Options', 'Bubble Tea', 'Japanese'],
  },
  {
    rank: 7,
    name: 'Raku Tonkatsu Ramen',
    rating: 4.4,
    reviewCount: 844,
    address: '2550 Pleasant Hill Rd #112, Duluth, GA 30096',
    phone: '+1 770-476-1212',
    description: "With 'Tonkatsu' in the name, Raku means business. Nearly 900 reviews at 4.4 stars on Pleasant Hill Rd — the pork broth is rich, the chashu is generous, and the value is hard to beat in Duluth.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH4zUeahYemwrKzJuOIQKTy0b5CnYmRyc-Arl6n8hbJ7iuvJzskomFQHU7vBIAOsqTBc6HCMeJuyfV6UhHLPlVP6CH63rlUZAXfwps-pvgLPt-D3mIYTTkRZSPcz3eUP829ZJ-Z=w800-h500-k-no',
    slug: 'raku-tonkatsu-ramen',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Tonkotsu', 'Japanese', 'Great Value'],
  },
  {
    rank: 8,
    name: 'Kumai Ramen',
    rating: 4.3,
    reviewCount: 299,
    address: '3875 Venture Dr a2, Duluth, GA 30096',
    phone: '+1 470-246-5475',
    description: "A solid neighborhood ramen shop on Venture Dr with nearly 300 reviews and a 4.3 rating. Kumai Ramen keeps it focused — straightforward Japanese ramen done well, in a comfortable, no-frills setting.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE8qetig_DwVNPQgMsQKDtfmlBV0nVeTkaAse4DJ1gvvkMdfTdJnXBV8bgRvQ9iBOpQDQM5A8U01DRHCEQ2fp2Es3hT4k1grbWigAmZZCBDb0FpD8D0NNeSoHFokOOQ8QsfGKww3w=w800-h500-k-no',
    slug: 'kumai-ramen',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Japanese Ramen', 'Casual', 'Neighborhood'],
  },
  {
    rank: 9,
    name: 'Mizumi Ramen & Whisky Bar',
    rating: 4.2,
    reviewCount: 623,
    address: '1611 Satellite Blvd NW Suite 11, Duluth, GA 30097',
    phone: '+1 678-373-3985',
    description: "Over 600 reviews and a whisky bar to boot. Mizumi Ramen brings a lively energy to Satellite Blvd — the ramen is hearty and satisfying, and the whisky selection makes it a natural date night destination.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFkUrY3e-Y8fsiFh5PGfa-QqDjmPBPNBFW6Dxv2X6dysmeXVCrBleyElbEsCzyVwJ4U0zlQabsBzT9eCMZ-f6r_PZudOy7WKOl_2TwTDZabja0HqF6Gw2lGgBOrCdWnp0-2meY=w800-h500-k-no',
    slug: 'mizumi-ramen-whisky-bar',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Ramen', 'Whisky Bar', 'Date Night'],
  },
  {
    rank: 10,
    name: 'K Ramen Cafe',
    rating: 4.5,
    reviewCount: 21,
    address: '2400 Satellite Blvd Ste 112, Duluth, GA 30096',
    phone: '+1 985-212-9287',
    description: "A newer Duluth entry blending Japanese and Korean ramen traditions in a cafe-style setting. Early reviews are strong at 4.5 stars — a hidden gem on Satellite Blvd worth discovering before the crowds find it.",
    photo: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGfaDWUqc7SaGhwIJUqhqV0AeJPYQFpwYJPvx07Lt1hyqHiSzNGQDCDMI9vyNhnP07qwsizs7RyDom-9cYf-NSnn_kkylAeFFY7iTQOZR1TrxHWYWy1KAEbqlGsv7SSTQ37oQOufdLgnjDA=w800-h500-k-no',
    slug: 'k-ramen-cafe',
    citySlug: 'duluth',
    stateSlug: 'ga',
    tags: ['Korean-Japanese', 'Cafe', 'Hidden Gem'],
  },
]

blogPosts.push(
  {
    slug: 'vegan-ramen-atlanta',
    title: 'Best Vegan Ramen in Atlanta — Top 10 Plant-Based Bowls',
    description: 'Looking for the best vegan ramen in Atlanta? These 10 restaurants serve Atlanta\'s top plant-based bowls — rich broths, housemade noodles, and zero compromise on flavor.',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>Finding great <strong>vegan ramen in Atlanta</strong> used to mean settling — a bland vegetable broth dressed up with tofu and hoping for the best. That era is over. Atlanta's ramen scene has evolved to the point where some of the city's best bowls happen to be fully plant-based. The restaurants below don't just accommodate vegan diners — they've built menus where the vegan option can stand alongside (and sometimes outshine) the pork-based originals. Ranked by Google rating, review volume, and dedication to plant-based craft.</p>`,
    restaurantCards: veganAtlantaTop10,
    outroContent: `<h2>The Best Vegan Ramen in Atlanta: What to Know</h2><p>Atlanta's best vegan ramen comes from spots that treat the plant-based bowl as a menu priority, not an afterthought. Start at Okiboru for the city's most technically precise vegan broth, hit JINYA Buckhead when you want reliability at scale, and work through Midtown's dense cluster of options — Kin NoTori, E Ramen+, and Nagomiya are all within blocks of each other. Whether you're fully vegan, vegetarian, or just curious, every restaurant on this list is worth the trip.</p>`,
  },
  {
    slug: 'tonkotsu-ramen-atlanta',
    title: 'Best Tonkotsu Ramen in Atlanta — Top 10 Restaurants',
    description: 'Searching for the best tonkotsu ramen in Atlanta? These 10 spots serve the city\'s richest pork bone broths — from Buckhead to East Atlanta Village, ranked by rating and review count.',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>If you're hunting for the best <strong>tonkotsu ramen in Atlanta</strong>, you're chasing the king of broth styles — rich, cloudy pork bone soup simmered for 12 to 18 hours until every bit of collagen and fat emulsifies into something unctuous, savory, and completely irreplaceable. Atlanta has more serious tonkotsu options than most Southern cities, spread across Midtown, Buckhead, Westside, and East Atlanta Village. Below are the 10 best spots, ranked by Google rating, review volume, and broth quality.</p>`,
    restaurantCards: tonkotsuAtlantaTop10,
    outroContent: `<h2>Where to Find the Best Tonkotsu Ramen in Atlanta</h2><p>Atlanta's tonkotsu scene is anchored by Okiboru (the most technically precise broth in the city), JINYA (the most consistent at scale), and a growing crop of independent shops like TENSAN and Kin NoTori pushing the standard higher. For tonkotsu specifically, Wagaya Westside and E Ramen+ are the neighborhood standouts. Wherever you land, Atlanta's tonkotsu game is strong — and getting stronger every year.</p>`,
  },
  {
    slug: 'ramen-duluth-ga',
    title: 'Best Ramen in Duluth, GA — Top 10 Restaurants',
    description: 'Looking for the best ramen in Duluth, GA? These 10 spots serve Gwinnett County\'s top-rated bowls — from Korean ramyun to classic Japanese tonkotsu, ranked by rating and reviews.',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'City Guides',
    content: `<p>Duluth, GA has quietly become one of the best places in the South to eat <strong>ramen in Duluth, GA</strong>. Gwinnett County's dense Asian-American community has driven a ramen scene that punches well above its weight — with standout Korean ramyun, authentic Japanese tonkotsu, and creative fusion spots all within a few miles of each other on Satellite Blvd, Pleasant Hill Rd, and beyond. Here are the 10 best ramen restaurants in Duluth, ranked by Google rating and review count.</p>`,
    restaurantCards: duluthTop10,
    outroContent: `<h2>The Best Ramen in Duluth, GA: Final Word</h2><p>Duluth's ramen scene rewards exploration. Start with Ramyun Gallery for the city's highest-rated bowl, visit Umai Ramen for authentic Japanese craft, and don't overlook RINOO's rising star status. For sheer review volume and consistency, JINYA Duluth and Raku Tonkatsu Ramen are the safe bets. Duluth's proximity to Atlanta and its own strong Korean and Japanese dining culture make it one of Georgia's best ramen destinations — and the restaurants on this list prove it.</p>`,
  }
)

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
