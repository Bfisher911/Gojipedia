import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getFeaturedCollections, getMonsters } from '@/lib/db';
import { ProductCard, AffiliateDisclosure } from '@/components/products/ProductCard';
import { AdSlot } from '@/components/ui/AdSlot';
import type { ProductCategory } from '@/types';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Shop authentic Godzilla merchandise. Browse figures, Blu-rays, posters, shirts, and more from the kaiju universe.',
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    monster?: string;
    movie?: string;
    era?: string;
    search?: string;
  }>;
}

const categories: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: 'figures', label: 'Figures', emoji: '🦖' },
  { value: 'model_kits', label: 'Model Kits', emoji: '🔧' },
  { value: 'bluray', label: 'Blu-ray & DVD', emoji: '📀' },
  { value: 'books', label: 'Books', emoji: '📚' },
  { value: 'posters', label: 'Posters', emoji: '🖼️' },
  { value: 'shirts', label: 'Apparel', emoji: '👕' },
  { value: 'art', label: 'Art', emoji: '🎨' },
];

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters = {
    category: params.category,
    search: params.search || params.monster || params.movie,
    limit: 24,
  };

  const [products, collections, monsters] = await Promise.all([
    getProducts(filters),
    getFeaturedCollections(4),
    getMonsters({ sortBy: 'fanPowerIndex', sortOrder: 'desc' }),
  ]);

  const hasFilters = params.category || params.monster || params.movie || params.era || params.search;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Kaiju Shop</h1>
          <p className="mt-2 text-[#9090a0]">
            Authentic Godzilla merchandise, figures, movies, and collectibles.
          </p>
        </div>

        {/* Affiliate Disclosure Banner */}
        <div className="mb-8 p-4 bg-[#00d4aa]/10 border border-[#00d4aa]/30 rounded-xl">
          <p className="text-sm text-[#9090a0]">
            <span className="text-[#00d4aa] font-medium">Affiliate Disclosure:</span>{' '}
            As an Amazon Associate, Gojipedia earns from qualifying purchases.
            We hand-pick products we think you&apos;ll love.{' '}
            <Link href="/about/product-selection" className="text-[#00d4aa] hover:underline">
              Learn how we choose products
            </Link>
          </p>
        </div>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#f0f0f5] mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label, emoji }) => (
              <Link
                key={value}
                href={`/shop?category=${value}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  params.category === value
                    ? 'bg-[#00d4aa] text-[#0a0a0f]'
                    : 'bg-[#12121a] text-[#9090a0] border border-[#2a2a3a] hover:border-[#00d4aa]/50 hover:text-[#f0f0f5]'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </Link>
            ))}
            {hasFilters && (
              <Link
                href="/shop"
                className="px-4 py-2 text-[#ff4444] hover:text-[#ff6666] transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>
        </section>

        {/* Shop by Monster */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#f0f0f5] mb-4">Shop by Monster</h2>
          <div className="flex flex-wrap gap-2">
            {monsters.slice(0, 10).map((monster) => (
              <Link
                key={monster.id}
                href={`/shop?monster=${monster.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  params.monster === monster.slug
                    ? 'bg-[#00d4aa] text-[#0a0a0f]'
                    : 'bg-[#1a1a25] text-[#9090a0] hover:text-[#f0f0f5] border border-[#2a2a3a] hover:border-[#00d4aa]/50'
                }`}
              >
                {monster.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot variant="top" className="mb-8" />

        {/* Featured Collections */}
        {!hasFilters && collections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">Featured Collections</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/shop/collection/${collection.slug}`}
                  className="p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
                >
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-semibold text-[#f0f0f5]">{collection.title}</h3>
                  <p className="text-sm text-[#9090a0] mt-1 line-clamp-2">{collection.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#f0f0f5]">
              {hasFilters ? 'Results' : 'All Products'}
            </h2>
            <span className="text-sm text-[#606070]">{products.length} items</span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  {/* Insert ad after every 10 products */}
                  {(index + 1) % 10 === 0 && index < products.length - 1 && (
                    <div className="col-span-full my-6">
                      <AdSlot variant="infeed" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold text-[#f0f0f5]">No products found</h2>
              <p className="text-[#9090a0] mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </section>

        {/* Bottom Disclosure */}
        <AffiliateDisclosure className="mt-8" />
      </div>
    </div>
  );
}
