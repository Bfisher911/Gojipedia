'use client';

import { cn } from '@/lib/utils';
import type { FanPowerBreakdown } from '@/types';
import { Info } from 'lucide-react';
import Link from 'next/link';

interface FanPowerIndexProps {
  score: number;
  breakdown?: FanPowerBreakdown;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FanPowerIndex({
  score,
  breakdown,
  showBreakdown = false,
  size = 'md',
  className,
}: FanPowerIndexProps) {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-[#00d4aa]';
    if (value >= 75) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (value: number) => {
    if (value >= 90) return 'bg-[#00d4aa]';
    if (value >= 75) return 'bg-green-400';
    if (value >= 60) return 'bg-yellow-400';
    if (value >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const sizes = {
    sm: { score: 'text-2xl', label: 'text-[10px]' },
    md: { score: 'text-4xl', label: 'text-xs' },
    lg: { score: 'text-6xl', label: 'text-sm' },
  };

  return (
    <div className={cn('', className)}>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className={cn('font-bold', sizes[size].score, getScoreColor(score))}>
            {score}
          </div>
          <div className={cn('uppercase tracking-wider text-[#606070]', sizes[size].label)}>
            Fan Power Index
          </div>
        </div>
        <Link
          href="/about/fan-power-index"
          className="text-[#606070] hover:text-[#9090a0] transition-colors"
          title="Learn how we calculate the Fan Power Index"
        >
          <Info className="w-4 h-4" />
        </Link>
      </div>

      {showBreakdown && breakdown && (
        <div className="mt-4 space-y-2">
          <StatBar label="Durability" value={breakdown.durability} color={getBarColor(breakdown.durability)} />
          <StatBar label="Attack Power" value={breakdown.attackPower} color={getBarColor(breakdown.attackPower)} />
          <StatBar label="Mobility" value={breakdown.mobility} color={getBarColor(breakdown.mobility)} />
          <StatBar label="Intelligence" value={breakdown.intelligence} color={getBarColor(breakdown.intelligence)} />
          <StatBar label="Special" value={breakdown.specialAbilities} color={getBarColor(breakdown.specialAbilities)} />
          {breakdown.eraScaling !== 1.0 && (
            <div className="text-xs text-[#606070] mt-2">
              Era scaling factor: {breakdown.eraScaling.toFixed(2)}x
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface StatBarProps {
  label: string;
  value: number;
  color?: string;
  className?: string;
}

export function StatBar({ label, value, color = 'bg-[#00d4aa]', className }: StatBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-[#606070] w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#1a1a25] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-[#9090a0] w-8 text-right">{value}</span>
    </div>
  );
}
