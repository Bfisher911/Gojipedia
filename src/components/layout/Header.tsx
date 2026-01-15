'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingBag, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Monsters', href: '/monsters' },
  { name: 'Movies', href: '/movies' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Lore', href: '/lore' },
  { name: 'Stories', href: '/stories' },
  { name: 'Shop', href: '/shop' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0a0a0f]/98 backdrop-blur-md shadow-lg'
            : 'bg-[#0a0a0f]/95 backdrop-blur-sm'
        )}
      >
        {/* Utility Bar */}
        <div className="utility-bar hidden lg:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-8 text-xs">
              <span className="text-[#606070]">The Ultimate Godzilla Encyclopedia</span>
              <div className="flex items-center gap-6">
                <Link href="/about/fan-power-index" className="text-[#606070] hover:text-[#00d4aa] transition-colors">
                  Fan Power Index
                </Link>
                <Link href="/about" className="text-[#606070] hover:text-[#00d4aa] transition-colors">
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav
          className={cn(
            'border-b transition-colors duration-300',
            scrolled ? 'border-[#2a2a3a]' : 'border-transparent'
          )}
          aria-label="Main"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center group-hover:bg-[#00d4aa]/20 transition-colors">
                  <Zap className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <span className="text-xl font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors">
                  Gojipedia
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:items-center lg:gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'nav-link px-4 py-2 text-sm font-medium rounded-lg',
                      isActive(item.href) && 'active'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Search & Shop */}
              <div className="hidden lg:flex lg:items-center lg:gap-3 flex-shrink-0">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#606070] group-focus-within:text-[#00d4aa] transition-colors" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-48 pl-9 pr-12 py-2 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-sm text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa] focus:w-64 transition-all"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-[#606070] bg-[#1a1a25] rounded border border-[#2a2a3a]">
                    ⌘K
                  </kbd>
                </div>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-[#0a0a0f] rounded-lg font-medium text-sm hover:from-[#00f0c0] hover:to-[#00d4aa] transition-all shadow-md hover:shadow-lg hover:shadow-[#00d4aa]/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 text-[#9090a0] hover:text-[#f0f0f5] hover:bg-[#12121a] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'mobile-menu-overlay lg:hidden transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col h-full pt-20">
          {/* Mobile Search */}
          <div className="px-4 py-4 border-b border-[#2a2a3a]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#606070]" />
              <input
                type="search"
                placeholder="Search monsters, movies, articles..."
                className="w-full pl-10 pr-4 py-3 bg-[#12121a] border border-[#2a2a3a] rounded-xl text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-colors',
                    isActive(item.href)
                      ? 'text-[#00d4aa] bg-[#00d4aa]/10'
                      : 'text-[#f0f0f5] hover:bg-[#12121a]'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Era Quick Links */}
            <div className="mt-8 pt-6 border-t border-[#2a2a3a]">
              <p className="px-4 text-xs font-medium text-[#606070] uppercase tracking-wider mb-3">
                Browse by Era
              </p>
              <div className="flex flex-wrap gap-2 px-4">
                {[
                  { name: 'Showa', color: 'bg-yellow-500/20 text-yellow-400' },
                  { name: 'Heisei', color: 'bg-red-500/20 text-red-400' },
                  { name: 'Millennium', color: 'bg-teal-500/20 text-teal-400' },
                  { name: 'Reiwa', color: 'bg-purple-500/20 text-purple-400' },
                  { name: 'MonsterVerse', color: 'bg-blue-500/20 text-blue-400' },
                ].map((era) => (
                  <Link
                    key={era.name}
                    href={`/monsters?era=${era.name}`}
                    className={cn('px-3 py-1.5 rounded-full text-sm font-medium', era.color)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {era.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile Shop CTA */}
          <div className="p-4 border-t border-[#2a2a3a]">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-[#0a0a0f] rounded-xl font-semibold text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              Shop Kaiju Gear
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-24" />
    </>
  );
}
