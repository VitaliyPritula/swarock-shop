import { Link } from "@/src/i18n/routing";
import { notFound } from "next/navigation";

const steps: Record<string, { title: string; text: string }> = {
  delivery1: {
    title: "Доставка та оплата",
    text: "Оберіть зручний спосіб доставки: Нова Пошта або курʼєрська доставка.",
  },
  delivery2: {
    title: "Способи оплати",
    text: "Можлива оплата карткою онлайн або готівкою при отриманні замовлення.",
  },
  delivery3: {
    title: "Підтвердження доставки",
    text: "Після оформлення ми звʼяжемося для підтвердження даних і повідомимо номер відправлення.",
  },
};

type Props = {
  params: Promise<{ locale: string; step: string }>;
};

export default async function PaymentStepPage({ params }: Props) {
  const { step } = await params;
  const page = steps[step];
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="font-display text-3xl uppercase">{page.title}</h1>
      <p className="mx-auto mt-5 max-w-xl leading-8 text-muted-foreground">{page.text}</p>
      <Link href="/checkout" className="mt-8 inline-flex rounded bg-primary px-6 py-3 text-sm text-white">
        Перейти до оформлення
      </Link>
    </main>
  );
}
