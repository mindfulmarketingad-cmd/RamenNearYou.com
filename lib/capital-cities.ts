export interface CapitalCity {
  city: string
  citySlug: string
  stateCode: string
  stateSlug: string
  /** URL param: citySlug-stateCode (lowercase), e.g. "atlanta-ga" */
  param: string
  lat: number
  lng: number
}

export const CAPITAL_CITIES: CapitalCity[] = [
  { city: 'Montgomery',    citySlug: 'montgomery',    stateCode: 'AL', stateSlug: 'alabama',        param: 'montgomery-al',     lat: 32.3617,  lng: -86.2792 },
  { city: 'Juneau',        citySlug: 'juneau',        stateCode: 'AK', stateSlug: 'alaska',         param: 'juneau-ak',         lat: 58.3005,  lng: -134.4197 },
  { city: 'Phoenix',       citySlug: 'phoenix',       stateCode: 'AZ', stateSlug: 'arizona',        param: 'phoenix-az',        lat: 33.4484,  lng: -112.0740 },
  { city: 'Little Rock',   citySlug: 'little-rock',   stateCode: 'AR', stateSlug: 'arkansas',       param: 'little-rock-ar',    lat: 34.7465,  lng: -92.2896 },
  { city: 'Sacramento',    citySlug: 'sacramento',    stateCode: 'CA', stateSlug: 'california',     param: 'sacramento-ca',     lat: 38.5816,  lng: -121.4944 },
  { city: 'Denver',        citySlug: 'denver',        stateCode: 'CO', stateSlug: 'colorado',       param: 'denver-co',         lat: 39.7392,  lng: -104.9903 },
  { city: 'Hartford',      citySlug: 'hartford',      stateCode: 'CT', stateSlug: 'connecticut',    param: 'hartford-ct',       lat: 41.7637,  lng: -72.6851 },
  { city: 'Dover',         citySlug: 'dover',         stateCode: 'DE', stateSlug: 'delaware',       param: 'dover-de',          lat: 39.1582,  lng: -75.5244 },
  { city: 'Tallahassee',   citySlug: 'tallahassee',   stateCode: 'FL', stateSlug: 'florida',        param: 'tallahassee-fl',    lat: 30.4518,  lng: -84.2807 },
  { city: 'Atlanta',       citySlug: 'atlanta',       stateCode: 'GA', stateSlug: 'georgia',        param: 'atlanta-ga',        lat: 33.7490,  lng: -84.3880 },
  { city: 'Honolulu',      citySlug: 'honolulu',      stateCode: 'HI', stateSlug: 'hawaii',         param: 'honolulu-hi',       lat: 21.3069,  lng: -157.8583 },
  { city: 'Boise',         citySlug: 'boise',         stateCode: 'ID', stateSlug: 'idaho',          param: 'boise-id',          lat: 43.6150,  lng: -116.2023 },
  { city: 'Springfield',   citySlug: 'springfield',   stateCode: 'IL', stateSlug: 'illinois',       param: 'springfield-il',    lat: 39.7817,  lng: -89.6501 },
  { city: 'Indianapolis',  citySlug: 'indianapolis',  stateCode: 'IN', stateSlug: 'indiana',        param: 'indianapolis-in',   lat: 39.7684,  lng: -86.1581 },
  { city: 'Des Moines',    citySlug: 'des-moines',    stateCode: 'IA', stateSlug: 'iowa',           param: 'des-moines-ia',     lat: 41.5868,  lng: -93.6250 },
  { city: 'Topeka',        citySlug: 'topeka',        stateCode: 'KS', stateSlug: 'kansas',         param: 'topeka-ks',         lat: 39.0489,  lng: -95.6780 },
  { city: 'Frankfort',     citySlug: 'frankfort',     stateCode: 'KY', stateSlug: 'kentucky',       param: 'frankfort-ky',      lat: 38.2009,  lng: -84.8733 },
  { city: 'Baton Rouge',   citySlug: 'baton-rouge',   stateCode: 'LA', stateSlug: 'louisiana',      param: 'baton-rouge-la',    lat: 30.4515,  lng: -91.1871 },
  { city: 'Augusta',       citySlug: 'augusta',       stateCode: 'ME', stateSlug: 'maine',          param: 'augusta-me',        lat: 44.3106,  lng: -69.7795 },
  { city: 'Annapolis',     citySlug: 'annapolis',     stateCode: 'MD', stateSlug: 'maryland',       param: 'annapolis-md',      lat: 38.9784,  lng: -76.4922 },
  { city: 'Boston',        citySlug: 'boston',        stateCode: 'MA', stateSlug: 'massachusetts',  param: 'boston-ma',         lat: 42.3601,  lng: -71.0589 },
  { city: 'Lansing',       citySlug: 'lansing',       stateCode: 'MI', stateSlug: 'michigan',       param: 'lansing-mi',        lat: 42.7325,  lng: -84.5555 },
  { city: 'Saint Paul',    citySlug: 'saint-paul',    stateCode: 'MN', stateSlug: 'minnesota',      param: 'saint-paul-mn',     lat: 44.9537,  lng: -93.0900 },
  { city: 'Jackson',       citySlug: 'jackson',       stateCode: 'MS', stateSlug: 'mississippi',    param: 'jackson-ms',        lat: 32.2988,  lng: -90.1848 },
  { city: 'Jefferson City',citySlug: 'jefferson-city',stateCode: 'MO', stateSlug: 'missouri',       param: 'jefferson-city-mo', lat: 38.5767,  lng: -92.1735 },
  { city: 'Helena',        citySlug: 'helena',        stateCode: 'MT', stateSlug: 'montana',        param: 'helena-mt',         lat: 46.5958,  lng: -112.0270 },
  { city: 'Lincoln',       citySlug: 'lincoln',       stateCode: 'NE', stateSlug: 'nebraska',       param: 'lincoln-ne',        lat: 40.8136,  lng: -96.7026 },
  { city: 'Carson City',   citySlug: 'carson-city',   stateCode: 'NV', stateSlug: 'nevada',         param: 'carson-city-nv',    lat: 39.1638,  lng: -119.7674 },
  { city: 'Concord',       citySlug: 'concord',       stateCode: 'NH', stateSlug: 'new-hampshire',  param: 'concord-nh',        lat: 43.2081,  lng: -71.5376 },
  { city: 'Trenton',       citySlug: 'trenton',       stateCode: 'NJ', stateSlug: 'new-jersey',     param: 'trenton-nj',        lat: 40.2171,  lng: -74.7429 },
  { city: 'Santa Fe',      citySlug: 'santa-fe',      stateCode: 'NM', stateSlug: 'new-mexico',     param: 'santa-fe-nm',       lat: 35.6870,  lng: -105.9378 },
  { city: 'Albany',        citySlug: 'albany',        stateCode: 'NY', stateSlug: 'new-york',       param: 'albany-ny',         lat: 42.6526,  lng: -73.7562 },
  { city: 'Raleigh',       citySlug: 'raleigh',       stateCode: 'NC', stateSlug: 'north-carolina', param: 'raleigh-nc',        lat: 35.7796,  lng: -78.6382 },
  { city: 'Bismarck',      citySlug: 'bismarck',      stateCode: 'ND', stateSlug: 'north-dakota',   param: 'bismarck-nd',       lat: 46.8083,  lng: -100.7837 },
  { city: 'Columbus',      citySlug: 'columbus',      stateCode: 'OH', stateSlug: 'ohio',           param: 'columbus-oh',       lat: 39.9612,  lng: -82.9988 },
  { city: 'Oklahoma City', citySlug: 'oklahoma-city', stateCode: 'OK', stateSlug: 'oklahoma',       param: 'oklahoma-city-ok',  lat: 35.4676,  lng: -97.5164 },
  { city: 'Salem',         citySlug: 'salem',         stateCode: 'OR', stateSlug: 'oregon',         param: 'salem-or',          lat: 44.9429,  lng: -123.0351 },
  { city: 'Harrisburg',    citySlug: 'harrisburg',    stateCode: 'PA', stateSlug: 'pennsylvania',   param: 'harrisburg-pa',     lat: 40.2732,  lng: -76.8867 },
  { city: 'Providence',    citySlug: 'providence',    stateCode: 'RI', stateSlug: 'rhode-island',   param: 'providence-ri',     lat: 41.8240,  lng: -71.4128 },
  { city: 'Columbia',      citySlug: 'columbia',      stateCode: 'SC', stateSlug: 'south-carolina', param: 'columbia-sc',       lat: 34.0007,  lng: -81.0348 },
  { city: 'Pierre',        citySlug: 'pierre',        stateCode: 'SD', stateSlug: 'south-dakota',   param: 'pierre-sd',         lat: 44.3683,  lng: -100.3510 },
  { city: 'Nashville',     citySlug: 'nashville',     stateCode: 'TN', stateSlug: 'tennessee',      param: 'nashville-tn',      lat: 36.1627,  lng: -86.7816 },
  { city: 'Austin',        citySlug: 'austin',        stateCode: 'TX', stateSlug: 'texas',          param: 'austin-tx',         lat: 30.2672,  lng: -97.7431 },
  { city: 'Salt Lake City',citySlug: 'salt-lake-city',stateCode: 'UT', stateSlug: 'utah',           param: 'salt-lake-city-ut', lat: 40.7608,  lng: -111.8910 },
  { city: 'Montpelier',    citySlug: 'montpelier',    stateCode: 'VT', stateSlug: 'vermont',        param: 'montpelier-vt',     lat: 44.2601,  lng: -72.5754 },
  { city: 'Richmond',      citySlug: 'richmond',      stateCode: 'VA', stateSlug: 'virginia',       param: 'richmond-va',       lat: 37.5407,  lng: -77.4360 },
  { city: 'Olympia',       citySlug: 'olympia',       stateCode: 'WA', stateSlug: 'washington',     param: 'olympia-wa',        lat: 47.0379,  lng: -122.9007 },
  { city: 'Charleston',    citySlug: 'charleston',    stateCode: 'WV', stateSlug: 'west-virginia',  param: 'charleston-wv',     lat: 38.3498,  lng: -81.6326 },
  { city: 'Madison',       citySlug: 'madison',       stateCode: 'WI', stateSlug: 'wisconsin',      param: 'madison-wi',        lat: 43.0731,  lng: -89.4012 },
  { city: 'Cheyenne',      citySlug: 'cheyenne',      stateCode: 'WY', stateSlug: 'wyoming',        param: 'cheyenne-wy',       lat: 41.1400,  lng: -104.8202 },
]

export const CAPITAL_BY_PARAM = Object.fromEntries(CAPITAL_CITIES.map(c => [c.param, c]))
