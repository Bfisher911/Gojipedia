import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Building, User } from 'lucide-react';
import { getWorkWithMonsters, getProducts } from '@/lib/db';
import { EraTags } from '@/components/ui/EraBadge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MonsterCardCompact } from '@/components/monsters/MonsterCard';
import { ProductCard, AffiliateDisclosure } from '@/components/products/ProductCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getWorkWithMonsters(slug);

  if (!result) {
    return { title: 'Movie Not Found' };
  }

  const { work } = result;

  return {
    title: work.title,
    description: work.synopsisLong || `Learn about ${work.title} from the Godzilla franchise.`,
    openGraph: {
      title: `${work.title} | Gojipedia`,
      description: work.synopsisLong || `Explore ${work.title} and its monsters.`,
      images: work.posterImageUrl ? [{ url: work.posterImageUrl }] : undefined,
    },
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getWorkWithMonsters(slug);

  if (!result) {
    notFound();
  }

  const { work, monsters } = result;

  // Get related products
  const products = await getProducts({
    search: work.title.split(' ').slice(0, 3).join(' '),
    limit: 4,
  });

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1a25] to-[#0a0a0f] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Movies', href: '/movies' },
              { label: work.title }
            ]}
            className="mb-6"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#12121a]">
              {work.posterImageUrl ? (
                <Image
                  src={work.posterImageUrl}
                  alt={work.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl opacity-20">🎬</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <EraTags eras={work.eraTags} size="md" className="mb-4" />

              <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">{work.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-[#9090a0]">
                {work.releaseDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(work.releaseDate)}
                  </span>
                )}
                {work.runtimeMinutes && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {work.runtimeMinutes} minutes
                  </span>
                )}
                <span className="capitalize">{work.workType}</span>
              </div>

              {(work.studio || work.director) && (
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  {work.studio && (
                    <span className="flex items-center gap-2 text-[#9090a0]">
                      <Building className="w-4 h-4" />
                      {work.studio}
                    </span>
                  )}
                  {work.director && (
                    <span className="flex items-center gap-2 text-[#9090a0]">
                      <User className="w-4 h-4" />
                      Directed by {work.director}
                    </span>
                  )}
                </div>
              )}

              {/* Synopsis */}
              {work.synopsisLong && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-[#f0f0f5] mb-2">Synopsis</h2>
                  <p className="text-[#9090a0] whitespace-pre-line">{work.synopsisLong}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Monsters */}
            {monsters.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Featured Monsters</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {monsters.map((monster) => (
                    <MonsterCardCompact key={monster.id} monster={monster} />
                  ))}
                </div>
              </section>
            )}

            {/* Ad Slot */}
            <AdSlot variant="article" />

            {/* Timeline Context */}
            <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Timeline Context</h2>
              <p className="text-[#9090a0]">
                Released in {work.releaseDate ? formatDate(work.releaseDate, 'year') : 'unknown'} as part of the{' '}
                <span className="text-[#00d4aa]">{work.eraTags[0] || 'Unknown'} Era</span>
                {work.continuityTag && ` within the ${work.continuityTag} continuity`}.
              </p>
              <Link
                href={`/timeline?year=${work.releaseDate?.getFullYear()}`}
                className="inline-flex items-center gap-2 mt-4 text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
              >
                View in Timeline
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shop This Movie */}
            {products.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#f0f0f5]">Shop This Movie</h2>
                  <Link
                    href={`/shop?movie=${work.slug}`}
                    className="text-sm text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <AffiliateDisclosure className="mt-4" />
              </section>
            )}

            {/* Ad Slot */}
            <AdSlot variant="sidebar" className="hidden lg:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
