import { useTranslations } from 'next-intl';
import { Hero } from '@/src/components/Home/Hero';
import  Populyar  from '@/src/components/Home/Populyar';

export default function Home() {

  return (
    <main>
      <Hero />
      <Populyar />
    </main>
  );
}