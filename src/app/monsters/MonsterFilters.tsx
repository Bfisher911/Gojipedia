'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { FilterSidebar, FilterGroup, FilterOption } from '@/components/layout/FilterSidebar';
import type { Era, Alignment, SpeciesType, MonsterFilters } from '@/types';

const eras: { value: Era; label: string; color: string }[] = [
  { value: 'Showa', label: 'Showa', color: '#ffd700' },
  { value: 'Heisei', label: 'Heisei', color: '#ff6b6b' },
  { value: 'Millennium', label: 'Millennium', color: '#4ecdc4' },
  { value: 'Reiwa', label: 'Reiwa', color: '#a855f7' },
  { value: 'MonsterVerse', label: 'MonsterVerse', color: '#3b82f6' },
  { value: 'Other', label: 'Other', color: '#6b7280' },
];

const alignments: { value: Alignment; label: string; color: string }[] = [
  { value: 'protagonist', label: 'Defender', color: '#22c55e' },
  { value: 'antagonist', label: 'Threat', color: '#ef4444' },
  { value: 'neutral', label: 'Neutral', color: '#6b7280' },
  { value: 'evolves', label: 'Complex', color: '#a855f7' },
];

const speciesTypes: { value: SpeciesType; label: string }[] = [
  { value: 'kaiju', label: 'Kaiju' },
  { value: 'titan', label: 'Titan' },
  { value: 'mech', label: 'Mech' },
  { value: 'alien', label: 'Alien' },
  { value: 'human_organization', label: 'Organization' },
];

const sortOptions = [
  { value: 'fanPowerIndex', label: 'Fan Power Index' },
  { value: 'name', label: 'Name' },
  { value: 'firstAppearanceDate', label: 'First Appearance' },
];

interface MonsterFiltersClientProps {
  currentFilters: MonsterFilters;
}

export function MonsterFiltersClient({ currentFilters }: MonsterFiltersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/monsters?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push('/monsters');
  };

  const hasActiveFilters =
    currentFilters.era ||
    currentFilters.alignment ||
    currentFilters.speciesType;

  return (
    <FilterSidebar title="Filter Monsters">
      {/* Era Filter */}
      <FilterGroup title="Era" defaultOpen={true}>
        {eras.map((era) => (
          <FilterOption
            key={era.value}
            label={era.label}
            color={era.color}
            checked={currentFilters.era === era.value}
            onChange={(checked) => updateFilters('era', checked ? era.value : null)}
          />
        ))}
      </FilterGroup>

      {/* Alignment Filter */}
      <FilterGroup title="Alignment" defaultOpen={true}>
        {alignments.map((alignment) => (
          <FilterOption
            key={alignment.value}
            label={alignment.label}
            color={alignment.color}
            checked={currentFilters.alignment === alignment.value}
            onChange={(checked) => updateFilters('alignment', checked ? alignment.value : null)}
          />
        ))}
      </FilterGroup>

      {/* Species Type Filter */}
      <FilterGroup title="Type" defaultOpen={true}>
        {speciesTypes.map((type) => (
          <FilterOption
            key={type.value}
            label={type.label}
            checked={currentFilters.speciesType === type.value}
            onChange={(checked) => updateFilters('type', checked ? type.value : null)}
          />
        ))}
      </FilterGroup>

      {/* Sort Options */}
      <FilterGroup title="Sort By" defaultOpen={false}>
        <div className="space-y-3">
          <select
            value={currentFilters.sortBy || 'fanPowerIndex'}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-sm text-[#f0f0f5] focus:outline-none focus:border-[#00d4aa]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={currentFilters.sortOrder || 'desc'}
            onChange={(e) => updateFilters('order', e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-sm text-[#f0f0f5] focus:outline-none focus:border-[#00d4aa]"
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>
      </FilterGroup>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#ff4444] hover:text-[#ff6666] hover:bg-[#ff4444]/10 rounded-lg transition-colors mt-4"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </FilterSidebar>
  );
}

// Search bar component (separate from sidebar)
interface MonsterSearchProps {
  currentSearch?: string;
}

export function MonsterSearch({ currentSearch }: MonsterSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    router.push(`/monsters?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/monsters?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#606070]" />
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search monsters by name or alias..."
        className="w-full pl-10 pr-10 py-3 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa] transition-colors"
      />
      {searchInput && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606070] hover:text-[#f0f0f5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
}

// Active filters display (shown above content)
interface ActiveFiltersProps {
  currentFilters: MonsterFilters;
}

export function ActiveFilters({ currentFilters }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/monsters?${params.toString()}`);
  };

  const hasActiveFilters =
    currentFilters.era ||
    currentFilters.alignment ||
    currentFilters.speciesType ||
    currentFilters.search;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-[#606070]">Active:</span>
      {currentFilters.search && (
        <FilterTag label={`"${currentFilters.search}"`} onRemove={() => removeFilter('search')} />
      )}
      {currentFilters.era && (
        <FilterTag label={currentFilters.era} onRemove={() => removeFilter('era')} />
      )}
      {currentFilters.alignment && (
        <FilterTag
          label={alignments.find((a) => a.value === currentFilters.alignment)?.label || currentFilters.alignment}
          onRemove={() => removeFilter('alignment')}
        />
      )}
      {currentFilters.speciesType && (
        <FilterTag
          label={speciesTypes.find((t) => t.value === currentFilters.speciesType)?.label || currentFilters.speciesType}
          onRemove={() => removeFilter('type')}
        />
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00d4aa]/10 border border-[#00d4aa]/30 rounded-full text-sm text-[#00d4aa]">
      {label}
      <button onClick={onRemove} className="hover:text-[#f0f0f5] transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
