import { CatalogView } from "@/src/components/CatalogView";
import { localProducts } from "@/src/lib/catalog";
import { listCategories, listProducts } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";

export default async function CatalogPage() {
  const t = await getTranslations("Products");
  const cats = await listCategories();
  const products = await listProducts();

  const fallbackProducts = localProducts.map((product) => ({
    id: product.slug,
    slug: product.slug,
    name: t(`items.${product.translationKey}.name`),
    price: product.price,
    image_url: product.imageKey,
    material: t(`items.${product.translationKey}.material`),
    is_new: product.isNew,
    is_popular: product.isPopular,
  }));

  return (
    <CatalogView
      title="Каталог товарів"
      products={products.length > 0 ? products : fallbackProducts}
      categories={cats}
    />
  );
}
