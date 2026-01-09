import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/db';
import { AdSlot } from '@/components/ui/AdSlot';
import { formatDate } from '@/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lore & History',
  description: 'Deep dives into Godzilla history, kaiju lore, and the mythology of the monster universe.',
};

export default async function LorePage() {
  const articles = await getPosts({ type: 'article', status: 'published', limit: 20 });
  const guides = await getPosts({ type: 'guide', status: 'published', limit: 10 });
  const explainers = await getPosts({ type: 'explainer', status: 'published', limit: 10 });

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Lore & History</h1>
          <p className="mt-2 text-[#9090a0]">
            Deep dives, guides, and explainers about the Godzilla universe.
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8">
          <CategoryLink href="/lore" label="All" isActive />
          <CategoryLink href="/lore?type=guide" label="Guides" />
          <CategoryLink href="/lore?type=explainer" label="Explainers" />
        </div>

        {/* Ad Slot */}
        <AdSlot variant="top" className="mb-8" />

        {/* Featured Article */}
        {articles[0] && (
          <section className="mb-12">
            <Link
              href={`/lore/${articles[0].slug}`}
              className="block bg-gradient-to-r from-[#1a1a25] to-[#12121a] rounded-2xl p-8 border border-[#2a2a3a] hover:border-[#00d4aa]/50 transition-colors"
            >
              <span className="text-xs text-[#00d4aa] uppercase tracking-wider">Featured</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#f0f0f5]">{articles[0].title}</h2>
              <p className="mt-4 text-[#9090a0] max-w-2xl">{articles[0].excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-[#606070]">
                {articles[0].publishedAt && (
                  <span>{formatDate(articles[0].publishedAt, 'short')}</span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />5 min read
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Grid of Articles */}
        <section>
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* In-feed ad */}
        <AdSlot variant="infeed" className="my-8" />

        {/* Guides Section */}
        {guides.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#f0f0f5]">Guides</h2>
              <Link href="/lore?type=guide" className="text-[#00d4aa] hover:text-[#00f0c0] transition-colors flex items-center gap-1 text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guides.slice(0, 4).map((guide) => (
                <Link
                  key={guide.id}
                  href={`/lore/${guide.slug}`}
                  className="flex items-center gap-4 p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#00d4aa]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#f0f0f5] truncate">{guide.title}</h3>
                    <p className="text-sm text-[#606070] truncate">{guide.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Explainers Section */}
        {explainers.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#f0f0f5]">Explainers</h2>
              <Link href="/lore?type=explainer" className="text-[#00d4aa] hover:text-[#00f0c0] transition-colors flex items-center gap-1 text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {explainers.slice(0, 6).map((explainer) => (
                <Link
                  key={explainer.id}
                  href={`/lore/${explainer.slug}`}
                  className="p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
                >
                  <span className="text-xs text-purple-400 uppercase tracking-wider">Explainer</span>
                  <h3 className="mt-1 font-semibold text-[#f0f0f5]">{explainer.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CategoryLink({ href, label, isActive = false }: { href: string; label: string; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[#00d4aa] text-[#0a0a0f]'
          : 'bg-[#12121a] text-[#9090a0] border border-[#2a2a3a] hover:border-[#00d4aa]/50 hover:text-[#f0f0f5]'
      }`}
    >
      {label}
    </Link>
  );
}

function ArticleCard({ article }: { article: { id: string; title: string; slug: string; excerpt: string; publishedAt: Date | null; tags: string[] } }) {
  return (
    <Link
      href={`/lore/${article.slug}`}
      className="group flex flex-col p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {article.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-[#9090a0] line-clamp-3 flex-1">{article.excerpt}</p>
      <div className="mt-4 text-xs text-[#606070]">
        {article.publishedAt && formatDate(article.publishedAt, 'short')}
      </div>
    </Link>
  );
}
