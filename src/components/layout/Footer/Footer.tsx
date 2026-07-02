
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="mx-auto w-full max-w-[1440px]">
      Footer

      <div className=""></div>

      <div className="py-[30px] mb-2 leading-6 border-t border-main text-center text-[12px] text-light-background tablet:text-body-text">
        © {new Date().getFullYear()} {t('copyright')} <br /> {t('shopName')}
      </div>
    </footer>
  )
}
