import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'JINYA Ramen Bar Menu — Full Menu With Items & Descriptions',
  description: 'Browse the full JINYA Ramen Bar menu including ramen, small plates, rice bowls, salads, desserts, and cocktails. See every item and description.',
  alternates: { canonical: 'https://www.ramennearyou.com/menu/jinya-ramen-bar-menu' },
  openGraph: {
    title: 'JINYA Ramen Bar Menu — Full Menu With Items & Descriptions',
    description: 'Browse the full JINYA Ramen Bar menu including ramen, small plates, rice bowls, salads, desserts, and cocktails.',
    url: 'https://www.ramennearyou.com/menu/jinya-ramen-bar-menu',
  },
}

type MenuItem = { name: string; description?: string; note?: string }
type MenuSection = { heading: string; note?: string; items: MenuItem[] }

const menu: MenuSection[] = [
  {
    heading: "Chef's Special",
    items: [
      {
        name: 'Hokuriku Cabba-Chick',
        description: 'Clear chicken broth with tender pork back fat, sautéed chicken thigh, cabbage, bean sprouts, green onion, and a hint of chili thread. Served with thin noodles.',
      },
      {
        name: 'Ice Matcha Latte',
        description: 'Matcha, Oat Milk, Agave, Salted Cream on top.',
      },
    ],
  },
  {
    heading: 'Ramen',
    items: [
      {
        name: 'Birria Ramen',
        description: 'Fusion of Mexican Birria and Japanese Ramen! Spiced beef and chicken broth, slow-cooked birria beef, red onion, green onion, cilantro and lime.',
        note: 'US Locations only.',
      },
      {
        name: 'Chicken Yuzu Shio Delight',
        description: 'Chicken clear soup: chicken chashu, green onion, spinach, seasoned egg, nori seaweed with yuzu flavor. Served with thin noodles.',
      },
      {
        name: 'Tan Tan Men',
        description: 'A savory chicken soy broth with a rich sesame essence, includes tender pork soboro, fresh baby bok choy, and vibrant shredded leek, complemented by a touch of chili sesame seeds and drizzled with chili oil. Served with thick noodles.',
      },
      {
        name: 'Flying V Harvest',
        description: 'Vegetable miso broth: Impossible™ meat made from plants, tofu, bean sprouts, broccolini, green onion, corn, red onion, crispy garlic and chili seasoning. Served with thick noodles.',
        note: 'Vegetarian.',
      },
      {
        name: 'V Red Fire Opal',
        description: 'Yuzu flavored hot and sour soup; tofu, sautéed bamboo shoot, simmered shiitake mushroom, cilantro, chili thread, chili oil and lime. Served with thick noodles.',
      },
      {
        name: 'Spicy Creamy V Ramen',
        description: 'Vegetable broth: tofu, onion, green onion, spinach, crispy onion, garlic chips, garlic oil, chili oil and sesame seeds. Served with thick noodles.',
      },
      {
        name: 'JINYA Chicken Ramen',
        description: 'Chicken broth: chicken chashu, spinach, green onion and fried onion. Served with thin noodles.',
      },
      {
        name: 'Spicy Chicken Ramen',
        description: 'Chicken broth: chicken chashu, spinach, spicy bean sprouts and green onion. Served with thin noodles.',
        note: 'Choose your spice level: Mild, Spicy, or Hot.',
      },
      {
        name: 'Wonton Chicken Ramen',
        description: 'Chicken broth: wonton, spinach and green onion. Served with thin noodles.',
      },
      {
        name: 'JINYA Tonkotsu Black',
        description: 'Pork broth: pork chashu, kikurage, green onion, nori dried seaweed, seasoned egg, garlic chips, garlic oil, fried onion and spicy sauce. Served with thin noodles.',
      },
      {
        name: 'Premium Tonkotsu Red',
        description: 'Pork broth: pork chashu, kikurage, green onion, seasoned egg, nori dried seaweed, red hot chili oil and spicy bean sprouts. Served with thick noodles.',
        note: 'Choose your spice level 1–10. Level 6+ adds $1.',
      },
      {
        name: 'JINYA Tonkotsu Original 2010',
        description: 'Pork broth: pork chashu, green onion, spinach, seasoned egg, nori dried seaweed. Served with extra thick noodles.',
      },
      {
        name: 'Shrimp Wonton Ramen',
        description: 'Pork and shrimp broth: shrimp & chicken wonton, green onion and kikurage. Served with thick noodles.',
      },
      {
        name: 'Mountain Buta Garlic',
        description: 'Pork broth: pork chashu, wonton, bean sprouts, cabbage, green onion, spinach, seasoned egg, nori dried seaweed. Served with extra thick noodles.',
        note: 'Available at select locations.',
      },
    ],
  },
  {
    heading: 'Small Plates',
    items: [
      {
        name: 'French Fries',
        description: 'Shoestring fries with truffle ranch and spicy mayonnaise.',
        note: 'Available at select locations.',
      },
      {
        name: 'Aburi Oshi-Sushi Salmon',
        description: 'Pressed salmon sushi, serrano chili, JINYA sauce.',
      },
      {
        name: 'Aburi Oshi Sushi Salmon 6pc',
        description: 'Pressed salmon sushi, serrano chili, JINYA sauce. 6 pieces.',
      },
      { name: 'Miso Glazed Eggplant' },
      {
        name: 'Hokkaido Scallop w/ Organic Dry Miso',
        description: 'Hokkaido scallop sashimi with dry miso and yuzu citrus sauce, garnished with crispy garlic, cilantro, cucumber slice and cherry tomato.',
        note: 'Available at select locations.',
      },
      {
        name: 'Salmon Jalapeño Sashimi',
        description: 'Salmon sashimi with yuzu soy sauce, garnished with serrano chili, cilantro and cherry tomato.',
        note: 'Available at select locations.',
      },
      {
        name: 'Corn Tempura',
        description: 'Corn tempura with broccolini. Served with tempura sauce.',
      },
      { name: 'Nikuman', description: 'Steamed meat bun (1 pc).' },
      {
        name: 'Impossible™ Gyoza',
        description: 'Gyoza stuffed with delicious, savory Impossible™ meat made from plants.',
      },
      {
        name: 'Brussels Sprouts Tempura',
        description: 'Crispy tempura brussels sprouts with white truffle oil.',
      },
      { name: 'Edamame', description: 'Lightly salted boiled soy beans.' },
      {
        name: 'Garlic Shrimp Spring Roll',
        description: 'Flavorful garlic shrimp tucked inside a spring roll wrapper.',
      },
      { name: 'Pork Gyoza (6 pcs)', description: 'Handmade pork potstickers.' },
      {
        name: 'JINYA Bun',
        description: 'Steamed bun stuffed with slow-braised pork chashu, cucumber and baby mixed greens served with JINYA\'s original bun sauce and Kewpie mayonnaise.',
      },
      {
        name: 'Impossible™ Bun',
        description: 'Plant-based bun: Impossible™ meat made from plants, guacamole, cucumber with vegan mayonnaise.',
        note: 'Vegetarian.',
      },
      {
        name: 'Crispy Chicken',
        description: 'Juicy fried chicken thigh served with mixed baby greens and JINYA\'s original ponzu sauce.',
      },
      {
        name: 'Takoyaki — Octopus Ball',
        description: 'Battered octopus over egg tartar topped with Kewpie mayonnaise, okonomiyaki sauce, fresh cut green onion and smoked bonito flakes.',
      },
      {
        name: 'Spicy Creamy Shrimp Tempura',
        description: 'Crispy shrimp tempura tossed in JINYA\'s original spicy mayonnaise in the classic ebi-mayo style.',
      },
      {
        name: 'Crispy Rice with Spicy Tuna',
        description: 'Crispy grilled sushi rice topped with spicy tuna, garnished with sliced serrano pepper.',
      },
      {
        name: 'Sautéed Broccolini',
        description: 'Sautéed broccolini with crispy white quinoa.',
      },
    ],
  },
  {
    heading: 'Mini Tacos',
    items: [
      { name: 'Salmon Poke Mini Taco (2 pcs)' },
      {
        name: 'Spicy Tuna Tacos (2 pcs)',
        description: 'Spicy tuna in a crispy wonton taco shell.',
      },
      {
        name: 'Impossible™ Tacos (2 pcs)',
        description: 'Plant-based tacos: Impossible™ guacamole and cilantro on bite-size crispy taco shells.',
      },
    ],
  },
  {
    heading: 'Salads',
    items: [
      {
        name: 'Crunchy Cucumber Salad',
        description: 'Marinated cucumber with kombu sesame dashi, topped with sesame seed and chili powder.',
        note: 'Available at select locations.',
      },
      {
        name: 'Chicken Salad',
        description: 'Tender and juicy chicken breast with diced red onion, cucumber, dressed with creamy sauce. Served with crispy wonton chips.',
      },
      {
        name: 'House Salad',
        description: 'Kale and baby mixed greens with Japanese dressing.',
        note: 'Vegetarian.',
      },
      {
        name: 'Seaweed Salad',
        description: 'Lightly seasoned mixed seaweed salad with baby mixed greens.',
        note: 'Available at select locations.',
      },
    ],
  },
  {
    heading: 'Rice Bowls & Curry',
    items: [
      {
        name: 'Garlic Rice',
        description: 'Fried garlic rice with eggs, garnished with garlic chip and green onion. Served on a sizzling hot iron plate and finished with egg at tableside. Optional toppings available.',
      },
      {
        name: 'Pork Chashu Bowl',
        description: 'Slow-braised pork chashu, kikurage namul, simmered shiitake mushroom, green onion, seasoned egg and sesame seeds.',
      },
      {
        name: 'Chicken Chashu Bowl',
        description: 'Slow-braised chicken breast chashu, ground chicken soboro, kikurage namul, simmered shiitake mushroom, green onion, seasoned egg and sesame seeds.',
      },
      {
        name: 'Impossible™ Rice Bowl',
        description: 'Impossible™ meat made from plants, crispy chickpeas, kale, pickled red cabbage, crispy garlic, roasted pine nuts over steamed rice with vegan curry ranch dressing.',
      },
      {
        name: 'Tokyo Curry Rice',
        description: 'Tokyo style curry with ground chicken and steamed rice.',
      },
    ],
  },
  {
    heading: 'Dessert',
    items: [
      { name: 'Matcha Tiramisu', description: 'Homemade matcha flavor tiramisu.' },
      { name: 'Mochi Ice Cream', description: 'Choice of green tea or chocolate.' },
    ],
  },
  {
    heading: "Kids' Meal",
    items: [
      {
        name: "Kid's Meal",
        description: 'Chicken ramen with kikurage and corn, chashu rice, crispy chicken, sweet potato fries, orange, candy, and vanilla ice cream.',
      },
      {
        name: 'Vegetarian Kid\'s Meal',
        description: 'Rice bowl, ramen, tacos, edamame, green salad mix, boiled vegetables, orange slice.',
      },
    ],
  },
  {
    heading: 'JINYA Signature Cocktails',
    note: 'Available at select locations.',
    items: [
      { name: 'Malibu Sunrise' },
      { name: 'E Tomo E Tomo E Tomorrow' },
      { name: 'Flying Violette' },
      { name: 'Smokey Wokashi OF' },
      { name: 'Lycheetini' },
      { name: 'Yuzu Margarita' },
    ],
  },
  {
    heading: 'JINYA Signature Mocktails',
    note: 'Varies by location.',
    items: [
      { name: 'J. Girl' },
      { name: 'Watermelon Delight' },
      { name: 'Cucumber Chiller' },
      { name: 'Matcha Lychee Lemonade' },
      { name: 'Kiwi Sparkler' },
    ],
  },
]

