import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { EraTags } from '@/components/ui/EraBadge';
import { Clock, ShoppingBag } from 'lucide-react';
import type { Work } from '@/types';

interface WorkCardProps {
  work: Work;
  showShopLink?: boolean;
  className?: string;
}

export function WorkCard({ work, showShopLink = true, className }: WorkCardProps) {
  return (
    <article
      className={cn(
        'group bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00d4aa]/50 hover:shadow-lg hover:shadow-[#00d4aa]/10',
        className
      )}
    >
      {/* Poster */}
      <Link href={`/movies/${work.slug}`} className="block relative aspect-[2/3] bg-[#1a1a25] overflow-hidden">
        {work.posterImageUrl ? (
          <Image
            src={work.posterImageUrl}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">🎬</span>
          </div>
        )}
        {/* Year overlay */}
        {work.releaseDate && (
          <div className="absolute top-3 right-3 bg-[#0a0a0f]/90 px-2 py-1 rounded-lg">
            <span className="text-[#f0f0f5] font-bold text-sm">
              {formatDate(work.releaseDate, 'year')}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Era tags */}
        <EraTags eras={work.eraTags} className="mb-2" />

        {/* Title */}
        <Link href={`/movies/${work.slug}`}>
          <h3 className="text-lg font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors line-clamp-2">
            {work.title}
          </h3>
        </Link>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-2 text-sm text-[#606070]">
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
          <p className="text-xs text-[#606070] mt-1">{work.studio}</p>
        )}

        {/* Actions */}
        {showShopLink && (
          <div className="mt-3 pt-3 border-t border-[#2a2a3a]">
            <Link
              href={`/shop?movie=${work.slug}`}
              className="flex items-center gap-1 text-xs text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
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
  return (
    <Link
      href={`/movies/${work.slug}`}
      className={cn(
        'flex items-center gap-3 p-3 bg-[#12121a] border border-[#2a2a3a] rounded-lg hover:border-[#00d4aa]/50 transition-colors',
        className
      )}
    >
      <div className="relative w-12 h-16 rounded overflow-hidden bg-[#1a1a25] flex-shrink-0">
        {work.posterImageUrl ? (
          <Image src={work.posterImageUrl} alt={work.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🎬</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[#f0f0f5] truncate">{work.title}</h4>
        <p className="text-xs text-[#606070]">
          {work.releaseDate ? formatDate(work.releaseDate, 'year') : 'Unknown'} • {work.studio || 'Unknown Studio'}
        </p>
      </div>
    </Link>
  );
}
