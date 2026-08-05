'use client';

import { Link, useRouter } from '@/src/i18n/routing';
import { supabase } from '@/src/lovable/client';
import { Heart, Search, ShoppingCart, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

type HeaderActionsProps = {
  isMenuOpen: boolean;
  onOpenSearch: () => void;
  t: (key: string) => string;
};

export default function HeaderActions({ isMenuOpen, onOpenSearch, t }: HeaderActionsProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) {
        setIsAuthenticated(!!user);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenSearch}
        className="md:hidden"
        aria-label={t('openSearch')}
      >
        <Search className="h-5 w-4 text-white" />
      </button>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <Link href="/account" className="rounded-full p-2 hidden md:block text-white transition hover:bg-white/10" aria-label={t('user')}>
            <UserRound className="h-5 w-5" />
          </Link>
        ) : (
          <Link href="/auth" className="rounded-full p-2 hidden md:block text-white transition hover:bg-white/10" aria-label={t('user')}>
            <UserRound className="h-5 w-5" />
          </Link>
        )}

        <Link href="/wishlist" className="rounded-full p-2 hidden md:block text-white transition hover:bg-white/10" aria-label={t('favorites')}>
          <Heart className="h-5 w-5" />
        </Link>
        <Link href="/cart" className="rounded-full p-2 text-white transition hover:bg-white/10" aria-label={t('cart')}>
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
