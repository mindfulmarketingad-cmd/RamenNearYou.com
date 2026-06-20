const FAQS = [
  {
    q: 'How do I find ramen near me?',
    a: 'Use the map above — enter your ZIP code or click "Use my location" and the map will sort ramen restaurants by distance. You can filter by broth type, price, and hours.',
  },
  {
    q: 'What is the best ramen broth type?',
    a: 'Tonkotsu (rich pork bone broth) is the most popular, but miso, shoyu, and shio all have loyal followings. Use the Filters button to browse by broth type and find your favorite.',
  },
  {
    q: 'What ramen restaurants are open late near me?',
    a: 'Switch on the "Open Late (10pm+)" filter in the filter panel, or visit our dedicated Ramen Open Late Near Me page for a pre-filtered view sorted by distance.',
  },
  {
    q: 'Is there vegan ramen near me?',
    a: 'Yes — many ramen restaurants offer vegan broth options. Use the Vegan filter chip in the filter panel to show only restaurants with vegan ramen on the menu.',
  },
  {
    q: 'How much does a bowl of ramen cost?',
    a: 'Most ramen restaurants charge between $13 and $22 per bowl. Use the price filter to find budget options (under ~$15) or premium spots near you.',
  },
  {
    q: 'What is tonkotsu ramen?',
    a: 'Tonkotsu ramen has a thick, rich, milky broth made from pork bones simmered for many hours. It is one of the most popular styles in the US and is often topped with chashu pork, soft-boiled egg, nori, and bamboo shoots.',
  },
]

export default function HomepageFAQ() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group border border-black/8 rounded-xl overflow-hidden bg-white">
            <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
              {q}
              <span className="text-[#B57F50] shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-150">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
