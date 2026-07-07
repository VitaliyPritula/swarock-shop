'use client';

import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from "../i18n/routing";

export const LanguageToogler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (locale: 'en' | 'uk') => {
    router.push(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-[7px]">
      <button
        onClick={() => changeLanguage('uk')}
        type="button"
        className={clsx(
          'flex cursor-pointer items-center text-[18px] font-medium leading-[19.5px] transition-all duration-300 hover:text-accent tablet:font-semibold tablet:leading-[21.94px]',
          currentLocale === 'uk'
            ? 'text-accent'
            : 'text-light-background'
        )}
      >
        Ua
      </button>
      <span className="">/</span>
      <button
        onClick={() => changeLanguage('en')}
        type="button"
        className={clsx(
          'flex cursor-pointer items-center text-[18px] font-medium leading-[19.5px] transition-all duration-300 hover:text-accent tablet:font-semibold tablet:leading-[21.94px]',
          currentLocale === 'en'
            ? 'text-accent'
            : 'text-light-background'
        )}
      >
        En
      </button>
    </div>
  );
};

export default LanguageToogler;
