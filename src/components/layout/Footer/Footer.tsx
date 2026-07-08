'use client';
import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from "react";
import { ICONS } from '../../containts/icon';

type Section = {
  title: string;
  content: ReactNode;
};

function getDesktopSections(t: ReturnType<typeof useTranslations>): Section[] {
  return [
    {
      title: t('catalogTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><Link href="/catalog/futbolki">{t('tshirts')}</Link></li>
          <li><Link href="/catalog/kurtki">{t('jackets')}</Link></li>
          <li><Link href="/catalog/obuv">{t('shoes')}</Link></li>
          <li><Link href="/catalog/holovni-ubory">{t('headwear')}</Link></li>
          <li><Link href="/catalog/aksesuary">{t('accessories')}</Link></li>
          <li><Link href="/catalog/muzyka">{t('music')}</Link></li>
          <li><Link href="/catalog/plakaty">{t('posters')}</Link></li>
          <li><Link href="/catalog/kvytky">{t('tickets')}</Link></li>
        </ul>
      ),
    },
    {
      title: t('aboutTitle'),
      content: (
        <div className="space-y-4">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link href="/contacts">{t('aboutCompany')}</Link></li>
            <li><Link href="/payment">{t('deliveryPayment')}</Link></li>
            <li><Link href="/blog">{t('refund')}</Link></li>
            <li><Link href="/blog">{t('ourBlog')}</Link></li>
          </ul>
          <div className="space-y-2">
            <h4 className="font-display text-sm uppercase tracking-widest">{t('userSection')}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/auth">{t('login')}</Link></li>
              <li><Link href="/auth">{t('register')}</Link></li>
              <li><Link href="/contacts">{t('callback')}</Link></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: t('contactsTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>+38 067 777 88 67</li>
          <li>+38 050 123 45 67</li>
          <li>svarock.mag@gmail.com</li>
          <li className="pt-2">{t('locationUk')}</li>
        </ul>
      ),
    },
    {
      title: t('contactsRuTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>+380677213567</li>
          <li>+380507336884</li>
          <li>svarock.mag@gmail.com</li>
          <li>{t('forResidents')}</li>
          <li>{t('forGuests')}</li>
          <li>{t('ofChuguev')}</li>
          <li>{t('shopName')}</li>
          <li>{t('shopAddress')}</li>
          <li>+380574622726</li>
        </ul>
      ),
    },
  ];
}

function getMobileSections(t: ReturnType<typeof useTranslations>): Section[] {
  return [
    {
      title: t('catalogTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><Link href="/catalog/futbolki">{t('tshirts')}</Link></li>
          <li><Link href="/catalog/kurtki">{t('jackets')}</Link></li>
          <li><Link href="/catalog/obuv">{t('shoes')}</Link></li>
          <li><Link href="/catalog/holovni-ubory">{t('headwear')}</Link></li>
          <li><Link href="/catalog/aksesuary">{t('accessories')}</Link></li>
          <li><Link href="/catalog/muzyka">{t('music')}</Link></li>
          <li><Link href="/catalog/plakaty">{t('posters')}</Link></li>
          <li><Link href="/catalog/kvytky">{t('tickets')}</Link></li>
        </ul>
      ),
    },
    {
      title: t('aboutTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><Link href="/contacts">{t('aboutCompany')}</Link></li>
          <li><Link href="/payment">{t('deliveryPayment')}</Link></li>
          <li><Link href="/blog">{t('refund')}</Link></li>
          <li><Link href="/blog">{t('ourBlog')}</Link></li>
        </ul>
      ),
    },
    {
      title: t('userSection'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><Link href="/auth">{t('login')}</Link></li>
          <li><Link href="/auth">{t('register')}</Link></li>
          <li><Link href="/contacts">{t('callback')}</Link></li>
        </ul>
      ),
    },
    {
      title: t('contactsTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>+38 067 777 88 67</li>
          <li>+38 050 123 45 67</li>
          <li>svarock.mag@gmail.com</li>
          <li className="pt-2">{t('locationUk')}</li>
        </ul>
      ),
    },
    {
      title: t('contactsRuTitle'),
      content: (
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>+380677213567</li>
          <li>+380507336884</li>
          <li>svarock.mag@gmail.com</li>
          <li>{t('forResidents')}</li>
          <li>{t('forGuests')}</li>
          <li>{t('ofChuguev')}</li>
          <li>{t('shopName')}</li>
          <li>{t('shopAddress')}</li>
          <li>+380574622726</li>
        </ul>
      ),
    },
  ];
}

function FooterAccordion({ sections, t }: { sections: Section[]; t: ReturnType<typeof useTranslations> }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="footer md:hidden">
      {sections.map((s) => {
        const isOpen = open === s.title;
        return (
          <div key={s.title} className="">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.title)}
              className="flex w-full items-center justify-between bg-secondary px-4 py-3 text-left font-display text-sm uppercase tracking-widest"
              aria-expanded={isOpen}
            >
              <span>{s.title}</span>
              <ICONS.ARROW className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`} />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="min-h-0 px-4 py-4">{s.content}</div>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
        <span className="font-display text-sm uppercase tracking-widest">{t('socialTitle')}</span>
        <div className="flex gap-3 text-foreground">
          <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">f</a>
          <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">ig</a>
          <a href="#" aria-label="YouTube" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">yt</a>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');
  const desktopSections = getDesktopSections(t);
  const mobileSections = getMobileSections(t);

  return (
    <footer className="mt-16 border-t border-border bg-background">
      {/* Desktop ≥ lg (992+) */}
      <div className="mx-auto hidden max-w-7xl gap-8 px-4 py-10 min-[992px]:grid min-[992px]:grid-cols-4">
        {desktopSections.map((s) => (
          <div key={s.title}>
            <h4 className="mb-3 font-display text-sm uppercase tracking-widest">{s.title}</h4>
            {s.content}
          </div>
        ))}
      </div>
      <div className="mx-auto hidden max-w-7xl px-4 pb-10 min-[992px]:block">
        <h4 className="mb-3 font-display text-sm uppercase tracking-widest">Наші спільноти</h4>
        <div className="flex gap-3 text-foreground">
          <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">f</a>
          <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">ig</a>
          <a href="#" aria-label="YouTube" className="inline-flex items-center justify-center rounded bg-gray-100 p-1 text-xs font-semibold">yt</a>
        </div>
      </div>

      {/* Mobile/Tablet < lg */}
      <FooterAccordion sections={mobileSections} t={t} />

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t('copyright')} <br /> {t('shopName')}
      </div>
    </footer>
  );
}
