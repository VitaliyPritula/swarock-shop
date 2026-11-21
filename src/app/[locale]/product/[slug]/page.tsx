import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/routing";
import { localProducts } from "@/src/lib/catalog";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { getProduct } from "@/src/lib/shop.functions";
import ProductDetails from "@/src/components/ProductDetails";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("Products");
  const commonT = await getTranslations("Common");
  const catalogT = await getTranslations("Catalog");
  const productT = await getTranslations("ProductModal");
  const [databaseProduct, localProduct] = await Promise.all([
    getProduct(slug).catch(() => null),
    Promise.resolve(localProducts.find((product) => product.slug === slug)),
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
  const localProductCode = localProduct
    ? String(14081488 + localProducts.indexOf(localProduct))
    : undefined;
  const productCode = databaseProduct?.code || localProductCode;

  return (
    <section className="px-4">
      <nav className="border-b border-border xl:px-10 py-4 flex items-center gap-2 text-xs text-muted-foreground ">
        <div className="max-w-[1440px] xl:px-10 mx-auto flex items-center gap-2 w-full">
          <Link href="/" className="text-sm font-medium tracking-widest text-muted-foreground hover:text-foreground">
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

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="aspect-square overflow-hidden bg-white">
          <Image
            src={image}
            alt={name}
            width={typeof image === "string" ? 900 : image.width}
            height={typeof image === "string" ? 900 : image.height}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <div className="flex flex-col ">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("material")}: {material}
          </p>
          <h1 className="mt-3 font-display text-3xl uppercase sm:text-4xl">{name}</h1>
          {productCode && (
            <p className="mt-2 text-sm text-blue-400">
              {productT("productCode")}{" "}
              <span className="text-[color:var(--brand)]">{productCode}</span>
            </p>
          )}
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
          <p className="mt-8 font-display text-3xl">{uah(price, locale)}</p>
          <ProductDetails name={name} />
        </div>
      </div>
    </section>
  );
}
