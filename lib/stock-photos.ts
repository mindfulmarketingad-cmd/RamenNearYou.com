// A small pool of general-purpose ramen photos used as visual filler across
// the site — mainly as a varied fallback for restaurant listings that have
// no real photo (Places-supplement listings), and as hero art on marketing
// pages that would otherwise show no image at all.
export const STOCK_RAMEN_PHOTOS = [
  'https://www.allrecipes.com/thmb/F9iQOUFEC1DFfeh6A5uId-Wxcx0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21187-ramen-noodle-soup-DDMFS-202-4x3-beauty--56b4542883b644b2a574a196e3322e0c.jpg',
  'https://whatsinthepan.com/wp-content/uploads/2018/12/Beef-ramen-noodles-stir-fry.jpg',
  'https://theflavoursofkitchen.com/wp-content/uploads/2022/02/Sesame-Garlic-Ramens-1-scaled.jpg',
  'https://www.favfamilyrecipes.com/wp-content/uploads/2018/06/Cheap-Peanut-Butter-Ramen-500x500.jpg',
  'https://theforkedspoon.com/wp-content/uploads/2023/03/Spicy-Ramen-Noodles-11.jpg',
  'https://lanzhouramenatlanta.com/wp-content/uploads/2019/05/atlanta-magazine-best-restaurant-list-lanzhou-ramen.jpg',
  'https://static01.nyt.com/images/2014/03/05/dining/20140305-RAMEN-slide-DR6O/20140305-RAMEN-slide-DR6O-superJumbo.jpg',
  'https://images.squarespace-cdn.com/content/v1/5d815d4db50c44555a72c530/96c4c030-0119-484d-87c0-f92527f79aea/black+woman+in+yellow+dress+noodles+on+chopsticks+red+bowl+best+ramen+JINYA+restaurant+oklahoma+city.jpg',
] as const

// Deterministic pick so the same seed (e.g. a restaurant slug or page name)
// always shows the same photo — variety across items, stability per item.
export function pickStockPhoto(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return STOCK_RAMEN_PHOTOS[hash % STOCK_RAMEN_PHOTOS.length]
}
