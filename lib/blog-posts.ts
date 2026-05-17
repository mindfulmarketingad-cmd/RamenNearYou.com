export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: string
}

export const blogPosts: BlogPost[] = [
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
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
