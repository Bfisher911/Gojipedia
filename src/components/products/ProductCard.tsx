'use client';

import Image from 'next/image';
import { cn, buildAmazonUrl } from '@/lib/utils';
import { ExternalLink, Package, Star } from 'lucide-react';
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
    const url = product.amazonUrlWithTag || buildAmazonUrl(product.asin);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className={cn(
        'group relative bg-[#0d0d12] border border-[#2a2a3a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#ff9900]/50 hover:shadow-lg hover:shadow-[#ff9900]/10 hover:-translate-y-1 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-[#1a1a25] to-[#12121a] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Stylized placeholder */}
            <div className="relative w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ff9900]/20 to-[#ff9900]/5 border border-[#ff9900]/20 group-hover:scale-110 transition-transform duration-300">
              <Package className="w-10 h-10 text-[#ff9900]/60" />
            </div>
            {/* Product name as placeholder text */}
            <span className="mt-3 text-lg font-bold text-[#ff9900]/80 text-center px-4 line-clamp-2">
              {product.title.split(' ').slice(0, 3).join(' ')}
            </span>
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #ff9900 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />
          </div>
        )}

        {/* Prime badge - enhanced */}
        {product.primeEligible && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#ff9900] text-[#0a0a0f] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shadow-lg shadow-[#ff9900]/20">
              Prime
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-[#f0f0f5] line-clamp-2 group-hover:text-[#ff9900] transition-colors leading-snug">
          {product.title}
        </h3>

        {product.brand && (
          <p className="text-xs text-[#606070] mt-1.5 flex items-center gap-1">
            <Star className="w-3 h-3 text-[#ff9900]" />
            {product.brand}
          </p>
        )}

        {reasonLine && (
          <p className="text-xs text-[#9090a0] mt-2 line-clamp-2 italic">{reasonLine}</p>
        )}

        <div className="mt-auto pt-4">
          {product.price && (
            <p className="text-xl font-bold text-[#f0f0f5] mb-3">
              {product.price}
            </p>
          )}
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff9900] to-[#ffaa22] hover:from-[#ffaa22] hover:to-[#ffbb44] text-[#0a0a0f] rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-[#ff9900]/20"
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
        'group flex gap-4 p-4 bg-[#0d0d12] border border-[#2a2a3a] rounded-xl hover:border-[#ff9900]/50 hover:bg-[#12121a] transition-all duration-200',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex-shrink-0 border border-[#2a2a3a]/50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-[#ff9900]/50" />
          </div>
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
          <h3 className="text-sm font-semibold text-[#f0f0f5] line-clamp-2 group-hover:text-[#ff9900] transition-colors">
            {product.title}
          </h3>
        </div>
        {reasonLine && (
          <p className="text-xs text-[#9090a0] mt-1 line-clamp-1">{reasonLine}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          {product.price && (
            <span className="text-[#f0f0f5] font-bold">{product.price}</span>
          )}
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-xs text-[#ff9900] hover:text-[#ffaa22] font-semibold transition-colors"
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
    <div className={cn('bg-[#ff9900]/5 border border-[#ff9900]/20 rounded-lg p-3', className)}>
      <p className="text-xs text-[#9090a0]">
        <span className="text-[#ff9900] font-medium">Affiliate Disclosure:</span>{' '}
        As an Amazon Associate, we earn from qualifying purchases. Prices and availability may change.
      </p>
    </div>
  );
}
