'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Era, Alignment, SpeciesType, MonsterFilters } from '@/types';

const eras: Era[] = ['Showa', 'Heisei', 'Millennium', 'Reiwa', 'MonsterVerse', 'Other'];
const alignments: { value: Alignment; label: string }[] = [
  { value: 'protagonist', label: 'Defender' },
  { value: 'antagonist', label: 'Threat' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'evolves', label: 'Complex' },
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
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(currentFilters.search || '');

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
    setSearchInput('');
    router.push('/monsters');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchInput || null);
  };

  const hasActiveFilters =
    currentFilters.era ||
    currentFilters.alignment ||
    currentFilters.speciesType ||
    currentFilters.search;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#606070]" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search monsters by name or alias..."
            className="w-full pl-10 pr-4 py-3 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4aa]"
          />
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
            showFilters
              ? 'bg-[#00d4aa] text-[#0a0a0f]'
              : 'bg-[#12121a] text-[#f0f0f5] border border-[#2a2a3a] hover:border-[#00d4aa]/50'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#00d4aa]" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6 space-y-6 animate-fade-in">
          {/* Era Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9090a0] mb-3">Era</label>
            <div className="flex flex-wrap gap-2">
              {eras.map((era) => (
                <FilterChip
                  key={era}
                  label={era}
                  isActive={currentFilters.era === era}
                  onClick={() => updateFilters('era', currentFilters.era === era ? null : era)}
                  colorClass={getEraColorClass(era)}
                />
              ))}
            </div>
          </div>

          {/* Alignment Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9090a0] mb-3">Alignment</label>
            <div className="flex flex-wrap gap-2">
              {alignments.map(({ value, label }) => (
                <FilterChip
                  key={value}
                  label={label}
                  isActive={currentFilters.alignment === value}
                  onClick={() => updateFilters('alignment', currentFilters.alignment === value ? null : value)}
                />
              ))}
            </div>
          </div>

          {/* Species Type Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9090a0] mb-3">Type</label>
            <div className="flex flex-wrap gap-2">
              {speciesTypes.map(({ value, label }) => (
                <FilterChip
                  key={value}
                  label={label}
                  isActive={currentFilters.speciesType === value}
                  onClick={() => updateFilters('type', currentFilters.speciesType === value ? null : value)}
                />
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9090a0] mb-2">Sort by</label>
              <select
                value={currentFilters.sortBy || 'fanPowerIndex'}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="px-4 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] focus:outline-none focus:border-[#00d4aa] appearance-none cursor-pointer pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239090a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9090a0] mb-2">Order</label>
              <select
                value={currentFilters.sortOrder || 'desc'}
                onChange={(e) => updateFilters('order', e.target.value)}
                className="px-4 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[#f0f0f5] focus:outline-none focus:border-[#00d4aa] appearance-none cursor-pointer pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239090a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                }}
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2 text-sm text-[#ff4444] hover:text-[#ff6666] transition-colors mt-auto"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#606070]">Active filters:</span>
          {currentFilters.search && (
            <ActiveFilter
              label={`"${currentFilters.search}"`}
              onRemove={() => {
                setSearchInput('');
                updateFilters('search', null);
              }}
            />
          )}
          {currentFilters.era && (
            <ActiveFilter
              label={currentFilters.era}
              onRemove={() => updateFilters('era', null)}
            />
          )}
          {currentFilters.alignment && (
            <ActiveFilter
              label={alignments.find((a) => a.value === currentFilters.alignment)?.label || currentFilters.alignment}
              onRemove={() => updateFilters('alignment', null)}
            />
          )}
          {currentFilters.speciesType && (
            <ActiveFilter
              label={speciesTypes.find((t) => t.value === currentFilters.speciesType)?.label || currentFilters.speciesType}
              onRemove={() => updateFilters('type', null)}
            />
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-[#ff4444] hover:text-[#ff6666] transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  colorClass?: string;
}

function FilterChip({ label, isActive, onClick, colorClass }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        isActive
          ? colorClass || 'bg-[#00d4aa] text-[#0a0a0f]'
          : 'bg-[#1a1a25] text-[#9090a0] hover:text-[#f0f0f5] border border-[#2a2a3a] hover:border-[#00d4aa]/50'
      )}
    >
      {label}
    </button>
  );
}

interface ActiveFilterProps {
  label: string;
  onRemove: () => void;
}

function ActiveFilter({ label, onRemove }: ActiveFilterProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1a1a25] rounded text-sm text-[#f0f0f5]">
      {label}
      <button onClick={onRemove} className="hover:text-[#ff4444] transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function getEraColorClass(era: Era): string {
  const classes: Record<Era, string> = {
    Showa: 'bg-yellow-500 text-black',
    Heisei: 'bg-red-500 text-white',
    Millennium: 'bg-teal-500 text-black',
    Reiwa: 'bg-purple-500 text-white',
    Legendary: 'bg-blue-500 text-white',
    MonsterVerse: 'bg-blue-500 text-white',
    Other: 'bg-gray-500 text-white',
  };
  return classes[era] || classes.Other;
}
