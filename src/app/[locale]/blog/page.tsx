import { Link } from "@/src/i18n/routing";
import { listBlog } from "@/src/lib/shop.functions";
import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const posts = await listBlog().catch(() => []);
  const fallbackSlugs = ["rok-szcogoden", "dobir-rozmiru", "novi-relizy"] as const;
  const fallbackPosts = fallbackSlugs.map((slug) => ({
    slug,
    title: t(`fallbackPosts.${slug}.title`),
    excerpt: t(`fallbackPosts.${slug}.excerpt`),
  }));
  const items = posts.length > 0 ? posts : fallbackPosts;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">{t("home")}</Link>
        <span className="mx-2">/</span>
        <span>{t("title")}</span>
      </nav>
      <h1 className="mb-8 text-center font-display text-2xl uppercase tracking-widest">{t("title")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((post: { slug: string; title: string; excerpt?: string }) => (
          <article key={post.slug} className="border border-border bg-white p-5">
            <h2 className="font-display text-lg uppercase">{post.title}</h2>
            {post.excerpt && <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>}
            <Link
              href={`/blog/${post.slug}`}
              className="mt-5 inline-block border-b border-primary text-sm uppercase tracking-widest"
            >
              {t("read")}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
