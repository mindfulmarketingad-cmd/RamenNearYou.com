export type Amenities = {
  delivery: boolean; takeout: boolean; dineIn: boolean; outdoorSeating: boolean;
  alcohol: boolean; veganOptions: boolean; vegetarianOptions: boolean;
  acceptsReservations: boolean; wheelchairAccessible: boolean;
  casual: boolean; cozy: boolean; trendy: boolean; familyFriendly: boolean;
  parking: boolean; creditCards: boolean;
}

export type Restaurant = {
  name: string; slug: string; citySlug: string; stateSlug: string;
  phone: string; website: string; address: string; street: string;
  city: string; county: string; state: string; stateCode: string; postalCode: string;
  latitude: number | null; longitude: number | null;
  rating: number | null; reviewCount: number; reviewsPerScore: Record<string,number>;
  photosCount: number; photo: string; logo: string; businessStatus: string;
  hours: Record<string, string[]>; priceRange: string;
  description: string; menuLink: string; orderLinks: string; googleMapsLink: string;
  placeId: string; subtypes: string; amenities: Amenities;
}

export const restaurants: Restaurant[] = [
  {
    "name": "Okiboru Tsukemen & Ramen",
    "slug": "okiboru-tsukemen-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-941-7469",
    "website": "https://okiboru.com/",
    "address": "2277 Peachtree Rd NE B, Atlanta, GA 30309",
    "street": "2277 Peachtree Rd NE B",
    "city": "Atlanta",
    "county": "Colonial Homes",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.8159957,
    "longitude": -84.3902831,
    "rating": 4.8,
    "reviewCount": 1099,
    "reviewsPerScore": {
      "1": 11,
      "2": 14,
      "3": 21,
      "4": 79,
      "5": 974
    },
    "photosCount": 823,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFV-ir1WWoRunbC7WyOC76EfAEIJ9F0vxc_5dP29_YZQBQNdju9browSuXjCMRV9lGeT9BUHnBj5lyg7NvdZRD0VW28NK303hkY9tIvOvtYYMuUMZ8Ho6p7vCll_mPLEDXItNpphMds2RCL=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-PZYX5VnmZnI/AAAAAAAAAAI/AAAAAAAAAAA/8btRxJaqE34/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-3PM",
        "5-9PM"
      ],
      "Tuesday": [
        "11:30AM-3PM",
        "5-9PM"
      ],
      "Wednesday": [
        "11:30AM-3PM",
        "5-9PM"
      ],
      "Thursday": [
        "11:30AM-3PM",
        "5-9PM"
      ],
      "Friday": [
        "11:30AM-3PM",
        "5-10PM"
      ],
      "Saturday": [
        "11:30AM-10PM"
      ],
      "Sunday": [
        "11:30AM-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Okiboru+Tsukemen+%26+Ramen/@33.8159957,-84.39028309999999,14z/data=!4m8!1m2!2m1!1sOkiboru+Tsukemen+%26+Ramen!3m4!1s0x88f505bea2102ec9:0x60075764bb84a8bf!8m2!3d33.8159957!4d-84.39028309999999",
    "placeId": "ChIJyS4Qor4F9YgRv6iEu2RXB2A",
    "subtypes": "Ramen restaurant, Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "E Ramen +",
    "slug": "e-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-913-4142",
    "website": "http://www.eramenatl.com/",
    "address": "1110 W Peachtree St NW #300, Atlanta, GA 30309",
    "street": "1110 W Peachtree St NW #300",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7851738,
    "longitude": -84.3879785,
    "rating": 4.6,
    "reviewCount": 1056,
    "reviewsPerScore": {
      "1": 30,
      "2": 16,
      "3": 46,
      "4": 117,
      "5": 847
    },
    "photosCount": 1110,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpL-16lOC62LPA8GMFCSO_qz6OwfOcS15qXfs481X2z2U12myPsrs5hZAcfw0HAaxtExjtS6IM1Yl2GhfVXqC_9twm5L7HB0X62iUrsJFofomlPbjghqa_4O8ocMAhtfs7dqim=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-WWkEzqRhTe8/AAAAAAAAAAI/AAAAAAAAAAA/xqagmXUG4mA/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "12-9:30PM"
      ],
      "Wednesday": [
        "12-9:30PM"
      ],
      "Thursday": [
        "12-9:30PM"
      ],
      "Friday": [
        "12-10:30PM"
      ],
      "Saturday": [
        "12-10:30PM"
      ],
      "Sunday": [
        "12-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "Homemade ramen served in a contemporary eatery that has an extensive sake & cocktail menu.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/E+Ramen+%2B/@33.785173799999995,-84.3879785,14z/data=!4m8!1m2!2m1!1sE+Ramen+%2B!3m4!1s0x88f5051854294b5d:0x6c02b9c9724b4661!8m2!3d33.785173799999995!4d-84.3879785",
    "placeId": "ChIJXUspVBgF9YgRYUZLcsm5Amw",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "JINYA Ramen Bar - Poncey Highland",
    "slug": "jinya-ramen-bar-poncey-highland",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-748-4520",
    "website": "https://www.jinyaramenbar.com/locations/alpharetta/%3Futm_medium%3Dsoci%26utm_source%3Dgmb",
    "address": "676 N Highland Ave NE Suite #3-ABC, Atlanta, GA 30306",
    "street": "676 N Highland Ave NE Suite #3-ABC",
    "city": "Atlanta",
    "county": "Poncey-Highland",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30306",
    "latitude": 33.7728413,
    "longitude": -84.352801,
    "rating": 4.6,
    "reviewCount": 1086,
    "reviewsPerScore": {
      "1": 54,
      "2": 29,
      "3": 32,
      "4": 99,
      "5": 872
    },
    "photosCount": 1009,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFoRlFIOWCXK0poL8Bz0Aa0Rqt6EbvlMsZymbuGpei5coa5w0yzsPN3LGfVPhL04IqlPzzWgb-rk6zlyZ2G3QtYBTpjKRe9C5hQYpLHbn-PeXNrRwNuZ6jwRFlFRjQdGfsGExll=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-KqIsPbQ--FY/AAAAAAAAAAI/AAAAAAAAAAA/9IhJrUWa6Ew/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/JINYA+Ramen+Bar+-+Poncey+Highland/@33.772841299999996,-84.352801,14z/data=!4m8!1m2!2m1!1sJINYA+Ramen+Bar+-+Poncey+Highland!3m4!1s0x88f5073c685a868f:0x154b54b25c58462e!8m2!3d33.772841299999996!4d-84.352801",
    "placeId": "ChIJj4ZaaDwH9YgRLkZYXLJUSxU",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Hajime",
    "slug": "hajime",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-428-2388",
    "website": "http://hajime.us/",
    "address": "2345 Cheshire Bridge Rd NE #101, Atlanta, GA 30324",
    "street": "2345 Cheshire Bridge Rd NE #101",
    "city": "Atlanta",
    "county": "Lindridge-Martin Manor",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30324",
    "latitude": 33.8191602,
    "longitude": -84.3497225,
    "rating": 4.4,
    "reviewCount": 756,
    "reviewsPerScore": {
      "1": 44,
      "2": 27,
      "3": 42,
      "4": 132,
      "5": 511
    },
    "photosCount": 621,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJL9wC8zwjxS1BPz-gBPdCcidcE-6IXr287EsPvq2vfrwYMwCBhWk_kwqDm6WCpH8J_pqJQsNfOgqrDKUsmRPaOAvgn_OjxAxyFnorSb7UZ31ssGW9ypkhNEliQKIi-TD_GkUZ=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-9aImKxnE1tU/AAAAAAAAAAI/AAAAAAAAAAA/7JRbepg1GAs/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-3PM",
        "5-9:30PM"
      ],
      "Tuesday": [
        "11:30AM-3PM",
        "5-9:30PM"
      ],
      "Wednesday": [
        "11:30AM-3PM",
        "5-9:30PM"
      ],
      "Thursday": [
        "11:30AM-3PM",
        "5-9:30PM"
      ],
      "Friday": [
        "11:30AM-3PM",
        "5:30-10PM"
      ],
      "Saturday": [
        "12-10PM"
      ],
      "Sunday": [
        "12-8:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "Multiple styles of traditional ramen served alongside Japanese small plates in spacious surrounds.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Hajime/@33.8191602,-84.3497225,14z/data=!4m8!1m2!2m1!1sHajime!3m4!1s0x88f506743e310ca3:0x43434a6360340c31!8m2!3d33.8191602!4d-84.3497225",
    "placeId": "ChIJowwxPnQG9YgRMQw0YGNKQ0M",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Hikaru Ramen & Sushi Rolls",
    "slug": "hikaru-ramen-sushi-rolls",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 678-888-2070",
    "website": "http://www.hikaruramenatl.com/",
    "address": "2014 Powers Ferry Rd UNIT 400, Atlanta, GA 30339",
    "street": "2014 Powers Ferry Rd UNIT 400",
    "city": "Atlanta",
    "county": "Cumberland",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30339",
    "latitude": 33.9033277,
    "longitude": -84.4606294,
    "rating": 4.5,
    "reviewCount": 355,
    "reviewsPerScore": {
      "1": 23,
      "2": 8,
      "3": 13,
      "4": 41,
      "5": 270
    },
    "photosCount": 372,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFsYtPy9Vup4ZA0mmrhpF9Bj3cqIpeF_KgoeYnlKssTS-RYlZKbxsSBkTAGmZ_tt9bl6xwl54t-Y9FWAija1lXrbj_9bQPZuk3bmASYZ1b2lJAN4wPm1_VLAUA6QPCMkbKP05hECA=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-sgAn6PcuLCA/AAAAAAAAAAI/AAAAAAAAAAA/6XSEHcx_OLc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-3PM",
        "5-9PM"
      ],
      "Tuesday": [
        "11AM-3PM",
        "5-9PM"
      ],
      "Wednesday": [
        "11AM-3PM",
        "5-9PM"
      ],
      "Thursday": [
        "11AM-3PM",
        "5-9PM"
      ],
      "Friday": [
        "11AM-3PM",
        "5-9PM"
      ],
      "Saturday": [
        "12-9PM"
      ],
      "Sunday": [
        "12-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Hikaru+Ramen+%26+Sushi+Rolls/@33.9033277,-84.4606294,14z/data=!4m8!1m2!2m1!1sHikaru+Ramen+%26+Sushi+Rolls!3m4!1s0x88f511d1290de7e7:0xf85f6b6879a78017!8m2!3d33.9033277!4d-84.4606294",
    "placeId": "ChIJ5-cNKdER9YgRF4CneWhrX_g",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "PaoPao Ramen Factory & BoBa",
    "slug": "paopao-ramen-factory-boba",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 678-973-0613",
    "website": "http://www.paopaoramen.com/",
    "address": "2929 N Druid Hills Rd NE C, Atlanta, GA 30329",
    "street": "2929 N Druid Hills Rd NE C",
    "city": "Atlanta",
    "county": "Toco Hills",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30329",
    "latitude": 33.815239,
    "longitude": -84.312064,
    "rating": 4.4,
    "reviewCount": 1293,
    "reviewsPerScore": {
      "1": 105,
      "2": 45,
      "3": 52,
      "4": 91,
      "5": 1000
    },
    "photosCount": 889,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEreM2SNPzqw8AJZSFIfILPu7m1jeBDRu2dZ6gDCDeigH-MpkVzaCbPO1shM937ezBHwg-PKEM3Mdzv0xGPwxg0_Nrx5Qehuz0VJtWaIiC7kDy2qMRjLRIPH10UczufCyTJnXQh=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-P1c3j_paBgE/AAAAAAAAAAI/AAAAAAAAAAA/EhA3z7hHAxU/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-10PM"
      ],
      "Tuesday": [
        "11:30AM-10PM"
      ],
      "Wednesday": [
        "11:30AM-10PM"
      ],
      "Thursday": [
        "11:30AM-10PM"
      ],
      "Friday": [
        "11:30AM-10PM"
      ],
      "Saturday": [
        "12-10PM"
      ],
      "Sunday": [
        "12-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/PaoPao+Ramen+Factory+%26+BoBa/@33.815239,-84.31206399999999,14z/data=!4m8!1m2!2m1!1sPaoPao+Ramen+Factory+%26+BoBa!3m4!1s0x88f5077ab9aa4923:0x2467bfdf7c42e1da!8m2!3d33.815239!4d-84.31206399999999",
    "placeId": "ChIJI0mquXoH9YgR2uFCfN-_ZyQ",
    "subtypes": "Ramen restaurant, Asian restaurant, Bar, Bubble tea store, Dumpling restaurant, Ice cream shop",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Shibuya Ramen Atlanta",
    "slug": "shibuya-ramen-atlanta",
    "citySlug": "marietta",
    "stateSlug": "ga",
    "phone": "+1 770-693-3893",
    "website": "https://www.shibuyaramen.com/",
    "address": "2769 Chastain Meadows Pkwy NW #90, Marietta, GA 30066",
    "street": "2769 Chastain Meadows Pkwy NW #90",
    "city": "Marietta",
    "county": "Town Center",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30066",
    "latitude": 34.0175029,
    "longitude": -84.5559993,
    "rating": 4.9,
    "reviewCount": 441,
    "reviewsPerScore": {
      "1": 6,
      "2": 3,
      "3": 7,
      "4": 19,
      "5": 406
    },
    "photosCount": 639,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH3ekJV9EmysdycLlgUifD5l8fLixzAJjHsfjY9toFkUt8weUy_u46LR9u1fQgVi-i3VGOGFCOMoN7Sfbp54J0_wbjH1rpYamJ-Q6Mp_0yV6bUsDe8HiJt7lPo6rZDS29ZcWas=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-jdX1T1sxYAo/AAAAAAAAAAI/AAAAAAAAAAA/prhYE-hcIdo/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-2:30PM",
        "5-9PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "11AM-2:30PM",
        "5-9PM"
      ],
      "Thursday": [
        "11AM-2:30PM",
        "5-9PM"
      ],
      "Friday": [
        "11AM-2:30PM",
        "5-9:30PM"
      ],
      "Saturday": [
        "11AM-2:30PM",
        "5-9:30PM"
      ],
      "Sunday": [
        "11AM-2:30PM",
        "5-9PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Shibuya+Ramen+Atlanta/@34.0175029,-84.5559993,14z/data=!4m8!1m2!2m1!1sShibuya+Ramen+Atlanta!3m4!1s0x88f51594ccb8d9cd:0xc5033beb4e469353!8m2!3d34.0175029!4d-84.5559993",
    "placeId": "ChIJzdm4zJQV9YgRU5NGTus7A8U",
    "subtypes": "Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Hotto Hotto Ramen & Teppanyaki",
    "slug": "hotto-hotto-ramen-teppanyaki",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-963-2937",
    "website": "http://www.hottohotto.com/",
    "address": "1039 Grant St SE Suite B10, Atlanta, GA 30315",
    "street": "1039 Grant St SE Suite B10",
    "city": "Atlanta",
    "county": "Grant Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30315",
    "latitude": 33.7257281,
    "longitude": -84.3769297,
    "rating": 4.2,
    "reviewCount": 893,
    "reviewsPerScore": {
      "1": 88,
      "2": 48,
      "3": 67,
      "4": 89,
      "5": 601
    },
    "photosCount": 856,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFOUIh4wPe7h3Lp3hjG6n1Wr1o0mz6KlOVroGHCedTT1DVYIcZQfwpopcyTrYCW86ZKhvRKdkAnyZlhZn2GdeS3wXVBfrvGmFsYMQCMqlpOXl54v4aMQbmFlpYisin9DF2PJE_W=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-l4R8FFtBNhA/AAAAAAAAAAI/AAAAAAAAAAA/oaiWBYJUBUc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "12-9PM"
      ],
      "Tuesday": [
        "12-9PM"
      ],
      "Wednesday": [
        "12-9PM"
      ],
      "Thursday": [
        "12-9PM"
      ],
      "Friday": [
        "12-10PM"
      ],
      "Saturday": [
        "12-10PM"
      ],
      "Sunday": [
        "12-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "http://www.hottohotto.com/",
    "googleMapsLink": "https://www.google.com/maps/place/Hotto+Hotto+Ramen+%26+Teppanyaki/@33.7257281,-84.37692969999999,14z/data=!4m8!1m2!2m1!1sHotto+Hotto+Ramen+%26+Teppanyaki!3m4!1s0x88f503bac704c591:0xb41a79b318618d64!8m2!3d33.7257281!4d-84.37692969999999",
    "placeId": "ChIJkcUEx7oD9YgRZI1hGLN5GrQ",
    "subtypes": "Ramen restaurant, Asian restaurant, Bar & grill, Cocktail bar, Japanese restaurant, Small plates restaurant, Teppanyaki restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "JINYA Ramen Bar - Buckhead",
    "slug": "jinya-ramen-bar-buckhead",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-254-4770",
    "website": "https://www.jinyaramenbar.com/locations/atlanta-buckhead/%3Futm_medium%3Dsoci%26utm_source%3Dgmb",
    "address": "3714 Roswell Rd #35, Atlanta, GA 30342",
    "street": "3714 Roswell Rd #35",
    "city": "Atlanta",
    "county": "East Chastain Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30342",
    "latitude": 33.856646,
    "longitude": -84.3826649,
    "rating": 4.7,
    "reviewCount": 2959,
    "reviewsPerScore": {
      "1": 68,
      "2": 37,
      "3": 100,
      "4": 341,
      "5": 2413
    },
    "photosCount": 2301,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGC7BquBSpHmTj4A8C9y4_0GU_48lDrJIRb7XtmeT962wpNby2bXoxLC7DkyFvMOWeMBRK5yP4jg5IWvZPKFM3qXbfY0qug4GTJEzbvgzlnFCTl4Qnd3ovRg3BnxmgyKbRp2uJW=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-K4xJHrau1Ik/AAAAAAAAAAI/AAAAAAAAAAA/95aOw5lZ4zM/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "Modern chain serving ramen noodle varieties & other traditional Japanese fare, with a large bar.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/JINYA+Ramen+Bar+-+Buckhead/@33.856646,-84.3826649,14z/data=!4m8!1m2!2m1!1sJINYA+Ramen+Bar+-+Buckhead!3m4!1s0x88f50f659a18a43d:0xd97d3517a79321db!8m2!3d33.856646!4d-84.3826649",
    "placeId": "ChIJPaQYmmUP9YgR2yGTpxc1fdk",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Momonoki",
    "slug": "momonoki",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-390-3025",
    "website": "http://momonokiatl.com/",
    "address": "95 8th St NW #100, Atlanta, GA 30309",
    "street": "95 8th St NW #100",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7797614,
    "longitude": -84.3902573,
    "rating": 4.2,
    "reviewCount": 1436,
    "reviewsPerScore": {
      "1": 95,
      "2": 79,
      "3": 142,
      "4": 274,
      "5": 846
    },
    "photosCount": 2076,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFarGQB7eupFhn8Pa092xst7fIBnc8I1bWOz9qxQ1z0BqvSIaarPBufCdw57l5dWf9nj_BLaKcT-SyX0VPE6su-C18bQlXtJV16VXwUqRbWw4wSiaTcM8S63WNHKi0e32jWEW5f=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-yD-j9_smfaQ/AAAAAAAAAAI/AAAAAAAAAAA/P9fXNSb5qjc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "9AM-9PM"
      ],
      "Tuesday": [
        "9AM-9PM"
      ],
      "Wednesday": [
        "9AM-9PM"
      ],
      "Thursday": [
        "9AM-9PM"
      ],
      "Friday": [
        "9AM-10PM"
      ],
      "Saturday": [
        "9AM-10PM"
      ],
      "Sunday": [
        "9AM-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "Ramen, poke bowls & other Japanese eats offered in an airy, contemporary space with counter seating.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Momonoki/@33.7797614,-84.3902573,14z/data=!4m8!1m2!2m1!1sMomonoki!3m4!1s0x88f5053a5a7f7ebd:0xd0d98db5fa4b4311!8m2!3d33.7797614!4d-84.3902573",
    "placeId": "ChIJvX5_WjoF9YgREUNL-rWN2dA",
    "subtypes": "Ramen restaurant, Cafe, Coffee shop",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Silverlake Ramen",
    "slug": "silverlake-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-390-3362",
    "website": "",
    "address": "1080 Peachtree St NE Ste 9, Atlanta, GA 30309",
    "street": "1080 Peachtree St NE Ste 9",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7834212,
    "longitude": -84.3842495,
    "rating": 4.1,
    "reviewCount": 382,
    "reviewsPerScore": {
      "1": 44,
      "2": 13,
      "3": 36,
      "4": 60,
      "5": 229
    },
    "photosCount": 546,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHl0s8TDu8hFUbcFhXiLJeymsWhZrv8Tp8kSY1V92UKV0EHxEpQyoz9eTpzu9nB50rwGxcJ34T70aimvKOTkPFg6KH65m6EJ-faSph7uvz7re6fVVIKidOd4888pDRzsaf9ujZY=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-IeJanuKHnF8/AAAAAAAAAAI/AAAAAAAAAAA/eLKqaA9Zyh8/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-11PM"
      ],
      "Tuesday": [
        "11:30AM-11PM"
      ],
      "Wednesday": [
        "11:30AM-11PM"
      ],
      "Thursday": [
        "11:30AM-11PM"
      ],
      "Friday": [
        "11:30AM-12AM"
      ],
      "Saturday": [
        "11:30AM-12AM"
      ],
      "Sunday": [
        "11:30AM-12AM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Silverlake+Ramen/@33.7834212,-84.3842495,14z/data=!4m8!1m2!2m1!1sSilverlake+Ramen!3m4!1s0x88f505e760ed7acf:0x302fc68cd4eca4e9!8m2!3d33.7834212!4d-84.3842495",
    "placeId": "ChIJz3rtYOcF9YgR6aTs1IzGLzA",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kin NoTori Ramen Bar Midtown Atlanta",
    "slug": "kin-notori-ramen-bar-midtown-atlanta",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-312-2964",
    "website": "http://www.kinnotori.com/",
    "address": "650 Ponce De Leon Ave NE, Atlanta, GA 30308",
    "street": "650 Ponce De Leon Ave NE",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30308",
    "latitude": 33.7737413,
    "longitude": -84.366719,
    "rating": 4.7,
    "reviewCount": 835,
    "reviewsPerScore": {
      "1": 24,
      "2": 14,
      "3": 30,
      "4": 79,
      "5": 688
    },
    "photosCount": 1067,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGZaHLoocLVF-Z13GRsgZYmgu23DzJLabBTrLWcxtA9xRu6nXt-UmSG7k9EIiMja2TzMIYVTT3mljDKDTe_cvIjoUsRvKuHZLjeyn7Q1KkeiZeqzcr3xU6o3SEqNGRij0hlso6V-Q=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-TIY7LMmJFIU/AAAAAAAAAAI/AAAAAAAAAAA/CX_9L785KqM/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "CLOSED_TEMPORARILY",
    "hours": {},
    "priceRange": "$$",
    "description": "Casual spot for classic ramen noodle dishes like spicy tori paitan, plus gyoza chicken & pork buns.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kin+NoTori+Ramen+Bar+Midtown+Atlanta/@33.7737413,-84.36671899999999,14z/data=!4m8!1m2!2m1!1sKin+NoTori+Ramen+Bar+Midtown+Atlanta!3m4!1s0x88f5050d89ffc5ef:0x6c8bb387cc78b522!8m2!3d33.7737413!4d-84.36671899999999",
    "placeId": "ChIJ78X_iQ0F9YgRIrV4zIezi2w",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": false,
      "trendy": false,
      "familyFriendly": true,
      "parking": true,
      "creditCards": false
    }
  },
  {
    "name": "LanZhou Ramen",
    "slug": "lanzhou-ramen",
    "citySlug": "doraville",
    "stateSlug": "ga",
    "phone": "+1 678-691-2175",
    "website": "http://lanzhouramenatlanta.com/",
    "address": "5231 Buford Hwy NE, Doraville, GA 30340",
    "street": "5231 Buford Hwy NE",
    "city": "Doraville",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30340",
    "latitude": 33.8948429,
    "longitude": -84.2819667,
    "rating": 4.4,
    "reviewCount": 1720,
    "reviewsPerScore": {
      "1": 114,
      "2": 62,
      "3": 79,
      "4": 270,
      "5": 1195
    },
    "photosCount": 2141,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAECO26c80ePo6dUAgwaXDzZah1mmiRblGbeolT0rd_5z18fuW72oDKIIG81jb59OF_dcsRAeJZNW1Ua1UiJEubb_pofGJAHvrRAk7EnOWIqzUSQAfNX5mzmgM_YrVCwUevBYwe1jg=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-KLcCs3Jb6qg/AAAAAAAAAAI/AAAAAAAAAAA/Z3YqS3Qdb8E/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "11AM-9:30PM"
      ]
    },
    "priceRange": "$",
    "description": "Hand-pulled Chinese noodles & broths take center stage here, with a noodle viewing window in back.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/LanZhou+Ramen/@33.8948429,-84.2819667,14z/data=!4m8!1m2!2m1!1sLanZhou+Ramen!3m4!1s0x88f509ce541bca67:0x43d40571174b99fc!8m2!3d33.8948429!4d-84.2819667",
    "placeId": "ChIJZ8obVM4J9YgR_JlLF3EF1EM",
    "subtypes": "Ramen restaurant, Chinese restaurant, Chinese noodle restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Lanzhou Ramen N Sushi (????)",
    "slug": "lanzhou-ramen-n-sushi",
    "citySlug": "roswell",
    "stateSlug": "ga",
    "phone": "+1 770-674-5670",
    "website": "https://chowbusmkt.wixsite.com/website-533",
    "address": "1055 Mansell Rd #200, Roswell, GA 30076",
    "street": "1055 Mansell Rd #200",
    "city": "Roswell",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30076",
    "latitude": 34.0421903,
    "longitude": -84.329962,
    "rating": 4.6,
    "reviewCount": 253,
    "reviewsPerScore": {
      "1": 15,
      "2": 2,
      "3": 8,
      "4": 14,
      "5": 214
    },
    "photosCount": 520,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGvEazADDGeHO31gCvekMfOQGWJxeCi_Z8Csa3u-4qG08gpA47iUb1HQOrm-IXcADZznpgQOvXI1_bYpydAWuu44ZsdFJpH4_PoOJMEBecqnWCWw53aKe0Z8tNaSV_WFnw8uAwk=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-ta8YK961P_A/AAAAAAAAAAI/AAAAAAAAAAA/aJWg_fsaGo0/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11AM-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Lanzhou+Ramen+N+Sushi+%28%E5%85%B0%E5%B7%9E%E6%8B%89%E9%9D%A2%29/@34.0421903,-84.329962,14z/data=!4m8!1m2!2m1!1sLanzhou+Ramen+N+Sushi+%28%E5%85%B0%E5%B7%9E%E6%8B%89%E9%9D%A2%29!3m4!1s0x88f5752f2ff8df31:0x9307180e43652bf!8m2!3d34.0421903!4d-84.329962",
    "placeId": "ChIJMd_4Ly919YgRv1I25IBxMAk",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "JINYA Ramen Bar - Duluth",
    "slug": "jinya-ramen-bar-duluth",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-691-3101",
    "website": "https://www.jinyaramenbar.com/menu/ga/Duluth/%3Futm_medium%3Dsoci%26utm_source%3Dgmb",
    "address": "2200 Duluth Hwy, Duluth, GA 30097",
    "street": "2200 Duluth Hwy",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30097",
    "latitude": 33.9786477,
    "longitude": -84.0992961,
    "rating": 4.5,
    "reviewCount": 1438,
    "reviewsPerScore": {
      "1": 73,
      "2": 42,
      "3": 51,
      "4": 129,
      "5": 1143
    },
    "photosCount": 1271,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEJgbkNKCq3ByEWYpqQamVsvKisNW3ZeVCnF1V-OOIdrCmh5ifKgEwt0ZjNtiZEMJYDf5pZqhiRbc5tzcIvekXog21N74zua7S8CblvzfogNBkmWX_3Pa9Wg2n4Bu9cRSOsoQbeKGRaTdyA=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-DN6y8Q5-4F4/AAAAAAAAAAI/AAAAAAAAAAA/UiYifyAVY_U/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/JINYA+Ramen+Bar+-+Duluth/@33.978647699999996,-84.09929609999999,14z/data=!4m8!1m2!2m1!1sJINYA+Ramen+Bar+-+Duluth!3m4!1s0x88f5bd06035792f9:0xae23f3e980af34af!8m2!3d33.978647699999996!4d-84.09929609999999",
    "placeId": "ChIJ-ZJXAwa99YgRrzSvgOnzI64",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kyuramen x TBaar - Duluth",
    "slug": "kyuramen-x-tbaar-duluth",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-587-5853",
    "website": "https://www.kyuramen.com/",
    "address": "3780 Old Norcross Rd #108, Duluth, GA 30096",
    "street": "3780 Old Norcross Rd #108",
    "city": "Duluth",
    "county": "Gwinnett Place",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9614336,
    "longitude": -84.1440517,
    "rating": 4.4,
    "reviewCount": 258,
    "reviewsPerScore": {
      "1": 13,
      "2": 12,
      "3": 15,
      "4": 35,
      "5": 183
    },
    "photosCount": 726,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhFkGnzEDtoT8uhK6d95PyJQdzLsyx0HtWAgLjhPJSOGJAV1Ic0kwUlRTGW7NByuSZ1d6DwWRFShlk-0vYr7OYIM3zwC5yQFm5MGYNdpxwBSgF48iY77IGFP1SR97AyDRE-AsArPvgf3IWCr1TXoOt6MgZ1EwSe9Xs_UgtIYs7RIraPAWMBOLtum=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-gsCzUEpcBRQ/AAAAAAAAAAI/AAAAAAAAAAA/ZLlCpItOCPw/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "12-11PM"
      ],
      "Tuesday": [
        "12-11PM"
      ],
      "Wednesday": [
        "12-11PM"
      ],
      "Thursday": [
        "12-11PM"
      ],
      "Friday": [
        "12PM-12AM"
      ],
      "Saturday": [
        "12PM-12AM"
      ],
      "Sunday": [
        "12-11PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kyuramen+x+TBaar+-+Duluth/@33.9614336,-84.14405169999999,14z/data=!4m8!1m2!2m1!1sKyuramen+x+TBaar+-+Duluth!3m4!1s0x88f5a3aa21102461:0xd156010af2c57d0e!8m2!3d33.9614336!4d-84.14405169999999",
    "placeId": "ChIJYSQQIaqj9YgRDn3F8goBVtE",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Ramyun Gallery - Duluth",
    "slug": "ramyun-gallery-duluth",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-336-9334",
    "website": "https://order.peblla.com/ramyungallery/order%3Fsid%3D964470310850810816",
    "address": "2645 N Berkeley Lake Rd NW Ste E233, Duluth, GA 30096",
    "street": "2645 N Berkeley Lake Rd NW Ste E233",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9748761,
    "longitude": -84.1577122,
    "rating": 4.9,
    "reviewCount": 396,
    "reviewsPerScore": {
      "1": 5,
      "2": 1,
      "3": 4,
      "4": 6,
      "5": 380
    },
    "photosCount": 403,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH1J1PIWPT2LI7xfPC2QZtnRMCRI4euP6u2rKy3CrOjG8XkPT04ppFqrFHB2M-he8MUKCIajDl7gFsOfCvMBpTbhSnX84tG2dYusoqwkRq--VcUqdBJV0KjMJtpp4bfuvxQhDLmB9io6BEI=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-EQcWsNm_HJg/AAAAAAAAAAI/AAAAAAAAAAA/vK3VOThLz-o/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-11PM"
      ],
      "Tuesday": [
        "11:30AM-11PM"
      ],
      "Wednesday": [
        "11:30AM-11PM"
      ],
      "Thursday": [
        "11:30AM-11PM"
      ],
      "Friday": [
        "11:30AM-1AM"
      ],
      "Saturday": [
        "11:30AM-1AM"
      ],
      "Sunday": [
        "11:30AM-11PM"
      ]
    },
    "priceRange": "$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Ramyun+Gallery+-+Duluth/@33.974876099999996,-84.15771219999999,14z/data=!4m8!1m2!2m1!1sRamyun+Gallery+-+Duluth!3m4!1s0x88f5a3f5ff83f02b:0xf2bc43d53a26da83!8m2!3d33.974876099999996!4d-84.15771219999999",
    "placeId": "ChIJK_CD__Wj9YgRg9omOtVDvPI",
    "subtypes": "Ramen restaurant, Noodle shop, Korean restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Okiboru - Duluth",
    "slug": "okiboru-duluth",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 470-550-1953",
    "website": "http://okiboru.com/",
    "address": "3614 Satellite Blvd, Duluth, GA 30096",
    "street": "3614 Satellite Blvd",
    "city": "Duluth",
    "county": "Gwinnett Place",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9571284,
    "longitude": -84.1353715,
    "rating": 4.5,
    "reviewCount": 428,
    "reviewsPerScore": {
      "1": 16,
      "2": 13,
      "3": 31,
      "4": 56,
      "5": 312
    },
    "photosCount": 585,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH4zUeahYemwrKzJuOIQKTy0b5CnYmRyc-Arl6n8hbJ7iuvJzskomFQHU7vBIAOsqTBc6HCMeJuyfV6UhHLPlVP6CH63rlUZAXfwps-pvgLPt-D3mIYTTkRZSPcz3eUP829ZJ-Z=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-rOm0adxr36w/AAAAAAAAAAI/AAAAAAAAAAA/HoU5F6PQAws/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Wednesday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Thursday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Friday": [
        "11:30AM-3PM",
        "5:30-10PM"
      ],
      "Saturday": [
        "11:30AM-10PM"
      ],
      "Sunday": [
        "11:30AM-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Okiboru+-+Duluth/@33.9571284,-84.13537149999999,14z/data=!4m8!1m2!2m1!1sOkiboru+-+Duluth!3m4!1s0x88f5a34b68784c73:0xd5aaac5abab97439!8m2!3d33.9571284!4d-84.13537149999999",
    "placeId": "ChIJc0x4aEuj9YgROXS5ulqsqtU",
    "subtypes": "Ramen restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Raku Tonkatsu Ramen",
    "slug": "raku-tonkatsu-ramen",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 770-476-1212",
    "website": "https://www.rakutonkatsuramenduluth.com/",
    "address": "2550 Pleasant Hill Rd #112, Duluth, GA 30096",
    "street": "2550 Pleasant Hill Rd #112",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9701888,
    "longitude": -84.1438074,
    "rating": 4.4,
    "reviewCount": 844,
    "reviewsPerScore": {
      "1": 43,
      "2": 33,
      "3": 53,
      "4": 151,
      "5": 564
    },
    "photosCount": 1191,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFpJPW0deDgsi8jjmx0YSN9esV6u46yfZ4IU1aVSMsg8XD6H7O61619SGXd2l1zCfcgQeaBFlhNFEozXfVEYxxTRZaUvbNlpxdb1nxnaPrALps3kMfktpdx9JC3y1ETJNThUtCv=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-FZnNVVRu7js/AAAAAAAAAAI/AAAAAAAAAAA/p6myWrwLWJc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-10:30PM"
      ],
      "Tuesday": [
        "11:30AM-10:30PM"
      ],
      "Wednesday": [
        "11:30AM-10:30PM"
      ],
      "Thursday": [
        "11:30AM-10:30PM"
      ],
      "Friday": [
        "11:30AM-11PM"
      ],
      "Saturday": [
        "11:30AM-11PM"
      ],
      "Sunday": [
        "12-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Raku+Tonkatsu+Ramen/@33.970188799999995,-84.1438074,14z/data=!4m8!1m2!2m1!1sRaku+Tonkatsu+Ramen!3m4!1s0x88f5a3aaaa711347:0xebe8bac388462787!8m2!3d33.970188799999995!4d-84.1438074",
    "placeId": "ChIJRxNxqqqj9YgRhydGiMO66Os",
    "subtypes": "Ramen restaurant, Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "K Ramen Cafe",
    "slug": "k-ramen-cafe",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 985-212-9287",
    "website": "https://kramencafe.com/",
    "address": "2400 SATELLTE BVLD STE112, Duluth, GA 30096",
    "street": "2400 SATELLTE BVLD STE112",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.974811,
    "longitude": -84.0931235,
    "rating": 4.5,
    "reviewCount": 21,
    "reviewsPerScore": {
      "1": 2,
      "2": 0,
      "3": 1,
      "4": 0,
      "5": 18
    },
    "photosCount": 23,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGfaDWUqc7SaGhwIJUqhqV0AeJPYQFpwYJPvx07Lt1hyqHiSzNGQDCDMI9vyNhnP07qwsizs7RyDom-9cYf-NSnn_kkylAeFFY7iTQOZR1TrxHWYWy1KAEbqlGsv7SSTQ37oQOufdLgnjDA=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-ub1JQFlxhu8/AAAAAAAAAAI/AAAAAAAAAAA/2ecTGshgFdQ/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-8PM"
      ],
      "Tuesday": [
        "11:30AM-8PM"
      ],
      "Wednesday": [
        "11:30AM-8PM"
      ],
      "Thursday": [
        "11:30AM-8PM"
      ],
      "Friday": [
        "11:30AM-8PM"
      ],
      "Saturday": [
        "11:30AM-8PM"
      ],
      "Sunday": [
        "11:30AM-8PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/K+Ramen+Cafe/@33.974810999999995,-84.09312349999999,14z/data=!4m8!1m2!2m1!1sK+Ramen+Cafe!3m4!1s0x88f5bd4b39344871:0x8734d23fd29d08d6!8m2!3d33.974810999999995!4d-84.09312349999999",
    "placeId": "ChIJcUg0OUu99YgR1gid0j_SNIc",
    "subtypes": "Noodle shop",
    "amenities": {
      "delivery": false,
      "takeout": false,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "K-Ramen Cafe",
    "slug": "k-ramen-cafe",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 943-240-7918",
    "website": "https://kramencafe.com/",
    "address": "2131 Pleasant Hill Rd # 107, Duluth, GA 30096",
    "street": "2131 Pleasant Hill Rd # 107",
    "city": "Duluth",
    "county": "Gwinnett Place",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9547608,
    "longitude": -84.1343519,
    "rating": 5.0,
    "reviewCount": 7,
    "reviewsPerScore": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 7
    },
    "photosCount": 8,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJV7NcweDMtWB6hCDhNotoQM3mV0XnLVcy2RtvD76vr1meMKga5BTQx47Xrxl8R0KLXE3NYpmRVtQHiNSWZbUWbS9ENRkMI9BCMYSaQEiAsyMBlq2Zes5n6t-c4IT0sMmD0oNk-Z22HPEq=w800-h500-k-no",
    "logo": "",
    "businessStatus": "OPERATIONAL",
    "hours": {},
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/K-Ramen+Cafe/@33.954760799999995,-84.1343519,14z/data=!4m8!1m2!2m1!1sK-Ramen+Cafe!3m4!1s0x88f5a3006d3f9dc7:0xb504faa35198a769!8m2!3d33.954760799999995!4d-84.1343519",
    "placeId": "ChIJx50_bQCj9YgRaaeYUaP6BLU",
    "subtypes": "Korean restaurant",
    "amenities": {
      "delivery": false,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Lifting Noodles Ramen",
    "slug": "lifting-noodles-ramen",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-825-2990",
    "website": "http://liftingnoodlesramen.com/",
    "address": "3559 W Lawrenceville St #600, Duluth, GA 30096",
    "street": "3559 W Lawrenceville St #600",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 34.0031555,
    "longitude": -84.1451419,
    "rating": 4.0,
    "reviewCount": 13,
    "reviewsPerScore": {
      "1": 0,
      "2": 3,
      "3": 1,
      "4": 2,
      "5": 7
    },
    "photosCount": 102,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE8qetig_DwVNPQgMsQKDtfmlBV0nVeTkaAse4DJ1gvvkMdfTdJnXBV8bgRvQ9iBOpQDQM5A8U01DRHCEQ2fp2Es3hT4k1grbWigAmZZCBDb0FpD8D0NNeSoHFokOOQ8QsfGKww3w=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-NAtd2wX6F1k/AAAAAAAAAAI/AAAAAAAAAAA/g_dtD5Rjau0/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11:30AM-9PM"
      ],
      "Wednesday": [
        "Closed"
      ],
      "Thursday": [
        "11:30AM-9PM"
      ],
      "Friday": [
        "11:30AM-9PM"
      ],
      "Saturday": [
        "11:30AM-9PM"
      ],
      "Sunday": [
        "11:30AM-9PM"
      ]
    },
    "priceRange": "$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Lifting+Noodles+Ramen/@34.0031555,-84.1451419,14z/data=!4m8!1m2!2m1!1sLifting+Noodles+Ramen!3m4!1s0x88f5a3fc41e83069:0x94c2ad3ae9f93d82!8m2!3d34.0031555!4d-84.1451419",
    "placeId": "ChIJaTDoQfyj9YgRgj356TqtwpQ",
    "subtypes": "Ramen restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kumai Ramen",
    "slug": "kumai-ramen",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 470-246-5475",
    "website": "https://kumairamen.com/",
    "address": "3875 Venture Dr a2, Duluth, GA 30096",
    "street": "3875 Venture Dr a2",
    "city": "Duluth",
    "county": "Gwinnett Place",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 33.9522744,
    "longitude": -84.1414619,
    "rating": 4.3,
    "reviewCount": 299,
    "reviewsPerScore": {
      "1": 21,
      "2": 6,
      "3": 24,
      "4": 68,
      "5": 180
    },
    "photosCount": 444,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH-Rc2X97PJqvy3lnZzmT7OgWfkbp9kMwmoFWQ88Dr2yprNTP7xy6XWPHf0tvD1AQ6lP1tdYU77NsbuKXA9kQk7woGqBsIl1TjTBEYOPHhsMzWEWpZ8xnAKG7Ez6BgWO5CCJkDE6A=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-DasV7bRwYik/AAAAAAAAAAI/AAAAAAAAAAA/dy9pM5RSkkY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-8PM"
      ],
      "Tuesday": [
        "11AM-8PM"
      ],
      "Wednesday": [
        "Closed"
      ],
      "Thursday": [
        "11AM-8PM"
      ],
      "Friday": [
        "11AM-8PM"
      ],
      "Saturday": [
        "11AM-8PM"
      ],
      "Sunday": [
        "11AM-8PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kumai+Ramen/@33.9522744,-84.1414619,14z/data=!4m8!1m2!2m1!1sKumai+Ramen!3m4!1s0x88f5a30a30711f5d:0xeac381e9539efc1c!8m2!3d33.9522744!4d-84.1414619",
    "placeId": "ChIJXR9xMAqj9YgRHPyeU-mBw-o",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "RINOO",
    "slug": "rinoo",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-242-8363",
    "website": "https://sites.google.com/view/rinoo-rice",
    "address": "3455 Peachtree Industrial Blvd STE 230, Duluth, GA 30096",
    "street": "3455 Peachtree Industrial Blvd STE 230",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30096",
    "latitude": 34.0053467,
    "longitude": -84.1736107,
    "rating": 4.6,
    "reviewCount": 99,
    "reviewsPerScore": {
      "1": 4,
      "2": 3,
      "3": 6,
      "4": 3,
      "5": 83
    },
    "photosCount": 232,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFkUrY3e-Y8fsiFh5PGfa-QqDjmPBPNBFW6Dxv2X6dysmeXVCrBleyElbEsCzyVwJ4U0zlQabsBzT9eCMZ-f6r_PZudOy7WKOl_2TwTDZabja0HqF6Gw2lGgBOrCdWnp0-2meY=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-I8Hs-FiYOng/AAAAAAAAAAI/AAAAAAAAAAA/KoyI1rLeHEc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9PM"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/RINOO/@34.0053467,-84.1736107,14z/data=!4m8!1m2!2m1!1sRINOO!3m4!1s0x88f5a38f7883112f:0x82eb329183ad088e!8m2!3d34.0053467!4d-84.1736107",
    "placeId": "ChIJLxGDeI-j9YgRjgitg5Ey64I",
    "subtypes": "Ramen restaurant, Asian fusion restaurant, Box lunch supplier, Fast food restaurant, Korean restaurant, Vegetarian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Mizumi Ramen & Whisky Bar",
    "slug": "mizumi-ramen-whisky-bar",
    "citySlug": "duluth",
    "stateSlug": "ga",
    "phone": "+1 678-373-3985",
    "website": "",
    "address": "1611 Satellite Blvd NW Suite 11, Duluth, GA 30097",
    "street": "1611 Satellite Blvd NW Suite 11",
    "city": "Duluth",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30097",
    "latitude": 34.0013883,
    "longitude": -84.0824093,
    "rating": 4.2,
    "reviewCount": 623,
    "reviewsPerScore": {
      "1": 60,
      "2": 21,
      "3": 45,
      "4": 86,
      "5": 411
    },
    "photosCount": 424,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG4mitehnRu-r6jtHf3YBBCW6o7_3FTy97Crkqquap2efFYcdNsMTIODHgd9HDLMWC8_p14TqxdN8LNVtinaPMy7VlEXiNU8a_gViVbVGl5eODL5TRD7F77Nh0AtBRFtnkSgSRP=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-TaxkVMLYhY8/AAAAAAAAAAI/AAAAAAAAAAA/tQIYvKjYys4/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "CLOSED_PERMANENTLY",
    "hours": {},
    "priceRange": "$",
    "description": "Noodle soups, rice dishes & other Japanese eats served in a low-key setup with counter seating.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Mizumi+Ramen+%26+Whisky+Bar/@34.001388299999995,-84.0824093,14z/data=!4m8!1m2!2m1!1sMizumi+Ramen+%26+Whisky+Bar!3m4!1s0x88f5bd5d23b1ffb7:0x35cd7c9d6a1a4b6f!8m2!3d34.001388299999995!4d-84.0824093",
    "placeId": "ChIJt_-xI1299YgRb0saap18zTU",
    "subtypes": "Ramen restaurant, Bar",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": false,
      "trendy": false,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kyuramen x TBaar - West Midtown Atlanta GA",
    "slug": "kyuramen-x-tbaar-west-midtown-atlanta-ga",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-855-5418",
    "website": "https://www.kyuramen.com/",
    "address": "1801 Howell Mill Rd NW #460, Atlanta, GA 30318",
    "street": "1801 Howell Mill Rd NW #460",
    "city": "Atlanta",
    "county": "Berkeley Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.8032771,
    "longitude": -84.4122855,
    "rating": 4.4,
    "reviewCount": 151,
    "reviewsPerScore": {
      "1": 10,
      "2": 6,
      "3": 13,
      "4": 10,
      "5": 112
    },
    "photosCount": 742,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhHfs7mqdj_sbSz2d-aE84IDrgDirZZXRuAEUJC8hMxvUAmTCaHfS1gIMqRi1JS1fYNvo7lXDli_TkslcQMnZOWYGYYLZmYJm9n9_-doRoTDh0hq8K1HOJcc9eigVTuXVLj9iGKHk1W_sego4w-6zIaOHlKiHHdGoBuMl38z7AMPruZnNJq83gaGRw=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-wkzz7WiIO3k/AAAAAAAAAAI/AAAAAAAAAAA/iBUN84HRE-8/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kyuramen+x+TBaar+-+West+Midtown+Atlanta+GA/@33.803277099999995,-84.4122855,14z/data=!4m8!1m2!2m1!1sKyuramen+x+TBaar+-+West+Midtown+Atlanta+GA!3m4!1s0x88f505cd6912bbf5:0x248e99b8e335f7a4!8m2!3d33.803277099999995!4d-84.4122855",
    "placeId": "ChIJ9bsSac0F9YgRpPc147iZjiQ",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": false,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "TENSAN Ramen",
    "slug": "tensan-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-815-8882",
    "website": "https://www.tensanatlanta.com/%3Futm_source%3Dgoogle%26utm_medium%3Dwix_google_business_profile%26utm_campaign%3D4210231220427330082",
    "address": "475 Bill Kennedy Wy SE B, Atlanta, GA 30316",
    "street": "475 Bill Kennedy Wy SE B",
    "city": "Atlanta",
    "county": "Glenwood Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30316",
    "latitude": 33.7407891,
    "longitude": -84.3583014,
    "rating": 4.6,
    "reviewCount": 59,
    "reviewsPerScore": {
      "1": 3,
      "2": 2,
      "3": 0,
      "4": 4,
      "5": 50
    },
    "photosCount": 56,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEOyWxmTVwGcfzUTsStQaSoX1kRshXAy0Zunkr5qBHpAxreePviIAXtQtFk8_egFlMuhR5Hg4q2DqgAojI8zkki1JbPz0X9lnVbM1xbTLfh4W2GeNgsc6sDQqatw8Id5JJFIg3_Rg=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-2zNj5ouwesQ/AAAAAAAAAAI/AAAAAAAAAAA/nR2AbklK3Xs/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11:30AM-10PM"
      ],
      "Sunday": [
        "11:30AM-9:30PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/TENSAN+Ramen/@33.7407891,-84.3583014,14z/data=!4m8!1m2!2m1!1sTENSAN+Ramen!3m4!1s0x88f503c094dcf097:0xaef8cbbffe3dfc2f!8m2!3d33.7407891!4d-84.3583014",
    "placeId": "ChIJl_DclMAD9YgRL_w9_r_L-K4",
    "subtypes": "Asian fusion restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Lifting Noodles Ramen",
    "slug": "lifting-noodles-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "",
    "website": "http://liftingnoodlesramen.com/",
    "address": "477 Flat Shoals Ave SE, Atlanta, GA 30316",
    "street": "477 Flat Shoals Ave SE",
    "city": "Atlanta",
    "county": "East Atlanta Village",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30316",
    "latitude": 33.7410039,
    "longitude": -84.3464861,
    "rating": 4.5,
    "reviewCount": 308,
    "reviewsPerScore": {
      "1": 6,
      "2": 11,
      "3": 19,
      "4": 58,
      "5": 214
    },
    "photosCount": 266,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE3CVaAkvQc4WIXVk_XMMlGkm7fG6Sz2eQO7VopBrFw1nVL4GwcKa5rFcuHp_G2CsnYRPwJVV7OuUmxtOrNBKYUnVW0pQ-lTZj0dSCwD32nW2zi9jZ-3rM4sjR2I-0ijdO7mAbo=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-Jcyg7cOLZEQ/AAAAAAAAAAI/AAAAAAAAAAA/XIAoIBLIwFg/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11:30AM-9PM"
      ],
      "Wednesday": [
        "11:30AM-9PM"
      ],
      "Thursday": [
        "11:30AM-9PM"
      ],
      "Friday": [
        "11:30AM-9PM"
      ],
      "Saturday": [
        "11:30AM-9PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$",
    "description": "Traditional & modern noodle soups, plus bubble teas, are prepared in a bustling food-court setting.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Lifting+Noodles+Ramen/@33.741003899999995,-84.34648609999999,14z/data=!4m8!1m2!2m1!1sLifting+Noodles+Ramen!3m4!1s0x88f5015b9e9f4d29:0xc981251efacce4e6!8m2!3d33.741003899999995!4d-84.34648609999999",
    "placeId": "ChIJKU2fnlsB9YgR5uTM-h4lgck",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": false,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": false,
      "creditCards": false
    }
  },
  {
    "name": "Okiboru - Sandy Springs",
    "slug": "okiboru-sandy-springs",
    "citySlug": "sandy-springs",
    "stateSlug": "ga",
    "phone": "+1 678-498-6530",
    "website": "http://okiboru.com/",
    "address": "6125 Roswell Rd Suite 800, Sandy Springs, GA 30328",
    "street": "6125 Roswell Rd Suite 800",
    "city": "Sandy Springs",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30328",
    "latitude": 33.9219327,
    "longitude": -84.378873,
    "rating": 4.6,
    "reviewCount": 1231,
    "reviewsPerScore": {
      "1": 33,
      "2": 25,
      "3": 53,
      "4": 134,
      "5": 986
    },
    "photosCount": 1680,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHhR2BicAQtfnLBCB2-dnVHz1VBAvkFm3C45TaZ0R1YFG5NqSRevxUIUOsgOcIEBkAzP2eLPS8kklLvPG9h9BYfOvppZAlTgEp1L-DpRhRlnfkk_1MQygKm1I4eBjrQ7W44JMeK392uTpU=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-wMbmplpvedg/AAAAAAAAAAI/AAAAAAAAAAA/AtzQpnGx9ls/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Tuesday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Wednesday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Thursday": [
        "11:30AM-3PM",
        "5:30-9PM"
      ],
      "Friday": [
        "11:30AM-3PM",
        "5:30-10PM"
      ],
      "Saturday": [
        "11:30AM-10PM"
      ],
      "Sunday": [
        "11:30AM-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "Lively restaurant offering lauded noodle dishes, wraps & bao buns in a modern dining area.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Okiboru+-+Sandy+Springs/@33.9219327,-84.378873,14z/data=!4m8!1m2!2m1!1sOkiboru+-+Sandy+Springs!3m4!1s0x88f50fcbee22a319:0x7189dc84ee8372d!8m2!3d33.9219327!4d-84.378873",
    "placeId": "ChIJGaMi7ssP9YgRLTfoTsidGAc",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kyuramen x Tbaar",
    "slug": "kyuramen-x-tbaar",
    "citySlug": "sandy-springs",
    "stateSlug": "ga",
    "phone": "+1 404-963-7326",
    "website": "http://www.kyuramen.com/",
    "address": "6623 Roswell Rd NE Suite g, Sandy Springs, GA 30328",
    "street": "6623 Roswell Rd NE Suite g",
    "city": "Sandy Springs",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30328",
    "latitude": 33.9355851,
    "longitude": -84.3770354,
    "rating": 4.3,
    "reviewCount": 366,
    "reviewsPerScore": {
      "1": 26,
      "2": 11,
      "3": 35,
      "4": 54,
      "5": 240
    },
    "photosCount": 1036,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhF0NcNfUf8bc5zBltY1h0nnlkbPZo9k62TZllwV0sREk1QXtLdF2hj_CJ-aOGrNoAc8FhUB6GKVMa3d3VLDtQi4aCHAJLUcfvrLbP2IimDl51QrGdwAQk6SmDDfoww35S2VzzS9l8w7l-4iCuLqBQ3xVoZhXXX9B_Oz6NvuTW6-MIzqcdNcZdgi=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-QbsunhuXQh0/AAAAAAAAAAI/AAAAAAAAAAA/uPqx38wJ5pg/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kyuramen+x+Tbaar/@33.9355851,-84.3770354,14z/data=!4m8!1m2!2m1!1sKyuramen+x+Tbaar!3m4!1s0x88f50f7df859f71f:0x52df3d7c03c9f5c2!8m2!3d33.9355851!4d-84.3770354",
    "placeId": "ChIJH_dZ-H0P9YgRwvXJA3w931I",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "ALOHA POKE & RAMEN",
    "slug": "aloha-poke-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-861-1579",
    "website": "https://chowbusmkt.wixsite.com/website-1088",
    "address": "4400 Ashford Dunwoody Rd NE Suite 1380, Atlanta, GA 30346",
    "street": "4400 Ashford Dunwoody Rd NE Suite 1380",
    "city": "Atlanta",
    "county": "Perimeter Center",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30346",
    "latitude": 33.9238128,
    "longitude": -84.3409798,
    "rating": 4.0,
    "reviewCount": 44,
    "reviewsPerScore": {
      "1": 6,
      "2": 4,
      "3": 0,
      "4": 6,
      "5": 28
    },
    "photosCount": 32,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEe7Jw9YrymaM78b8aaGIlkMlIFixRQdB7vLNRoU2Z2pwjrYU6sPaGCo9j1oEXRyGx0EOExNDvYZoIwhV3PE9sxIDCmO9mi-PdWU_x8M47tAb5H-VyMpZl1U4IJtrEjQSYC-MGg=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-pga0FSOJGPE/AAAAAAAAAAI/AAAAAAAAAAA/WVlZhI9pVRw/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "10AM-8PM"
      ],
      "Tuesday": [
        "10AM-8PM"
      ],
      "Wednesday": [
        "10AM-8PM"
      ],
      "Thursday": [
        "10AM-8PM"
      ],
      "Friday": [
        "10AM-8PM"
      ],
      "Saturday": [
        "10AM-8PM"
      ],
      "Sunday": [
        "11AM-7PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/ALOHA+POKE+%26+RAMEN/@33.9238128,-84.3409798,14z/data=!4m8!1m2!2m1!1sALOHA+POKE+%26+RAMEN!3m4!1s0x88f509efd5c6f593:0xc6a89e97da33dea2!8m2!3d33.9238128!4d-84.3409798",
    "placeId": "ChIJk_XG1e8J9YgRot4z2peeqMY",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kawa 18 Ramen",
    "slug": "kawa-18-ramen",
    "citySlug": "forest-park",
    "stateSlug": "ga",
    "phone": "+1 404-968-9296",
    "website": "https://www.kawa18ramenga.com/",
    "address": "4035 Jonesboro Rd Suite 250, Forest Park, GA 30297",
    "street": "4035 Jonesboro Rd Suite 250",
    "city": "Forest Park",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30297",
    "latitude": 33.6448347,
    "longitude": -84.3646378,
    "rating": 4.2,
    "reviewCount": 366,
    "reviewsPerScore": {
      "1": 28,
      "2": 19,
      "3": 33,
      "4": 48,
      "5": 238
    },
    "photosCount": 378,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFkgfKenTCxdHdeZITJf02BZa9-gT5ftTO7frvP6FFev_Qr9GYO8nmslbE9HjO37SONjud5Tr7nKVez-7VD4-xtMtfczXRYtxDNSUth6RRnBPzlrjiPPDvleK-Aq0yCdS9APg1q=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-kjUQVlhk1_E/AAAAAAAAAAI/AAAAAAAAAAA/jtxdx6x9j2g/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-9PM"
      ],
      "Saturday": [
        "11AM-9PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.kawa18ramenga.com/",
    "googleMapsLink": "https://www.google.com/maps/place/Kawa+18+Ramen/@33.6448347,-84.3646378,14z/data=!4m8!1m2!2m1!1sKawa+18+Ramen!3m4!1s0x88f4fd65476bc953:0x8eeff392d60752a7!8m2!3d33.6448347!4d-84.3646378",
    "placeId": "ChIJU8lrR2X99IgRp1IH1pLz744",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Lifting Noodles Ramen",
    "slug": "lifting-noodles-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-800-2735",
    "website": "http://liftingnoodlesramen.com/",
    "address": "925 Battery Ave SE Ste. 1100, Atlanta, GA 30339",
    "street": "925 Battery Ave SE Ste. 1100",
    "city": "Atlanta",
    "county": "Cumberland",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30339",
    "latitude": 33.8878751,
    "longitude": -84.4705433,
    "rating": 4.3,
    "reviewCount": 309,
    "reviewsPerScore": {
      "1": 31,
      "2": 17,
      "3": 16,
      "4": 23,
      "5": 222
    },
    "photosCount": 393,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEflRV6rZG9Sl1Cbcsbq_pB4P1d3pAX1cqKuC8FsHKF0baY9HMvBwP5yPM0vSkwUK5-6gAoefgDnmbXkbfBGu_xakcwWqsV7ItAgfmHHko1Z-WLIav6yWHW7D-C3aEIL1PtNuVEGA=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-It7Tv8TgbBw/AAAAAAAAAAI/AAAAAAAAAAA/wSWxer72U0w/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10:30PM"
      ],
      "Tuesday": [
        "11AM-10:30PM"
      ],
      "Wednesday": [
        "11AM-10:30PM"
      ],
      "Thursday": [
        "11AM-10:30PM"
      ],
      "Friday": [
        "11AM-11:45PM"
      ],
      "Saturday": [
        "11AM-11:45PM"
      ],
      "Sunday": [
        "11AM-10:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Lifting+Noodles+Ramen/@33.887875099999995,-84.4705433,14z/data=!4m8!1m2!2m1!1sLifting+Noodles+Ramen!3m4!1s0x88f5112c546a8693:0x9503156fc74592ff!8m2!3d33.887875099999995!4d-84.4705433",
    "placeId": "ChIJk4ZqVCwR9YgR_5JFx28VA5U",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "JINYA Ramen Bar - Sandy Springs",
    "slug": "jinya-ramen-bar-sandy-springs",
    "citySlug": "sandy-springs",
    "stateSlug": "ga",
    "phone": "+1 404-600-6974",
    "website": "https://www.jinyaramenbar.com/locations/sandy-springs/%3Futm_medium%3Dsoci%26utm_source%3Dgmb",
    "address": "5975 Roswell Rd Suite B217, Sandy Springs, GA 30328",
    "street": "5975 Roswell Rd Suite B217",
    "city": "Sandy Springs",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30328",
    "latitude": 33.9184522,
    "longitude": -84.3773301,
    "rating": 4.6,
    "reviewCount": 3300,
    "reviewsPerScore": {
      "1": 114,
      "2": 62,
      "3": 116,
      "4": 455,
      "5": 2553
    },
    "photosCount": 2949,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH8J8nI56mlLimK4YsKJapW8TWhVHJN1BT-sN3_kZlxd3Jr01pWGZUBRNvdla8zHdCxKJ7HsKKlhv71fArOvfcjhVKZGRjFIsy6LQtwcqQGNlkG1rmJwXP6yDjeO6sZKzgSezI=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-CkkmnwfZIR0/AAAAAAAAAAI/AAAAAAAAAAA/2gnqN589NWA/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "Casual, modern Japanese chain serving varieties of ramen noodle soup & other traditional dishes.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/JINYA+Ramen+Bar+-+Sandy+Springs/@33.9184522,-84.3773301,14z/data=!4m8!1m2!2m1!1sJINYA+Ramen+Bar+-+Sandy+Springs!3m4!1s0x88f50e9432e05599:0x726396db4af3458f!8m2!3d33.9184522!4d-84.3773301",
    "placeId": "ChIJmVXgMpQO9YgRj0XzStuWY3I",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kumo Ramen & Tea",
    "slug": "kumo-ramen-tea",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-228-2790",
    "website": "https://pos.chowbus.com/online-ordering/store/kumo-ramen-tea/15186%3Freferrer%3Dgoogle_food_ordering",
    "address": "231 Peachtree St FC-13, Atlanta, GA 30303",
    "street": "231 Peachtree St FC-13",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.7604528,
    "longitude": -84.3870292,
    "rating": 3.8,
    "reviewCount": 60,
    "reviewsPerScore": {
      "1": 12,
      "2": 1,
      "3": 7,
      "4": 5,
      "5": 35
    },
    "photosCount": 244,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhGAF7dAlxbIALTUKb83sUlhNCtzG0hhkxeB8hyB7157J3ZQA41qOJEy1tp87keeSQpqTrnPoPc17SGSBis8SkS_Zc7pGeVwnIrWb-UkdyP_vv9DHYTaH0CYWJeOfEv44-nK2-7YQr3YteA_iZsRASh1ebDHVlJj-C_OO9g90Y1KN4ew2lCoPaU4=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-5UMIokuoABA/AAAAAAAAAAI/AAAAAAAAAAA/qWMEZR_tuQI/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-5:30PM"
      ],
      "Tuesday": [
        "11AM-5:30PM"
      ],
      "Wednesday": [
        "11AM-5:30PM"
      ],
      "Thursday": [
        "11AM-5:30PM"
      ],
      "Friday": [
        "11AM-5:30PM"
      ],
      "Saturday": [
        "11AM-5PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kumo+Ramen+%26+Tea/@33.760452799999996,-84.3870292,14z/data=!4m8!1m2!2m1!1sKumo+Ramen+%26+Tea!3m4!1s0x88f5053f6b8629c3:0x12d9190ab454ba37!8m2!3d33.760452799999996!4d-84.3870292",
    "placeId": "ChIJwymGaz8F9YgRN7pUtAoZ2RI",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Hikaru Ramen",
    "slug": "hikaru-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 678-800-8004",
    "website": "https://hikaruramen-codafoodhall.com/",
    "address": "756 W Peachtree St NW, Atlanta, GA 30308",
    "street": "756 W Peachtree St NW",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30308",
    "latitude": 33.7752992,
    "longitude": -84.388508,
    "rating": 4.5,
    "reviewCount": 21,
    "reviewsPerScore": {
      "1": 1,
      "2": 0,
      "3": 2,
      "4": 2,
      "5": 16
    },
    "photosCount": 142,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFFsaZFJaE00IJTtA8PTi8Jsrp5HtNcXnu3CFSE0fbzM1ePsjIVz1hYMuumMTR3Q20zwdCAoW0-5U7e8WtLq9Zm-841RhVHpoX7F8k-XL74TK_Sg87XeB8JTkywR_k7OpywrS68LbFDMHk_=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-WfiRE48241w/AAAAAAAAAAI/AAAAAAAAAAA/T5W0Lt3LADQ/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-8PM"
      ],
      "Tuesday": [
        "11AM-8PM"
      ],
      "Wednesday": [
        "11AM-8PM"
      ],
      "Thursday": [
        "11AM-8PM"
      ],
      "Friday": [
        "11AM-8PM"
      ],
      "Saturday": [
        "11AM-8PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Hikaru+Ramen/@33.7752992,-84.388508,14z/data=!4m8!1m2!2m1!1sHikaru+Ramen!3m4!1s0x88f5055d251e2b91:0x4ba65566493c911d!8m2!3d33.7752992!4d-84.388508",
    "placeId": "ChIJkSseJV0F9YgRHZE8SWZVpks",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Wagyu House Atlanta",
    "slug": "wagyu-house-atlanta",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-263-3762",
    "website": "https://wagyuhouse.group/project/wagyu-house-atlanta/",
    "address": "1042 Northside Dr NW suite 1300, Atlanta, GA 30318",
    "street": "1042 Northside Dr NW suite 1300",
    "city": "Atlanta",
    "county": "Home Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7833333,
    "longitude": -84.4086198,
    "rating": 4.9,
    "reviewCount": 9097,
    "reviewsPerScore": {
      "1": 102,
      "2": 55,
      "3": 70,
      "4": 340,
      "5": 8530
    },
    "photosCount": 2744,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEo6MlYwRUUFCBg3V0fLwlf0aIAgsy_WjpOamASmOhQIgp_1Jo9KltDuwv3wXqGo1vNYBKXRw1FyM5FCzlxVTCjjJQrM3NZKLJ1JlnA3rh_BBIi46-wBPAb-4mGHe7tQr1qwEMDEX4_OUPG=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-QJAMjuKUiXg/AAAAAAAAAAI/AAAAAAAAAAA/K7iPcBwPXOI/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "5PM-12AM"
      ],
      "Tuesday": [
        "5PM-12AM"
      ],
      "Wednesday": [
        "5PM-12AM"
      ],
      "Thursday": [
        "5PM-12AM"
      ],
      "Friday": [
        "5PM-1AM"
      ],
      "Saturday": [
        "12PM-1AM"
      ],
      "Sunday": [
        "12-11PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.opentable.com/r/wagyu-house-atlanta",
    "googleMapsLink": "https://www.google.com/maps/place/Wagyu+House+Atlanta/@33.783333299999995,-84.4086198,14z/data=!4m8!1m2!2m1!1sWagyu+House+Atlanta!3m4!1s0x88f505b94cfc7743:0xe8c2741729c83200!8m2!3d33.783333299999995!4d-84.4086198",
    "placeId": "ChIJQ3f8TLkF9YgRADLIKRd0wug",
    "subtypes": "Japanese restaurant, Barbecue area, Buffet restaurant, Yakiniku restaurant",
    "amenities": {
      "delivery": false,
      "takeout": false,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Ginya Izakaya",
    "slug": "ginya-izakaya",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-355-5621",
    "website": "https://ginyaizakayaatlanta.com/%3Futm_source%3Dgoogle",
    "address": "1700 Northside Dr NW A-6, Atlanta, GA 30318",
    "street": "1700 Northside Dr NW A-6",
    "city": "Atlanta",
    "county": "Berkeley Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.8005695,
    "longitude": -84.4084883,
    "rating": 4.5,
    "reviewCount": 1814,
    "reviewsPerScore": {
      "1": 77,
      "2": 44,
      "3": 77,
      "4": 312,
      "5": 1304
    },
    "photosCount": 1939,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAENWRX0cMjFQczRrgryXMPathT1uCKvuidmOGf-PXdN5ApB5oHkZNlW3_ZlwM8yL5Cpy_6vvQMwu-2xF3gKzJ9nC41sAVgHrWhYhbV3ViFpsAl45DU2hFNw4kW0YjCUDtD72qGLIGtxigp2=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/--gCLIdJ5ND8/AAAAAAAAAAI/AAAAAAAAAAA/8PSBLws9EsY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "5-11PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "5-11PM"
      ],
      "Thursday": [
        "5-11PM"
      ],
      "Friday": [
        "5-11PM"
      ],
      "Saturday": [
        "5-11PM"
      ],
      "Sunday": [
        "5-11PM"
      ]
    },
    "priceRange": "$$",
    "description": "Casual Japanese eatery serving ramen, sushi, grilled meat skewers & other small plates, plus sake.",
    "menuLink": "",
    "orderLinks": "https://www.google.com/maps/reserve/v/dine/c/CYIJONPuS54?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Ginya+Izakaya/@33.8005695,-84.4084883,14z/data=!4m8!1m2!2m1!1sGinya+Izakaya!3m4!1s0x88f504e319172161:0x5e2c0ec51b3b1f93!8m2!3d33.8005695!4d-84.4084883",
    "placeId": "ChIJYSEXGeME9YgRkx87G8UOLF4",
    "subtypes": "Ramen restaurant, Asian restaurant, Bar, Izakaya restaurant, Noodle shop, Japanese restaurant, Seafood restaurant, Sushi restaurant, Udon noodle restaurant, Vegetarian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Wagaya - Westside",
    "slug": "wagaya-westside",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-575-5799",
    "website": "http://www.wagayaatlanta.com/",
    "address": "339 14th St NW, Atlanta, GA 30318",
    "street": "339 14th St NW",
    "city": "Atlanta",
    "county": "Home Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7863662,
    "longitude": -84.3982613,
    "rating": 4.6,
    "reviewCount": 1837,
    "reviewsPerScore": {
      "1": 46,
      "2": 35,
      "3": 95,
      "4": 316,
      "5": 1345
    },
    "photosCount": 1819,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFe6gbhpEc79e8B5cdkM-18PZtJLkO-qNNEDcSNSO3_IkJdwaoEqMTMKHjB3YRasGrqztZBVkvRFoRnbhdKdrw8yLylIFyZG-ZoX0J-jREvGeg4KycXcMhs2_LqFGmERAX0821yOQ=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-r8LkOJwKo4s/AAAAAAAAAAI/AAAAAAAAAAA/7vrnY30Q854/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-2:30PM",
        "5-10PM"
      ],
      "Tuesday": [
        "11:30AM-2:30PM",
        "5-10PM"
      ],
      "Wednesday": [
        "11:30AM-2:30PM",
        "5-10PM"
      ],
      "Thursday": [
        "11:30AM-2:30PM",
        "5-10PM"
      ],
      "Friday": [
        "11:30AM-2:30PM",
        "5-10:30PM"
      ],
      "Saturday": [
        "12-3PM",
        "5-10:30PM"
      ],
      "Sunday": [
        "12-3PM",
        "5-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "Intimate spot serving homey Japanese food, from classic noodle soups & sushi to tonkatsu plates.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Wagaya+-+Westside/@33.786366199999996,-84.3982613,14z/data=!4m8!1m2!2m1!1sWagaya+-+Westside!3m4!1s0x88f504f5d7376a6b:0xf4ccbc33d7c234f5!8m2!3d33.786366199999996!4d-84.3982613",
    "placeId": "ChIJa2o31_UE9YgR9TTC1zO8zPQ",
    "subtypes": "Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Yami Yami",
    "slug": "yami-yami",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-522-0007",
    "website": "https://yamiyamiatl.com/",
    "address": "231 Peachtree Rd NE, Atlanta, GA 30303",
    "street": "231 Peachtree Rd NE",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.760732,
    "longitude": -84.3867427,
    "rating": 4.1,
    "reviewCount": 247,
    "reviewsPerScore": {
      "1": 20,
      "2": 14,
      "3": 22,
      "4": 51,
      "5": 140
    },
    "photosCount": 186,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFltf9hYf4uJLyKfW7XWvGO6LLeHRrb3hPiVRH6pWH8sXtnbCxvBFhoQ5lqOrPWQwyosJXFHAxFO0EHPlW9w6flil7mtFhCtSfB82xjPG2FuhloATzqpPIFPmyriOSBmduQkaOn=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-TCOkVxGqw3s/AAAAAAAAAAI/AAAAAAAAAAA/P5CEWufKoMg/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "10AM-7PM"
      ],
      "Tuesday": [
        "10AM-7PM"
      ],
      "Wednesday": [
        "10AM-7PM"
      ],
      "Thursday": [
        "10AM-7PM"
      ],
      "Friday": [
        "10AM-7PM"
      ],
      "Saturday": [
        "10AM-7PM"
      ],
      "Sunday": [
        "10AM-7PM"
      ]
    },
    "priceRange": "",
    "description": "Mall food court option with a cafeteria-style setup supplying Japanese staples like sushi & noodles.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Yami+Yami/@33.760732,-84.3867427,14z/data=!4m8!1m2!2m1!1sYami+Yami!3m4!1s0x88f5047846849c47:0x4647972cfbd1193c!8m2!3d33.760732!4d-84.3867427",
    "placeId": "ChIJR5yERngE9YgRPBnR-yyXR0Y",
    "subtypes": "Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": false,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Noodoh Asian Fusion & Bar",
    "slug": "noodoh-asian-fusion-bar",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-228-1663",
    "website": "https://noodohatl.com/",
    "address": "126 Renaissance Pkwy NE unit 100, Atlanta, GA 30308",
    "street": "126 Renaissance Pkwy NE unit 100",
    "city": "Atlanta",
    "county": "Downtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30308",
    "latitude": 33.7688026,
    "longitude": -84.3831481,
    "rating": 4.6,
    "reviewCount": 587,
    "reviewsPerScore": {
      "1": 22,
      "2": 17,
      "3": 21,
      "4": 40,
      "5": 487
    },
    "photosCount": 689,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHWteC6q0i3VUjRix-D1cK6DxcuJ5HP_Ac5Dd_qnyKB-khWZdn1Jd5O80NQY1p_143lrFbDk1zwAvgjqcyobFFFwmmp2wCnaKYxLy4CPKszMX4EmAwr7WTJuihKm5zLYqi2tDqv5x2Cq80=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-Y1Y1uUiY1b8/AAAAAAAAAAI/AAAAAAAAAAA/VDNKOmbH_1w/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "12-11PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "12-11PM"
      ],
      "Thursday": [
        "12-11PM"
      ],
      "Friday": [
        "12-11PM"
      ],
      "Saturday": [
        "12-11PM"
      ],
      "Sunday": [
        "12-11PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.google.com/maps/reserve/v/dine/c/wLcc4U4Q0Jw?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Noodoh+Asian+Fusion+%26+Bar/@33.7688026,-84.3831481,14z/data=!4m8!1m2!2m1!1sNoodoh+Asian+Fusion+%26+Bar!3m4!1s0x88f505aaacfc59d5:0xc36c5b006d12cf07!8m2!3d33.7688026!4d-84.3831481",
    "placeId": "ChIJ1Vn8rKoF9YgRB88SbQBbbMM",
    "subtypes": "Chinese restaurant, Asian fusion restaurant, Asian restaurant, Fusion restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Asian Fusion",
    "slug": "asian-fusion",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-549-7045",
    "website": "https://asianfusiongatech.com/",
    "address": "75 5th St NW #170, Atlanta, GA 30308",
    "street": "75 5th St NW #170",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30308",
    "latitude": 33.7770234,
    "longitude": -84.3892727,
    "rating": 4.8,
    "reviewCount": 1125,
    "reviewsPerScore": {
      "1": 15,
      "2": 10,
      "3": 17,
      "4": 51,
      "5": 1032
    },
    "photosCount": 526,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhHPHZHbTxSNGNpcqEM9T-HqGhpK5PDmMCxnFOCQr6_SbPA4T5ftSLrJWqw6NwWefCxUcYfa_mPh-feBi0OhzwiMnrZn-O5LDZ2mVXDqzJQiQei_6IXixHQXeiR7CPg7THfIDTkUhLlWXSPUZs8CtZWGzl6bSWJ8kuR0fEsinHUcFw7Q4dEidBKIeg=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-547dC6CuO94/AAAAAAAAAAI/AAAAAAAAAAA/EKHlU1Zb2Nc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "12-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Asian+Fusion/@33.7770234,-84.38927269999999,14z/data=!4m8!1m2!2m1!1sAsian+Fusion!3m4!1s0x88f505f8943f52fd:0x9aa766851104da40!8m2!3d33.7770234!4d-84.38927269999999",
    "placeId": "ChIJ_VI_lPgF9YgRQNoEEYVmp5o",
    "subtypes": "Asian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Nagomiya",
    "slug": "nagomiya",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-975-3851",
    "website": "http://nagomiyaatlanta.com/",
    "address": "1010 W Peachtree St NW Ste 400, Atlanta, GA 30309",
    "street": "1010 W Peachtree St NW Ste 400",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7817668,
    "longitude": -84.3882804,
    "rating": 4.5,
    "reviewCount": 448,
    "reviewsPerScore": {
      "1": 31,
      "2": 14,
      "3": 13,
      "4": 53,
      "5": 337
    },
    "photosCount": 731,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGpV5duskaCt0J-nHRBqWtexq50BaZ8GGWX1iGjd5YfGwSKSq8fskGPiW4cXis91aggDfPcIYNkcLLGETytN2air8jjbP-n3MF9C2PbDHep-cTITGMFAh7DPknF7-mdmdkznesd=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-bttmPOf26gw/AAAAAAAAAAI/AAAAAAAAAAA/S0Il-_XIHmg/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11:30AM-2PM",
        "5:30-9:30PM"
      ],
      "Wednesday": [
        "11:30AM-2PM",
        "5:30-9:30PM"
      ],
      "Thursday": [
        "11:30AM-2PM",
        "5:30-9:30PM"
      ],
      "Friday": [
        "11:30AM-2:30PM",
        "5:30-10:30PM"
      ],
      "Saturday": [
        "12-3PM",
        "5:30-10:30PM"
      ],
      "Sunday": [
        "12-3PM",
        "5:30-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://tables.toasttab.com/restaurants/edaa7171-63ee-41e5-b757-aacca96f6e39/findTime, https://www.google.com/maps/reserve/v/dine/c/4x7CJT4Dl5I?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Nagomiya/@33.7817668,-84.3882804,14z/data=!4m8!1m2!2m1!1sNagomiya!3m4!1s0x88f5055d41b159a9:0x4c86266c1bfa08dd!8m2!3d33.7817668!4d-84.3882804",
    "placeId": "ChIJqVmxQV0F9YgR3Qj6G2wmhkw",
    "subtypes": "Japanese restaurant, Modern izakaya restaurant, Sushi restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Pelicana Chicken Atlanta",
    "slug": "pelicana-chicken-atlanta",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-856-3960",
    "website": "https://www.pelicanausa.com/home",
    "address": "420 14th St NW #100A, Atlanta, GA 30318",
    "street": "420 14th St NW #100A",
    "city": "Atlanta",
    "county": "Home Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7859285,
    "longitude": -84.4008723,
    "rating": 4.9,
    "reviewCount": 11759,
    "reviewsPerScore": {
      "1": 109,
      "2": 32,
      "3": 55,
      "4": 225,
      "5": 11338
    },
    "photosCount": 2476,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGGY_2AUfsszIxNcVkf4s5yFywLCPLyuTF1RCxhUQHUqaaRaKbcTvE-qpbs-7Zg_e-vH7JPcZmA2LmKwDHeuzTwvBz_vHb7MnisnPCjjo5ybRWuq9W0BigoaSdp4UVbgYEW54gr0WroxvRk=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-03Qp-rkE6uI/AAAAAAAAAAI/AAAAAAAAAAA/S5G2-YUleaU/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-3AM"
      ],
      "Tuesday": [
        "11AM-3AM"
      ],
      "Wednesday": [
        "11AM-3AM"
      ],
      "Thursday": [
        "11AM-3AM"
      ],
      "Friday": [
        "11AM-3AM"
      ],
      "Saturday": [
        "11AM-3AM"
      ],
      "Sunday": [
        "11AM-3AM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Pelicana+Chicken+Atlanta/@33.7859285,-84.4008723,14z/data=!4m8!1m2!2m1!1sPelicana+Chicken+Atlanta!3m4!1s0x88f5059dc0fcb9fb:0x730e602d414d9a4c!8m2!3d33.7859285!4d-84.4008723",
    "placeId": "ChIJ-7n8wJ0F9YgRTJpNQS1gDnM",
    "subtypes": "Korean restaurant, Chicken wings restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "AZN (Simple. Seasonal. Healthy) Georgia St. University",
    "slug": "azn-simple-seasonal-healthy-georgia-st-university",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-688-4437",
    "website": "http://www.eatazn.com/",
    "address": "52 Broad St NW, Atlanta, GA 30303",
    "street": "52 Broad St NW",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.755658,
    "longitude": -84.3897569,
    "rating": 4.8,
    "reviewCount": 344,
    "reviewsPerScore": {
      "1": 9,
      "2": 4,
      "3": 10,
      "4": 15,
      "5": 306
    },
    "photosCount": 441,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhG8kY9u61tg83zfBV3zEXM7XbBpSSY7iZX4tThZ_BMnlE8M2Gujat3T8YgWkMMBSJLMmUh-77j6jpoMDAgXzjfghfQDeE5Dc6DzOVFCvF8BnJ2W962_JoC_Niu_c1ZccEV367u7nUPHCBIuyl9RFJQbUYWDeGAPY4-U2iVURmNTRIp2kLtIVYrI=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-keXcIkaoH-4/AAAAAAAAAAI/AAAAAAAAAAA/euNrTIAeswc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "10AM-6PM"
      ],
      "Tuesday": [
        "10AM-6PM"
      ],
      "Wednesday": [
        "10AM-6PM"
      ],
      "Thursday": [
        "10AM-6PM"
      ],
      "Friday": [
        "10AM-6PM"
      ],
      "Saturday": [
        "12-6PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/AZN+%28Simple.+Seasonal.+Healthy%29+Georgia+St.+University/@33.755658,-84.3897569,14z/data=!4m8!1m2!2m1!1sAZN+%28Simple.+Seasonal.+Healthy%29+Georgia+St.+University!3m4!1s0x88f5036764c0a8ef:0x603cf844568c8e05!8m2!3d33.755658!4d-84.3897569",
    "placeId": "ChIJ76jAZGcD9YgRBY6MVkT4PGA",
    "subtypes": "Asian restaurant, Bubble tea store, Chinese restaurant, Dumpling restaurant, Health food restaurant, Juice shop, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Queen Tea GSU",
    "slug": "queen-tea-gsu",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 816-888-1177",
    "website": "https://www.queenteaboba.com/",
    "address": "50 Hurt Plaza SE, Atlanta, GA 30303",
    "street": "50 Hurt Plaza SE",
    "city": "Atlanta",
    "county": "Downtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.7543349,
    "longitude": -84.3868116,
    "rating": 4.2,
    "reviewCount": 17,
    "reviewsPerScore": {
      "1": 2,
      "2": 1,
      "3": 0,
      "4": 2,
      "5": 12
    },
    "photosCount": 11,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAECuUKP5YAw08IDdv-c9DaWX8Kj-KAYtOXMxVAWf2kJVVQs_bhZghN34cUClyvMJb9JkX0KGtgJIm8dOdNerbHHHK1Vw8MsyFCg5rYvfkvh9sqg6za1YUTr1-Ec9pMLuiMyE7XFjac_SipJ=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-hweVwYCQ61w/AAAAAAAAAAI/AAAAAAAAAAA/vQT_iP1qxNc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "8:30AM-10PM"
      ],
      "Tuesday": [
        "8:30AM-10PM"
      ],
      "Wednesday": [
        "8:30AM-10PM"
      ],
      "Thursday": [
        "8:30AM-10PM"
      ],
      "Friday": [
        "8:30AM-10PM"
      ],
      "Saturday": [
        "12:30-8:30PM"
      ],
      "Sunday": [
        "12:30-8:30PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Queen+Tea+GSU/@33.754334899999996,-84.3868116,14z/data=!4m8!1m2!2m1!1sQueen+Tea+GSU!3m4!1s0x88f503f482c4f523:0x14a4c0fd50bba7a1!8m2!3d33.754334899999996!4d-84.3868116",
    "placeId": "ChIJI_XEgvQD9YgRoae7UP3ApBQ",
    "subtypes": "Ramen restaurant, Bubble tea store, Dim sum restaurant, Dumpling restaurant, Ice cream shop, Tea house, Rice restaurant, Taiwanese restaurant",
    "amenities": {
      "delivery": false,
      "takeout": false,
      "dineIn": false,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": false,
      "casual": false,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Food Terminal",
    "slug": "food-terminal",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-500-2695",
    "website": "https://www.foodterminal.com/",
    "address": "1000 Marietta St NW UNIT 202, Atlanta, GA 30318",
    "street": "1000 Marietta St NW UNIT 202",
    "city": "Atlanta",
    "county": "Marietta Street Artery",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7788171,
    "longitude": -84.4100323,
    "rating": 4.5,
    "reviewCount": 935,
    "reviewsPerScore": {
      "1": 37,
      "2": 23,
      "3": 51,
      "4": 155,
      "5": 669
    },
    "photosCount": 1203,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHsiiW4WMB13eMvB3XiDkUJs4Rucd1t7s84_9FcQ2qPTo2T3ye_qa-zR1w6gUwrbNAbG2y9l-uTzb5i53YgoAsYhLDVJjPsz-XJJzVcpg0JmHJcWO8vwKJN3ZP5mcVCBwv52D50tw=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-8-NrIWke71I/AAAAAAAAAAI/AAAAAAAAAAA/GnVCgtRVqdU/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "Hip eatery in an industrial space serving Malaysian classics & street fare, plus sake & cocktails.",
    "menuLink": "",
    "orderLinks": "https://resy.com/cities/atlanta-ga/venues/food-terminal-west-midtown?rwg_token=AFd1xnEX8B2oDtzKF7wDlqzwrEOoGMWUP2oCgHxnMHBQT7VvW5JJFk3irSrcgEZMa6mI_rj7_Sp7NlUs75QdwUhy6nztR7_utc8EeUFbAvMZl2AXPCnXjdQ%3D, https://www.google.com/maps/reserve/v/dine/c/JsWgPgkoCXY?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Food+Terminal/@33.7788171,-84.4100323,14z/data=!4m8!1m2!2m1!1sFood+Terminal!3m4!1s0x88f505a11d3dbc5f:0x2b5ac9ecab371f3d!8m2!3d33.7788171!4d-84.4100323",
    "placeId": "ChIJX7w9HaEF9YgRPR83q-zJWis",
    "subtypes": "Asian fusion restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "OiShokudo",
    "slug": "oishokudo",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-458-3692",
    "website": "http://www.oishokudo.com/",
    "address": "955 Spring St NW Suite A, Atlanta, GA 30309",
    "street": "955 Spring St NW Suite A",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7813664,
    "longitude": -84.3889428,
    "rating": 4.8,
    "reviewCount": 16,
    "reviewsPerScore": {
      "1": 0,
      "2": 1,
      "3": 0,
      "4": 0,
      "5": 15
    },
    "photosCount": 46,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH-MB5e2z40Ikrw4z1yECoz5tUzieNszhOdnM2k5n1WJrUORV8Pah09P8EpM0kokGaX4JMCBPKtVMOnxbqdDLMI4b9XTXHs0NJle-9myIxbUZQzmFEQnVYAQdQ1dWifZypxaQJW37boQ9cw=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-260pGopIi1I/AAAAAAAAAAI/AAAAAAAAAAA/w_ZEdRTFTW4/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/OiShokudo/@33.781366399999996,-84.3889428,14z/data=!4m8!1m2!2m1!1sOiShokudo!3m4!1s0x88f5054dd43a99c5:0x7f8d4e55272a955f!8m2!3d33.781366399999996!4d-84.3889428",
    "placeId": "ChIJxZk61E0F9YgRX5UqJ1VOjX8",
    "subtypes": "Ramen restaurant, Asian restaurant, Bar, Syokudo and Teishoku restaurant, Conveyor belt sushi restaurant, Catering food and drink supplier, Japanese restaurant, Takeout Restaurant, Sushi restaurant, Udon noodle restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kwan's Deli and Korean Kitchen",
    "slug": "kwans-deli-and-korean-kitchen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-522-9796",
    "website": "",
    "address": "267 Marietta St NW, Atlanta, GA 30313",
    "street": "267 Marietta St NW",
    "city": "Atlanta",
    "county": "Downtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30313",
    "latitude": 33.7608147,
    "longitude": -84.3942453,
    "rating": 4.4,
    "reviewCount": 1135,
    "reviewsPerScore": {
      "1": 45,
      "2": 31,
      "3": 82,
      "4": 207,
      "5": 770
    },
    "photosCount": 827,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH0DOFhXeHy61Q9LaDGNFGSMxWuzpyvrRBZTAyF3PwgzAoHiz4fDmAHzNsVQxk73FrM7yXDfmAlSf_pWX5CeSpVnc2XQ1XigK3szWiAlH3yjnsUdK55uCADR07hb-dIVX7RASNm=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-q5ZulX3YB98/AAAAAAAAAAI/AAAAAAAAAAA/G_2x-qVKHKc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "10:30AM-9PM"
      ],
      "Tuesday": [
        "10:30AM-9PM"
      ],
      "Wednesday": [
        "10:30AM-9PM"
      ],
      "Thursday": [
        "10:30AM-9PM"
      ],
      "Friday": [
        "10:30AM-9PM"
      ],
      "Saturday": [
        "10:30AM-9PM"
      ],
      "Sunday": [
        "10:30AM-9PM"
      ]
    },
    "priceRange": "$",
    "description": "This casual corner shop offers American breakfasts, deli sandwiches & salads, plus Korean dishes.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kwan%27s+Deli+and+Korean+Kitchen/@33.7608147,-84.3942453,14z/data=!4m8!1m2!2m1!1sKwan%27s+Deli+and+Korean+Kitchen!3m4!1s0x88f5047faf827459:0x19ede45dc77d586a!8m2!3d33.7608147!4d-84.3942453",
    "placeId": "ChIJWXSCr38E9YgRalh9x13k7Rk",
    "subtypes": "Korean restaurant, Asian fusion restaurant, Deli, Korean barbecue restaurant, Restaurant, Sushi restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Bao Bun Hibachi",
    "slug": "bao-bun-hibachi",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-351-5502",
    "website": "https://www.baobunhibachi.com/",
    "address": "1715 Howell Mill Rd NW Suite # C15-A, Atlanta, GA 30318",
    "street": "1715 Howell Mill Rd NW Suite # C15-A",
    "city": "Atlanta",
    "county": "Berkeley Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.8011912,
    "longitude": -84.4134362,
    "rating": 4.7,
    "reviewCount": 393,
    "reviewsPerScore": {
      "1": 12,
      "2": 5,
      "3": 9,
      "4": 30,
      "5": 337
    },
    "photosCount": 304,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH6Uplhzzzr1C32i_dXjOva63ASvlHBcy0DrdSI1hUE2ws_9uh5wYrXjiThPf9sAiBOKZNx9vLh-n7-NWOXOxI-ufvEctY7My5vaayiS5dbnF1Rb0r9o3iF9bOU2FwjTk0UmMKBBkMshCmP=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-gM4vYuhRHp8/AAAAAAAAAAI/AAAAAAAAAAA/hSAXReSJPz0/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9PM"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.skiplinow.com/shop/-LmBOe1_TzdTppnl2lq1",
    "googleMapsLink": "https://www.google.com/maps/place/Bao+Bun+Hibachi/@33.8011912,-84.41343619999999,14z/data=!4m8!1m2!2m1!1sBao+Bun+Hibachi!3m4!1s0x88f50548f9a409fd:0xc9234543ebf8f1a4!8m2!3d33.8011912!4d-84.41343619999999",
    "placeId": "ChIJ_Qmk-UgF9YgRpPH460NFI8k",
    "subtypes": "Asian fusion restaurant, Steamed bun shop",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kura Revolving Sushi Bar",
    "slug": "kura-revolving-sushi-bar",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-855-0558",
    "website": "https://www.kurasushi.com/",
    "address": "1042 Northside Dr NW Suite G115, Atlanta, GA 30318",
    "street": "1042 Northside Dr NW Suite G115",
    "city": "Atlanta",
    "county": "Home Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7832293,
    "longitude": -84.4077225,
    "rating": 4.3,
    "reviewCount": 690,
    "reviewsPerScore": {
      "1": 56,
      "2": 37,
      "3": 31,
      "4": 104,
      "5": 462
    },
    "photosCount": 464,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhG51myGOPvn-tKa6QVLQABai4PhemDq21J_1Ot2Ud8VX4us_zInhuqEmuqmbB1SsRDsNM4DpfSdSWuym8kCiv7rbpU41_85nXCAulkfGMlS_7ywfo8ZiujiAnbVx7W2BhHa3d6GfW77kWns7bYFaLl2ar5lhdnOEg2MOz9-r-Aut9LmXEZ6xJFaGA=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-WJHmrPUu1Xg/AAAAAAAAAAI/AAAAAAAAAAA/fqeMxlUSyRc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-9PM"
      ],
      "Tuesday": [
        "11:30AM-9PM"
      ],
      "Wednesday": [
        "11:30AM-9PM"
      ],
      "Thursday": [
        "11:30AM-9PM"
      ],
      "Friday": [
        "11:30AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "11AM-9PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://k063.kurasushi.com/reservation",
    "googleMapsLink": "https://www.google.com/maps/place/Kura+Revolving+Sushi+Bar/@33.783229299999995,-84.40772249999999,14z/data=!4m8!1m2!2m1!1sKura+Revolving+Sushi+Bar!3m4!1s0x88f505005c97a59f:0x499e0bdce7f0a3a2!8m2!3d33.783229299999995!4d-84.40772249999999",
    "placeId": "ChIJn6WXXAAF9YgRoqPw59wLnkk",
    "subtypes": "Sushi restaurant, Asian restaurant, Conveyor belt sushi restaurant, Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Xi'an Gourmet House (Midtown)",
    "slug": "xian-gourmet-house-midtown",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-228-4995",
    "website": "https://pos.chowbus.com/online-ordering/store/Xian-Gourmet-House--Midtown/23436",
    "address": "955 Spring St NW c, Atlanta, GA 30309",
    "street": "955 Spring St NW c",
    "city": "Atlanta",
    "county": "Midtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30309",
    "latitude": 33.7813332,
    "longitude": -84.3886628,
    "rating": 4.4,
    "reviewCount": 629,
    "reviewsPerScore": {
      "1": 51,
      "2": 18,
      "3": 31,
      "4": 71,
      "5": 458
    },
    "photosCount": 684,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHROyA4PhIrWRflBAr1embJJM2ia791GY7WEpzJwDvQIIyZU4Lc2tqgDyo57bwOmAgjvPr57RKVyNDwbQLRekGEi6EBAYfeXh0PEoxPQ__EsGtS9sKZvPUN8dKiHjIMC8bQbJtAX9tiVca9=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-ze76muKirmo/AAAAAAAAAAI/AAAAAAAAAAA/CZ4m5vDksr8/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-9:30PM"
      ],
      "Saturday": [
        "11AM-9:30PM"
      ],
      "Sunday": [
        "11AM-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Xi%27an+Gourmet+House+%28Midtown%29/@33.7813332,-84.38866279999999,14z/data=!4m8!1m2!2m1!1sXi%27an+Gourmet+House+%28Midtown%29!3m4!1s0x88f5052c0dec41ef:0x799ef3fff7dac04d!8m2!3d33.7813332!4d-84.38866279999999",
    "placeId": "ChIJ70HsDSwF9YgRTcDa9__znnk",
    "subtypes": "Asian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": false,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Park27 Korean BBQ and Bar - Centennial Park",
    "slug": "park27-korean-bbq-and-bar-centennial-park",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-390-3009",
    "website": "https://www.park27bbq.com/",
    "address": "275 Baker St NW Suite B, Atlanta, GA 30313",
    "street": "275 Baker St NW Suite B",
    "city": "Atlanta",
    "county": "Downtown Atlanta",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30313",
    "latitude": 33.7620658,
    "longitude": -84.39536,
    "rating": 4.5,
    "reviewCount": 565,
    "reviewsPerScore": {
      "1": 34,
      "2": 15,
      "3": 22,
      "4": 57,
      "5": 437
    },
    "photosCount": 589,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHVM9uYO7TVrOR8QMk25ChpmRjgPeNkiWXveMaORBC6XeK5S5Q03DIVmuUrQ9V1xWgHl5065ODqpPR__OE2Fn6szFiUekP2hmAgvOLnbDDrn-WpHt4sD5KmptfuAVxQyQiIJe2buxZmMxgR=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-4NKSrKyqJAg/AAAAAAAAAAI/AAAAAAAAAAA/rA65HuBu7rA/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10:30PM"
      ],
      "Tuesday": [
        "11AM-10:30PM"
      ],
      "Wednesday": [
        "11AM-10:30PM"
      ],
      "Thursday": [
        "11AM-10:30PM"
      ],
      "Friday": [
        "11AM-11:30PM"
      ],
      "Saturday": [
        "11AM-11:30PM"
      ],
      "Sunday": [
        "11AM-10:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Park27+Korean+BBQ+and+Bar+-+Centennial+Park/@33.7620658,-84.39536,14z/data=!4m8!1m2!2m1!1sPark27+Korean+BBQ+and+Bar+-+Centennial+Park!3m4!1s0x88f5054b332b4eff:0xa9336e5dbc64374b!8m2!3d33.7620658!4d-84.39536",
    "placeId": "ChIJ_04rM0sF9YgRSzdkvF1uM6k",
    "subtypes": "Korean barbecue restaurant, Asian restaurant, Korean restaurant, Restaurant, Steak house",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Gyu-kaku Japanese BBQ",
    "slug": "gyu-kaku-japanese-bbq",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-253-2989",
    "website": "https://www.gyu-kaku.com/atlanta/",
    "address": "265 18th St NW Ste 4130, Atlanta, GA 30363",
    "street": "265 18th St NW Ste 4130",
    "city": "Atlanta",
    "county": "Midtown",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30363",
    "latitude": 33.7928136,
    "longitude": -84.3967016,
    "rating": 4.5,
    "reviewCount": 2144,
    "reviewsPerScore": {
      "1": 140,
      "2": 68,
      "3": 80,
      "4": 233,
      "5": 1623
    },
    "photosCount": 1590,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhGLZy7RcYHCCh80LdEm-gP8ElbxJ9Byum-3k-FliJrAjxMlhKKabIxzu9Tq-I7THvZXS8M2kQYVT3Dfaiqov1Snqv0h7w2sLO5MQjqf7DXWfd6HJGejYiRSPg0o_9Rvu_YkO6xJxALSKUZae6EO_6eErZhgCFeaLcIAw0_VjLxln8374riQWElv=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-FRIoel3P2pg/AAAAAAAAAAI/AAAAAAAAAAA/bWo5GAQEMfY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-10PM"
      ],
      "Tuesday": [
        "11:30AM-10PM"
      ],
      "Wednesday": [
        "11:30AM-10PM"
      ],
      "Thursday": [
        "11:30AM-10PM"
      ],
      "Friday": [
        "11:30AM-10:30PM"
      ],
      "Saturday": [
        "11:30AM-10:30PM"
      ],
      "Sunday": [
        "11:30AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.gyu-kaku.com/atlanta/, https://www.opentable.com/restaurant/profile/1008241?ref=1068, https://www.google.com/maps/reserve/v/dine/c/9WLmnwKF3Ac?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Gyu-kaku+Japanese+BBQ/@33.792813599999995,-84.3967016,14z/data=!4m8!1m2!2m1!1sGyu-kaku+Japanese+BBQ!3m4!1s0x88f50568a7d3d19d:0x5c70f33540e5d659!8m2!3d33.792813599999995!4d-84.3967016",
    "placeId": "ChIJndHTp2gF9YgRWdblQDXzcFw",
    "subtypes": "Japanese restaurant, Bar, Barbecue restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Pacific Rim Bistro",
    "slug": "pacific-rim-bistro",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-893-0018",
    "website": "http://www.pacificrimbistro.com/",
    "address": "303 Peachtree Center Ave NE, Atlanta, GA 30303",
    "street": "303 Peachtree Center Ave NE",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.7625845,
    "longitude": -84.3857881,
    "rating": 4.4,
    "reviewCount": 879,
    "reviewsPerScore": {
      "1": 39,
      "2": 33,
      "3": 68,
      "4": 178,
      "5": 561
    },
    "photosCount": 929,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEyT2ppkgQuIQdimFmOIGRsKlUIC1AQo_j67o263vzYPy0b8dsYSa4jO4_oYqX4_IE0gfu1niZZVKllVsIw4eECcTQlFfICH-2JZQ6EPEp4QtIyUngLrXmCZT95y129r1gVQZdN=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-OqYNYhWmAG0/AAAAAAAAAAI/AAAAAAAAAAA/TUGSvEvtmTY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-2PM",
        "4:30-9PM"
      ],
      "Tuesday": [
        "11:30AM-2PM",
        "4:30-9PM"
      ],
      "Wednesday": [
        "11:30AM-2PM",
        "4:30-9PM"
      ],
      "Thursday": [
        "11:30AM-2PM",
        "4:30-9PM"
      ],
      "Friday": [
        "11:30AM-2PM",
        "4:30-9PM"
      ],
      "Saturday": [
        "5-9PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "Eats from all over Asia, some with Western fusion touches, served in a spiffy modern setting.",
    "menuLink": "",
    "orderLinks": "https://tmt.spotapps.com/, https://tmt.spotapps.co/reservations?spot_id=67047&source=google&rwg_token=AFd1xnEJbPx4O5SB6Bo_tEzbAZ7wcizv-xPOh5X4hKYTX42FirX0mYE8lVJCbsSmfg-uCB1k05H4Hgg5K0OIEyHW0T9yIrfGYQ%3D%3D, https://resy.com/cities/atlanta-ga/venues/pacific-rim-bistro?rwg_token=AFd1xnHiWL0IEI0jJwNVJno1HxoQuJs57GHWQOpXMuiRpTL3yokHw1_w6tzGVpnbh9qiabQgInahGJXPvXR2paUVPQ_0tA7Gqg%3D%3D, https://www.opentable.com/restaurant/profile/2583?ref=1068, https://www.google.com/maps/reserve/v/dine/c/Hp0wMtugQzQ?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Pacific+Rim+Bistro/@33.762584499999996,-84.3857881,14z/data=!4m8!1m2!2m1!1sPacific+Rim+Bistro!3m4!1s0x88f50479e05ea211:0x6741cf285cf2020b!8m2!3d33.762584499999996!4d-84.3857881",
    "placeId": "ChIJEaJe4HkE9YgRCwLyXCjPQWc",
    "subtypes": "Sushi restaurant, Asian restaurant, Caterer, Japanese restaurant, Thai restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Park Place K-BOB",
    "slug": "park-place-k-bob",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 404-653-0080",
    "website": "https://order.peblla.com/parkplacekbob/order%3Fsid%3D1142384297737643072",
    "address": "55 Park Pl NE suite#107, Atlanta, GA 30303",
    "street": "55 Park Pl NE suite#107",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.7560078,
    "longitude": -84.3875185,
    "rating": 4.8,
    "reviewCount": 235,
    "reviewsPerScore": {
      "1": 3,
      "2": 2,
      "3": 7,
      "4": 18,
      "5": 205
    },
    "photosCount": 231,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFs-EYKJYoLurJKUAuFTVOBqf3HL5lZtY151BI0zgqdfcW3_ZOSvzA_H9ZTmy6TCsm8L_4SEefyDiAktPnqaUarJFGhUQzfeHAO7NP67QKgvZBySkGR94jLhxcPTlpNoYfvjW3x=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-d5sOiSTF_Ok/AAAAAAAAAAI/AAAAAAAAAAA/yVtuBIjpRaU/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "10AM-5PM"
      ],
      "Tuesday": [
        "10AM-5PM"
      ],
      "Wednesday": [
        "10AM-5PM"
      ],
      "Thursday": [
        "10AM-5PM"
      ],
      "Friday": [
        "10AM-4PM"
      ],
      "Saturday": [
        "Closed"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Park+Place+K-BOB/@33.7560078,-84.3875185,14z/data=!4m8!1m2!2m1!1sPark+Place+K-BOB!3m4!1s0x88f50387b26966b3:0x18f86f42746fd11b!8m2!3d33.7560078!4d-84.3875185",
    "placeId": "ChIJs2ZpsocD9YgRG9FvdEJv-Bg",
    "subtypes": "Korean restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": false,
      "casual": true,
      "cozy": true,
      "trendy": false,
      "familyFriendly": false,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Chirori - Omakase & Sushi",
    "slug": "chirori-omakase-sushi",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-427-3171",
    "website": "http://chiroriatl.com/",
    "address": "349 14th St NW C-1, Atlanta, GA 30318",
    "street": "349 14th St NW C-1",
    "city": "Atlanta",
    "county": "Home Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7863418,
    "longitude": -84.3983721,
    "rating": 4.6,
    "reviewCount": 382,
    "reviewsPerScore": {
      "1": 19,
      "2": 9,
      "3": 12,
      "4": 23,
      "5": 319
    },
    "photosCount": 1037,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkR8WWJU12-vdQ_JCmzkSydYaOmoMulLJ-hkv-mx4ie_soGBDMHG3dmKEpnmLu30TRCR5IbCBX5REq4z48tF6wNLi7MJP0WDSXGf98GkbqjJ0UK_9o_mSLHGesIoFaz4E7XbF5=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-UQC5wcOBVyo/AAAAAAAAAAI/AAAAAAAAAAA/X4Euq4OEZo4/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "5-10PM"
      ],
      "Tuesday": [
        "5-10PM"
      ],
      "Wednesday": [
        "5-10PM"
      ],
      "Thursday": [
        "11:30AM-2PM",
        "5-10PM"
      ],
      "Friday": [
        "11:30AM-2PM",
        "5-10:30PM"
      ],
      "Saturday": [
        "5-10:30PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://chirori-omakase-and-sushi-2.ueniweb.com/services, https://resy.com/cities/atlanta-ga/venues/chirori?rwg_token=AFd1xnH1ujiV9NbrUJZGFXxz8gXAvPgziXmM-aoURJwinLjbnCl2NuQNXkJ7wi0R4qP92-it6uLSMon060qC8bZREJ95W07tUKdxsomolrDtcAxhDA9oWJQ%3D, https://www.google.com/maps/reserve/v/dine/c/hzue9CuR-NI?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Chirori+-+Omakase+%26+Sushi/@33.786341799999995,-84.3983721,14z/data=!4m8!1m2!2m1!1sChirori+-+Omakase+%26+Sushi!3m4!1s0x88f505d476115adb:0x17e7589d7d6c0c2a!8m2!3d33.786341799999995!4d-84.3983721",
    "placeId": "ChIJ21oRdtQF9YgRKgxsfZ1Y5xc",
    "subtypes": "Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Yatai Handroll Bar",
    "slug": "yatai-handroll-bar",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 470-412-0233",
    "website": "https://www.theyatai.com/",
    "address": "63 Broad St NW, Atlanta, GA 30303",
    "street": "63 Broad St NW",
    "city": "Atlanta",
    "county": "Hotel District",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30303",
    "latitude": 33.7555969,
    "longitude": -84.3892133,
    "rating": 4.6,
    "reviewCount": 45,
    "reviewsPerScore": {
      "1": 3,
      "2": 1,
      "3": 1,
      "4": 2,
      "5": 38
    },
    "photosCount": 174,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhGWvJIvPm_EFNSIbXV7YxQxpk6nYqW8zjBN1w_0U_K9FfspJevhl_ttt4n4G1S74OH_VyIX3y_fvNlIlOV9JZdNPoqpU4F3cM5rqqCpQPWPSvQayUMHzRalH_P1PauZ-ZJKPHyIBVLcHxLZIBOr1sgB1DQmuZ5Qr-mQBW6_W6z9kI8ie7ZZ19j-=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-yyM3oPZkwkA/AAAAAAAAAAI/AAAAAAAAAAA/Yx8jTuxAvFA/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-4PM"
      ],
      "Tuesday": [
        "11AM-8PM"
      ],
      "Wednesday": [
        "11AM-8PM"
      ],
      "Thursday": [
        "11AM-8PM"
      ],
      "Friday": [
        "11AM-4PM"
      ],
      "Saturday": [
        "Closed"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Yatai+Handroll+Bar/@33.7555969,-84.3892133,14z/data=!4m8!1m2!2m1!1sYatai+Handroll+Bar!3m4!1s0x88f50397b4587435:0xcc65aad3eac15371!8m2!3d33.7555969!4d-84.3892133",
    "placeId": "ChIJNXRYtJcD9YgRcVPB6tOqZcw",
    "subtypes": "Sushi restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Oshi Ramen",
    "slug": "oshi-ramen",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "+1 678-599-8833",
    "website": "",
    "address": "800 Forrest St NW k19, Atlanta, GA 30318",
    "street": "800 Forrest St NW k19",
    "city": "Atlanta",
    "county": "Berkeley Park",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.7957735,
    "longitude": -84.4142335,
    "rating": 5.0,
    "reviewCount": 3,
    "reviewsPerScore": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 3
    },
    "photosCount": 36,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhFoCgoFQMLVL27uTgaeyFCKPokx098jUR3BrNi7OcETXg3vK4y2vpnFNT7iwJipFuqQ8EZ6MIQ4FMiRnAqrd4XDON9RHMeyUmXtCgp3kqqamGZDP6cirSxLl8qUCdj8upA9okB6N9lUCqe-11-x7m3CZAMNRg7DQCV-fVMzzHpzxQhAriL_vitt5g=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-CFFfXqbRD_E/AAAAAAAAAAI/AAAAAAAAAAA/kOv52lcqBDY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "CLOSED_TEMPORARILY",
    "hours": {},
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Oshi+Ramen/@33.795773499999996,-84.4142335,14z/data=!4m8!1m2!2m1!1sOshi+Ramen!3m4!1s0x88f505b9a9a1827b:0x19c3a5c546412d85!8m2!3d33.795773499999996!4d-84.4142335",
    "placeId": "ChIJe4KhqbkF9YgRhS1BRsWlwxk",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": false,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": false,
      "cozy": false,
      "trendy": false,
      "familyFriendly": true,
      "parking": false,
      "creditCards": true
    }
  },
  {
    "name": "Ramen Station",
    "slug": "ramen-station",
    "citySlug": "atlanta",
    "stateSlug": "ga",
    "phone": "",
    "website": "",
    "address": "1235 Chattahoochee Ave NW, Atlanta, GA 30318",
    "street": "1235 Chattahoochee Ave NW",
    "city": "Atlanta",
    "county": "Underwood Hills",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30318",
    "latitude": 33.8027943,
    "longitude": -84.4285671,
    "rating": 3.8,
    "reviewCount": 5,
    "reviewsPerScore": {
      "1": 0,
      "2": 2,
      "3": 0,
      "4": 0,
      "5": 3
    },
    "photosCount": 95,
    "photo": "https://lh3.googleusercontent.com/gps-proxy/ALd4DhFWE25zTb57Sdnr94tBA3LnWYjxaXwfdrWUeTk4a65b8PgnEuY7U0r9bJW2uOGw8vyRRkpT9gCHIqqoPxcRHo5W_a7F3HTJ1hBf2VrydP-4kFLPn55SXyFssQUlK2kzsmXGGn4rQPOJRAXDv9mYqlZa7WZYsyIWD6ldPYr-5VdDWkZHfCozl0_A=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-dZQYwdchgXM/AAAAAAAAAAI/AAAAAAAAAAA/CJ_Gy2rTqYg/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9PM"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-9PM"
      ],
      "Saturday": [
        "11AM-9PM"
      ],
      "Sunday": [
        "11AM-9PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Ramen+Station/@33.802794299999995,-84.4285671,14z/data=!4m8!1m2!2m1!1sRamen+Station!3m4!1s0x88f505e20eaa65c9:0xc4625da1e9da138b!8m2!3d33.802794299999995!4d-84.4285671",
    "placeId": "ChIJyWWqDuIF9YgRixPa6aFdYsQ",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kin No Tori Ramen Bar Alpharetta",
    "slug": "kin-no-tori-ramen-bar-alpharetta",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-336-9295",
    "website": "https://alpharetta.kinnotori.com/",
    "address": "4180 Old Milton Pkwy #1-H, Alpharetta, GA 30005",
    "street": "4180 Old Milton Pkwy #1-H",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30005",
    "latitude": 34.0594889,
    "longitude": -84.2349056,
    "rating": 4.6,
    "reviewCount": 1576,
    "reviewsPerScore": {
      "1": 63,
      "2": 33,
      "3": 62,
      "4": 216,
      "5": 1202
    },
    "photosCount": 1505,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGs02o1wk_g97Nxo5C3gs9Z6taMZV0jMXbxBNFpnJrZQc0Bo6SH6C4S4YuibpPRaq6F_0MuM6AG2IJPAtpw8yFixs0x-4cINcQZaLuBfIiFplr5BKF1ntQPPF7Ke54j0mTUrS2YHA=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-FbhWlggnaPY/AAAAAAAAAAI/AAAAAAAAAAA/fLa2zhW8yXk/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-2:30PM",
        "4-9:30PM"
      ],
      "Tuesday": [
        "11AM-2:30PM",
        "4-9:30PM"
      ],
      "Wednesday": [
        "11AM-2:30PM",
        "4-9:30PM"
      ],
      "Thursday": [
        "11AM-2:30PM",
        "4-9:30PM"
      ],
      "Friday": [
        "11AM-2:30PM",
        "4-9:30PM"
      ],
      "Saturday": [
        "3-9:30PM"
      ],
      "Sunday": [
        "3-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "Multiple styles of traditional ramen served alongside Japanese small plates in suburban surrounds.",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kin+No+Tori+Ramen+Bar+Alpharetta/@34.0594889,-84.23490559999999,14z/data=!4m8!1m2!2m1!1sKin+No+Tori+Ramen+Bar+Alpharetta!3m4!1s0x88f59fac5b995267:0x6f6cdd4e4142f40c!8m2!3d34.0594889!4d-84.23490559999999",
    "placeId": "ChIJZ1KZW6yf9YgRDPRCQU7dbG8",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Noodle shop, Restaurant, Steamed bun shop",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Slurpin' Ramen Bar - Alpharetta",
    "slug": "slurpin-ramen-bar-alpharetta",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-587-5009",
    "website": "https://slurpinramenga.com/%3Futm_source%3Dgoogle",
    "address": "11770 Haynes Bridge Rd #101, Alpharetta, GA 30009",
    "street": "11770 Haynes Bridge Rd #101",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30009",
    "latitude": 34.0707755,
    "longitude": -84.2949206,
    "rating": 4.6,
    "reviewCount": 284,
    "reviewsPerScore": {
      "1": 10,
      "2": 8,
      "3": 8,
      "4": 26,
      "5": 232
    },
    "photosCount": 392,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFqiiWGNlzzFX92UhETsWMM_CYrvTqmPpX0eRYu8GtPEDn8_l4-qCuJyB3vvTYw74LHexVzJEo45bXCZKU8hylewHtIS6V6uhTbzZ8ZtF9R-T64UPTwgliNrjZ-rJNyAyRNVKu_MTY-_A4p=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-SK4NM-x-nnY/AAAAAAAAAAI/AAAAAAAAAAA/bKIa7oqQk6k/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-9:45PM"
      ],
      "Tuesday": [
        "11:30AM-9:45PM"
      ],
      "Wednesday": [
        "11:30AM-9:45PM"
      ],
      "Thursday": [
        "11:30AM-9:45PM"
      ],
      "Friday": [
        "11:30AM-9:45PM"
      ],
      "Saturday": [
        "11:30AM-9:45PM"
      ],
      "Sunday": [
        "11:30AM-9:45PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Slurpin%27+Ramen+Bar+-+Alpharetta/@34.070775499999996,-84.2949206,14z/data=!4m8!1m2!2m1!1sSlurpin%27+Ramen+Bar+-+Alpharetta!3m4!1s0x88f575952f9fab25:0xc4196da3b44a094f!8m2!3d34.070775499999996!4d-84.2949206",
    "placeId": "ChIJJaufL5V19YgRTwlKtKNtGcQ",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Noodle shop, Vegetarian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Hokkaido Ramen House",
    "slug": "hokkaido-ramen-house",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-730-2888",
    "website": "http://www.hokkaidoramenga.com/",
    "address": "1525 McFarland Pkwy, Alpharetta, GA 30005",
    "street": "1525 McFarland Pkwy",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30005",
    "latitude": 34.1107919,
    "longitude": -84.2194047,
    "rating": 4.8,
    "reviewCount": 151,
    "reviewsPerScore": {
      "1": 5,
      "2": 1,
      "3": 2,
      "4": 4,
      "5": 139
    },
    "photosCount": 603,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEHVJjVbsFuGRL4HiQQpFmhjixQZtumPnak_mvwvVVkObxkhnglnkiqmY4Q5cNCh0kvTzsvBxBPk_E80WUQqUywaHh4kLierSG2FQVpXdooLhXy63P_EKj8SprIhCuWT19iL9CbD17-lNM7=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-TzyCXBq2nTg/AAAAAAAAAAI/AAAAAAAAAAA/jM7AJyi5zpU/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Hokkaido+Ramen+House/@34.110791899999995,-84.2194047,14z/data=!4m8!1m2!2m1!1sHokkaido+Ramen+House!3m4!1s0x88f59d001e7096bf:0xf52ecf522b82f452!8m2!3d34.110791899999995!4d-84.2194047",
    "placeId": "ChIJv5ZwHgCd9YgRUvSCK1LPLvU",
    "subtypes": "Ramen restaurant, Asian restaurant, Chinese restaurant, Japanese restaurant, Sushi restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Ramen Spot",
    "slug": "ramen-spot",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-580-3669",
    "website": "https://www.ramenspotalpharetta.com/",
    "address": "7300 North Point Pkwy #102, Alpharetta, GA 30022",
    "street": "7300 North Point Pkwy #102",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30022",
    "latitude": 34.043005,
    "longitude": -84.300239,
    "rating": 4.6,
    "reviewCount": 282,
    "reviewsPerScore": {
      "1": 14,
      "2": 6,
      "3": 11,
      "4": 15,
      "5": 236
    },
    "photosCount": 413,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEjEYEXOurkKjcDvSM2MYcGsdi_3oD0MKIuu13MRo8eq8eee4sTuV1yPCoaq1gCtukpZSVLKrjB-H50CpV4omEblnuuQSKgc5wbUp_-FzXXqjmnhUphl9iXf2KjXQ5l66dHOkyA=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-nzOL79ckDRs/AAAAAAAAAAI/AAAAAAAAAAA/1FQqjeBVMtw/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "12-9:30PM"
      ],
      "Sunday": [
        "12-9:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Ramen+Spot/@34.043005,-84.30023899999999,14z/data=!4m8!1m2!2m1!1sRamen+Spot!3m4!1s0x88f575f23edb7d7d:0xabc2694250838eed!8m2!3d34.043005!4d-84.30023899999999",
    "placeId": "ChIJfX3bPvJ19YgR7Y6DUEJpwqs",
    "subtypes": "Ramen restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "JINYA Ramen Bar - Alpharetta",
    "slug": "jinya-ramen-bar-alpharetta",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 770-609-8238",
    "website": "https://www.jinyaramenbar.com/locations/alpharetta/%3Futm_medium%3Dsoci%26utm_source%3Dgmb",
    "address": "401 S Broad St Space 4A, Alpharetta, GA 30009",
    "street": "401 S Broad St Space 4A",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30009",
    "latitude": 34.0740415,
    "longitude": -84.2940552,
    "rating": 4.6,
    "reviewCount": 1954,
    "reviewsPerScore": {
      "1": 87,
      "2": 36,
      "3": 59,
      "4": 163,
      "5": 1609
    },
    "photosCount": 1843,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHn8-PuvhD4Cbp3QwsQ92FYM3yU685Wq8Q7hzyLMB9bHJyieYSL9zokPg1wHZHLP9rAFD7mgJPZ7CnR9gAo9NedPqCI3c-qhoFmfwQNlPgOrFKidzFQVyABNj5Z4p2Z-oibdVY=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-8CSRquj7eoM/AAAAAAAAAAI/AAAAAAAAAAA/93jCnPKu0AY/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-10PM"
      ],
      "Tuesday": [
        "11AM-10PM"
      ],
      "Wednesday": [
        "11AM-10PM"
      ],
      "Thursday": [
        "11AM-10PM"
      ],
      "Friday": [
        "11AM-11PM"
      ],
      "Saturday": [
        "11AM-11PM"
      ],
      "Sunday": [
        "11AM-10PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/JINYA+Ramen+Bar+-+Alpharetta/@34.0740415,-84.2940552,14z/data=!4m8!1m2!2m1!1sJINYA+Ramen+Bar+-+Alpharetta!3m4!1s0x88f575a00f055b01:0xd42e325626e3541!8m2!3d34.0740415!4d-84.2940552",
    "placeId": "ChIJAVsFD6B19YgRQTVuYiXjQg0",
    "subtypes": "Ramen restaurant, Asian restaurant, Japanese restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Kaya Sushi & Ramen",
    "slug": "kaya-sushi-ramen",
    "citySlug": "roswell",
    "stateSlug": "ga",
    "phone": "+1 770-609-8590",
    "website": "http://www.kayasushiramenbar.com/",
    "address": "10707 Alpharetta Hwy, Roswell, GA 30076",
    "street": "10707 Alpharetta Hwy",
    "city": "Roswell",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30076",
    "latitude": 34.0396641,
    "longitude": -84.3405113,
    "rating": 4.8,
    "reviewCount": 522,
    "reviewsPerScore": {
      "1": 5,
      "2": 1,
      "3": 13,
      "4": 34,
      "5": 469
    },
    "photosCount": 515,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHzoNF4oNqMOyHmfUOXGkqQWq40ymg6Dmbb0_s-25IWYf_xloH3-eBB6YxJmRsmRZvNMYB6GwTJPPFHdoY_71I4ch0eJIEXguFx7CR1kroGaqUU-ZVPw9ev3_c6ByCETeuaB5cVIQ=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-VGREBAlHKI0/AAAAAAAAAAI/AAAAAAAAAAA/sJqbZYNXzvM/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-9PM"
      ],
      "Tuesday": [
        "11:30AM-9PM"
      ],
      "Wednesday": [
        "11:30AM-9PM"
      ],
      "Thursday": [
        "11:30AM-9PM"
      ],
      "Friday": [
        "11:30AM-9:30PM"
      ],
      "Saturday": [
        "12-9:30PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Kaya+Sushi+%26+Ramen/@34.039664099999996,-84.3405113,14z/data=!4m8!1m2!2m1!1sKaya+Sushi+%26+Ramen!3m4!1s0x88f575c3d88c7c0f:0xbca2807ce961c87!8m2!3d34.039664099999996!4d-84.3405113",
    "placeId": "ChIJD3yM2MN19YgRhxyWzgcoygs",
    "subtypes": "Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Shodo Ramen & Sushi",
    "slug": "shodo-ramen-sushi",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-404-8588",
    "website": "http://www.shodoatlanta.com/",
    "address": "735 N Main St #1700, Alpharetta, GA 30009",
    "street": "735 N Main St #1700",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30009",
    "latitude": 34.090874,
    "longitude": -84.28432,
    "rating": 4.4,
    "reviewCount": 166,
    "reviewsPerScore": {
      "1": 10,
      "2": 8,
      "3": 14,
      "4": 12,
      "5": 122
    },
    "photosCount": 235,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGlHR4Yt5yixm9lU_4umplbacbi1DuGFzkT36T2nWGlwMFBXtQ08jDnkXdyMipcNhsT1y3a6-nYcwA6zyQNZ5J83LOOT0jl9Aimro0IYjRrHvIqOkO6WbM-HzSiy4Z-WIeVqR2zLwfkixFp=w800-h500-k-no",
    "logo": "https://lh6.googleusercontent.com/-0-vf4NHAFxU/AAAAAAAAAAI/AAAAAAAAAAA/Q0m4_lYR5xc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "12-9PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Shodo+Ramen+%26+Sushi/@34.090874,-84.28432,14z/data=!4m8!1m2!2m1!1sShodo+Ramen+%26+Sushi!3m4!1s0x88f5756c67a96fdb:0xeaf9b340224fbb51!8m2!3d34.090874!4d-84.28432",
    "placeId": "ChIJ22-pZ2x19YgRUbtPIkCz-eo",
    "subtypes": "Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Poke Factory & Ramen Bar",
    "slug": "poke-factory-ramen-bar",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-353-6627",
    "website": "https://www.poke.menu/",
    "address": "5950 North Point Pkwy Ste 125, Alpharetta, GA 30022",
    "street": "5950 North Point Pkwy Ste 125",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30022",
    "latitude": 34.0492296,
    "longitude": -84.281204,
    "rating": 4.7,
    "reviewCount": 288,
    "reviewsPerScore": {
      "1": 10,
      "2": 4,
      "3": 11,
      "4": 26,
      "5": 237
    },
    "photosCount": 286,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE7tOnt1_s5ZeD4sgAm9xfNbsuwIDmSnnt4RsoH6E3PlSfH8jHaDMNlbhuVu8ly-tyB4DZf24d0zv3DiN9zKQnybOhaeikuXXg2pgvImcj3LLDZi5ktnNoV1wK-AYzA6daJ7VgQxQ=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-ysHn71hqFHQ/AAAAAAAAAAI/AAAAAAAAAAA/v0c958di56o/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-8PM"
      ],
      "Tuesday": [
        "11AM-8PM"
      ],
      "Wednesday": [
        "11AM-8PM"
      ],
      "Thursday": [
        "11AM-8PM"
      ],
      "Friday": [
        "11AM-8PM"
      ],
      "Saturday": [
        "12-8PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Poke+Factory+%26+Ramen+Bar/@34.0492296,-84.281204,14z/data=!4m8!1m2!2m1!1sPoke+Factory+%26+Ramen+Bar!3m4!1s0x88f5753f10bdfbf9:0xacde11c8aae97008!8m2!3d34.0492296!4d-84.281204",
    "placeId": "ChIJ-fu9ED919YgRCHDpqsgR3qw",
    "subtypes": "Ramen restaurant, Asian fusion restaurant, Bubble tea store, Hawaiian restaurant, Japanese restaurant, Salad shop, Sushi restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Bang Bang Japanese and Korean Cuisine",
    "slug": "bang-bang-japanese-and-korean-cuisine",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 770-686-3348",
    "website": "",
    "address": "5250 Windward Pkwy Suite 111, Alpharetta, GA 30004",
    "street": "5250 Windward Pkwy Suite 111",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30004",
    "latitude": 34.0912539,
    "longitude": -84.2752008,
    "rating": 4.4,
    "reviewCount": 244,
    "reviewsPerScore": {
      "1": 18,
      "2": 9,
      "3": 13,
      "4": 23,
      "5": 181
    },
    "photosCount": 303,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFPcwfyCaKM_vWQVa1uqLoZr0nz94q6xOC8aBP9MFIrp31Jar4sY6i6XMTJ_f3EKMfmKTUgvb4SCJtmim02-C6RIxR1REILTruchqf8xwKbKKOqCgw5QiUF_XTT40In_i_o3iWTpg=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-FCvyk75LyY8/AAAAAAAAAAI/AAAAAAAAAAA/TwYcW947ywQ/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-9PM"
      ],
      "Tuesday": [
        "11:30AM-9PM"
      ],
      "Wednesday": [
        "11:30AM-9PM"
      ],
      "Thursday": [
        "11:30AM-9PM"
      ],
      "Friday": [
        "11:30AM-9:30PM"
      ],
      "Saturday": [
        "12-9:30PM"
      ],
      "Sunday": [
        "12-8PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Bang+Bang+Japanese+and+Korean+Cuisine/@34.0912539,-84.2752008,14z/data=!4m8!1m2!2m1!1sBang+Bang+Japanese+and+Korean+Cuisine!3m4!1s0x88f57529aa15eca9:0xc8974b87c987705b!8m2!3d34.0912539!4d-84.2752008",
    "placeId": "ChIJqewVqil19YgRW3CHyYdLl8g",
    "subtypes": "Japanese restaurant, Asian fusion restaurant, Dessert restaurant, Restaurant, Korean restaurant, Noodle shop",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Haochi Asian Street Food",
    "slug": "haochi-asian-street-food",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-691-3144",
    "website": "https://www.haochiasianstreetfoodalpharetta.com/",
    "address": "11550 Webb Bridge Way ste B3, Alpharetta, GA 30005",
    "street": "11550 Webb Bridge Way ste B3",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30005",
    "latitude": 34.0621806,
    "longitude": -84.2254508,
    "rating": 4.8,
    "reviewCount": 401,
    "reviewsPerScore": {
      "1": 4,
      "2": 6,
      "3": 9,
      "4": 15,
      "5": 367
    },
    "photosCount": 659,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFSRmSHGo28ItW5zxGfxMdElLOA9SA8ptFZcXByl_GKffGbbg-r5DknWZ__48d6nr3tyV2d6v3xU-Oe9qYobgMATU6p-GhB9RwrpMi_3wROcvXhzYwfWlrKfCDlGzIlB8nbhEk8UrPeq_Y=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-hYSJUYxQe-4/AAAAAAAAAAI/AAAAAAAAAAA/ZEhj41A9ot8/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "Closed"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-9PM"
      ],
      "Saturday": [
        "11AM-9PM"
      ],
      "Sunday": [
        "12-8:30PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Haochi+Asian+Street+Food/@34.0621806,-84.22545079999999,14z/data=!4m8!1m2!2m1!1sHaochi+Asian+Street+Food!3m4!1s0x88f59fdfde873735:0xbdd5087133bdabcd!8m2!3d34.0621806!4d-84.22545079999999",
    "placeId": "ChIJNTeH3t-f9YgRzau9M3EI1b0",
    "subtypes": "Asian restaurant, Restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Dumpling Master | Bubble Tea & Noodles",
    "slug": "dumpling-master-bubble-tea-noodles",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-587-5529",
    "website": "https://dumplingmaster.us/",
    "address": "13085 GA-9 Ste 440, Alpharetta, GA 30004",
    "street": "13085 GA-9 Ste 440",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30004",
    "latitude": 34.1017108,
    "longitude": -84.2689337,
    "rating": 4.6,
    "reviewCount": 426,
    "reviewsPerScore": {
      "1": 14,
      "2": 11,
      "3": 12,
      "4": 52,
      "5": 337
    },
    "photosCount": 643,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH76OEbec9RI7hLdr4IjBNDc5NzgjpIMd0xA7dMLEvnPvhA1lXop6ZwbnWY4FFc43xyoX0o0Ps1WHvj7JQNlRIg8YZyN24N_7_kv--BF4FnC6l4Ean65BkKf8KCTeh1-zr0SEw=w800-h500-k-no",
    "logo": "https://lh5.googleusercontent.com/-CVieQkvE7oM/AAAAAAAAAAI/AAAAAAAAAAA/FLKz5BJA5xE/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9PM"
      ],
      "Tuesday": [
        "11AM-9PM"
      ],
      "Wednesday": [
        "11AM-9PM"
      ],
      "Thursday": [
        "11AM-9PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11AM-9PM"
      ]
    },
    "priceRange": "$$",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Dumpling+Master+%7C+Bubble+Tea+%26+Noodles/@34.1017108,-84.26893369999999,14z/data=!4m8!1m2!2m1!1sDumpling+Master+%7C+Bubble+Tea+%26+Noodles!3m4!1s0x88f59f0067a42ea1:0x110a40e7f5fecac9!8m2!3d34.1017108!4d-84.26893369999999",
    "placeId": "ChIJoS6kZwCf9YgRycr-9edAChE",
    "subtypes": "Chinese restaurant, Asian restaurant, Chinese noodle restaurant, Dumpling restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": false,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Jang Su Jang Korean BBQ",
    "slug": "jang-su-jang-korean-bbq",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-694-8786",
    "website": "",
    "address": "35 Milton Ave c, Alpharetta, GA 30009",
    "street": "35 Milton Ave c",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30009",
    "latitude": 34.0758217,
    "longitude": -84.2954335,
    "rating": 4.8,
    "reviewCount": 385,
    "reviewsPerScore": {
      "1": 8,
      "2": 5,
      "3": 9,
      "4": 30,
      "5": 333
    },
    "photosCount": 920,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFzyzt_OlhTxozNCiqU79fp9RxJcyhWl_fE5sKa26734rFPOLC5sNlyhTbaiT31XossyStTY_ZAXIZsiCklO-1tfwSa7K9OjCumUdaYjNmob5HPAvubQx7ATMhfXfKGrr_XQkAJnsRFoPjo=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-kXpC2m7p8Vw/AAAAAAAAAAI/AAAAAAAAAAA/KZ1ENQAdgvc/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11:30AM-10PM"
      ],
      "Tuesday": [
        "Closed"
      ],
      "Wednesday": [
        "11:30AM-10PM"
      ],
      "Thursday": [
        "11:30AM-10PM"
      ],
      "Friday": [
        "11:30AM-10PM"
      ],
      "Saturday": [
        "11:30AM-10PM"
      ],
      "Sunday": [
        "11:30AM-10PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://www.google.com/maps/reserve/v/dine/c/LgPPmmZTnOk?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Jang+Su+Jang+Korean+BBQ/@34.0758217,-84.2954335,14z/data=!4m8!1m2!2m1!1sJang+Su+Jang+Korean+BBQ!3m4!1s0x88f575f49a2f4c1f:0x1550e39afda1af37!8m2!3d34.0758217!4d-84.2954335",
    "placeId": "ChIJH0wvmvR19YgRN6-h_ZrjUBU",
    "subtypes": "Korean barbecue restaurant, Asian restaurant, Barbecue restaurant, Box lunch supplier, Brunch restaurant, Catering food and drink supplier, Korean beef restaurant, Lunch restaurant, Restaurant, Tofu restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Revolving Sushi Factory",
    "slug": "revolving-sushi-factory",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 678-395-3177",
    "website": "http://revolvingsushifactory.com/",
    "address": "865 N Main St, Alpharetta, GA 30004",
    "street": "865 N Main St",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30004",
    "latitude": 34.0926517,
    "longitude": -84.2805293,
    "rating": 4.3,
    "reviewCount": 587,
    "reviewsPerScore": {
      "1": 40,
      "2": 28,
      "3": 49,
      "4": 94,
      "5": 376
    },
    "photosCount": 770,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGhbqBhVmqXV2duROwlu3SsjjefNQHuWdzxmg75foocd6sKplHN0AYKxCJQa4ZfpibpzQvBOI72SXEQmNpEMASQ_RrQ_4x5dhbO0pu7abRfAtaKBHcTypg3CqA4RhaoWrtAMfc-qg=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-JOWoUnWfFc4/AAAAAAAAAAI/AAAAAAAAAAA/aD2rmS8b6Gk/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-9:30PM"
      ],
      "Tuesday": [
        "11AM-9:30PM"
      ],
      "Wednesday": [
        "11AM-9:30PM"
      ],
      "Thursday": [
        "11AM-9:30PM"
      ],
      "Friday": [
        "11AM-10PM"
      ],
      "Saturday": [
        "11AM-10PM"
      ],
      "Sunday": [
        "11:30AM-9:30PM"
      ]
    },
    "priceRange": "$",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://tmt.spotapps.co/reservations?spot_id=227145&source=google&rwg_token=AFd1xnH0qKQSy4hFTWEDVG2cxaXKkabJNKetmXp0SiHuDbx5N-BYpTtR0rFiGi-bkWOESZ1hGaCkrfe5isONayw4p2d9D5IJS-w28Dm5Vc0iY9YipUgLxxw%3D, https://www.google.com/maps/reserve/v/dine/c/qHzk5hQPqaY?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Revolving+Sushi+Factory/@34.0926517,-84.2805293,14z/data=!4m8!1m2!2m1!1sRevolving+Sushi+Factory!3m4!1s0x88f57509b7b06c95:0xebd93cd8da9f4daf!8m2!3d34.0926517!4d-84.2805293",
    "placeId": "ChIJlWywtwl19YgRr02f2tg82es",
    "subtypes": "Conveyor belt sushi restaurant, Asian restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": true,
      "vegetarianOptions": true,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": true,
      "familyFriendly": true,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Edo Japanese Cuisine",
    "slug": "edo-japanese-cuisine",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 770-558-2060",
    "website": "https://edo-us.com/",
    "address": "2500 North Point Ct, Alpharetta, GA 30022",
    "street": "2500 North Point Ct",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30022",
    "latitude": 34.0506518,
    "longitude": -84.2883997,
    "rating": 4.7,
    "reviewCount": 434,
    "reviewsPerScore": {
      "1": 12,
      "2": 7,
      "3": 15,
      "4": 19,
      "5": 381
    },
    "photosCount": 878,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHFxVKvoQUaZqwS9KvFkyaY1h14U9lwS3iTwZw7kyhf2LLsDV54nhWMW-pHktYm5IpvxLjV1ZIiiH3hwkc1sy-hrgEWlxzJeU-ECH1NQMPqd2vhTqljmLmJ38FRN2EP0CGodVqASK676f0=w800-h500-k-no",
    "logo": "https://lh3.googleusercontent.com/-WUS-AgTf3e8/AAAAAAAAAAI/AAAAAAAAAAA/NuwiCHOW5mA/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "5-10PM"
      ],
      "Tuesday": [
        "5-10PM"
      ],
      "Wednesday": [
        "5-10PM"
      ],
      "Thursday": [
        "5-10PM"
      ],
      "Friday": [
        "5-11PM"
      ],
      "Saturday": [
        "12-3PM",
        "5-11PM"
      ],
      "Sunday": [
        "12-3PM",
        "5-10PM"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "https://resy.com/cities/alpharetta-ga/venues/edo-japanese-cuisine?rwg_token=AFd1xnGU09pR6wZPVXHz2GbWDndYySJps8GdE3q5YkwW6JjfxmyF7MA1SMKCYBA1iwpBbJ9EuEL6scrtDyvat7JPplfRHjtog9DzrUkNq4h7tMzsFmbG-Fo%3D, https://www.google.com/maps/reserve/v/dine/c/dOzcfN55xiA?source=pa&opi=79508299",
    "googleMapsLink": "https://www.google.com/maps/place/Edo+Japanese+Cuisine/@34.0506518,-84.2883997,14z/data=!4m8!1m2!2m1!1sEdo+Japanese+Cuisine!3m4!1s0x88f575286f28c7a3:0xb78b33ba54eb3189!8m2!3d34.0506518!4d-84.2883997",
    "placeId": "ChIJo8cobyh19YgRiTHrVLozi7c",
    "subtypes": "Authentic Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": true,
      "alcohol": true,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": true,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": true,
      "trendy": true,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  },
  {
    "name": "Hibachiman",
    "slug": "hibachiman",
    "citySlug": "alpharetta",
    "stateSlug": "ga",
    "phone": "+1 470-514-5376",
    "website": "https://www.hibachiman.com/",
    "address": "4932 Atlanta Hwy, Alpharetta, GA 30004",
    "street": "4932 Atlanta Hwy",
    "city": "Alpharetta",
    "county": "None",
    "state": "Georgia",
    "stateCode": "GA",
    "postalCode": "30004",
    "latitude": 34.1584588,
    "longitude": -84.2402147,
    "rating": 4.7,
    "reviewCount": 158,
    "reviewsPerScore": {
      "1": 6,
      "2": 0,
      "3": 4,
      "4": 22,
      "5": 126
    },
    "photosCount": 53,
    "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEWAVfJ1pzqmfj-84uPkWYVmJtwjCkPxRc1cQ_ZQT_j4uKizipm0R_SXG1-YqsBGagw-ogAJEsmNhGzHdtJyONi95Ib1K8RYLgEThh2g182ILHFPchizdZPN0Y5GWJBcM0WeCbw=w800-h500-k-no",
    "logo": "https://lh4.googleusercontent.com/-9cb8OEqKKA0/AAAAAAAAAAI/AAAAAAAAAAA/EiJmpuAM_M8/s44-p-k-no-ns-nd/photo.jpg",
    "businessStatus": "OPERATIONAL",
    "hours": {
      "Monday": [
        "11AM-8PM"
      ],
      "Tuesday": [
        "11AM-8PM"
      ],
      "Wednesday": [
        "11AM-8PM"
      ],
      "Thursday": [
        "11AM-8PM"
      ],
      "Friday": [
        "11AM-8PM"
      ],
      "Saturday": [
        "11AM-8PM"
      ],
      "Sunday": [
        "Closed"
      ]
    },
    "priceRange": "",
    "description": "",
    "menuLink": "",
    "orderLinks": "",
    "googleMapsLink": "https://www.google.com/maps/place/Hibachiman/@34.1584588,-84.2402147,14z/data=!4m8!1m2!2m1!1sHibachiman!3m4!1s0x88f59d0f3c365c4d:0xc9b176dbde834d55!8m2!3d34.1584588!4d-84.2402147",
    "placeId": "ChIJTVw2PA-d9YgRVU2D3tt2sck",
    "subtypes": "Japanese restaurant",
    "amenities": {
      "delivery": true,
      "takeout": true,
      "dineIn": true,
      "outdoorSeating": false,
      "alcohol": false,
      "veganOptions": false,
      "vegetarianOptions": false,
      "acceptsReservations": false,
      "wheelchairAccessible": true,
      "casual": true,
      "cozy": false,
      "trendy": false,
      "familyFriendly": false,
      "parking": true,
      "creditCards": true
    }
  }
]

