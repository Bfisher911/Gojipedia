import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm', className)}
    >
      <Link
        href="/"
        className="text-[#606070] hover:text-[#00d4aa] transition-colors p-1 -m-1 rounded"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[#2a2a3a]" aria-hidden="true" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-[#9090a0] hover:text-[#00d4aa] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#f0f0f5] font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
