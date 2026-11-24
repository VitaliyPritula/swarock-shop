import { CatalogView } from "@/src/components/CatalogView";
import { localProducts } from "@/src/lib/catalog";
import { listProducts } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const categoryFallbackSlugs: Record<string, string[]> = {
  futbolki: [
    "rock-tshirt", "rock-tshirt-1", "rock-tshirt-mars", "rock-tshirt-aborted",
    "rock-tshirt-moon", "rock-tshirt-chthonic",
    ...Array.from({ length: 19 }, (_, index) => `rock-tshirt-${index + 5}`),
  ],
  kurtki: ["leather-jacket"],
  obuv: ["combat-boots"],
  "holovni-ubory": ["rock-cap"],
  aksesuary: ["band-mask"],
  muzyka: [],
  plakaty: ["rock-poster"],
  kvytky: [],
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CategoryCatalogPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!categoryFallbackSlugs[slug]) notFound();

  const t = await getTranslations("Products");
  const catalogT = await getTranslations("Catalog");
  const products = await listProducts({ category: slug }).catch(() => []);

  const fallbackProducts = localProducts
    .filter((product) => product.category
      ? product.category === slug
      : categoryFallbackSlugs[slug]?.includes(product.slug))
    .map((product) => ({
      id: product.slug,
      slug: product.slug,
      name: (locale === "en" ? product.nameEn : product.nameUk) ?? t(`items.${product.translationKey}.name`),
      price: product.price,
      image_url: product.imageKey,
      material: slug === "kurtki"
        ? (locale === "en" ? "Leather" : "Шкіра")
        : slug === "obuv"
          ? (locale === "en" ? "Leather" : "Шкіра")
          : slug === "holovni-ubory"
            ? (locale === "en" ? "Cotton" : "Бавовна")
            : slug === "aksesuary"
              ? (locale === "en" ? "Leather" : "Шкіра")
              : slug === "muzyka"
                ? (locale === "en" ? "Vinyl" : "Вініл")
                : (locale === "en" ? "Paper" : "Папір"),
      is_new: product.isNew,
      is_popular: product.isPopular,
      product_variants: product.sizes?.map((size) => ({ size })),
      brand: product.brand,
      color: product.color,
      gender: product.gender,
      country: product.country,
    }));

  const title = catalogT(`categories.${slug}`);

  return (
    <CatalogView
      title={title}
      products={products.length > 0 ? products : fallbackProducts}
      activeCategorySlug={slug}
    />
  );
}
