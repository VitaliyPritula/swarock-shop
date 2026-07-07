import { Link } from '@/src/i18n/routing';

type Item = { href: string; labelKey: string };
export const NAV: Item[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/catalog", labelKey: "nav.catalog" },
  { href: "/catalog/futbolki", labelKey: "nav.tshirts" },
  { href: "/catalog/kurtki", labelKey: "nav.jackets" },
  { href: "/catalog/obuv", labelKey: "nav.shoes" },
  { href: "/catalog/holovni-ubory", labelKey: "nav.headwear" },
  { href: "/catalog/aksesuary", labelKey: "nav.accessories" },
  { href: "/catalog/muzyka", labelKey: "nav.music" },
  { href: "/catalog/plakaty", labelKey: "nav.posters" },
  { href: "/catalog/kvytky", labelKey: "nav.tickets" },
  { href: "/blog", labelKey: "nav.blog" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-display text-2xl font-bold tracking-widest text-[color:var(--brand)] ${className}`}>
      SVAROCK
    </Link>
  );
}
