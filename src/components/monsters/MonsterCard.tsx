import Link from 'next/link';
import Image from 'next/image';
import { cn, getAlignmentLabel, getAlignmentClassName, formatDate } from '@/lib/utils';
import { EraTags } from '@/components/ui/EraBadge';
import { ShoppingBag, Zap } from 'lucide-react';
import type { Monster, Era } from '@/types';

interface MonsterCardProps {
  monster: Monster;
  showShopLink?: boolean;
  className?: string;
}

// Get gradient colors based on the primary era
function getEraGradient(era: Era): string {
  const gradients: Record<Era, string> = {
    Showa: 'from-amber-900/40 via-yellow-800/20 to-transparent',
    Heisei: 'from-red-900/40 via-rose-800/20 to-transparent',
    Millennium: 'from-teal-900/40 via-cyan-800/20 to-transparent',
    Reiwa: 'from-purple-900/40 via-violet-800/20 to-transparent',
    Legendary: 'from-blue-900/40 via-indigo-800/20 to-transparent',
    MonsterVerse: 'from-blue-900/40 via-indigo-800/20 to-transparent',
    Other: 'from-gray-800/40 via-slate-700/20 to-transparent',
  };
  return gradients[era] || gradients.Other;
}

function getEraAccent(era: Era): string {
  const accents: Record<Era, string> = {
    Showa: 'text-amber-400',
    Heisei: 'text-red-400',
    Millennium: 'text-teal-400',
    Reiwa: 'text-purple-400',
    Legendary: 'text-blue-400',
    MonsterVerse: 'text-blue-400',
    Other: 'text-gray-400',
  };
  return accents[era] || accents.Other;
}

export function MonsterCard({ monster, showShopLink = true, className }: MonsterCardProps) {
  const primaryEra = monster.eraTags[0] as Era || 'Other';
  const eraGradient = getEraGradient(primaryEra);
  const eraAccent = getEraAccent(primaryEra);

  return (
    <article
      className={cn(
        'group relative bg-[#0d0d12] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00d4aa]/60 hover:shadow-xl hover:shadow-[#00d4aa]/10 hover:-translate-y-1',
        className
      )}
    >
      {/* Background gradient based on era */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', eraGradient)} />

      {/* Decorative monster name watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className={cn(
          'text-[6rem] font-black opacity-[0.04] select-none whitespace-nowrap tracking-tighter',
          eraAccent
        )}>
          {monster.name}
        </span>
      </div>

      {/* Image area with enhanced styling */}
      <Link href={`/monsters/${monster.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        {monster.primaryImageUrl ? (
          <>
            <Image
              src={monster.primaryImageUrl}
              alt={monster.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a25] to-[#0d0d12]">
            {/* Stylized placeholder with monster initial */}
            <div className={cn(
              'relative w-24 h-24 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/5',
              'border border-[#00d4aa]/20',
              'group-hover:scale-110 transition-transform duration-300'
            )}>
              <span className={cn('text-5xl font-black', eraAccent)}>
                {monster.name.charAt(0)}
              </span>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-[#00d4aa]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #00d4aa 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        )}

        {/* FPI Badge - enhanced */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0a0a0f]/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-[#2a2a3a]/50">
          <Zap className="w-3 h-3 text-[#00d4aa]" />
          <span className="text-[#00d4aa] font-bold text-sm">{monster.fanPowerIndex}</span>
          <span className="text-[#606070] text-[10px]">FPI</span>
        </div>

        {/* Alignment indicator */}
        <div className={cn(
          'absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm',
          monster.alignment === 'protagonist' && 'bg-green-500/20 text-green-400 border border-green-500/30',
          monster.alignment === 'antagonist' && 'bg-red-500/20 text-red-400 border border-red-500/30',
          monster.alignment === 'neutral' && 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
          monster.alignment === 'evolves' && 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
        )}>
          {getAlignmentLabel(monster.alignment)}
        </div>
      </Link>

      {/* Content */}
      <div className="relative p-4">
        {/* Era tags */}
        <EraTags eras={monster.eraTags} limit={3} className="mb-2" />

        {/* Name */}
        <Link href={`/monsters/${monster.slug}`}>
          <h3 className="text-xl font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors line-clamp-1">
            {monster.name}
          </h3>
        </Link>

        {/* Type and first appearance */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm text-[#9090a0] capitalize">{monster.speciesType.replace('_', ' ')}</span>
          {monster.firstAppearanceDate && (
            <>
              <span className="text-[#2a2a3a]">•</span>
              <span className="text-sm text-[#606070]">
                {formatDate(monster.firstAppearanceDate, 'year')}
              </span>
            </>
          )}
        </div>

        {/* Stats strip - enhanced */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#2a2a3a]/50">
          {monster.heightMeters && (
            <div className="text-center">
              <div className="text-sm font-bold text-[#f0f0f5]">{monster.heightMeters}m</div>
              <div className="text-[10px] text-[#606070] uppercase tracking-wide">Height</div>
            </div>
          )}
          {monster.weightTons && (
            <div className="text-center">
              <div className="text-sm font-bold text-[#f0f0f5]">{(monster.weightTons / 1000).toFixed(0)}K</div>
              <div className="text-[10px] text-[#606070] uppercase tracking-wide">Tons</div>
            </div>
          )}
          <div className="flex-1" />
          {showShopLink && (
            <Link
              href={`/shop?monster=${monster.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#00d4aa] bg-[#00d4aa]/10 rounded-md hover:bg-[#00d4aa]/20 transition-colors"
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
  const primaryEra = monster.eraTags[0] as Era || 'Other';
  const eraAccent = getEraAccent(primaryEra);

  return (
    <Link
      href={`/monsters/${monster.slug}`}
      className={cn(
        'group flex items-center gap-3 p-3 bg-[#0d0d12] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 hover:bg-[#12121a] transition-all duration-200',
        className
      )}
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex-shrink-0 border border-[#2a2a3a]/50">
        {monster.primaryImageUrl ? (
          <Image src={monster.primaryImageUrl} alt={monster.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={cn('text-2xl font-bold', eraAccent)}>
              {monster.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors truncate">
          {monster.name}
        </h4>
        <p className="text-xs text-[#606070] truncate">{monster.eraTags.slice(0, 2).join(' • ')}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#00d4aa]" />
          <span className="text-[#00d4aa] font-bold">{monster.fanPowerIndex}</span>
        </div>
        <div className="text-[10px] text-[#606070]">FPI</div>
      </div>
    </Link>
  );
}
