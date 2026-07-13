import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/routing";
import { localProducts } from "@/src/lib/catalog";
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { getProduct } from "@/src/lib/shop.functions";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const t = await getTranslations("Products");
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
        {t("backToCatalog")}
      </Link>

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

        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("material")}: {material}
          </p>
          <h1 className="mt-3 font-display text-3xl uppercase sm:text-4xl">{name}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
          <p className="mt-8 font-display text-3xl">{uah(price)}</p>
        </div>
      </div>
    </main>
  );
}
