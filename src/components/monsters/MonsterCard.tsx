import Link from 'next/link';
import Image from 'next/image';
import { cn, getAlignmentLabel, getAlignmentClassName, formatDate } from '@/lib/utils';
import { EraTags } from '@/components/ui/EraBadge';
import { ShoppingBag, Swords } from 'lucide-react';
import type { Monster } from '@/types';

interface MonsterCardProps {
  monster: Monster;
  showShopLink?: boolean;
  className?: string;
}

export function MonsterCard({ monster, showShopLink = true, className }: MonsterCardProps) {
  return (
    <article
      className={cn(
        'group bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00d4aa]/50 hover:shadow-lg hover:shadow-[#00d4aa]/10',
        className
      )}
    >
      {/* Image */}
      <Link href={`/monsters/${monster.slug}`} className="block relative aspect-[4/3] bg-[#1a1a25] overflow-hidden">
        {monster.primaryImageUrl ? (
          <Image
            src={monster.primaryImageUrl}
            alt={monster.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">
              {monster.speciesType === 'mech' ? '🤖' : '🦖'}
            </span>
          </div>
        )}
        {/* FPI overlay */}
        <div className="absolute top-3 right-3 bg-[#0a0a0f]/90 px-2 py-1 rounded-lg">
          <span className="text-[#00d4aa] font-bold text-sm">{monster.fanPowerIndex}</span>
          <span className="text-[#606070] text-[10px] ml-1">FPI</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Era tags */}
        <EraTags eras={monster.eraTags} limit={3} className="mb-2" />

        {/* Name and alignment */}
        <Link href={`/monsters/${monster.slug}`}>
          <h3 className="text-lg font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors">
            {monster.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className={cn('text-sm capitalize', getAlignmentClassName(monster.alignment))}>
            {getAlignmentLabel(monster.alignment)}
          </span>
          <span className="text-[#2a2a3a]">•</span>
          <span className="text-sm text-[#606070] capitalize">{monster.speciesType.replace('_', ' ')}</span>
        </div>

        {/* First appearance */}
        {monster.firstAppearanceDate && (
          <p className="text-xs text-[#606070] mt-2">
            First seen: {formatDate(monster.firstAppearanceDate, 'year')}
          </p>
        )}

        {/* Stats strip */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#2a2a3a]">
          {monster.heightMeters && (
            <div className="text-center">
              <div className="text-sm font-semibold text-[#f0f0f5]">{monster.heightMeters}m</div>
              <div className="text-[10px] text-[#606070] uppercase">Height</div>
            </div>
          )}
          {monster.weightTons && (
            <div className="text-center">
              <div className="text-sm font-semibold text-[#f0f0f5]">{(monster.weightTons / 1000).toFixed(0)}K</div>
              <div className="text-[10px] text-[#606070] uppercase">Tons</div>
            </div>
          )}
          <div className="flex-1" />
          {showShopLink && (
            <Link
              href={`/shop?monster=${monster.slug}`}
              className="flex items-center gap-1 text-xs text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
            >
              <ShoppingBag className="w-3 h-3" />
              Shop
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

interface MonsterCardCompactProps {
  monster: Monster;
  className?: string;
}

export function MonsterCardCompact({ monster, className }: MonsterCardCompactProps) {
  return (
    <Link
      href={`/monsters/${monster.slug}`}
      className={cn(
        'flex items-center gap-3 p-3 bg-[#12121a] border border-[#2a2a3a] rounded-lg hover:border-[#00d4aa]/50 transition-colors',
        className
      )}
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a25] flex-shrink-0">
        {monster.primaryImageUrl ? (
          <Image src={monster.primaryImageUrl} alt={monster.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🦖</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[#f0f0f5] truncate">{monster.name}</h4>
        <p className="text-xs text-[#606070]">{monster.eraTags.slice(0, 2).join(', ')}</p>
      </div>
      <div className="text-right">
        <div className="text-[#00d4aa] font-bold">{monster.fanPowerIndex}</div>
        <div className="text-[10px] text-[#606070]">FPI</div>
      </div>
    </Link>
  );
}
