import ProductDetails from "@/src/components/ProductDetails";
import { Link } from "@/src/i18n/routing";
import { getLocalProductCode, localProducts } from "@/src/lib/catalog";
import { img } from "@/src/lib/images";
import { getProduct, listProducts } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { SizeGuideType } from "@/src/components/SizeGuideModal";
import type { ProductCardData } from "@/src/components/ProductCard";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type ProductVariant = { id: string; size: string; stock?: number };

type RelatedRow = {
  id: string;
  code?: string | null;
  slug: string;
  name: string;
  price: number | string;
  image_url: string | null;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const t = await getTranslations("Products");
  const commonT = await getTranslations("Common");
  const catalogT = await getTranslations("Catalog");
  const [databaseProduct, localProduct, databaseRelated] = await Promise.all([
    getProduct(slug).catch(() => null),
    Promise.resolve(localProducts.find((product) => product.slug === slug)),
    listProducts({ limit: 10 }).catch(() => []),
  ]);

  if (!databaseProduct && !localProduct) notFound();

  const translationKey = localProduct?.translationKey;
  const imageSource = databaseProduct?.image_url ?? localProduct?.imageKey;
  const image = typeof imageSource === "string" && imageSource.startsWith("http")
    ? imageSource
    : img(imageSource);
  const name = databaseProduct?.name ?? t(`items.${translationKey}.name`);
  const material = databaseProduct?.material ?? t(`items.${translationKey}.material`);
  const description = databaseProduct?.description ?? t(`items.${translationKey}.description`);
  const price = Number(databaseProduct?.price ?? localProduct?.price ?? 0);
  const productCode = databaseProduct?.code || getLocalProductCode(slug);
  const categorySlug = (databaseProduct?.categories?.slug ?? "").toLowerCase();
  const guideType: SizeGuideType = /shoe|boot|vzutt|взутт/.test(`${categorySlug} ${slug}`)
    ? "shoes"
    : /jacket|kurt|куртк/.test(`${categorySlug} ${slug}`)
      ? "jacket"
      : "tshirt";

  const fallbackSizes = guideType === "shoes"
    ? ["40", "41", "42", "43", "44", "45", "46"]
    : guideType === "jacket"
      ? ["S", "M", "L", "XL", "XXL", "XXXL"]
      : ["S", "M", "L", "XL", "XXL"];

  const allVariants: ProductVariant[] = databaseProduct?.product_variants?.length
    ? (databaseProduct.product_variants as ProductVariant[])
    : fallbackSizes.map(
        (size, index): ProductVariant => ({ id: `${slug}-${index}`, size, stock: 10 })
      );
  const variants = allVariants.filter(
    (variant) => variant.stock === undefined || variant.stock > 0
  );

  const relatedRows = (databaseRelated ?? []) as RelatedRow[];
  const related: ProductCardData[] = relatedRows.length > 0
    ? relatedRows
      .filter((item) => item.slug !== slug)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        code: item.code ?? null,
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        image_url: item.image_url ?? null,
      }))
    : localProducts
      .filter((item) => item.slug !== slug)
      .slice(0, 5)
      .map((item) => ({
        id: item.slug,
        slug: item.slug,
        name: t(`items.${item.translationKey}.name`),
        price: item.price,
        image_url: item.imageKey,
        material: t(`items.${item.translationKey}.material`),
      }));

  return (
    <section className="px-4">
      <nav className="border-b border-border xl:px-10 py-4 flex items-center gap-2 text-xs text-primary ">
        <div className="max-w-[1440px] xl:px-10 mx-auto flex items-center gap-2 w-full">
          <Link href="/" className="text-sm font-medium tracking-widest text-primary hover:text-foreground">
            {commonT("home")}
          </Link>
          <span>|</span>
          <Link href="/catalog" className="hover:text-foreground hover:underline">{commonT("catalog")}</Link>
          {databaseProduct?.categories && (
            <>
              <Link
                href={`/catalog/${databaseProduct.categories.slug}`}
                className="hover:text-foreground"
              >
                {catalogT.has(`categories.${databaseProduct.categories.slug}`)
                  ? catalogT(`categories.${databaseProduct.categories.slug}`)
                  : databaseProduct.categories.name}
              </Link>
            </>
          )}

          <span>|</span>

          <span className="text-foreground">
            {name}
          </span>
        </div>
      </nav>

      <div className="mx-auto mt-6 grid max-w-[1440px] gap-8 md:grid-cols-[minmax(280px,0.9fr)_minmax(360px,1.1fr)] xl:px-10 md:gap-10">
        <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 sm:grid-cols-[96px_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((thumb) => (
              <div key={thumb} className="aspect-square border border-border bg-white p-1">
                <Image
                  src={image}
                  alt={`${name} ${thumb + 1}`}
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
          <div className="aspect-[4/5] overflow-hidden ">
            <Image
              src={image}
              alt={name}
              width={typeof image === "string" ? 900 : image.width}
              height={typeof image === "string" ? 1100 : image.height}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>

        <ProductDetails
          name={name}
          guideType={guideType}
          id={databaseProduct?.id}
          code={productCode}
          slug={slug}
          image={image}
          price={price}
          variants={variants}
          related={related}
          material={material}
          description={description}
        />
      </div>
    </section>
  );
}