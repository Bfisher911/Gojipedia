'use client';

import Image from 'next/image';
import { cn, buildAmazonUrl } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  reasonLine?: string;
  onTrackClick?: () => void;
  className?: string;
}

export function ProductCard({ product, reasonLine, onTrackClick, className }: ProductCardProps) {
  const handleClick = () => {
    onTrackClick?.();
    // Open Amazon link
    const url = product.amazonUrlWithTag || buildAmazonUrl(product.asin);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className={cn(
        'group bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00d4aa]/50 hover:shadow-lg hover:shadow-[#00d4aa]/10 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#1a1a25] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-20">📦</span>
          </div>
        )}
        {/* Prime badge */}
        {product.primeEligible && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#ff9900] text-[#0a0a0f] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
              Prime
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col">
        <h3 className="text-sm font-medium text-[#f0f0f5] line-clamp-2 group-hover:text-[#00d4aa] transition-colors">
          {product.title}
        </h3>

        {product.brand && (
          <p className="text-xs text-[#606070] mt-1">{product.brand}</p>
        )}

        {reasonLine && (
          <p className="text-xs text-[#9090a0] mt-2 line-clamp-2 italic">{reasonLine}</p>
        )}

        <div className="mt-auto pt-3">
          {product.price && (
            <p className="text-lg font-bold text-[#00d4aa] mb-2">{product.price}</p>
          )}
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#ff9900] hover:bg-[#ffaa22] text-[#0a0a0f] rounded-lg text-sm font-semibold transition-colors"
          >
            Check Price on Amazon
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

interface ProductCardHorizontalProps {
  product: Product;
  reasonLine?: string;
  onTrackClick?: () => void;
  className?: string;
}

export function ProductCardHorizontal({ product, reasonLine, onTrackClick, className }: ProductCardHorizontalProps) {
  const handleClick = () => {
    onTrackClick?.();
    const url = product.amazonUrlWithTag || buildAmazonUrl(product.asin);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className={cn(
        'flex gap-4 p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a25] flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {product.primeEligible && (
            <span className="bg-[#ff9900] text-[#0a0a0f] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0">
              Prime
            </span>
          )}
          <h3 className="text-sm font-medium text-[#f0f0f5] line-clamp-2">{product.title}</h3>
        </div>
        {reasonLine && (
          <p className="text-xs text-[#9090a0] mt-1 line-clamp-1">{reasonLine}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          {product.price && (
            <span className="text-[#00d4aa] font-bold">{product.price}</span>
          )}
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-xs text-[#ff9900] hover:text-[#ffaa22] font-medium transition-colors"
          >
            View on Amazon
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <div className={cn('bg-[#00d4aa]/10 border border-[#00d4aa]/30 rounded-lg p-3', className)}>
      <p className="text-xs text-[#9090a0]">
        <span className="text-[#00d4aa] font-medium">Affiliate Disclosure:</span>{' '}
        As an Amazon Associate, we earn from qualifying purchases. Prices and availability may change.
      </p>
    </div>
  );
}
