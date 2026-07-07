'use client';
import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import LanguageSwitcher from '../../LanguageSwitcher';
import BurgerIcon from './BurgerIcon';
import HeaderActions from './HeaderActions';
import HeaderNav from './HeaderNav';
import HeaderSearch from './HeaderSearch';
import { NAV } from './nav-data';

export default function Header() {
  const t = useTranslations('Header');
  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = () => {
    const trimmed = q.trim();
    if (!trimmed) return;

    window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);


  // Автофокус на інпут при відкритті
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Закриття при кліку поза пошуком
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="w-full relative">
      <div className="bg-primary text-md font-bold text-white">
        <div className="mx-auto relative gap-3 flex w-full max-w-[1440px] items-center justify-between px-4 py-3">
          <BurgerIcon isOpen={isOpen} onClick={toggleMenu} />
          <div className="">
            <Link href="/">
              <Image
                className="h-10 w-30 md:w-40"
                src="/LOGO.svg"
                alt="Logo"
                width={98}
                height={98}
                priority
              />
            </Link>
          </div>
          <div className="hidden w-[60%] items-center gap-3 sm:gap-4 md:flex">
            <HeaderSearch
              value={q}
              onChange={setQ}
              onSearch={handleSearch}
              inputRef={inputRef}
              placeholder={t('searchPlaceholder')}
              buttonLabel={t('searchAria')}
              className="hidden w-full items-center gap-2 rounded bg-white px-2 py-1 md:flex"
              inputClassName="flex-1 rounded bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
              buttonClassName="rounded bg-white p-2"
              iconClassName="h-5 w-5 text-primary"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderActions isMenuOpen={isOpen} onOpenSearch={() => setIsSearchOpen(true)} t={t} />
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {/* Mobile search overlay */}
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <div
              className="absolute inset-0 z-40 bg-primary"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search box */}
            <div ref={searchRef} className="absolute left-0 top-0 z-50 w-full bg-primary p-4 md:hidden">
              <HeaderSearch
                value={q}
                onChange={setQ}
                onSearch={handleSearch}
                inputRef={inputRef}
                placeholder={t('searchPlaceholder')}
                buttonLabel={t('searchAria')}
                className="flex w-full items-center gap-2 rounded bg-white px-2 py-1"
                inputClassName="flex-1 rounded bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                buttonClassName="rounded bg-white p-2"
                iconClassName="h-5 w-5 text-primary"
              />
            </div>
          </>
        )}
      </div>

      <div
        className={`md:relative absolute left-0 top-0 h-auto w-full md:bg-transparent bg-[#0e0925a9] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] mx-auto px-4 max-w-[1440px]
          ${isOpen
            ? "translate-x-[0%] pt-[20%] lg:h-8 h-screen overflow-y-scroll px-7"
            : "md:-translate-x-[98%] -translate-x-[1000%]"
          }
          `}>
        {isOpen && (
          <div className="fixed inset-x-0 top-0 z-20 h-[80px] bg-[#1D1D24] px-4 py-3 text-white">
            <div className="flex justify-end py-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
        <HeaderNav
          isOpen={isOpen}
          items={NAV.filter((n) => n.href !== '/').map((n) => ({
            href: n.href,
            label: t(n.labelKey),
          }))}
          t={t}
        />
      </div>
    </header>
  );
}
