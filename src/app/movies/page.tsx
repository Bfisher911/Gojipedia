import type { Metadata } from 'next';
import Link from 'next/link';
import { getWorks } from '@/lib/db';
import { WorkCard } from '@/components/movies/WorkCard';
import { AdSlot } from '@/components/ui/AdSlot';
import type { Era, WorkType, WorkFilters } from '@/types';

export const metadata: Metadata = {
  title: 'Movies & Media',
  description: 'Browse all Godzilla movies, series, and media. Filter by era and discover the complete kaiju filmography.',
};

interface PageProps {
  searchParams: Promise<{
    era?: string;
    type?: string;
    year?: string;
    search?: string;
  }>;
}

const eras: Era[] = ['Showa', 'Heisei', 'Millennium', 'Reiwa', 'MonsterVerse', 'Other'];
const workTypes: { value: WorkType; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'TV Series' },
  { value: 'comic', label: 'Comics' },
  { value: 'game', label: 'Games' },
];

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: WorkFilters = {
    era: params.era as Era | undefined,
    workType: params.type as WorkType | undefined,
    year: params.year ? parseInt(params.year) : undefined,
    search: params.search,
  };

  const works = await getWorks(filters);

  // Group works by era for display
  const worksByEra = works.reduce((acc, work) => {
    const era = work.eraTags[0] || 'Other';
    if (!acc[era]) acc[era] = [];
    acc[era].push(work);
    return acc;
  }, {} as Record<string, typeof works>);

  const hasFilters = filters.era || filters.workType || filters.year || filters.search;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Movies & Media</h1>
          <p className="mt-2 text-[#9090a0]">
            {works.length} titles spanning seven decades of kaiju cinema.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <FilterGroup label="Era">
            {eras.map((era) => (
              <FilterLink
                key={era}
                href={`/movies?era=${era}`}
                isActive={filters.era === era}
                label={era}
              />
            ))}
          </FilterGroup>
          <FilterGroup label="Type">
            {workTypes.map(({ value, label }) => (
              <FilterLink
                key={value}
                href={`/movies?type=${value}`}
                isActive={filters.workType === value}
                label={label}
              />
            ))}
          </FilterGroup>
          {hasFilters && (
            <Link
              href="/movies"
              className="px-3 py-1.5 text-sm text-[#ff4444] hover:text-[#ff6666] transition-colors"
            >
              Clear filters
            </Link>
          )}
        </div>

        {/* Ad Slot */}
        <AdSlot variant="top" className="mb-8" />

        {/* Results */}
        {hasFilters ? (
          // Filtered view - flat list
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          // Default view - grouped by era
          <div className="space-y-12">
            {Object.entries(worksByEra).map(([era, eraWorks]) => (
              <section key={era}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-[#f0f0f5]">{era} Era</h2>
                  <span className="text-sm text-[#606070]">{eraWorks.length} titles</span>
                  <div className="flex-1 h-px bg-[#2a2a3a]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {eraWorks.map((work) => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {works.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold text-[#f0f0f5]">No movies found</h2>
            <p className="text-[#9090a0] mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#606070]">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
}

function FilterLink({ href, isActive, label }: { href: string; isActive: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[#00d4aa] text-[#0a0a0f]'
          : 'bg-[#1a1a25] text-[#9090a0] hover:text-[#f0f0f5] border border-[#2a2a3a] hover:border-[#00d4aa]/50'
      }`}
    >
      {label}
    </Link>
  );
}
