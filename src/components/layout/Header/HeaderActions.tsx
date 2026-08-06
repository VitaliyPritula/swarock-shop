'use client';

import { Link, useRouter } from '@/src/i18n/routing';
import { useCart } from '@/src/lib/cart';
import { useWishlist } from '@/src/lib/wishlist';
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
  const cartCount = useCart((s) => s.items.reduce((acc, x) => acc + x.qty, 0));
  const wishCount = useWishlist((s) => s.items.length);

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

        <div className="relative hidden md:block">
          <Link href="/wishlist" className="rounded-full p-2 text-white transition hover:bg-white/10" aria-label={t('favorites')}>
            <Heart className="h-5 w-5" />
          </Link>
          {wishCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs text-white">{wishCount}</span>
          )}
        </div>
        <div className="relative">
          <Link href="/cart" className="rounded-full p-2 text-white transition hover:bg-white/10" aria-label={t('cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Link>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs text-white">{cartCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
