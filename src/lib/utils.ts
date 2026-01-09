// Utility functions for Gojipedia

import { clsx, type ClassValue } from 'clsx';
import type { Era, Alignment, FanPowerBreakdown, Monster } from '@/types';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Era utilities
export function getEraColor(era: Era): string {
  const colors: Record<Era, string> = {
    Showa: '#ffd700',
    Heisei: '#ff6b6b',
    Millennium: '#4ecdc4',
    Reiwa: '#a855f7',
    Legendary: '#3b82f6',
    MonsterVerse: '#3b82f6',
    Other: '#6b7280',
  };
  return colors[era] || colors.Other;
}

export function getEraClassName(era: Era): string {
  const classNames: Record<Era, string> = {
    Showa: 'bg-yellow-500/20 text-yellow-400',
    Heisei: 'bg-red-400/20 text-red-400',
    Millennium: 'bg-teal-400/20 text-teal-400',
    Reiwa: 'bg-purple-500/20 text-purple-400',
    Legendary: 'bg-blue-500/20 text-blue-400',
    MonsterVerse: 'bg-blue-500/20 text-blue-400',
    Other: 'bg-gray-500/20 text-gray-400',
  };
  return classNames[era] || classNames.Other;
}

// Alignment utilities
export function getAlignmentColor(alignment: Alignment): string {
  const colors: Record<Alignment, string> = {
    protagonist: '#22c55e',
    antagonist: '#ef4444',
    neutral: '#6b7280',
    evolves: '#a855f7',
  };
  return colors[alignment];
}

export function getAlignmentClassName(alignment: Alignment): string {
  const classNames: Record<Alignment, string> = {
    protagonist: 'text-green-500',
    antagonist: 'text-red-500',
    neutral: 'text-gray-400',
    evolves: 'text-purple-500',
  };
  return classNames[alignment];
}

export function getAlignmentLabel(alignment: Alignment): string {
  const labels: Record<Alignment, string> = {
    protagonist: 'Defender',
    antagonist: 'Threat',
    neutral: 'Neutral',
    evolves: 'Complex',
  };
  return labels[alignment];
}

// Fan Power Index calculation
export function calculateFanPowerIndex(monster: Monster): FanPowerBreakdown {
  const weights = {
    durability: 0.2,
    attackPower: 0.25,
    mobility: 0.15,
    intelligence: 0.15,
    specialAbilities: 0.25,
  };

  const baseScore =
    monster.durabilityScore * weights.durability +
    monster.attackPowerScore * weights.attackPower +
    monster.mobilityScore * weights.mobility +
    monster.intelligenceScore * weights.intelligence +
    monster.specialAbilitiesScore * weights.specialAbilities;

  const scaledScore = Math.round(baseScore * monster.eraScalingFactor);
  const total = Math.min(100, Math.max(0, scaledScore));

  return {
    total,
    durability: monster.durabilityScore,
    attackPower: monster.attackPowerScore,
    mobility: monster.mobilityScore,
    intelligence: monster.intelligenceScore,
    specialAbilities: monster.specialAbilitiesScore,
    eraScaling: monster.eraScalingFactor,
  };
}

// Date formatting
export function formatDate(date: Date | string | null, format: 'full' | 'year' | 'short' = 'full'): string {
  if (!date) return 'Unknown';
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'year') {
    return d.getFullYear().toString();
  }

  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Slug utilities
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Number formatting
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatHeight(meters: number | null): string {
  if (!meters) return 'Unknown';
  const feet = Math.round(meters * 3.28084);
  return `${meters}m (${feet}ft)`;
}

export function formatWeight(tons: number | null): string {
  if (!tons) return 'Unknown';
  const formattedTons = tons.toLocaleString();
  return `${formattedTons} tons`;
}

// Amazon URL helper
export function buildAmazonUrl(asin: string, tag?: string): string {
  const associateTag = tag || process.env.AMAZON_ASSOCIATE_TAG || 'gojipedia-20';
  return `https://www.amazon.com/dp/${asin}?tag=${associateTag}`;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// Get reading time estimate
export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Group by helper
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// Sort by date helper
export function sortByDate<T>(
  array: T[],
  getDate: (item: T) => Date | null | undefined,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...array].sort((a, b) => {
    const dateA = getDate(a)?.getTime() || 0;
    const dateB = getDate(b)?.getTime() || 0;
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

// Environment helpers
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
