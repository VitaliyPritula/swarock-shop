import '../globals.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import Footer from '../../components/layout/Footer/Footer';
import Header from '../../components/layout/Header/Header';

export const metadata: Metadata = {
  title: 'Сварок',
  description: 'Інтернет-магазин роківського одягу та аксесуарів',
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const messages = await getMessages();
  return (
    <html lang="uk">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
      </head>

      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-[1_1_auto]">
              {children}
            </main>

            <Footer />

          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
