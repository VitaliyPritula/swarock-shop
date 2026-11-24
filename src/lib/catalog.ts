export type LocalProduct = {
  slug: string;
  imageKey: string;
  translationKey: string;
  price: number;
  isPopular: boolean;
  isNew: boolean;
  category?: "kurtki" | "obuv" | "holovni-ubory" | "aksesuary" | "muzyka" | "plakaty";
  nameUk?: string;
  nameEn?: string;
  brand?: string;
  color?: string;
  gender?: "male" | "female" | "unisex";
  country?: "ukraine" | "usa" | "china";
  sizes?: string[];
};

export const localProducts: LocalProduct[] = [
  { slug: "leather-jacket", imageKey: "jacket", translationKey: "leatherJacket", price: 4200, isPopular: true, isNew: false },
  { slug: "rock-tshirt", imageKey: "tshirt", translationKey: "rockTshirt", price: 850, isPopular: true, isNew: true, nameUk: "Футболка Heathen", nameEn: "Heathen T-shirt", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-1", imageKey: "tshirt1", translationKey: "rockTshirt", price: 890, isPopular: true, isNew: true, nameUk: "Футболка Amorphis", nameEn: "Amorphis T-shirt", brand: "Amorphis", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-mars", imageKey: "tshirtMars", translationKey: "rockTshirt", price: 920, isPopular: true, isNew: true, nameUk: "Футболка Thirty Seconds to Mars", nameEn: "Thirty Seconds to Mars T-shirt", brand: "30 Seconds To Mars", color: "black", gender: "unisex", country: "usa", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-aborted", imageKey: "tshirtAborted", translationKey: "rockTshirt", price: 870, isPopular: false, isNew: true, nameUk: "Футболка Aborted", nameEn: "Aborted T-shirt", brand: "Aborted", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-moon", imageKey: "tshirtMoon", translationKey: "rockTshirt", price: 880, isPopular: false, isNew: true, nameUk: "Футболка Moonspell", nameEn: "Moonspell T-shirt", brand: "Moonspell", color: "black", gender: "male", country: "china", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-chthonic", imageKey: "tshirtChthonic", translationKey: "rockTshirt", price: 940, isPopular: true, isNew: true, nameUk: "Футболка Chthonic", nameEn: "Chthonic T-shirt", brand: "Chthonic", color: "blue", gender: "male", country: "usa", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-5", imageKey: "tshirt5", translationKey: "rockTshirt", price: 790, isPopular: false, isNew: false, nameUk: "Футболка рок-стиль №5", nameEn: "Rock Style T-shirt №5", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-6", imageKey: "tshirt6", translationKey: "rockTshirt", price: 790, isPopular: false, isNew: false, nameUk: "Футболка рок-стиль №6", nameEn: "Rock Style T-shirt №6", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-7", imageKey: "tshirt7", translationKey: "rockTshirt", price: 820, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №7", nameEn: "Rock Style T-shirt №7", brand: "SvaROCK", color: "black", gender: "male", country: "china", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-8", imageKey: "tshirt8", translationKey: "rockTshirt", price: 820, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №8", nameEn: "Rock Style T-shirt №8", brand: "SvaROCK", color: "black", gender: "female", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-9", imageKey: "tshirt9", translationKey: "rockTshirt", price: 840, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №9", nameEn: "Rock Style T-shirt №9", brand: "SvaROCK", color: "black", gender: "female", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-10", imageKey: "tshirt10", translationKey: "rockTshirt", price: 840, isPopular: true, isNew: false, nameUk: "Футболка рок-стиль №10", nameEn: "Rock Style T-shirt №10", brand: "SvaROCK", color: "white", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-11", imageKey: "tshirt11", translationKey: "rockTshirt", price: 860, isPopular: false, isNew: false, nameUk: "Футболка рок-стиль №11", nameEn: "Rock Style T-shirt №11", brand: "SvaROCK", color: "black", gender: "male", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-12", imageKey: "tshirt12", translationKey: "rockTshirt", price: 860, isPopular: true, isNew: false, nameUk: "Футболка рок-стиль №12", nameEn: "Rock Style T-shirt №12", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-13", imageKey: "tshirt13", translationKey: "rockTshirt", price: 880, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №13", nameEn: "Rock Style T-shirt №13", brand: "SvaROCK", color: "black", gender: "female", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-14", imageKey: "tshirt14", translationKey: "rockTshirt", price: 880, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №14", nameEn: "Rock Style T-shirt №14", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-15", imageKey: "tshirt15", translationKey: "rockTshirt", price: 900, isPopular: true, isNew: false, nameUk: "Футболка рок-стиль №15", nameEn: "Rock Style T-shirt №15", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-16", imageKey: "tshirt16", translationKey: "rockTshirt", price: 900, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №16", nameEn: "Rock Style T-shirt №16", brand: "SvaROCK", color: "red", gender: "male", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-17", imageKey: "tshirt17", translationKey: "rockTshirt", price: 910, isPopular: false, isNew: false, nameUk: "Футболка рок-стиль №17", nameEn: "Rock Style T-shirt №17", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-18", imageKey: "tshirt18", translationKey: "rockTshirt", price: 910, isPopular: true, isNew: false, nameUk: "Футболка рок-стиль №18", nameEn: "Rock Style T-shirt №18", brand: "SvaROCK", color: "black", gender: "male", country: "usa", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-19", imageKey: "tshirt19", translationKey: "rockTshirt", price: 930, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №19", nameEn: "Rock Style T-shirt №19", brand: "SvaROCK", color: "white", gender: "female", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-20", imageKey: "tshirt20", translationKey: "rockTshirt", price: 930, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №20", nameEn: "Rock Style T-shirt №20", brand: "SvaROCK", color: "black", gender: "male", country: "ukraine", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-21", imageKey: "tshirt21", translationKey: "rockTshirt", price: 950, isPopular: true, isNew: true, nameUk: "Футболка рок-стиль №21", nameEn: "Rock Style T-shirt №21", brand: "SvaROCK", color: "blue", gender: "male", country: "usa", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "rock-tshirt-22", imageKey: "tshirt22", translationKey: "rockTshirt", price: 950, isPopular: false, isNew: true, nameUk: "Футболка рок-стиль №22", nameEn: "Rock Style T-shirt №22", brand: "SvaROCK", color: "black", gender: "female", country: "china", sizes: ["S", "M", "L", "XL"] },
  { slug: "rock-tshirt-23", imageKey: "tshirt23", translationKey: "rockTshirt", price: 980, isPopular: true, isNew: true, nameUk: "Футболка Infinity War", nameEn: "Infinity War T-shirt", brand: "SvaROCK", color: "black", gender: "male", country: "usa", sizes: ["S", "M", "L", "XL", "XXL"] },
  { slug: "combat-boots", imageKey: "boots", translationKey: "combatBoots", price: 3600, isPopular: true, isNew: false },
  { slug: "rock-cap", imageKey: "cap", translationKey: "rockCap", price: 690, isPopular: true, isNew: true },
  { slug: "band-mask", imageKey: "mask", translationKey: "bandMask", price: 440, isPopular: false, isNew: true },
  { slug: "rock-poster", imageKey: "poster", translationKey: "rockPoster", price: 320, isPopular: false, isNew: true },
];

