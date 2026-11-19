import { CatalogView } from "@/src/components/CatalogView";
import { localProducts } from "@/src/lib/catalog";
import { listCategories, searchProducts } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const t = await getTranslations("Products");
  const [databaseProducts, categories] = await Promise.all([
    q ? searchProducts(q).catch(() => []) : Promise.resolve([]),
    listCategories().catch(() => []),
  ]);

  const normalizedQuery = q.trim().toLowerCase();
  const fallbackProducts = normalizedQuery
    ? localProducts
        .filter((product) => t(`items.${product.translationKey}.name`).toLowerCase().includes(normalizedQuery))
        .map((product) => ({
          id: product.slug,
          slug: product.slug,
          name: t(`items.${product.translationKey}.name`),
          price: product.price,
          image_url: product.imageKey,
          material: t(`items.${product.translationKey}.material`),
          is_new: product.isNew,
          is_popular: product.isPopular,
        }))
    : [];

  return (
    <CatalogView
      title={q ? `Результати пошуку: ${q}` : "Пошук товарів"}
      products={databaseProducts.length > 0 ? databaseProducts : fallbackProducts}
      categories={categories}
    />
  );
}
