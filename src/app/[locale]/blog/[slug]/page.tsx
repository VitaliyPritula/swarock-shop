import { Link } from "@/src/i18n/routing";
import { getBlogPost } from "@/src/lib/shop.functions";
import { notFound } from "next/navigation";

const fallbackPosts: Record<string, { title: string; content: string }> = {
  "rok-szcogoden": {
    title: "Рок — це стиль щодня",
    content: "Виразний образ починається з базових речей: чорної футболки, міцного взуття та атмосферного мерчу. Додавайте аксесуари поступово, щоб зберегти власний характер.",
  },
  "dobir-rozmiru": {
    title: "Як правильно підібрати розмір",
    content: "Перед замовленням звірте параметри вашого улюбленого одягу з таблицею розмірів. Для вільнішого крою обирайте розмір на один більший.",
  },
  "novi-relizy": {
    title: "Нові релізи та мерч",
    content: "У каталозі зʼявляються оновлені колекції одягу та атрибутики. Дотримуйтеся розділу новинок, щоб не пропустити нові релізи.",
  },
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  const fallback = fallbackPosts[slug];

  if (!post && !fallback) notFound();

  const title = post?.title ?? fallback?.title ?? "";
  const content = post?.content ?? fallback?.content ?? "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/blog" className="hover:underline">Наш блог</Link>
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
