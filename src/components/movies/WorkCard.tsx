import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { EraTags } from '@/components/ui/EraBadge';
import { Clock, ShoppingBag, Film, Calendar } from 'lucide-react';
import type { Work, Era } from '@/types';

// Get gradient colors based on the primary era
function getEraGradient(era: Era): string {
  const gradients: Record<Era, string> = {
    Showa: 'from-amber-900/30 via-yellow-800/15 to-transparent',
    Heisei: 'from-red-900/30 via-rose-800/15 to-transparent',
    Millennium: 'from-teal-900/30 via-cyan-800/15 to-transparent',
    Reiwa: 'from-purple-900/30 via-violet-800/15 to-transparent',
    Legendary: 'from-blue-900/30 via-indigo-800/15 to-transparent',
    MonsterVerse: 'from-blue-900/30 via-indigo-800/15 to-transparent',
    Other: 'from-gray-800/30 via-slate-700/15 to-transparent',
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

interface WorkCardProps {
  work: Work;
  showShopLink?: boolean;
  className?: string;
}

export function WorkCard({ work, showShopLink = true, className }: WorkCardProps) {
  const primaryEra = work.eraTags[0] as Era || 'Other';
  const eraGradient = getEraGradient(primaryEra);
  const eraAccent = getEraAccent(primaryEra);

  return (
    <article
      className={cn(
        'group relative bg-[#0d0d12] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00d4aa]/50 hover:shadow-xl hover:shadow-[#00d4aa]/10 hover:-translate-y-1',
        className
      )}
    >
      {/* Background gradient based on era */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', eraGradient)} />

      {/* Poster */}
      <Link href={`/movies/${work.slug}`} className="block relative aspect-[2/3] overflow-hidden">
        {work.posterImageUrl ? (
          <>
            <Image
              src={work.posterImageUrl}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a25] to-[#0d0d12]">
            {/* Stylized placeholder */}
            <div className={cn(
              'relative w-20 h-20 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/5',
              'border border-[#00d4aa]/20',
              'group-hover:scale-110 transition-transform duration-300'
            )}>
              <Film className={cn('w-10 h-10', eraAccent)} />
            </div>
            {/* Title as placeholder */}
            <span className={cn(
              'mt-3 text-lg font-bold text-center px-4 line-clamp-2',
              eraAccent
            )}>
              {work.title}
            </span>
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #00d4aa 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        )}

        {/* Year badge */}
        {work.releaseDate && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0a0a0f]/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-[#2a2a3a]/50">
            <Calendar className="w-3 h-3 text-[#00d4aa]" />
            <span className="text-[#f0f0f5] font-bold text-sm">
              {formatDate(work.releaseDate, 'year')}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="relative p-4">
        {/* Era tags */}
        <EraTags eras={work.eraTags} className="mb-2" />

        {/* Title */}
        <Link href={`/movies/${work.slug}`}>
          <h3 className="text-lg font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors line-clamp-2">
            {work.title}
          </h3>
        </Link>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-2 text-sm text-[#9090a0]">
          <span className="capitalize">{work.workType}</span>
          {work.runtimeMinutes && (
            <>
              <span className="text-[#2a2a3a]">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {work.runtimeMinutes}m
              </span>
            </>
          )}
        </div>

        {/* Studio */}
        {work.studio && (
          <p className="text-xs text-[#606070] mt-1.5">{work.studio}</p>
        )}

        {/* Actions */}
        {showShopLink && (
          <div className="mt-4 pt-3 border-t border-[#2a2a3a]/50">
            <Link
              href={`/shop?movie=${work.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#00d4aa] bg-[#00d4aa]/10 rounded-md hover:bg-[#00d4aa]/20 transition-colors w-fit"
            >
              <ShoppingBag className="w-3 h-3" />
              Shop this movie
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

interface WorkCardCompactProps {
  work: Work;
  className?: string;
}

export function WorkCardCompact({ work, className }: WorkCardCompactProps) {
  const primaryEra = work.eraTags[0] as Era || 'Other';
  const eraAccent = getEraAccent(primaryEra);

  return (
    <Link
      href={`/movies/${work.slug}`}
      className={cn(
        'group flex items-center gap-4 p-4 bg-[#0d0d12] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 hover:bg-[#12121a] transition-all duration-200',
        className
      )}
    >
      <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex-shrink-0 border border-[#2a2a3a]/50">
        {work.posterImageUrl ? (
          <Image src={work.posterImageUrl} alt={work.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className={cn('w-6 h-6', eraAccent)} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors truncate">
          {work.title}
        </h4>
        <p className="text-sm text-[#9090a0] mt-0.5">
          {work.releaseDate ? formatDate(work.releaseDate, 'year') : 'Unknown'}
        </p>
        <p className="text-xs text-[#606070] mt-0.5">
          {work.studio || 'Unknown Studio'}
        </p>
      </div>
    </Link>
  );
}
