import { cn, getEraClassName } from '@/lib/utils';
import type { Era } from '@/types';

interface EraBadgeProps {
  era: Era;
  size?: 'sm' | 'md';
  className?: string;
}

export function EraBadge({ era, size = 'sm', className }: EraBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-wide',
        getEraClassName(era),
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        className
      )}
    >
      {era}
    </span>
  );
}

interface EraTagsProps {
  eras: Era[];
  size?: 'sm' | 'md';
  limit?: number;
  className?: string;
}

export function EraTags({ eras, size = 'sm', limit, className }: EraTagsProps) {
  const displayEras = limit ? eras.slice(0, limit) : eras;
  const remaining = limit && eras.length > limit ? eras.length - limit : 0;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayEras.map((era) => (
        <EraBadge key={era} era={era} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-[#606070]">+{remaining}</span>
      )}
    </div>
  );
}
