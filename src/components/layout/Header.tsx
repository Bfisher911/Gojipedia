'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-[#2a2a3a]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#00d4aa]">Gojipedia</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[#9090a0] hover:text-[#f0f0f5] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#9090a0] hover:text-[#f0f0f5] transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/shop"
              className="flex items-center gap-2 px-4 py-2 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-medium text-sm hover:bg-[#00f0c0] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-[#9090a0] hover:text-[#f0f0f5]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            searchOpen ? 'max-h-16 py-3' : 'max-h-0'
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#606070]" />
            <input
              type="search"
              placeholder="Search monsters, movies, or articles..."
              className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
            />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-[#12121a] border-t border-[#2a2a3a]',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-[#9090a0] hover:text-[#f0f0f5] hover:bg-[#1a1a25] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-[#2a2a3a]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#606070]" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