const assetCategories: Array<{
  slug: LocalProduct["category"];
  folder: "jackets" | "boots" | "headwear" | "accessories" | "music" | "posters";
  nameUk: string;
  nameEn: string;
  basePrice: number;
}> = [
  { slug: "kurtki", folder: "jackets", nameUk: "Рок-косуха", nameEn: "Rock leather jacket", basePrice: 3900 },
  { slug: "obuv", folder: "boots", nameUk: "Рок-чоботи", nameEn: "Combat boots", basePrice: 2900 },
  { slug: "holovni-ubory", folder: "headwear", nameUk: "Рок головний убір", nameEn: "Rock headwear", basePrice: 620 },
  { slug: "aksesuary", folder: "accessories", nameUk: "Рок-аксесуар", nameEn: "Rock accessory", basePrice: 480 },
  { slug: "muzyka", folder: "music", nameUk: "Рок атрибутика", nameEn: "Rock music item", basePrice: 1150 },
  { slug: "plakaty", folder: "posters", nameUk: "Рок-плакат", nameEn: "Rock poster", basePrice: 360 },
];

for (const category of assetCategories) {
  for (let index = 1; index <= 20; index += 1) {
    const number = String(index).padStart(2, "0");
    const shoeSizes = category.slug === "obuv";
    const apparelSizes = category.slug === "kurtki" || category.slug === "holovni-ubory";

    localProducts.push({
      slug: `${category.folder}-${number}`,
      imageKey: `/catalog/${category.folder}/${number}.jpg`,
      translationKey: category.slug === "kurtki"
        ? "leatherJacket"
        : category.slug === "obuv"
          ? "combatBoots"
          : category.slug === "holovni-ubory"
            ? "rockCap"
            : category.slug === "aksesuary"
              ? "bandMask"
              : category.slug === "muzyka"
                ? "rockTshirt"
                : "rockPoster",
      price: category.basePrice + index * (category.slug === "kurtki" ? 120 : 35),
      isPopular: index <= 8,
      isNew: index % 4 === 0 || index > 14,
      category: category.slug,
      nameUk: `${category.nameUk} №${index}`,
      nameEn: `${category.nameEn} №${index}`,
      brand: index % 5 === 0 ? "SvaROCK" : "Rock Collection",
      color: index % 7 === 0 ? "khaki" : index % 5 === 0 ? "red" : "black",
      gender: shoeSizes ? "unisex" : index % 6 === 0 ? "female" : "male",
      country: index % 3 === 0 ? "ukraine" : index % 3 === 1 ? "usa" : "china",
      sizes: shoeSizes
        ? ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
        : apparelSizes
          ? ["S", "M", "L", "XL", "XXL"]
          : undefined,
    });
  }
}

export function getLocalProductCode(slug: string): string | undefined {
  const index = localProducts.findIndex((product) => product.slug === slug);
  return index < 0 ? undefined : String(14081488 + index);
}
