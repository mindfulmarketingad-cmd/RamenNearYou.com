#!/usr/bin/env python3
"""
Import ramen restaurants from Google Places API for Kansas cities.

Usage:
  pip install requests
  PLACES_API_KEY=your_key python3 scripts/import-kansas-ramen.py

The script will:
  1. Query Google Places Text Search for ramen in each Kansas city
  2. Fetch full Place Details for each result
  3. Output new restaurant records ready to append to lib/restaurants.json
  4. Skip any restaurant already in restaurants.json (by placeId)

After running, copy the output JSON into lib/restaurants.json and redeploy.
"""

import json
import os
import re
import sys
import time
import requests

API_KEY = os.environ.get("PLACES_API_KEY", "")
if not API_KEY:
    print("ERROR: Set PLACES_API_KEY environment variable", file=sys.stderr)
    sys.exit(1)

KANSAS_CITIES = [
    ("Wichita", "KS"),
    ("Kansas City", "KS"),
    ("Overland Park", "KS"),
    ("Olathe", "KS"),
    ("Topeka", "KS"),
    ("Lawrence", "KS"),
    ("Shawnee", "KS"),
    ("Manhattan", "KS"),
    ("Lenexa", "KS"),
    ("Salina", "KS"),
    ("Hutchinson", "KS"),
    ("Leavenworth", "KS"),
    ("Leawood", "KS"),
    ("Garden City", "KS"),
    ("Prairie Village", "KS"),
]

PLACES_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

DETAIL_FIELDS = ",".join([
    "place_id", "name", "formatted_address", "formatted_phone_number",
    "website", "rating", "user_ratings_total", "price_level",
    "geometry/location", "business_status", "opening_hours",
    "photos", "types", "url",
])

DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def price_level_to_range(level) -> str:
    return {0: "$", 1: "$", 2: "$$", 3: "$$$", 4: "$$$$"}.get(level, "")


def parse_hours(opening_hours: dict) -> dict:
    result = {}
    if not opening_hours:
        return result
    for period in opening_hours.get("periods", []):
        open_info = period.get("open", {})
        close_info = period.get("close", {})
        day_idx = open_info.get("day")
        if day_idx is None:
            continue
        day_name = DAY_NAMES[day_idx]
        open_time = open_info.get("time", "")
        close_time = close_info.get("time", "") if close_info else ""
        if not open_time:
            continue
        def fmt(t):
            t = t.zfill(4)
            h, m = int(t[:2]), int(t[2:])
            suffix = "AM" if h < 12 else "PM"
            h = h % 12 or 12
            return f"{h}:{m:02d}{suffix}" if m else f"{h}{suffix}"
        slot = f"{fmt(open_time)}-{fmt(close_time)}" if close_time else fmt(open_time)
        result.setdefault(day_name, []).append(slot)

    # Mark closed days
    for day in DAY_NAMES:
        if day not in result:
            result[day] = ["Closed"]

    return result


def search_ramen(city: str, state: str) -> list:
    query = f"ramen restaurant {city} {state}"
    results = []
    params = {"query": query, "key": API_KEY, "type": "restaurant"}
    while True:
        resp = requests.get(PLACES_SEARCH_URL, params=params, timeout=15)
        data = resp.json()
        results.extend(data.get("results", []))
        next_token = data.get("next_page_token")
        if not next_token:
            break
        time.sleep(2)
        params = {"pagetoken": next_token, "key": API_KEY}
    return results


def get_details(place_id: str) -> dict:
    resp = requests.get(PLACES_DETAILS_URL, params={
        "place_id": place_id,
        "fields": DETAIL_FIELDS,
        "key": API_KEY,
    }, timeout=15)
    return resp.json().get("result", {})


def build_record(detail: dict, city_name: str, state_name: str = "Kansas", state_code: str = "KS") -> dict:
    loc = detail.get("geometry", {}).get("location", {})
    name = detail.get("name", "")
    city_slug = slugify(city_name)
    state_slug = "kansas"
    slug = slugify(name)

    address = detail.get("formatted_address", "")
    # Try to extract street address only
    street = address.split(",")[0].strip() if address else ""

    # Photo intentionally omitted — the Place Photo endpoint is billed per
    # fetch, so we serve a local placeholder instead of live Google photos.
    photo_url = ""

    hours_raw = detail.get("opening_hours", {})
    hours_parsed = parse_hours(hours_raw)

    is_operational = detail.get("business_status", "") == "OPERATIONAL"

    types = detail.get("types", [])

    return {
        "name": name,
        "slug": slug,
        "citySlug": city_slug,
        "stateSlug": state_slug,
        "phone": detail.get("formatted_phone_number", ""),
        "website": detail.get("website", ""),
        "address": address,
        "street": street,
        "city": city_name,
        "county": "",
        "state": state_name,
        "stateCode": state_code,
        "postalCode": "",
        "latitude": loc.get("lat"),
        "longitude": loc.get("lng"),
        "rating": detail.get("rating"),
        "reviewCount": detail.get("user_ratings_total", 0),
        "reviewsPerScore": {},
        "photosCount": len(photos),
        "photo": photo_url,
        "logo": "",
        "businessStatus": "OPERATIONAL" if is_operational else "CLOSED_PERMANENTLY",
        "hours": hours_parsed,
        "priceRange": price_level_to_range(detail.get("price_level")),
        "description": "",
        "menuLink": "",
        "orderLinks": "",
        "googleMapsLink": detail.get("url", ""),
        "placeId": detail.get("place_id", ""),
        "subtypes": ", ".join(t.replace("_", " ").title() for t in types if t not in ("point_of_interest", "establishment", "food")),
        "amenities": {
            "delivery": False,
            "takeout": True,
            "dineIn": True,
            "outdoorSeating": False,
            "alcohol": False,
            "veganOptions": False,
            "vegetarianOptions": False,
            "acceptsReservations": hours_raw.get("reservable", False),
            "wheelchairAccessible": False,
            "casual": True,
            "cozy": False,
            "trendy": False,
            "familyFriendly": True,
            "parking": True,
            "creditCards": True,
        },
    }


def main():
    # Load existing data to find known place IDs
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    restaurants_path = os.path.join(repo_root, "lib", "restaurants.json")

    with open(restaurants_path) as f:
        existing = json.load(f)

    existing_place_ids = {r.get("placeId") for r in existing if r.get("placeId")}
    existing_slugs = {r.get("slug") for r in existing}

    new_records = []
    seen_place_ids = set(existing_place_ids)

    for city, state_code in KANSAS_CITIES:
        print(f"Searching: {city}, {state_code}...", file=sys.stderr)
        results = search_ramen(city, state_code)
        print(f"  Found {len(results)} results", file=sys.stderr)

        for r in results:
            pid = r.get("place_id", "")
            if pid in seen_place_ids:
                print(f"  Skip (known): {r.get('name')}", file=sys.stderr)
                continue

            seen_place_ids.add(pid)
            print(f"  Fetching details: {r.get('name')}", file=sys.stderr)
            detail = get_details(pid)
            time.sleep(0.3)

            record = build_record(detail, city)

            # Deduplicate by slug
            slug = record["slug"]
            suffix = 1
            base_slug = slug
            while slug in existing_slugs:
                suffix += 1
                slug = f"{base_slug}-{suffix}"
            record["slug"] = slug
            existing_slugs.add(slug)

            new_records.append(record)
            print(f"  Added: {record['name']} ({record['slug']})", file=sys.stderr)

    print(f"\nTotal new records: {len(new_records)}", file=sys.stderr)
    print(json.dumps(new_records, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
