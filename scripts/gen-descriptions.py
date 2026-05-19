import json, re, random

random.seed(42)

with open('lib/restaurants.ts') as f:
    raw = f.read()

# Extract the JSON array from the TS file by finding the array start and matching brackets
start = raw.index('export const restaurants: Restaurant[] = [') + len('export const restaurants: Restaurant[] = ')
depth = 0
end = start
for i, ch in enumerate(raw[start:], start):
    if ch == '[': depth += 1
    elif ch == ']':
        depth -= 1
        if depth == 0:
            end = i + 1
            break

data_str = raw[start:end]
# Convert TS to valid JSON (remove trailing commas before ] or })
data_str = re.sub(r',\s*([}\]])', r'\1', data_str)
restaurants = json.loads(data_str)

BROTH_MAP = [
    (['tonkotsu'], 'rich tonkotsu broth'),
    (['tsukemen'], 'dipping-style tsukemen noodles'),
    (['miso'], 'hearty miso ramen'),
    (['shoyu'], 'classic shoyu ramen'),
    (['shio'], 'delicate shio broth'),
    (['tori paitan', 'chicken broth'], 'creamy tori paitan'),
    (['spicy'], 'bold spicy ramen'),
]

SUBTYPE_WORDS = {
    'japanese': 'Japanese', 'korean': 'Korean', 'asian': 'Asian',
    'noodle': 'noodle', 'bar': 'ramen bar', 'fusion': 'fusion',
}

RATING_ADJ = {
    (4.7, 5.1): ['one of the top-rated', 'a standout', 'a highly acclaimed', 'a celebrated'],
    (4.4, 4.7): ['a well-loved', 'a consistently praised', 'a fan-favorite', 'a popular'],
    (4.0, 4.4): ['a well-regarded', 'a solid', 'a reliable', 'a go-to'],
    (0,   4.0): ['a neighborhood', 'a local', 'a casual', 'a friendly'],
}

PRICE_DESC = {
    '$':    'budget-friendly',
    '$$':   'moderately priced',
    '$$$':  'upscale',
    '$$$$': 'premium',
}

def rating_adj(rating):
    if rating is None:
        return random.choice(['a local', 'a neighborhood', 'a popular'])
    for (lo, hi), adjs in RATING_ADJ.items():
        if lo <= rating < hi:
            return random.choice(adjs)
    return 'a local'

def detect_broth(r):
    text = (r['name'] + ' ' + r.get('description', '') + ' ' + r.get('subtypes', '')).lower()
    for keywords, label in BROTH_MAP:
        if any(k in text for k in keywords):
            return label
    return None

def detect_type(r):
    st = r.get('subtypes', '').lower()
    for k, v in SUBTYPE_WORDS.items():
        if k in st:
            return v
    return 'ramen'

def amenity_highlights(r):
    a = r.get('amenities', {})
    highlights = []
    if a.get('veganOptions'): highlights.append('vegan-friendly options')
    if a.get('alcohol'): highlights.append('a curated sake and cocktail menu')
    if a.get('outdoorSeating'): highlights.append('outdoor seating')
    if a.get('acceptsReservations'): highlights.append('reservations')
    if a.get('delivery'): highlights.append('delivery')
    return highlights

TEMPLATES = [
    # 0
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        f"{adj.capitalize()} {rtype} spot in {city} "
        + (f"known for its {broth}. " if broth else "serving a rotating menu of ramen styles. ")
        + (f"Offers {feats[0]} and {feats[1]}." if len(feats) >= 2 else (f"Offers {feats[0]}." if feats else ""))
    ).strip(),
    # 1
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        f"{name} is {adj} {rtype} restaurant in {city} "
        + (f"specializing in {broth}. " if broth else "with a menu of classic and creative ramen bowls. ")
        + (f"Known for {feats[0]}." if feats else "A welcoming spot for ramen lovers of all levels.")
    ).strip(),
    # 2
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        (f"{price.capitalize()} {rtype} destination in {city} " if price else f"A {rtype} destination in {city} ")
        + (f"serving {broth} and other Japanese favorites. " if broth else "offering a wide selection of ramen styles. ")
        + (f"Features {feats[0]}." if feats else "Perfect for a warming bowl any time of day.")
    ).strip(),
    # 3
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        f"A {rtype} destination in {city} "
        + (f"celebrated for its {broth}. " if broth else "with a menu built around comfort and flavor. ")
        + (f"Guests enjoy {feats[0]}" + (f" and {feats[1]}" if len(feats) >= 2 else "") + "." if feats
           else f"Rated {rating:.1f} stars by the local ramen community." if rating else "")
    ).strip(),
    # 4
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        f"Tucked into {city}, {name} is {adj} {rtype} shop "
        + (f"with a focus on {broth}. " if broth else "offering a satisfying lineup of noodle bowls. ")
        + (f"Highlights include {feats[0]}." if feats else "A must-try for anyone exploring the local ramen scene.")
    ).strip(),
    # 5
    lambda name, city, broth, rtype, adj, price, feats, rating: (
        (f"With {rating:.1f} stars, " if rating and rating >= 4.2 else "")
        + f"{name} stands out as {adj} {rtype} spot in {city} "
        + (f"prized for its {broth}. " if broth else "delivering consistently satisfying ramen. ")
        + (f"Come for {feats[0]}" + (f", stay for {feats[1]}" if len(feats) >= 2 else "") + "." if feats else "")
    ).strip(),
]

def generate_description(r):
    name   = r['name']
    city   = r['city']
    broth  = detect_broth(r)
    rtype  = detect_type(r)
    adj    = rating_adj(r.get('rating'))
    price  = PRICE_DESC.get(r.get('priceRange', ''), '')
    feats  = amenity_highlights(r)
    rating = r.get('rating')

    # Pick a template deterministically but varied based on name hash
    tidx = hash(name) % len(TEMPLATES)
    desc = TEMPLATES[tidx](name, city, broth, rtype, adj, price, feats, rating)
    # Clean up double spaces and trailing punctuation issues
    desc = re.sub(r'  +', ' ', desc).strip()
    if desc and desc[-1] not in '.!?':
        desc += '.'
    return desc

updated = 0
for r in restaurants:
    if not r.get('description', '').strip():
        r['description'] = generate_description(r)
        updated += 1

print(f"Generated {updated} descriptions")
print("\nSample outputs:")
for r in random.sample([x for x in restaurants if x.get('description')], 8):
    print(f"  {r['name']}: {r['description']}")

# Write back to restaurants.ts — replace just the description fields for blank ones
result = raw

for r in restaurants:
    slug = r['slug']
    desc = r['description']
    # Find the restaurant block by slug and replace empty description
    # Pattern: "slug": "{slug}" ... "description": ""
    pattern = rf'("slug":\s*"{re.escape(slug)}".*?"description":\s*)"([^"]*)"'

    def replacer(m, desc=desc):
        current = m.group(2)
        if current.strip():
            return m.group(0)  # already has description, skip
        return m.group(1) + '"' + desc.replace('"', '\\"') + '"'

    result = re.sub(pattern, replacer, result, count=1, flags=re.DOTALL)

with open('lib/restaurants.ts', 'w') as f:
    f.write(result)

print(f"\n✓ Wrote {updated} descriptions to lib/restaurants.ts")
