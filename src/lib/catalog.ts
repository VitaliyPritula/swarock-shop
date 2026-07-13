export type LocalProduct = {
  slug: string;
  imageKey: string;
  translationKey: string;
  price: number;
  isPopular: boolean;
  isNew: boolean;
};

export const localProducts: LocalProduct[] = [
  { slug: "leather-jacket", imageKey: "jacket", translationKey: "leatherJacket", price: 4200, isPopular: true, isNew: false },
  { slug: "rock-tshirt", imageKey: "tshirt", translationKey: "rockTshirt", price: 850, isPopular: true, isNew: true },
  { slug: "combat-boots", imageKey: "boots", translationKey: "combatBoots", price: 3600, isPopular: true, isNew: false },
  { slug: "rock-cap", imageKey: "cap", translationKey: "rockCap", price: 690, isPopular: true, isNew: true },
  { slug: "band-mask", imageKey: "mask", translationKey: "bandMask", price: 440, isPopular: false, isNew: true },
  { slug: "rock-poster", imageKey: "poster", translationKey: "rockPoster", price: 320, isPopular: false, isNew: true },
];
