/**
 * Fetches ramen restaurant data from Google Places Text Search API
 * for major US cities not already in the DB or capital supplements.
 *
 * Run: GOOGLE_PLACES_API_KEY=<key> node scripts/fetch-major-city-places.mjs
 * Output: lib/places-major-cities.json
 * Resume-safe: skips cities already fetched or in DB/capitals.
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_FILE = join(ROOT, 'lib', 'places-major-cities.json')
const RESTAURANTS_FILE = join(ROOT, 'lib', 'restaurants.json')
const CAPITALS_FILE = join(ROOT, 'lib', 'places-capital-supplements.json')

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('GOOGLE_PLACES_API_KEY is not set')
  process.exit(1)
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Comprehensive major cities for all 50 states (10-15 per state)
const MAJOR_CITIES = [
  // Alabama
  { city: 'Birmingham',    stateCode: 'AL', state: 'Alabama' },
  { city: 'Huntsville',    stateCode: 'AL', state: 'Alabama' },
  { city: 'Mobile',        stateCode: 'AL', state: 'Alabama' },
  { city: 'Tuscaloosa',    stateCode: 'AL', state: 'Alabama' },
  { city: 'Montgomery',    stateCode: 'AL', state: 'Alabama' },
  { city: 'Hoover',        stateCode: 'AL', state: 'Alabama' },
  { city: 'Auburn',        stateCode: 'AL', state: 'Alabama' },
  { city: 'Dothan',        stateCode: 'AL', state: 'Alabama' },
  { city: 'Decatur',       stateCode: 'AL', state: 'Alabama' },
  { city: 'Madison',       stateCode: 'AL', state: 'Alabama' },
  { city: 'Phenix City',   stateCode: 'AL', state: 'Alabama' },
  { city: 'Florence',      stateCode: 'AL', state: 'Alabama' },

  // Alaska
  { city: 'Anchorage',     stateCode: 'AK', state: 'Alaska' },
  { city: 'Fairbanks',     stateCode: 'AK', state: 'Alaska' },
  { city: 'Juneau',        stateCode: 'AK', state: 'Alaska' },
  { city: 'Sitka',         stateCode: 'AK', state: 'Alaska' },
  { city: 'Ketchikan',     stateCode: 'AK', state: 'Alaska' },
  { city: 'Wasilla',       stateCode: 'AK', state: 'Alaska' },
  { city: 'Kenai',         stateCode: 'AK', state: 'Alaska' },
  { city: 'Kodiak',        stateCode: 'AK', state: 'Alaska' },

  // Arizona
  { city: 'Phoenix',       stateCode: 'AZ', state: 'Arizona' },
  { city: 'Tucson',        stateCode: 'AZ', state: 'Arizona' },
  { city: 'Mesa',          stateCode: 'AZ', state: 'Arizona' },
  { city: 'Chandler',      stateCode: 'AZ', state: 'Arizona' },
  { city: 'Scottsdale',    stateCode: 'AZ', state: 'Arizona' },
  { city: 'Glendale',      stateCode: 'AZ', state: 'Arizona' },
  { city: 'Gilbert',       stateCode: 'AZ', state: 'Arizona' },
  { city: 'Tempe',         stateCode: 'AZ', state: 'Arizona' },
  { city: 'Peoria',        stateCode: 'AZ', state: 'Arizona' },
  { city: 'Flagstaff',     stateCode: 'AZ', state: 'Arizona' },
  { city: 'Surprise',      stateCode: 'AZ', state: 'Arizona' },
  { city: 'Yuma',          stateCode: 'AZ', state: 'Arizona' },
  { city: 'Avondale',      stateCode: 'AZ', state: 'Arizona' },

  // Arkansas
  { city: 'Little Rock',   stateCode: 'AR', state: 'Arkansas' },
  { city: 'Fort Smith',    stateCode: 'AR', state: 'Arkansas' },
  { city: 'Fayetteville',  stateCode: 'AR', state: 'Arkansas' },
  { city: 'Springdale',    stateCode: 'AR', state: 'Arkansas' },
  { city: 'Jonesboro',     stateCode: 'AR', state: 'Arkansas' },
  { city: 'Rogers',        stateCode: 'AR', state: 'Arkansas' },
  { city: 'Bentonville',   stateCode: 'AR', state: 'Arkansas' },
  { city: 'Pine Bluff',    stateCode: 'AR', state: 'Arkansas' },
  { city: 'Conway',        stateCode: 'AR', state: 'Arkansas' },
  { city: 'North Little Rock', stateCode: 'AR', state: 'Arkansas' },

  // California
  { city: 'Los Angeles',   stateCode: 'CA', state: 'California' },
  { city: 'San Diego',     stateCode: 'CA', state: 'California' },
  { city: 'San Jose',      stateCode: 'CA', state: 'California' },
  { city: 'San Francisco', stateCode: 'CA', state: 'California' },
  { city: 'Fresno',        stateCode: 'CA', state: 'California' },
  { city: 'Sacramento',    stateCode: 'CA', state: 'California' },
  { city: 'Long Beach',    stateCode: 'CA', state: 'California' },
  { city: 'Oakland',       stateCode: 'CA', state: 'California' },
  { city: 'Bakersfield',   stateCode: 'CA', state: 'California' },
  { city: 'Anaheim',       stateCode: 'CA', state: 'California' },
  { city: 'Santa Ana',     stateCode: 'CA', state: 'California' },
  { city: 'Riverside',     stateCode: 'CA', state: 'California' },
  { city: 'Irvine',        stateCode: 'CA', state: 'California' },
  { city: 'San Bernardino', stateCode: 'CA', state: 'California' },
  { city: 'Torrance',      stateCode: 'CA', state: 'California' },

  // Colorado
  { city: 'Denver',        stateCode: 'CO', state: 'Colorado' },
  { city: 'Colorado Springs', stateCode: 'CO', state: 'Colorado' },
  { city: 'Aurora',        stateCode: 'CO', state: 'Colorado' },
  { city: 'Fort Collins',  stateCode: 'CO', state: 'Colorado' },
  { city: 'Lakewood',      stateCode: 'CO', state: 'Colorado' },
  { city: 'Thornton',      stateCode: 'CO', state: 'Colorado' },
  { city: 'Arvada',        stateCode: 'CO', state: 'Colorado' },
  { city: 'Westminster',   stateCode: 'CO', state: 'Colorado' },
  { city: 'Pueblo',        stateCode: 'CO', state: 'Colorado' },
  { city: 'Boulder',       stateCode: 'CO', state: 'Colorado' },
  { city: 'Greeley',       stateCode: 'CO', state: 'Colorado' },

  // Connecticut
  { city: 'Bridgeport',    stateCode: 'CT', state: 'Connecticut' },
  { city: 'New Haven',     stateCode: 'CT', state: 'Connecticut' },
  { city: 'Hartford',      stateCode: 'CT', state: 'Connecticut' },
  { city: 'Stamford',      stateCode: 'CT', state: 'Connecticut' },
  { city: 'Waterbury',     stateCode: 'CT', state: 'Connecticut' },
  { city: 'Norwalk',       stateCode: 'CT', state: 'Connecticut' },
  { city: 'Danbury',       stateCode: 'CT', state: 'Connecticut' },
  { city: 'New Britain',   stateCode: 'CT', state: 'Connecticut' },
  { city: 'West Hartford', stateCode: 'CT', state: 'Connecticut' },
  { city: 'Greenwich',     stateCode: 'CT', state: 'Connecticut' },

  // Delaware
  { city: 'Wilmington',    stateCode: 'DE', state: 'Delaware' },
  { city: 'Dover',         stateCode: 'DE', state: 'Delaware' },
  { city: 'Newark',        stateCode: 'DE', state: 'Delaware' },
  { city: 'Middletown',    stateCode: 'DE', state: 'Delaware' },
  { city: 'Smyrna',        stateCode: 'DE', state: 'Delaware' },
  { city: 'Milford',       stateCode: 'DE', state: 'Delaware' },

  // Florida
  { city: 'Jacksonville',  stateCode: 'FL', state: 'Florida' },
  { city: 'Miami',         stateCode: 'FL', state: 'Florida' },
  { city: 'Tampa',         stateCode: 'FL', state: 'Florida' },
  { city: 'Orlando',       stateCode: 'FL', state: 'Florida' },
  { city: 'St. Petersburg', stateCode: 'FL', state: 'Florida' },
  { city: 'Hialeah',       stateCode: 'FL', state: 'Florida' },
  { city: 'Tallahassee',   stateCode: 'FL', state: 'Florida' },
  { city: 'Fort Lauderdale', stateCode: 'FL', state: 'Florida' },
  { city: 'Port St. Lucie', stateCode: 'FL', state: 'Florida' },
  { city: 'Pembroke Pines', stateCode: 'FL', state: 'Florida' },
  { city: 'Gainesville',   stateCode: 'FL', state: 'Florida' },
  { city: 'Clearwater',    stateCode: 'FL', state: 'Florida' },
  { city: 'Boca Raton',    stateCode: 'FL', state: 'Florida' },

  // Georgia
  { city: 'Atlanta',       stateCode: 'GA', state: 'Georgia' },
  { city: 'Columbus',      stateCode: 'GA', state: 'Georgia' },
  { city: 'Augusta',       stateCode: 'GA', state: 'Georgia' },
  { city: 'Savannah',      stateCode: 'GA', state: 'Georgia' },
  { city: 'Macon',         stateCode: 'GA', state: 'Georgia' },
  { city: 'Roswell',       stateCode: 'GA', state: 'Georgia' },
  { city: 'Albany',        stateCode: 'GA', state: 'Georgia' },
  { city: 'Johns Creek',   stateCode: 'GA', state: 'Georgia' },
  { city: 'Warner Robins', stateCode: 'GA', state: 'Georgia' },
  { city: 'Athens',        stateCode: 'GA', state: 'Georgia' },
  { city: 'Sandy Springs', stateCode: 'GA', state: 'Georgia' },
  { city: 'Marietta',      stateCode: 'GA', state: 'Georgia' },

  // Hawaii
  { city: 'Honolulu',      stateCode: 'HI', state: 'Hawaii' },
  { city: 'Pearl City',    stateCode: 'HI', state: 'Hawaii' },
  { city: 'Hilo',          stateCode: 'HI', state: 'Hawaii' },
  { city: 'Kailua',        stateCode: 'HI', state: 'Hawaii' },
  { city: 'Waipahu',       stateCode: 'HI', state: 'Hawaii' },
  { city: 'Kaneohe',       stateCode: 'HI', state: 'Hawaii' },
  { city: 'Mililani',      stateCode: 'HI', state: 'Hawaii' },
  { city: 'Kahului',       stateCode: 'HI', state: 'Hawaii' },
  { city: 'Kihei',         stateCode: 'HI', state: 'Hawaii' },

  // Idaho
  { city: 'Boise',         stateCode: 'ID', state: 'Idaho' },
  { city: 'Nampa',         stateCode: 'ID', state: 'Idaho' },
  { city: 'Meridian',      stateCode: 'ID', state: 'Idaho' },
  { city: 'Idaho Falls',   stateCode: 'ID', state: 'Idaho' },
  { city: 'Pocatello',     stateCode: 'ID', state: 'Idaho' },
  { city: 'Caldwell',      stateCode: 'ID', state: 'Idaho' },
  { city: 'Coeur d\'Alene', stateCode: 'ID', state: 'Idaho' },
  { city: 'Twin Falls',    stateCode: 'ID', state: 'Idaho' },
  { city: 'Lewiston',      stateCode: 'ID', state: 'Idaho' },

  // Illinois
  { city: 'Chicago',       stateCode: 'IL', state: 'Illinois' },
  { city: 'Aurora',        stateCode: 'IL', state: 'Illinois' },
  { city: 'Joliet',        stateCode: 'IL', state: 'Illinois' },
  { city: 'Naperville',    stateCode: 'IL', state: 'Illinois' },
  { city: 'Rockford',      stateCode: 'IL', state: 'Illinois' },
  { city: 'Springfield',   stateCode: 'IL', state: 'Illinois' },
  { city: 'Elgin',         stateCode: 'IL', state: 'Illinois' },
  { city: 'Peoria',        stateCode: 'IL', state: 'Illinois' },
  { city: 'Champaign',     stateCode: 'IL', state: 'Illinois' },
  { city: 'Waukegan',      stateCode: 'IL', state: 'Illinois' },
  { city: 'Cicero',        stateCode: 'IL', state: 'Illinois' },
  { city: 'Evanston',      stateCode: 'IL', state: 'Illinois' },

  // Indiana
  { city: 'Indianapolis',  stateCode: 'IN', state: 'Indiana' },
  { city: 'Fort Wayne',    stateCode: 'IN', state: 'Indiana' },
  { city: 'Evansville',    stateCode: 'IN', state: 'Indiana' },
  { city: 'South Bend',    stateCode: 'IN', state: 'Indiana' },
  { city: 'Carmel',        stateCode: 'IN', state: 'Indiana' },
  { city: 'Fishers',       stateCode: 'IN', state: 'Indiana' },
  { city: 'Bloomington',   stateCode: 'IN', state: 'Indiana' },
  { city: 'Hammond',       stateCode: 'IN', state: 'Indiana' },
  { city: 'Gary',          stateCode: 'IN', state: 'Indiana' },
  { city: 'Lafayette',     stateCode: 'IN', state: 'Indiana' },
  { city: 'Muncie',        stateCode: 'IN', state: 'Indiana' },

  // Iowa
  { city: 'Des Moines',    stateCode: 'IA', state: 'Iowa' },
  { city: 'Cedar Rapids',  stateCode: 'IA', state: 'Iowa' },
  { city: 'Davenport',     stateCode: 'IA', state: 'Iowa' },
  { city: 'Sioux City',    stateCode: 'IA', state: 'Iowa' },
  { city: 'Iowa City',     stateCode: 'IA', state: 'Iowa' },
  { city: 'Waterloo',      stateCode: 'IA', state: 'Iowa' },
  { city: 'Ames',          stateCode: 'IA', state: 'Iowa' },
  { city: 'Ankeny',        stateCode: 'IA', state: 'Iowa' },
  { city: 'Dubuque',       stateCode: 'IA', state: 'Iowa' },
  { city: 'Council Bluffs', stateCode: 'IA', state: 'Iowa' },

  // Kansas
  { city: 'Wichita',       stateCode: 'KS', state: 'Kansas' },
  { city: 'Overland Park', stateCode: 'KS', state: 'Kansas' },
  { city: 'Kansas City',   stateCode: 'KS', state: 'Kansas' },
  { city: 'Topeka',        stateCode: 'KS', state: 'Kansas' },
  { city: 'Olathe',        stateCode: 'KS', state: 'Kansas' },
  { city: 'Lawrence',      stateCode: 'KS', state: 'Kansas' },
  { city: 'Shawnee',       stateCode: 'KS', state: 'Kansas' },
  { city: 'Manhattan',     stateCode: 'KS', state: 'Kansas' },
  { city: 'Lenexa',        stateCode: 'KS', state: 'Kansas' },
  { city: 'Salina',        stateCode: 'KS', state: 'Kansas' },

  // Kentucky
  { city: 'Louisville',    stateCode: 'KY', state: 'Kentucky' },
  { city: 'Lexington',     stateCode: 'KY', state: 'Kentucky' },
  { city: 'Bowling Green', stateCode: 'KY', state: 'Kentucky' },
  { city: 'Owensboro',     stateCode: 'KY', state: 'Kentucky' },
  { city: 'Covington',     stateCode: 'KY', state: 'Kentucky' },
  { city: 'Frankfort',     stateCode: 'KY', state: 'Kentucky' },
  { city: 'Georgetown',    stateCode: 'KY', state: 'Kentucky' },
  { city: 'Florence',      stateCode: 'KY', state: 'Kentucky' },
  { city: 'Hopkinsville',  stateCode: 'KY', state: 'Kentucky' },
  { city: 'Richmond',      stateCode: 'KY', state: 'Kentucky' },

  // Louisiana
  { city: 'New Orleans',   stateCode: 'LA', state: 'Louisiana' },
  { city: 'Baton Rouge',   stateCode: 'LA', state: 'Louisiana' },
  { city: 'Shreveport',    stateCode: 'LA', state: 'Louisiana' },
  { city: 'Lafayette',     stateCode: 'LA', state: 'Louisiana' },
  { city: 'Lake Charles',  stateCode: 'LA', state: 'Louisiana' },
  { city: 'Kenner',        stateCode: 'LA', state: 'Louisiana' },
  { city: 'Bossier City',  stateCode: 'LA', state: 'Louisiana' },
  { city: 'Monroe',        stateCode: 'LA', state: 'Louisiana' },
  { city: 'Alexandria',    stateCode: 'LA', state: 'Louisiana' },
  { city: 'Metairie',      stateCode: 'LA', state: 'Louisiana' },

  // Maine
  { city: 'Portland',      stateCode: 'ME', state: 'Maine' },
  { city: 'Lewiston',      stateCode: 'ME', state: 'Maine' },
  { city: 'Bangor',        stateCode: 'ME', state: 'Maine' },
  { city: 'South Portland', stateCode: 'ME', state: 'Maine' },
  { city: 'Augusta',       stateCode: 'ME', state: 'Maine' },
  { city: 'Biddeford',     stateCode: 'ME', state: 'Maine' },
  { city: 'Sanford',       stateCode: 'ME', state: 'Maine' },
  { city: 'Brunswick',     stateCode: 'ME', state: 'Maine' },

  // Maryland
  { city: 'Baltimore',     stateCode: 'MD', state: 'Maryland' },
  { city: 'Frederick',     stateCode: 'MD', state: 'Maryland' },
  { city: 'Rockville',     stateCode: 'MD', state: 'Maryland' },
  { city: 'Gaithersburg',  stateCode: 'MD', state: 'Maryland' },
  { city: 'Bowie',         stateCode: 'MD', state: 'Maryland' },
  { city: 'Hagerstown',    stateCode: 'MD', state: 'Maryland' },
  { city: 'Annapolis',     stateCode: 'MD', state: 'Maryland' },
  { city: 'College Park',  stateCode: 'MD', state: 'Maryland' },
  { city: 'Germantown',    stateCode: 'MD', state: 'Maryland' },
  { city: 'Salisbury',     stateCode: 'MD', state: 'Maryland' },
  { city: 'Silver Spring', stateCode: 'MD', state: 'Maryland' },

  // Massachusetts
  { city: 'Boston',        stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Worcester',     stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Springfield',   stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Cambridge',     stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Lowell',        stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Brockton',      stateCode: 'MA', state: 'Massachusetts' },
  { city: 'New Bedford',   stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Quincy',        stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Lynn',          stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Fall River',    stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Somerville',    stateCode: 'MA', state: 'Massachusetts' },
  { city: 'Medford',       stateCode: 'MA', state: 'Massachusetts' },

  // Michigan
  { city: 'Detroit',       stateCode: 'MI', state: 'Michigan' },
  { city: 'Grand Rapids',  stateCode: 'MI', state: 'Michigan' },
  { city: 'Warren',        stateCode: 'MI', state: 'Michigan' },
  { city: 'Sterling Heights', stateCode: 'MI', state: 'Michigan' },
  { city: 'Ann Arbor',     stateCode: 'MI', state: 'Michigan' },
  { city: 'Lansing',       stateCode: 'MI', state: 'Michigan' },
  { city: 'Flint',         stateCode: 'MI', state: 'Michigan' },
  { city: 'Dearborn',      stateCode: 'MI', state: 'Michigan' },
  { city: 'Livonia',       stateCode: 'MI', state: 'Michigan' },
  { city: 'Westland',      stateCode: 'MI', state: 'Michigan' },
  { city: 'Kalamazoo',     stateCode: 'MI', state: 'Michigan' },
  { city: 'Troy',          stateCode: 'MI', state: 'Michigan' },
  { city: 'Pontiac',       stateCode: 'MI', state: 'Michigan' },

  // Minnesota
  { city: 'Minneapolis',   stateCode: 'MN', state: 'Minnesota' },
  { city: 'Saint Paul',    stateCode: 'MN', state: 'Minnesota' },
  { city: 'Rochester',     stateCode: 'MN', state: 'Minnesota' },
  { city: 'Duluth',        stateCode: 'MN', state: 'Minnesota' },
  { city: 'Bloomington',   stateCode: 'MN', state: 'Minnesota' },
  { city: 'Plymouth',      stateCode: 'MN', state: 'Minnesota' },
  { city: 'Brooklyn Park', stateCode: 'MN', state: 'Minnesota' },
  { city: 'Maple Grove',   stateCode: 'MN', state: 'Minnesota' },
  { city: 'Woodbury',      stateCode: 'MN', state: 'Minnesota' },
  { city: 'Eagan',         stateCode: 'MN', state: 'Minnesota' },
  { city: 'Burnsville',    stateCode: 'MN', state: 'Minnesota' },

  // Mississippi
  { city: 'Jackson',       stateCode: 'MS', state: 'Mississippi' },
  { city: 'Gulfport',      stateCode: 'MS', state: 'Mississippi' },
  { city: 'Southaven',     stateCode: 'MS', state: 'Mississippi' },
  { city: 'Hattiesburg',   stateCode: 'MS', state: 'Mississippi' },
  { city: 'Biloxi',        stateCode: 'MS', state: 'Mississippi' },
  { city: 'Meridian',      stateCode: 'MS', state: 'Mississippi' },
  { city: 'Tupelo',        stateCode: 'MS', state: 'Mississippi' },
  { city: 'Olive Branch',  stateCode: 'MS', state: 'Mississippi' },
  { city: 'Starkville',    stateCode: 'MS', state: 'Mississippi' },
  { city: 'Oxford',        stateCode: 'MS', state: 'Mississippi' },

  // Missouri
  { city: 'Kansas City',   stateCode: 'MO', state: 'Missouri' },
  { city: 'St. Louis',     stateCode: 'MO', state: 'Missouri' },
  { city: 'Springfield',   stateCode: 'MO', state: 'Missouri' },
  { city: 'Columbia',      stateCode: 'MO', state: 'Missouri' },
  { city: 'Independence',  stateCode: 'MO', state: 'Missouri' },
  { city: 'Lee\'s Summit', stateCode: 'MO', state: 'Missouri' },
  { city: 'O\'Fallon',     stateCode: 'MO', state: 'Missouri' },
  { city: 'St. Joseph',    stateCode: 'MO', state: 'Missouri' },
  { city: 'St. Charles',   stateCode: 'MO', state: 'Missouri' },
  { city: 'Jefferson City', stateCode: 'MO', state: 'Missouri' },
  { city: 'Joplin',        stateCode: 'MO', state: 'Missouri' },

  // Montana
  { city: 'Billings',      stateCode: 'MT', state: 'Montana' },
  { city: 'Missoula',      stateCode: 'MT', state: 'Montana' },
  { city: 'Great Falls',   stateCode: 'MT', state: 'Montana' },
  { city: 'Bozeman',       stateCode: 'MT', state: 'Montana' },
  { city: 'Butte',         stateCode: 'MT', state: 'Montana' },
  { city: 'Helena',        stateCode: 'MT', state: 'Montana' },
  { city: 'Kalispell',     stateCode: 'MT', state: 'Montana' },
  { city: 'Havre',         stateCode: 'MT', state: 'Montana' },

  // Nebraska
  { city: 'Omaha',         stateCode: 'NE', state: 'Nebraska' },
  { city: 'Lincoln',       stateCode: 'NE', state: 'Nebraska' },
  { city: 'Bellevue',      stateCode: 'NE', state: 'Nebraska' },
  { city: 'Grand Island',  stateCode: 'NE', state: 'Nebraska' },
  { city: 'Kearney',       stateCode: 'NE', state: 'Nebraska' },
  { city: 'Fremont',       stateCode: 'NE', state: 'Nebraska' },
  { city: 'Hastings',      stateCode: 'NE', state: 'Nebraska' },
  { city: 'Norfolk',       stateCode: 'NE', state: 'Nebraska' },
  { city: 'Columbus',      stateCode: 'NE', state: 'Nebraska' },

  // Nevada
  { city: 'Las Vegas',     stateCode: 'NV', state: 'Nevada' },
  { city: 'Henderson',     stateCode: 'NV', state: 'Nevada' },
  { city: 'Reno',          stateCode: 'NV', state: 'Nevada' },
  { city: 'North Las Vegas', stateCode: 'NV', state: 'Nevada' },
  { city: 'Sparks',        stateCode: 'NV', state: 'Nevada' },
  { city: 'Carson City',   stateCode: 'NV', state: 'Nevada' },
  { city: 'Sunrise Manor', stateCode: 'NV', state: 'Nevada' },
  { city: 'Spring Valley', stateCode: 'NV', state: 'Nevada' },
  { city: 'Enterprise',    stateCode: 'NV', state: 'Nevada' },
  { city: 'Summerlin',     stateCode: 'NV', state: 'Nevada' },

  // New Hampshire
  { city: 'Manchester',    stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Nashua',        stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Concord',       stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Derry',         stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Rochester',     stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Dover',         stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Salem',         stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Merrimack',     stateCode: 'NH', state: 'New Hampshire' },
  { city: 'Portsmouth',    stateCode: 'NH', state: 'New Hampshire' },

  // New Jersey
  { city: 'Newark',        stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Jersey City',   stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Paterson',      stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Elizabeth',     stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Edison',        stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Woodbridge',    stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Lakewood',      stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Toms River',    stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Trenton',       stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Hamilton',      stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Clifton',       stateCode: 'NJ', state: 'New Jersey' },
  { city: 'Camden',        stateCode: 'NJ', state: 'New Jersey' },

  // New Mexico
  { city: 'Albuquerque',   stateCode: 'NM', state: 'New Mexico' },
  { city: 'Las Cruces',    stateCode: 'NM', state: 'New Mexico' },
  { city: 'Rio Rancho',    stateCode: 'NM', state: 'New Mexico' },
  { city: 'Santa Fe',      stateCode: 'NM', state: 'New Mexico' },
  { city: 'Roswell',       stateCode: 'NM', state: 'New Mexico' },
  { city: 'Farmington',    stateCode: 'NM', state: 'New Mexico' },
  { city: 'Clovis',        stateCode: 'NM', state: 'New Mexico' },
  { city: 'Hobbs',         stateCode: 'NM', state: 'New Mexico' },
  { city: 'Alamogordo',    stateCode: 'NM', state: 'New Mexico' },

  // New York
  { city: 'New York City', stateCode: 'NY', state: 'New York' },
  { city: 'Buffalo',       stateCode: 'NY', state: 'New York' },
  { city: 'Rochester',     stateCode: 'NY', state: 'New York' },
  { city: 'Yonkers',       stateCode: 'NY', state: 'New York' },
  { city: 'Syracuse',      stateCode: 'NY', state: 'New York' },
  { city: 'Albany',        stateCode: 'NY', state: 'New York' },
  { city: 'New Rochelle',  stateCode: 'NY', state: 'New York' },
  { city: 'Mount Vernon',  stateCode: 'NY', state: 'New York' },
  { city: 'Schenectady',   stateCode: 'NY', state: 'New York' },
  { city: 'Utica',         stateCode: 'NY', state: 'New York' },
  { city: 'White Plains',  stateCode: 'NY', state: 'New York' },
  { city: 'Flushing',      stateCode: 'NY', state: 'New York' },
  { city: 'Brooklyn',      stateCode: 'NY', state: 'New York' },

  // North Carolina
  { city: 'Charlotte',     stateCode: 'NC', state: 'North Carolina' },
  { city: 'Raleigh',       stateCode: 'NC', state: 'North Carolina' },
  { city: 'Greensboro',    stateCode: 'NC', state: 'North Carolina' },
  { city: 'Durham',        stateCode: 'NC', state: 'North Carolina' },
  { city: 'Winston-Salem', stateCode: 'NC', state: 'North Carolina' },
  { city: 'Fayetteville',  stateCode: 'NC', state: 'North Carolina' },
  { city: 'Cary',          stateCode: 'NC', state: 'North Carolina' },
  { city: 'Wilmington',    stateCode: 'NC', state: 'North Carolina' },
  { city: 'High Point',    stateCode: 'NC', state: 'North Carolina' },
  { city: 'Concord',       stateCode: 'NC', state: 'North Carolina' },
  { city: 'Asheville',     stateCode: 'NC', state: 'North Carolina' },
  { city: 'Chapel Hill',   stateCode: 'NC', state: 'North Carolina' },

  // North Dakota
  { city: 'Fargo',         stateCode: 'ND', state: 'North Dakota' },
  { city: 'Bismarck',      stateCode: 'ND', state: 'North Dakota' },
  { city: 'Grand Forks',   stateCode: 'ND', state: 'North Dakota' },
  { city: 'Minot',         stateCode: 'ND', state: 'North Dakota' },
  { city: 'West Fargo',    stateCode: 'ND', state: 'North Dakota' },
  { city: 'Mandan',        stateCode: 'ND', state: 'North Dakota' },
  { city: 'Dickinson',     stateCode: 'ND', state: 'North Dakota' },
  { city: 'Jamestown',     stateCode: 'ND', state: 'North Dakota' },

  // Ohio
  { city: 'Columbus',      stateCode: 'OH', state: 'Ohio' },
  { city: 'Cleveland',     stateCode: 'OH', state: 'Ohio' },
  { city: 'Cincinnati',    stateCode: 'OH', state: 'Ohio' },
  { city: 'Toledo',        stateCode: 'OH', state: 'Ohio' },
  { city: 'Akron',         stateCode: 'OH', state: 'Ohio' },
  { city: 'Dayton',        stateCode: 'OH', state: 'Ohio' },
  { city: 'Parma',         stateCode: 'OH', state: 'Ohio' },
  { city: 'Canton',        stateCode: 'OH', state: 'Ohio' },
  { city: 'Youngstown',    stateCode: 'OH', state: 'Ohio' },
  { city: 'Lorain',        stateCode: 'OH', state: 'Ohio' },
  { city: 'Hamilton',      stateCode: 'OH', state: 'Ohio' },
  { city: 'Kettering',     stateCode: 'OH', state: 'Ohio' },

  // Oklahoma
  { city: 'Oklahoma City', stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Tulsa',         stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Norman',        stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Broken Arrow',  stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Lawton',        stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Edmond',        stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Moore',         stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Midwest City',  stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Enid',          stateCode: 'OK', state: 'Oklahoma' },
  { city: 'Stillwater',    stateCode: 'OK', state: 'Oklahoma' },

  // Oregon
  { city: 'Portland',      stateCode: 'OR', state: 'Oregon' },
  { city: 'Salem',         stateCode: 'OR', state: 'Oregon' },
  { city: 'Eugene',        stateCode: 'OR', state: 'Oregon' },
  { city: 'Gresham',       stateCode: 'OR', state: 'Oregon' },
  { city: 'Hillsboro',     stateCode: 'OR', state: 'Oregon' },
  { city: 'Beaverton',     stateCode: 'OR', state: 'Oregon' },
  { city: 'Bend',          stateCode: 'OR', state: 'Oregon' },
  { city: 'Medford',       stateCode: 'OR', state: 'Oregon' },
  { city: 'Springfield',   stateCode: 'OR', state: 'Oregon' },
  { city: 'Corvallis',     stateCode: 'OR', state: 'Oregon' },
  { city: 'Albany',        stateCode: 'OR', state: 'Oregon' },

  // Pennsylvania
  { city: 'Philadelphia',  stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Pittsburgh',    stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Allentown',     stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Erie',          stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Reading',       stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Scranton',      stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Bethlehem',     stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Lancaster',     stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Harrisburg',    stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'York',          stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'State College', stateCode: 'PA', state: 'Pennsylvania' },
  { city: 'Wilkes-Barre',  stateCode: 'PA', state: 'Pennsylvania' },

  // Rhode Island
  { city: 'Providence',    stateCode: 'RI', state: 'Rhode Island' },
  { city: 'Cranston',      stateCode: 'RI', state: 'Rhode Island' },
  { city: 'Warwick',       stateCode: 'RI', state: 'Rhode Island' },
  { city: 'Pawtucket',     stateCode: 'RI', state: 'Rhode Island' },
  { city: 'East Providence', stateCode: 'RI', state: 'Rhode Island' },
  { city: 'Woonsocket',    stateCode: 'RI', state: 'Rhode Island' },
  { city: 'Newport',       stateCode: 'RI', state: 'Rhode Island' },

  // South Carolina
  { city: 'Columbia',      stateCode: 'SC', state: 'South Carolina' },
  { city: 'Charleston',    stateCode: 'SC', state: 'South Carolina' },
  { city: 'North Charleston', stateCode: 'SC', state: 'South Carolina' },
  { city: 'Mount Pleasant', stateCode: 'SC', state: 'South Carolina' },
  { city: 'Rock Hill',     stateCode: 'SC', state: 'South Carolina' },
  { city: 'Greenville',    stateCode: 'SC', state: 'South Carolina' },
  { city: 'Summerville',   stateCode: 'SC', state: 'South Carolina' },
  { city: 'Sumter',        stateCode: 'SC', state: 'South Carolina' },
  { city: 'Hilton Head Island', stateCode: 'SC', state: 'South Carolina' },
  { city: 'Florence',      stateCode: 'SC', state: 'South Carolina' },
  { city: 'Spartanburg',   stateCode: 'SC', state: 'South Carolina' },

  // South Dakota
  { city: 'Sioux Falls',   stateCode: 'SD', state: 'South Dakota' },
  { city: 'Rapid City',    stateCode: 'SD', state: 'South Dakota' },
  { city: 'Aberdeen',      stateCode: 'SD', state: 'South Dakota' },
  { city: 'Brookings',     stateCode: 'SD', state: 'South Dakota' },
  { city: 'Watertown',     stateCode: 'SD', state: 'South Dakota' },
  { city: 'Mitchell',      stateCode: 'SD', state: 'South Dakota' },
  { city: 'Pierre',        stateCode: 'SD', state: 'South Dakota' },

  // Tennessee
  { city: 'Nashville',     stateCode: 'TN', state: 'Tennessee' },
  { city: 'Memphis',       stateCode: 'TN', state: 'Tennessee' },
  { city: 'Knoxville',     stateCode: 'TN', state: 'Tennessee' },
  { city: 'Chattanooga',   stateCode: 'TN', state: 'Tennessee' },
  { city: 'Clarksville',   stateCode: 'TN', state: 'Tennessee' },
  { city: 'Murfreesboro',  stateCode: 'TN', state: 'Tennessee' },
  { city: 'Franklin',      stateCode: 'TN', state: 'Tennessee' },
  { city: 'Jackson',       stateCode: 'TN', state: 'Tennessee' },
  { city: 'Johnson City',  stateCode: 'TN', state: 'Tennessee' },
  { city: 'Bartlett',      stateCode: 'TN', state: 'Tennessee' },
  { city: 'Brentwood',     stateCode: 'TN', state: 'Tennessee' },

  // Texas
  { city: 'Houston',       stateCode: 'TX', state: 'Texas' },
  { city: 'San Antonio',   stateCode: 'TX', state: 'Texas' },
  { city: 'Dallas',        stateCode: 'TX', state: 'Texas' },
  { city: 'Austin',        stateCode: 'TX', state: 'Texas' },
  { city: 'Fort Worth',    stateCode: 'TX', state: 'Texas' },
  { city: 'El Paso',       stateCode: 'TX', state: 'Texas' },
  { city: 'Arlington',     stateCode: 'TX', state: 'Texas' },
  { city: 'Corpus Christi', stateCode: 'TX', state: 'Texas' },
  { city: 'Plano',         stateCode: 'TX', state: 'Texas' },
  { city: 'Laredo',        stateCode: 'TX', state: 'Texas' },
  { city: 'Lubbock',       stateCode: 'TX', state: 'Texas' },
  { city: 'Irving',        stateCode: 'TX', state: 'Texas' },
  { city: 'Garland',       stateCode: 'TX', state: 'Texas' },
  { city: 'Frisco',        stateCode: 'TX', state: 'Texas' },
  { city: 'McKinney',      stateCode: 'TX', state: 'Texas' },

  // Utah
  { city: 'Salt Lake City', stateCode: 'UT', state: 'Utah' },
  { city: 'West Valley City', stateCode: 'UT', state: 'Utah' },
  { city: 'Provo',         stateCode: 'UT', state: 'Utah' },
  { city: 'West Jordan',   stateCode: 'UT', state: 'Utah' },
  { city: 'Orem',          stateCode: 'UT', state: 'Utah' },
  { city: 'Sandy',         stateCode: 'UT', state: 'Utah' },
  { city: 'Ogden',         stateCode: 'UT', state: 'Utah' },
  { city: 'St. George',    stateCode: 'UT', state: 'Utah' },
  { city: 'Layton',        stateCode: 'UT', state: 'Utah' },
  { city: 'Taylorsville',  stateCode: 'UT', state: 'Utah' },

  // Vermont
  { city: 'Burlington',    stateCode: 'VT', state: 'Vermont' },
  { city: 'South Burlington', stateCode: 'VT', state: 'Vermont' },
  { city: 'Rutland',       stateCode: 'VT', state: 'Vermont' },
  { city: 'Barre',         stateCode: 'VT', state: 'Vermont' },
  { city: 'Montpelier',    stateCode: 'VT', state: 'Vermont' },
  { city: 'Winooski',      stateCode: 'VT', state: 'Vermont' },
  { city: 'St. Johnsbury', stateCode: 'VT', state: 'Vermont' },

  // Virginia
  { city: 'Virginia Beach', stateCode: 'VA', state: 'Virginia' },
  { city: 'Norfolk',       stateCode: 'VA', state: 'Virginia' },
  { city: 'Chesapeake',    stateCode: 'VA', state: 'Virginia' },
  { city: 'Richmond',      stateCode: 'VA', state: 'Virginia' },
  { city: 'Newport News',  stateCode: 'VA', state: 'Virginia' },
  { city: 'Alexandria',    stateCode: 'VA', state: 'Virginia' },
  { city: 'Hampton',       stateCode: 'VA', state: 'Virginia' },
  { city: 'Roanoke',       stateCode: 'VA', state: 'Virginia' },
  { city: 'Portsmouth',    stateCode: 'VA', state: 'Virginia' },
  { city: 'Suffolk',       stateCode: 'VA', state: 'Virginia' },
  { city: 'Lynchburg',     stateCode: 'VA', state: 'Virginia' },
  { city: 'Charlottesville', stateCode: 'VA', state: 'Virginia' },

  // Washington
  { city: 'Seattle',       stateCode: 'WA', state: 'Washington' },
  { city: 'Spokane',       stateCode: 'WA', state: 'Washington' },
  { city: 'Tacoma',        stateCode: 'WA', state: 'Washington' },
  { city: 'Vancouver',     stateCode: 'WA', state: 'Washington' },
  { city: 'Bellevue',      stateCode: 'WA', state: 'Washington' },
  { city: 'Kent',          stateCode: 'WA', state: 'Washington' },
  { city: 'Everett',       stateCode: 'WA', state: 'Washington' },
  { city: 'Renton',        stateCode: 'WA', state: 'Washington' },
  { city: 'Spokane Valley', stateCode: 'WA', state: 'Washington' },
  { city: 'Federal Way',   stateCode: 'WA', state: 'Washington' },
  { city: 'Bellingham',    stateCode: 'WA', state: 'Washington' },
  { city: 'Kirkland',      stateCode: 'WA', state: 'Washington' },
  { city: 'Redmond',       stateCode: 'WA', state: 'Washington' },

  // West Virginia
  { city: 'Charleston',    stateCode: 'WV', state: 'West Virginia' },
  { city: 'Huntington',    stateCode: 'WV', state: 'West Virginia' },
  { city: 'Parkersburg',   stateCode: 'WV', state: 'West Virginia' },
  { city: 'Morgantown',    stateCode: 'WV', state: 'West Virginia' },
  { city: 'Wheeling',      stateCode: 'WV', state: 'West Virginia' },
  { city: 'Weirton',       stateCode: 'WV', state: 'West Virginia' },
  { city: 'Fairmont',      stateCode: 'WV', state: 'West Virginia' },
  { city: 'Beckley',       stateCode: 'WV', state: 'West Virginia' },

  // Wisconsin
  { city: 'Milwaukee',     stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Madison',       stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Green Bay',     stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Kenosha',       stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Racine',        stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Appleton',      stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Waukesha',      stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Oshkosh',       stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Eau Claire',    stateCode: 'WI', state: 'Wisconsin' },
  { city: 'Janesville',    stateCode: 'WI', state: 'Wisconsin' },
  { city: 'La Crosse',     stateCode: 'WI', state: 'Wisconsin' },

  // Wyoming
  { city: 'Cheyenne',      stateCode: 'WY', state: 'Wyoming' },
  { city: 'Casper',        stateCode: 'WY', state: 'Wyoming' },
  { city: 'Laramie',       stateCode: 'WY', state: 'Wyoming' },
  { city: 'Gillette',      stateCode: 'WY', state: 'Wyoming' },
  { city: 'Rock Springs',  stateCode: 'WY', state: 'Wyoming' },
  { city: 'Sheridan',      stateCode: 'WY', state: 'Wyoming' },
  { city: 'Green River',   stateCode: 'WY', state: 'Wyoming' },
]

async function fetchPlaces(city) {
  const query = encodeURIComponent(`ramen restaurants in ${city.city}, ${city.state}`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${city.city}`)
  const json = await res.json()
  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error for ${city.city}: ${json.status} — ${json.error_message ?? ''}`)
  }
  return (json.results ?? []).slice(0, 20).map(r => ({
    placeId: r.place_id,
    name: r.name,
    address: r.formatted_address,
    rating: r.rating ?? null,
    reviewCount: r.user_ratings_total ?? 0,
    priceLevel: r.price_level ?? null,
    // Photo intentionally omitted — the Place Photo endpoint is billed per
    // fetch, so we serve a local placeholder instead of live Google photos.
    photo: null,
    latitude: r.geometry?.location?.lat ?? null,
    longitude: r.geometry?.location?.lng ?? null,
    openNow: r.opening_hours?.open_now ?? null,
    googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
  }))
}

async function main() {
  // Load existing restaurants DB to build skip set
  const restaurants = JSON.parse(readFileSync(RESTAURANTS_FILE, 'utf8'))
  const dbParams = new Set(
    restaurants.map(r => `${slugify(r.citySlug ?? r.city)}-${(r.stateCode ?? '').toLowerCase()}`)
  )
  console.log(`Loaded ${restaurants.length} DB restaurants across ${dbParams.size} city params`)

  // Load capital supplements to skip those too
  let capitalsData = {}
  try {
    capitalsData = JSON.parse(readFileSync(CAPITALS_FILE, 'utf8'))
    console.log(`Loaded ${Object.keys(capitalsData).length} capital supplement params`)
  } catch {
    console.log('No capitals file found, skipping')
  }
  const capitalParams = new Set(Object.keys(capitalsData))

  // Load existing output (resume-safe)
  let existing = {}
  try {
    existing = JSON.parse(readFileSync(OUT_FILE, 'utf8'))
    console.log(`Loaded ${Object.keys(existing).length} existing major-city fetches`)
  } catch {
    console.log('No existing output file — starting fresh')
  }

  const results = { ...existing }

  let skippedDb = 0
  let skippedCapitals = 0
  let skippedAlready = 0
  let fetched = 0
  let errors = 0

  for (const city of MAJOR_CITIES) {
    const citySlug = slugify(city.city)
    const param = `${citySlug}-${city.stateCode.toLowerCase()}`

    if (dbParams.has(param)) {
      skippedDb++
      continue
    }
    if (capitalParams.has(param)) {
      skippedCapitals++
      continue
    }
    if (param in results) {
      skippedAlready++
      continue
    }

    try {
      console.log(`  Fetching ${city.city}, ${city.stateCode} (${param})...`)
      const places = await fetchPlaces(city)
      results[param] = places
      console.log(`    → ${places.length} results`)
      fetched++
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.error(`    ERROR: ${err.message}`)
      results[param] = []
      errors++
    }

    // Save incrementally every 10 fetches
    if ((fetched + errors) % 10 === 0) {
      writeFileSync(OUT_FILE, JSON.stringify(results, null, 2))
      console.log(`  [checkpoint] Saved ${Object.keys(results).length} params to ${OUT_FILE}`)
    }
  }

  // ── Global de-duplication ──────────────────────────────────────────────────
  // Guarantee no listing appears twice: drop any place already in the DB, in the
  // capital supplements, or already kept under an earlier city param.
  const seen = new Set()
  for (const r of restaurants) if (r.placeId) seen.add(r.placeId)
  for (const arr of Object.values(capitalsData)) {
    if (Array.isArray(arr)) for (const p of arr) if (p.placeId) seen.add(p.placeId)
  }
  let removed = 0
  for (const param of Object.keys(results)) {
    const kept = []
    for (const p of results[param]) {
      if (!p.placeId || seen.has(p.placeId)) { if (p.placeId) removed++; continue }
      seen.add(p.placeId)
      kept.push(p)
    }
    results[param] = kept
  }
  console.log(`  De-dupe: removed ${removed} duplicate listings`)

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2))
  console.log(`\nDone.`)
  console.log(`  Fetched: ${fetched}`)
  console.log(`  Skipped (in DB): ${skippedDb}`)
  console.log(`  Skipped (in capitals): ${skippedCapitals}`)
  console.log(`  Skipped (already fetched): ${skippedAlready}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Total in output: ${Object.keys(results).length}`)
  console.log(`\nWrote ${OUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
