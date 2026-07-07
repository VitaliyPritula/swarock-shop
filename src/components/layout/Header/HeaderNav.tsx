'use client';

import { Link } from '@/src/i18n/routing';
import { BookOpen, Heart, LogIn, ShoppingBag } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
};

type HeaderNavProps = {
  isOpen: boolean;
  items: NavItem[];
  t: (key: string) => string;
};

export default function HeaderNav({ isOpen, items, t }: HeaderNavProps) {
  return (
    <div
      className={`flex flex-col gap-x-5 rounded-xl bg-[#DADFE2] p-4 text-black shadow-lg shadow-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex-row md:flex-wrap md:bg-transparent md:shadow-none ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block py-3 uppercase leading-6 tracking-wide transition-colors hover:text-[color:var(--brand)]"
        >
          {item.label}
        </Link>
      ))}

      {/* Білий блок — тільки на мобільному */}
      <div className="mt-4 flex flex-col gap-1 rounded-xl bg-white p-4 md:hidden">
        <Link href="/login" className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm font-medium">
          <LogIn className="w-5 h-5 text-gray-500" />
          {t('login')}
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm font-medium">
          <Heart className="w-5 h-5 text-gray-500" />
          {t('wishlist')}
        </Link>
        <Link href="/delivery" className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm font-medium">
          <ShoppingBag className="w-5 h-5 text-gray-500" />
          {t('delivery')}
        </Link>
        <Link href="/blog" className="flex items-center gap-3 py-3 text-sm font-medium">
          <BookOpen className="w-5 h-5 text-gray-500" />
          {t('blog')}
        </Link>
      </div>
      <a
        href="tel:+380574622726"
        className="mt-5 block text-m text-center font-light leading-[19.5px] transition-all duration-200 hover:text-gray-border hover:underline"
      >
        +380574622726
      </a>
    </div>
  );
}