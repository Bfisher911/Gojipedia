import Link from 'next/link';
import { ArrowRight, Swords, Film, Clock, BookOpen } from 'lucide-react';
import { MonsterCard } from '@/components/monsters/MonsterCard';
import { WorkCardCompact } from '@/components/movies/WorkCard';
import { ProductCard, AffiliateDisclosure } from '@/components/products/ProductCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { getFeaturedMonsters, getFeaturedWorks, getProducts, getPosts, getSiteStats } from '@/lib/db';

export default async function HomePage() {
  const [featuredMonsters, featuredWorks, products, articles, stats] = await Promise.all([
    getFeaturedMonsters(6),
    getFeaturedWorks(4),
    getProducts({ limit: 4 }),
    getPosts({ type: 'article', limit: 3 }),
    getSiteStats(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/10 via-transparent to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-[#f0f0f5] leading-tight">
              The Encyclopedia of the{' '}
              <span className="text-[#00d4aa]">King of Monsters</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#9090a0] max-w-2xl">
              Explore seven decades of kaiju history. From Godzilla&apos;s first atomic breath in 1954
              to the titans of the MonsterVerse, discover monsters, movies, timelines, and lore.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/monsters"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00f0c0] transition-colors"
              >
                Explore Monsters
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/timeline"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a25] text-[#f0f0f5] rounded-lg font-semibold border border-[#2a2a3a] hover:border-[#00d4aa]/50 transition-colors"
              >
                View Timeline
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<Swords className="w-5 h-5" />} value={stats.monsters} label="Monsters" />
            <StatCard icon={<Film className="w-5 h-5" />} value={stats.works} label="Movies & Media" />
            <StatCard icon={<Clock className="w-5 h-5" />} value="70+" label="Years of History" />
            <StatCard icon={<BookOpen className="w-5 h-5" />} value={stats.battles} label="Epic Battles" />
          </div>
        </div>
      </section>

      {/* Top Ad Slot */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSlot variant="top" />
      </div>

      {/* Section Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Featured Monsters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">Featured Monsters</h2>
              <p className="text-[#9090a0] mt-1">The titans that define the kaiju universe</p>
            </div>
            <Link
              href="/monsters"
              className="hidden md:flex items-center gap-1 text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
            >
              View all monsters
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMonsters.map((monster) => (
              <MonsterCard key={monster.id} monster={monster} />
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/monsters"
              className="flex items-center justify-center gap-1 text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
            >
              View all monsters
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Latest Movies + Shop Section */}
      <section className="py-16 bg-[#12121a]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Latest Movies */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#f0f0f5]">Featured Movies</h2>
                <Link
                  href="/movies"
                  className="flex items-center gap-1 text-sm text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
                >
                  All movies
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {featuredWorks.map((work) => (
                  <WorkCardCompact key={work.id} work={work} />
                ))}
              </div>
            </div>

            {/* Shop the Kaiju */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#f0f0f5]">Shop the Kaiju</h2>
                <Link
                  href="/shop"
                  className="flex items-center gap-1 text-sm text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
                >
                  Full store
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <AffiliateDisclosure className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* In-feed Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdSlot variant="infeed" />
      </div>

      {/* Section Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Timeline Teaser */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1a1a25] to-[#12121a] rounded-2xl p-8 md:p-12 border border-[#2a2a3a]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">
                  70 Years of Monster History
                </h2>
                <p className="mt-4 text-[#9090a0]">
                  From the radioactive horror of 1954 to the titans of today, trace the evolution
                  of Godzilla and kaiju cinema across five distinct eras.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <EraTag era="Showa" years="1954-1975" color="text-yellow-400 bg-yellow-400/10" />
                  <EraTag era="Heisei" years="1984-1995" color="text-red-400 bg-red-400/10" />
                  <EraTag era="Millennium" years="1999-2004" color="text-teal-400 bg-teal-400/10" />
                  <EraTag era="Reiwa" years="2016-present" color="text-purple-400 bg-purple-400/10" />
                  <EraTag era="MonsterVerse" years="2014-present" color="text-blue-400 bg-blue-400/10" />
                </div>
                <Link
                  href="/timeline"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00f0c0] transition-colors"
                >
                  Explore the Timeline
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden md:block">
                {/* Timeline visualization placeholder */}
                <div className="relative h-64">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-teal-400 to-blue-400 rounded-full" />
                  <div className="ml-6 space-y-8">
                    <TimelinePreview year="1954" event="Godzilla emerges" />
                    <TimelinePreview year="1964" event="King Ghidorah arrives" />
                    <TimelinePreview year="2014" event="MonsterVerse begins" />
                    <TimelinePreview year="2021" event="Godzilla vs. Kong" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-[#12121a]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">Lore & History</h2>
              <p className="text-[#9090a0] mt-1">Deep dives into the kaiju universe</p>
            </div>
            <Link
              href="/lore"
              className="hidden md:flex items-center gap-1 text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
            >
              All articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#12121a] rounded-2xl p-8 md:p-12 border border-[#2a2a3a] text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">
              Stay in the Loop
            </h2>
            <p className="mt-4 text-[#9090a0] max-w-md mx-auto">
              Get updates on new monster profiles, movie analyses, and exclusive kaiju content.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00f0c0] transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-[#606070]">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 md:p-6">
      <div className="text-[#00d4aa] mb-2">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">{value}</div>
      <div className="text-sm text-[#606070]">{label}</div>
    </div>
  );
}

function EraTag({ era, years, color }: { era: string; years: string; color: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {era} <span className="opacity-70">({years})</span>
    </span>
  );
}

function TimelinePreview({ year, event }: { year: string; event: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-[26px] top-1 w-3 h-3 bg-[#00d4aa] rounded-full" />
      <div className="text-[#00d4aa] font-bold">{year}</div>
      <div className="text-[#9090a0] text-sm">{event}</div>
    </div>
  );
}

function ArticleCard({ article }: { article: { id: string; title: string; slug: string; excerpt: string; publishedAt: Date | null } }) {
  return (
    <Link
      href={`/lore/${article.slug}`}
      className="group bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6 hover:border-[#00d4aa]/50 transition-colors"
    >
      <h3 className="text-lg font-semibold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-[#9090a0] line-clamp-3">{article.excerpt}</p>
      <div className="mt-4 flex items-center gap-1 text-sm text-[#00d4aa]">
        Read more
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
