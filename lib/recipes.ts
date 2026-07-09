export interface RecipeIngredient {
  amount: string  // e.g. "1" — scaled/converted client-side against baseServings
  unit: string     // e.g. "tablespoon", "cup" — shown as-is, pluralized client-side
  metricAmount?: string // e.g. "15" for the Metric unit toggle
  metricUnit?: string   // e.g. "ml"
  item: string     // e.g. "sesame oil"
  note?: string     // e.g. "I used chicken, but vegetable would also work"
}

export interface RecipeStep {
  text: string
}

export interface NutritionFacts {
  calories: number
  protein: string
  carbs: string
  fat: string
  fiber: string
  sugar: string
  sodium: string
}

export interface Recipe {
  slug: string
  title: string           // page H1 / title tag
  cardTitle: string        // shorter title shown on the printable card
  description: string
  image: string
  rating: number
  reviewCount: number
  prepTime: string
  cookTime: string
  totalTime: string
  baseServings: number
  servingsLabel: string    // e.g. "heaping 1-cup servings"
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  whatToAdd: { title: string; text: string }[]
  nutrition: NutritionFacts
  category: string
  date: string
}

export const RECIPES: Recipe[] = [
  {
    slug: 'quick-homemade-ramen',
    title: 'Quick Homemade Ramen Recipe',
    cardTitle: 'Quick Homemade Ramen',
    description:
      "Take instant ramen up a notch — or skip it entirely. This quick homemade ramen builds a genuinely savory broth from pantry staples in about 25 minutes, then lets you load it up with whatever fresh veggies, herbs, and toppings you have on hand. It's the easy weeknight version of a bowl that usually takes all day.",
    image: '/images/hero-ramen.jpg',
    rating: 4.4,
    reviewCount: 118,
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    totalTime: '25 minutes',
    baseServings: 4,
    servingsLabel: 'heaping 1-cup servings',
    ingredients: [
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'sesame oil' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated ginger' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated garlic' },
      { amount: '4', unit: 'cups', metricAmount: '950', metricUnit: 'ml', item: 'broth', note: 'chicken, vegetable, or dashi all work' },
      { amount: '2', unit: 'cups', metricAmount: '475', metricUnit: 'ml', item: 'water' },
      { amount: '3', unit: 'tablespoons', metricAmount: '45', metricUnit: 'ml', item: 'soy sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'mirin' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'g', item: 'white miso paste' },
      { amount: '8', unit: 'ounces', metricAmount: '225', metricUnit: 'g', item: 'ramen noodles', note: 'fresh or dried; instant noodle bricks work in a pinch' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'soft-boiled eggs, halved' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'scallions, thinly sliced' },
      { amount: '1', unit: 'sheet', metricAmount: '1', metricUnit: 'sheet', item: 'nori, cut into strips' },
      { amount: '1', unit: 'teaspoon', metricAmount: '5', metricUnit: 'ml', item: 'chili oil', note: 'optional, for heat' },
    ],
    steps: [
      { text: 'Warm the sesame oil in a pot over medium heat. Add the grated ginger and garlic and sauté for about 90 seconds, until fragrant — don\'t let the garlic brown.' },
      { text: 'Pour in the broth and water. Bring to a gentle simmer.' },
      { text: 'Stir in the soy sauce and mirin. Whisk the miso paste with a splash of the hot broth in a small bowl until smooth, then stir it back into the pot — this keeps the miso from clumping.' },
      { text: 'Let the broth simmer for 10 minutes so the flavors come together, tasting and adjusting the soy sauce or miso as needed.' },
      { text: 'While the broth simmers, cook the ramen noodles separately according to the package instructions, then drain.' },
      { text: 'Warm your serving bowls with hot water for a minute, then dump it out — a warm bowl keeps the ramen hotter longer.' },
      { text: 'Divide the noodles among the bowls, ladle the hot broth over top, and arrange the egg, scallions, and nori neatly on top. Finish with chili oil if using, and serve immediately.' },
    ],
    whatToAdd: [
      { title: 'Protein', text: 'Sliced chashu pork, leftover rotisserie chicken, seared tofu, or shrimp all work well simmered briefly in the broth or added just before serving.' },
      { title: 'Vegetables', text: 'Baby bok choy, corn, bean sprouts, mushrooms, and spinach are classic additions — add heartier vegetables to the simmering broth in the last few minutes so they soften.' },
      { title: 'More heat', text: 'A spoonful of gochujang or extra chili oil turns this into a spicy miso-style bowl.' },
      { title: 'Richness', text: 'A pat of butter or a drizzle of chili crisp stirred in right before serving adds the kind of richness you\'d get from a longer-simmered broth.' },
    ],
    nutrition: {
      calories: 420,
      protein: '18g',
      carbs: '52g',
      fat: '14g',
      fiber: '3g',
      sugar: '4g',
      sodium: '1450mg',
    },
    category: 'Recipes',
    date: 'July 9, 2026',
  },
  {
    slug: 'homemade-chicken-ramen',
    title: 'Homemade Chicken Ramen Recipe',
    cardTitle: 'Homemade Chicken Ramen',
    description:
      "This homemade chicken ramen builds a deeply savory, golden broth by simmering bone-in chicken thighs right in the pot — no separate stock-making required. Shredded chicken, a soft-boiled egg, and a tangle of noodles make this a complete, comforting bowl in under an hour.",
    image: '/images/hero-ramen.jpg',
    rating: 4.6,
    reviewCount: 94,
    prepTime: '10 minutes',
    cookTime: '40 minutes',
    totalTime: '50 minutes',
    baseServings: 4,
    servingsLabel: 'heaping 1-cup servings',
    ingredients: [
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'vegetable oil' },
      { amount: '1.5', unit: 'lbs', metricAmount: '680', metricUnit: 'g', item: 'bone-in, skin-on chicken thighs' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated ginger' },
      { amount: '3', unit: 'cloves', metricAmount: '3', metricUnit: 'cloves', item: 'garlic, smashed' },
      { amount: '6', unit: 'cups', metricAmount: '1420', metricUnit: 'ml', item: 'chicken stock' },
      { amount: '3', unit: 'tablespoons', metricAmount: '45', metricUnit: 'ml', item: 'soy sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'mirin' },
      { amount: '1', unit: 'teaspoon', metricAmount: '5', metricUnit: 'ml', item: 'rice vinegar' },
      { amount: '8', unit: 'ounces', metricAmount: '225', metricUnit: 'g', item: 'ramen noodles' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'soft-boiled eggs, halved' },
      { amount: '1', unit: 'cup', metricAmount: '150', metricUnit: 'g', item: 'corn kernels' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'scallions, thinly sliced' },
    ],
    steps: [
      { text: 'Heat the oil in a large pot over medium-high heat. Season the chicken thighs with salt and sear skin-side down for 4–5 minutes, until golden. Flip and sear another 2 minutes.' },
      { text: 'Add the ginger and garlic and sauté for 30 seconds, until fragrant.' },
      { text: 'Pour in the chicken stock, scraping up any browned bits from the bottom of the pot. Bring to a boil, then reduce to a simmer.' },
      { text: 'Cover and simmer for 30 minutes, until the chicken is cooked through and easily shreds with a fork.' },
      { text: 'Remove the chicken, shred the meat off the bone, and discard the skin and bones. Set the shredded chicken aside.' },
      { text: 'Stir the soy sauce, mirin, and rice vinegar into the broth. Taste and adjust seasoning.' },
      { text: 'Cook the ramen noodles separately according to the package instructions, then drain.' },
      { text: 'Divide the noodles among bowls, ladle the hot broth over top, and top with the shredded chicken, egg, corn, and scallions.' },
    ],
    whatToAdd: [
      { title: 'Extra umami', text: 'A spoonful of miso paste whisked into the broth adds depth without changing the chicken-forward flavor.' },
      { title: 'Vegetables', text: 'Baby bok choy, mushrooms, and bean sprouts all simmer well in the last few minutes of cooking.' },
      { title: 'Heat', text: 'Chili oil or a spoonful of chili crisp on top brings a spicy contrast to the mild broth.' },
      { title: 'Crunch', text: 'Toasted sesame seeds or crispy fried shallots add texture right before serving.' },
    ],
    nutrition: {
      calories: 480,
      protein: '32g',
      carbs: '48g',
      fat: '17g',
      fiber: '2g',
      sugar: '5g',
      sodium: '1380mg',
    },
    category: 'Recipes',
    date: 'July 9, 2026',
  },
  {
    slug: 'homemade-beef-ramen',
    title: 'Homemade Beef Ramen Recipe',
    cardTitle: 'Homemade Beef Ramen',
    description:
      "This homemade beef ramen leans on seared beef and a soy-and-beef-broth base for a rich, restaurant-style bowl at home. Thin-sliced beef cooks in minutes right in the hot broth, so it stays tender instead of overcooked.",
    image: '/images/hero-ramen.jpg',
    rating: 4.5,
    reviewCount: 76,
    prepTime: '15 minutes',
    cookTime: '30 minutes',
    totalTime: '45 minutes',
    baseServings: 4,
    servingsLabel: 'heaping 1-cup servings',
    ingredients: [
      { amount: '1', unit: 'lb', metricAmount: '450', metricUnit: 'g', item: 'thin-sliced beef sirloin or ribeye', note: 'freeze 20 minutes first for easier slicing' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'vegetable oil' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated ginger' },
      { amount: '3', unit: 'cloves', metricAmount: '3', metricUnit: 'cloves', item: 'garlic, minced' },
      { amount: '6', unit: 'cups', metricAmount: '1420', metricUnit: 'ml', item: 'beef stock' },
      { amount: '3', unit: 'tablespoons', metricAmount: '45', metricUnit: 'ml', item: 'soy sauce' },
      { amount: '2', unit: 'tablespoons', metricAmount: '30', metricUnit: 'ml', item: 'oyster sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'mirin' },
      { amount: '1', unit: 'teaspoon', metricAmount: '5', metricUnit: 'g', item: 'brown sugar' },
      { amount: '8', unit: 'ounces', metricAmount: '225', metricUnit: 'g', item: 'ramen noodles' },
      { amount: '1', unit: 'cup', metricAmount: '100', metricUnit: 'g', item: 'shiitake mushrooms, sliced' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'scallions, thinly sliced' },
      { amount: '1', unit: 'teaspoon', metricAmount: '5', metricUnit: 'ml', item: 'sesame oil, for finishing' },
    ],
    steps: [
      { text: 'Pat the beef dry and season lightly with salt and pepper. Heat the oil in a large pot over high heat and sear the beef in batches for 30–45 seconds per side, until browned but still rare in the center. Remove and set aside.' },
      { text: 'Reduce heat to medium. Add the ginger and garlic to the same pot and sauté 30 seconds, scraping up the browned bits.' },
      { text: 'Pour in the beef stock, soy sauce, oyster sauce, mirin, and brown sugar. Bring to a simmer.' },
      { text: 'Add the sliced mushrooms and simmer for 10 minutes to build flavor.' },
      { text: 'Meanwhile, cook the ramen noodles separately according to the package instructions, then drain.' },
      { text: 'Return the seared beef (and any resting juices) to the pot just long enough to warm through, about 1 minute — don\'t let it overcook.' },
      { text: 'Divide the noodles among bowls, ladle the broth, beef, and mushrooms over top, drizzle with sesame oil, and top with scallions.' },
    ],
    whatToAdd: [
      { title: 'Vegetables', text: 'Bok choy, napa cabbage, or bean sprouts add crunch and balance the richness of the beef broth.' },
      { title: 'Egg', text: 'A soft-boiled or fried egg on top adds richness and turns this into an even heartier meal.' },
      { title: 'Heat', text: 'A drizzle of chili oil or a spoonful of gochujang gives the broth a spicy kick that pairs well with beef.' },
      { title: 'Extra richness', text: 'A small pat of butter stirred into the broth at the end adds a silky, restaurant-style finish.' },
    ],
    nutrition: {
      calories: 510,
      protein: '34g',
      carbs: '46g',
      fat: '19g',
      fiber: '2g',
      sugar: '6g',
      sodium: '1520mg',
    },
    category: 'Recipes',
    date: 'July 9, 2026',
  },
  {
    slug: 'homemade-shrimp-ramen',
    title: 'Homemade Shrimp Ramen Recipe',
    cardTitle: 'Homemade Shrimp Ramen',
    description:
      "This homemade shrimp ramen uses the shrimp shells to build a quick, seafood-forward broth, then finishes with the shrimp themselves cooked just until pink and tender. It's a lighter, faster take on ramen that's ready in about 35 minutes.",
    image: '/images/hero-ramen.jpg',
    rating: 4.3,
    reviewCount: 61,
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    totalTime: '35 minutes',
    baseServings: 4,
    servingsLabel: 'heaping 1-cup servings',
    ingredients: [
      { amount: '1', unit: 'lb', metricAmount: '450', metricUnit: 'g', item: 'large shrimp, peeled and deveined', note: 'reserve the shells' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'sesame oil' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated ginger' },
      { amount: '2', unit: 'cloves', metricAmount: '2', metricUnit: 'cloves', item: 'garlic, minced' },
      { amount: '5', unit: 'cups', metricAmount: '1180', metricUnit: 'ml', item: 'seafood or chicken stock' },
      { amount: '2', unit: 'tablespoons', metricAmount: '30', metricUnit: 'ml', item: 'soy sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'fish sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'g', item: 'white miso paste' },
      { amount: '8', unit: 'ounces', metricAmount: '225', metricUnit: 'g', item: 'ramen noodles' },
      { amount: '1', unit: 'cup', metricAmount: '100', metricUnit: 'g', item: 'baby bok choy, halved' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'scallions, thinly sliced' },
      { amount: '1', unit: 'teaspoon', metricAmount: '5', metricUnit: 'ml', item: 'chili oil', note: 'optional' },
    ],
    steps: [
      { text: 'Heat the sesame oil in a pot over medium heat. Add the reserved shrimp shells and toast for 2–3 minutes, stirring, until fragrant and pink.' },
      { text: 'Add the ginger and garlic and sauté 30 seconds.' },
      { text: 'Pour in the stock and bring to a simmer. Let it simmer for 10 minutes to infuse with the shrimp shells, then strain out the shells and return the broth to the pot.' },
      { text: 'Stir the soy sauce and fish sauce into the broth. Whisk the miso with a splash of hot broth until smooth, then stir it back in.' },
      { text: 'Add the bok choy and simmer 2 minutes, then add the shrimp and cook for 2–3 minutes, just until pink and opaque — don\'t overcook.' },
      { text: 'Meanwhile, cook the ramen noodles separately according to the package instructions, then drain.' },
      { text: 'Divide the noodles among bowls, ladle the broth, shrimp, and bok choy over top, and finish with scallions and chili oil if using.' },
    ],
    whatToAdd: [
      { title: 'Extra seafood', text: 'Scallops or thin slices of fish fillet cook well alongside the shrimp for a fuller seafood bowl.' },
      { title: 'Vegetables', text: 'Corn, mushrooms, and bean sprouts all work well and add texture.' },
      { title: 'Richness', text: 'A soft-boiled egg or a small drizzle of coconut milk gives the broth a rounder, richer finish.' },
      { title: 'Heat', text: 'Sriracha or chili crisp stirred in at the table lets everyone adjust the spice to taste.' },
    ],
    nutrition: {
      calories: 380,
      protein: '28g',
      carbs: '44g',
      fat: '9g',
      fiber: '2g',
      sugar: '3g',
      sodium: '1390mg',
    },
    category: 'Recipes',
    date: 'July 9, 2026',
  },
  {
    slug: 'homemade-creamy-chicken-ramen',
    title: 'Homemade Creamy Chicken Ramen Recipe',
    cardTitle: 'Homemade Creamy Chicken Ramen',
    description:
      "This creamy chicken ramen gets its silky, tonkotsu-style body from simmered chicken and a splash of milk — a shortcut for the rich, opaque broth that usually takes 12+ hours to make from pork bones. It's indulgent, cozy, and ready well within a weeknight.",
    image: '/images/hero-ramen.jpg',
    rating: 4.7,
    reviewCount: 103,
    prepTime: '10 minutes',
    cookTime: '45 minutes',
    totalTime: '55 minutes',
    baseServings: 4,
    servingsLabel: 'heaping 1-cup servings',
    ingredients: [
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'butter' },
      { amount: '1.5', unit: 'lbs', metricAmount: '680', metricUnit: 'g', item: 'boneless, skinless chicken thighs' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'grated ginger' },
      { amount: '3', unit: 'cloves', metricAmount: '3', metricUnit: 'cloves', item: 'garlic, minced' },
      { amount: '5', unit: 'cups', metricAmount: '1180', metricUnit: 'ml', item: 'chicken stock' },
      { amount: '1', unit: 'cup', metricAmount: '240', metricUnit: 'ml', item: 'whole milk' },
      { amount: '2', unit: 'tablespoons', metricAmount: '30', metricUnit: 'g', item: 'white miso paste' },
      { amount: '2', unit: 'tablespoons', metricAmount: '30', metricUnit: 'ml', item: 'soy sauce' },
      { amount: '1', unit: 'tablespoon', metricAmount: '15', metricUnit: 'ml', item: 'sesame paste (tahini works too)' },
      { amount: '8', unit: 'ounces', metricAmount: '225', metricUnit: 'g', item: 'ramen noodles' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'soft-boiled eggs, halved' },
      { amount: '1', unit: 'cup', metricAmount: '150', metricUnit: 'g', item: 'corn kernels' },
      { amount: '2', unit: '', metricAmount: '2', metricUnit: '', item: 'scallions, thinly sliced' },
    ],
    steps: [
      { text: 'Melt the butter in a pot over medium heat. Add the chicken thighs and cook for 5–6 minutes per side, until golden and cooked through. Remove and set aside.' },
      { text: 'Add the ginger and garlic to the same pot and sauté 30 seconds, scraping up the browned bits.' },
      { text: 'Pour in the chicken stock and bring to a simmer. Let it simmer for 20 minutes to concentrate the flavor.' },
      { text: 'Stir in the milk, then whisk in the miso paste, soy sauce, and sesame paste until fully dissolved — this is what gives the broth its silky, opaque body.' },
      { text: 'Simmer gently for another 5 minutes; don\'t let it come to a hard boil once the milk is in, or it can separate.' },
      { text: 'Slice the cooked chicken while the broth finishes simmering.' },
      { text: 'Cook the ramen noodles separately according to the package instructions, then drain.' },
      { text: 'Divide the noodles among bowls, ladle the creamy broth over top, and arrange the sliced chicken, egg, corn, and scallions on top.' },
    ],
    whatToAdd: [
      { title: 'Extra creaminess', text: 'A drizzle of coconut milk or an extra spoonful of sesame paste makes the broth even richer.' },
      { title: 'Heat', text: 'Chili oil or a spoonful of gochujang cuts through the richness nicely.' },
      { title: 'Vegetables', text: 'Spinach or bean sprouts added at the end add freshness against the creamy broth.' },
      { title: 'Crunch', text: 'Toasted sesame seeds or crushed peanuts on top add texture.' },
    ],
    nutrition: {
      calories: 560,
      protein: '33g',
      carbs: '50g',
      fat: '24g',
      fiber: '2g',
      sugar: '7g',
      sodium: '1460mg',
    },
    category: 'Recipes',
    date: 'July 9, 2026',
  },
]

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug)
}

export function getAllRecipes(): Recipe[] {
  return RECIPES
}
