import { redirect } from "next/navigation";

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

export default function ProductRedirect({ params }: Props) {
  const { locale, slug } = params;
  redirect(`/${locale}/product/${slug}`);
}
