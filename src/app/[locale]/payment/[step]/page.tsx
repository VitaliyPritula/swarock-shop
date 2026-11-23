import { Link } from "@/src/i18n/routing";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; step: string }>;
};

const paymentSteps = ["delivery1", "delivery2", "delivery3"] as const;

export default async function PaymentStepPage({ params }: Props) {
  const { step } = await params;
  const t = await getTranslations("Payment");
  const paymentStep = paymentSteps.find((item) => item === step);
  if (!paymentStep) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="font-display text-3xl uppercase">{t(`${paymentStep}.title`)}</h1>
      <p className="mx-auto mt-5 max-w-xl leading-8 text-primary">{t(`${paymentStep}.text`)}</p>
      <Link href="/checkout" className="mt-8 inline-flex rounded bg-primary px-6 py-3 text-sm text-white">
        {t("continueToCheckout")}
      </Link>
    </main>
  );
}
