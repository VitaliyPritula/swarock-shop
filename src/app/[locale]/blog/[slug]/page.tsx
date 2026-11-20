import { Link } from "@/src/i18n/routing";
import { getBlogPost } from "@/src/lib/shop.functions";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("Blog");
  const post = await getBlogPost(slug).catch(() => null);
  const fallbackSlugs = ["rok-szcogoden", "dobir-rozmiru", "novi-relizy"] as const;
  const fallbackSlug = fallbackSlugs.find((item) => item === slug);

  if (!post && !fallbackSlug) notFound();

  const title = post?.title ?? t(`fallbackPosts.${fallbackSlug!}.title`);
  const content = post?.content ?? t(`fallbackPosts.${fallbackSlug!}.content`);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/blog" className="hover:underline">{t("title")}</Link>
        <span className="mx-2">/</span>
        <span>{title}</span>
      </nav>
      <article>
        <h1 className="font-display text-3xl uppercase">{title}</h1>
        <p className="mt-6 leading-8 text-muted-foreground">{content}</p>
      </article>
    </main>
  );
}
