import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MonsterCard } from '@/components/monsters/MonsterCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getMonsters } from '@/lib/db';
import type { Era, Alignment, SpeciesType, MonsterFilters } from '@/types';
import { MonsterFiltersClient, MonsterSearch, ActiveFilters } from './MonsterFilters';

export const metadata: Metadata = {
  title: 'Monster Directory',
  description: 'Browse all kaiju, titans, and monsters from the Godzilla universe. Filter by era, alignment, species type, and more.',
};

interface PageProps {
  searchParams: Promise<{
    era?: string;
    alignment?: string;
    type?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function MonstersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: MonsterFilters = {
    era: params.era as Era | undefined,
    alignment: params.alignment as Alignment | undefined,
    speciesType: params.type as SpeciesType | undefined,
    search: params.search,
    sortBy: (params.sort as MonsterFilters['sortBy']) || 'fanPowerIndex',
    sortOrder: (params.order as MonsterFilters['sortOrder']) || 'desc',
  };

  const monsters = await getMonsters(filters);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ label: 'Monsters' }]}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Monster Directory</h1>
          <p className="mt-2 text-[#9090a0]">
            Explore {monsters.length} kaiju, titans, and creatures from across the Godzilla universe.
          </p>
        </div>

        {/* Search Bar + Mobile Filter Button */}
        <div className="flex gap-4 mb-6">
          <Suspense fallback={<div className="flex-1 h-12 bg-[#12121a] rounded-lg animate-pulse" />}>
            <MonsterSearch currentSearch={filters.search} />
          </Suspense>
          <Suspense fallback={null}>
            <MonsterFiltersClient currentFilters={filters} />
          </Suspense>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Desktop Sidebar is rendered by MonsterFiltersClient */}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            <Suspense fallback={null}>
              <ActiveFilters currentFilters={filters} />
            </Suspense>

            {/* Ad Slot */}
            <div className="mb-8">
              <AdSlot variant="top" />
            </div>

            {/* Results */}
            {monsters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {monsters.map((monster, index) => (
                  <div key={monster.id}>
                    <MonsterCard monster={monster} />
                    {/* Insert ad after every 6 monsters */}
                    {(index + 1) % 6 === 0 && index < monsters.length - 1 && (
                      <div className="col-span-full my-6">
                        <AdSlot variant="infeed" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🦖</div>
                <h2 className="text-xl font-semibold text-[#f0f0f5]">No monsters found</h2>
                <p className="text-[#9090a0] mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
