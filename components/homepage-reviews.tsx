import { Star } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Marcus T.',
    location: 'Austin, TX',
    rating: 5,
    text: "I had no idea there was a tonkotsu spot literally 10 minutes from my apartment. RamenNearYou pointed me straight to Ramen Tatsu-ya and I've been going every week since. Best bowl I've ever had.",
    bowl: 'Tonkotsu',
  },
  {
    name: 'Priya S.',
    location: 'Seattle, WA',
    rating: 5,
    text: "The quiz took me maybe two minutes. I said I wanted spicy ramen, dine-in, and within 5 miles — and it handed me a list of exactly what I was looking for. Found Tanaka Ramen and it was incredible.",
    bowl: 'Spicy',
  },
  {
    name: 'Jordan K.',
    location: 'Chicago, IL',
    rating: 5,
    text: "I'm new to ramen and didn't know where to start. The site asked a few easy questions and recommended a shoyu spot that was perfect for a first-timer. Friendly staff, amazing broth. I'm hooked.",
    bowl: 'Shoyu',
  },
  {
    name: 'Lena M.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: "Finding vegan ramen is usually such a pain. This site filtered everything for me instantly. Clicked one card, walked in that night, and had the best miso-mushroom broth I've ever tasted.",
    bowl: 'Vegan',
  },
  {
    name: 'Derek W.',
    location: 'New York, NY',
    rating: 5,
    text: "My wife and I used the quiz on a Friday night when we couldn't decide where to eat. It matched us to a little miso ramen spot in our neighborhood we'd walked past a hundred times and never noticed.",
    bowl: 'Miso',
  },
  {
    name: 'Aaliyah R.',
    location: 'Houston, TX',
    rating: 5,
    text: "I just typed my ZIP and answered a couple questions. Two minutes later I was looking at a curated list with photos, ratings, and directions. Ended up at a Korean-Japanese fusion ramen place that blew my mind.",
    bowl: 'Korean',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#B57F50] text-[#96602F]" />
      ))}
    </div>
  )
}

export default function HomepageReviews() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#96602F] text-sm font-semibold uppercase tracking-widest mb-2">What People Are Saying</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]">
            Real Ramen Lovers, Real Results
          </h2>
          <p className="text-[#6B6862] text-base mt-3 max-w-xl mx-auto">
            Thousands of ramen fans have used our quiz to find their perfect bowl. Here's what they had to say.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-[#F5F4F0] rounded-2xl p-6 flex flex-col gap-3 border border-black/5"
            >
              <Stars count={r.rating} />
              <p className="text-[#1E2026] text-sm leading-relaxed flex-1">"{r.text}"</p>
              <div className="flex items-center justify-between pt-1 border-t border-black/8">
                <div>
                  <p className="text-sm font-semibold text-[#1E2026]">{r.name}</p>
                  <p className="text-xs text-[#6B6862]">{r.location}</p>
                </div>
                <span className="text-xs font-medium text-[#96602F] bg-[#B57F50]/10 px-2.5 py-1 rounded-full">
                  {r.bowl}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
