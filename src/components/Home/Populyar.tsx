"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard, type ProductCardData } from "@/src/components/ProductCard";
import { localProducts } from "@/src/lib/catalog";
import { listProducts } from "@/src/lib/shop.functions";
import { SectionTitle } from "../SectionTitle";

export default function Populyar() {
  const t = useTranslations("Products");
  const fallbackProducts = localProducts.map((product) => ({
    slug: product.slug,
    name: t(`items.${product.translationKey}.name`),
    price: product.price,
    image_url: product.imageKey,
    material: t(`items.${product.translationKey}.material`),
    isPopular: product.isPopular,
    isNew: product.isNew,
  }));
  const [popular, setPopular] = useState<ProductCardData[]>(() =>
    fallbackProducts.filter((p) => p.isPopular),
  );
  const [news, setNews] = useState<ProductCardData[]>(() =>
    fallbackProducts.filter((p) => p.isNew),
  );

  useEffect(() => {
    void Promise.all([
      listProducts({ onlyPopular: true, limit: 4 }),
      listProducts({ onlyNew: true, limit: 4 }),
    ])
      .then(([popularProducts, newProducts]) => {
        setPopular(popularProducts.length > 0 ? popularProducts : fallbackProducts.filter((p) => p.isPopular));
        setNews(newProducts.length > 0 ? newProducts : fallbackProducts.filter((p) => p.isNew));
      })
      .catch(() => {
        setPopular(fallbackProducts.filter((p) => p.isPopular));
        setNews(fallbackProducts.filter((p) => p.isNew));
      });
  }, []);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4">
        <div className="my-8 items-center gap-8">
          <SectionTitle>{t('popular')}</SectionTitle>
          <p className="-mt-4 text-center text-xs uppercase tracking-widest text-muted-foreground">{t('popularDescription')}</p>
          <div className="mt-6 flex snap-x snap-mandatory gap-15 overflow-x-auto pb-3 [scrollbar-width:thin]">
            {popular.map((p) => (
              <div key={p.slug} className="w-[78vw] max-w-[350px] shrink-0 snap-start sm:w-[320px] sm:max-w-none">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
          <SectionTitle>{t('new')}</SectionTitle>
          <p className="-mt-4 text-center text-xs uppercase tracking-widest text-muted-foreground">{t('newDescription')}</p>
          <div className="mt-6 flex snap-x snap-mandatory gap-15 overflow-x-auto pb-3 [scrollbar-width:thin]">
            {news.map((p) => (
              <div key={p.slug} className="w-[78vw] max-w-[350px] shrink-0 snap-start sm:w-[320px] sm:max-w-none">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
