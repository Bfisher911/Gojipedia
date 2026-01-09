'use client';

import { cn } from '@/lib/utils';

interface AdSlotProps {
  variant: 'top' | 'infeed' | 'sidebar' | 'article';
  className?: string;
}

const sizes = {
  top: 'h-[90px]',
  infeed: 'h-[250px]',
  sidebar: 'h-[600px]',
  article: 'h-[280px]',
};

export function AdSlot({ variant, className }: AdSlotProps) {
  // In production, this would render actual ad code
  // For now, it's a placeholder that maintains layout stability
  const slotId = `ad-slot-${variant}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div
      id={slotId}
      className={cn(
        'bg-[#12121a] border border-dashed border-[#2a2a3a] rounded-lg flex items-center justify-center',
        sizes[variant],
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      <span className="text-[#606070] text-xs uppercase tracking-widest">
        Advertisement
      </span>
    </div>
  );
}