export default function JinyaMenuPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20">

        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 pb-10 border-b border-black/5">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Restaurant Menu</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4 leading-tight">
              JINYA Ramen Bar Menu
            </h1>
            <p className="text-[#6B6862] text-lg leading-relaxed max-w-2xl">
              The full <strong className="text-[#1E2026]">JINYA Ramen Bar menu</strong> — covering every ramen bowl, small plate, salad, rice bowl, dessert, and cocktail. Items and availability may vary by location.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#6B6862]/60">
              <Link href="/atlanta/ga/jinya-ramen-bar-buckhead" className="hover:text-[#B57F50] transition-colors underline underline-offset-2">
                JINYA Ramen Bar – Buckhead, Atlanta →
              </Link>
              <Link href="/atlanta/ga/jinya-ramen-bar-poncey-highland" className="hover:text-[#B57F50] transition-colors underline underline-offset-2">
                JINYA Ramen Bar – Poncey Highland, Atlanta →
              </Link>
            </div>
          </div>
        </section>

        {/* Photo */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 border-b border-black/5">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGC7BquBSpHmTj4A8C9y4_0GU_48lDrJIRb7XtmeT962wpNby2bXoxLC7DkyFvMOWeMBRK5yP4jg5IWvZPKFM3qXbfY0qug4GTJEzbvgzlnFCTl4Qnd3ovRg3BnxmgyKbRp2uJW=w800-h500-k-no"
                alt="JINYA Ramen Bar"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#ECEAE4]/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Menu sections */}
        <section className="px-4 sm:px-6 lg:px-8 pt-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {menu.map((section) => (
              <div key={section.heading}>
                <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-black/8">
                  <h2 className="font-serif text-2xl font-bold text-[#1E2026]">{section.heading}</h2>
                  {section.note && (
                    <span className="text-[#6B6862]/50 text-xs">{section.note}</span>
                  )}
                </div>
                <div className="grid gap-4">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col gap-1 p-4 rounded-xl bg-[#ffffff] border border-black/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-semibold text-[#1E2026] text-sm leading-snug">{item.name}</p>
                        {item.note && (
                          <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#B57F50] font-medium whitespace-nowrap">
                            {item.note}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[#6B6862] text-xs leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-4xl mx-auto pt-10 border-t border-black/8">
            <p className="text-[#6B6862] text-sm mb-4">Find JINYA Ramen Bar locations in Atlanta</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/atlanta/ga/jinya-ramen-bar-buckhead"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
              >
                JINYA Buckhead →
              </Link>
              <Link
                href="/atlanta/ga/jinya-ramen-bar-poncey-highland"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B57F50]/15 border border-[#B57F50]/30 text-[#c8934f] text-sm font-medium hover:bg-[#B57F50]/25 transition-colors"
              >
                JINYA Poncey Highland →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