export function getRestaurantsByCity(citySlug: string, stateSlug: string) {
  return restaurants.filter(r => r.citySlug === citySlug && r.stateSlug === stateSlug)
}

export function getRestaurant(citySlug: string, stateSlug: string, slug: string) {
  return restaurants.find(r => r.citySlug === citySlug && r.stateSlug === stateSlug && r.slug === slug) ?? null
}

export function getCities() {
  const map = new Map<string, { city: string; stateCode: string; citySlug: string; stateSlug: string; count: number }>()
  for (const r of restaurants) {
    const key = `${r.citySlug}-${r.stateSlug}`
    if (map.has(key)) { map.get(key)!.count++ } else {
      map.set(key, { city: r.city, stateCode: r.stateCode, citySlug: r.citySlug, stateSlug: r.stateSlug, count: 1 })
    }
  }
  return Array.from(map.values()).sort((a,b) => b.count - a.count)
}

export const BROTH_TYPES = ['Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan'] as const
export type BrothType = typeof BROTH_TYPES[number]

export function getBrothTypes(r: Restaurant): BrothType[] {
  const text = `${r.name} ${r.description} ${r.subtypes}`.toLowerCase()
  const types: BrothType[] = []
  if (text.includes('tonkotsu')) types.push('Tonkotsu')
  if (text.includes('shoyu')) types.push('Shoyu')
  if (text.includes('miso') || text.includes('hokkaido')) types.push('Miso')
  if (text.includes('spicy') || text.includes('tantanmen') || text.includes('tan tan') || text.includes('tori paitan')) types.push('Spicy')
  if (r.amenities.veganOptions) types.push('Vegan')
  return types
}

export function getRestaurantsByBrothType(type: BrothType): Restaurant[] {
  return restaurants.filter(r => getBrothTypes(r).includes(type))
}
