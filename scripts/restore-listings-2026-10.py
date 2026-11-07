#!/usr/bin/env python3
"""One-off migration (Oct 2026): bring retired dataset listings back and fix
Hawaii's state slug. Idempotent; rerun is a no-op.

1. Un-retires every listing path in scripts/data/restored-listings-2026-10.csv
   (open, ramen/noodle, >=5 reviews, rating >=3) by deleting it from
   lib/retired-pages.json `redirects`. The listings were never removed from
   lib/restaurants.json, only left out of the build.
2. Un-retires the /find/{city}-{st} page of every city that hosts a restored
   listing (cities with 2+ dataset listings, i.e. in getFindCityParams()), so
   restored listings are linked from a live city page.
3. Hawaii: dataset rows used stateSlug "hi" instead of "hawaii" (every other
   state uses the full-name slug, and /find, state and supplement pages all
   resolve HI to "hawaii"). Rewrites restaurants.json and the retired map.
   vercel.json 308s /hi and /{city}/hi/{listing} to the new URLs.
4. Points still-retired listings at their city page when it's now live, and
   collapses redirect chains so every target is a live page.

    python3 scripts/restore-listings-2026-10.py
    npx tsx --tsconfig tsconfig.json scripts/generate-vercel-json.ts
"""
import csv, json, os, re, collections

ROOT = os.path.join(os.path.dirname(__file__), '..')
P = lambda *a: os.path.join(ROOT, *a)

# --- restaurants.json: Hawaii slug (string-level edit keeps the file byte-identical otherwise)
rpath = P('lib', 'restaurants.json')
raw = open(rpath, encoding='utf8').read()
n_hi = raw.count('"stateSlug": "hi"')
raw = raw.replace('"stateSlug": "hi"', '"stateSlug": "hawaii"')
open(rpath, 'w', encoding='utf8').write(raw)
restaurants = json.loads(raw)

def fix_hi(p):
    if p == '/hi':
        return '/hawaii'
    p = re.sub(r'^/(tonkotsu|miso|spicy|vegan)/([^/]+)/hi$', r'/\1/\2/hawaii', p)
    return re.sub(r'^/([^/]+)/hi(/|$)', r'/\1/hawaii\2', p)

# --- retired map
tpath = P('lib', 'retired-pages.json')
data = json.load(open(tpath, encoding='utf8'))
red = {fix_hi(k): fix_hi(v) for k, v in data['redirects'].items()}
before = len(red)

restore = [fix_hi(r['path']) for r in csv.DictReader(open(P('scripts', 'data', 'restored-listings-2026-10.csv'), encoding='utf8'))]
by_path = {f"/{r['citySlug']}/{r['stateSlug']}/{r['slug']}": r for r in restaurants}
missing = [p for p in restore if p not in by_path]
assert not missing, f'not in restaurants.json: {missing[:5]}'
for p in restore:
    red.pop(p, None)

city_count = collections.Counter((r['citySlug'], r['stateSlug']) for r in restaurants)
find_of = lambda r: f"/find/{r['citySlug']}-{r['stateCode'].lower()}"
find_restored = 0
for p in restore:
    r = by_path[p]
    if city_count[(r['citySlug'], r['stateSlug'])] >= 2 and red.pop(find_of(r), None) is not None:
        find_restored += 1

# Still-retired dataset listings: prefer their (now live) city page.
retarget = 0
for k, v in list(red.items()):
    r = by_path.get(k)
    if r and v != find_of(r) and find_of(r) not in red and city_count[(r['citySlug'], r['stateSlug'])] >= 2:
        red[k] = find_of(r)
        retarget += 1

# Collapse chains (target that is itself retired).
def final(v, seen=()):
    return final(red[v], seen + (v,)) if v in red and v not in seen else v
chains = 0
for k, v in list(red.items()):
    f = final(v)
    if f != v:
        red[k] = f
        chains += 1
red = {k: v for k, v in red.items() if k != v}

data['redirects'] = dict(sorted(red.items()))
open(tpath, 'w', encoding='utf8').write(json.dumps(data, separators=(',', ':'), ensure_ascii=False) + '\n')
print(f'HI rows re-slugged: {n_hi}')
print(f'retired before: {before}, listings restored: {len(restore)}, /find city pages restored: {find_restored}')
print(f'retargeted to live city page: {retarget}, chains collapsed: {chains}, retired now: {len(red)}')
