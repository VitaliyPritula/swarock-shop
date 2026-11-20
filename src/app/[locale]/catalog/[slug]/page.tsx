import { CatalogView } from "@/src/components/CatalogView";
import { localProducts } from "@/src/lib/catalog";
import { listProducts } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const categoryFallbackSlugs: Record<string, string[]> = {
  futbolki: ["rock-tshirt"],
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
  const { slug } = await params;
  if (!categoryFallbackSlugs[slug]) notFound();

  const t = await getTranslations("Products");
  const catalogT = await getTranslations("Catalog");
  const products = await listProducts({ category: slug }).catch(() => []);

  const fallbackProducts = localProducts
    .filter((product) => categoryFallbackSlugs[slug]?.includes(product.slug))
    .map((product) => ({
      id: product.slug,
      slug: product.slug,
      name: t(`items.${product.translationKey}.name`),
      price: product.price,
      image_url: product.imageKey,
      material: t(`items.${product.translationKey}.material`),
      is_new: product.isNew,
      is_popular: product.isPopular,
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
