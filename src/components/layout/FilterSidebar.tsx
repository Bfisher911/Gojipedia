'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function FilterSidebar({ children, title = 'Filters', className }: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-[#2a2a3a] rounded-lg text-sm font-medium text-[#f0f0f5] hover:border-[#00d4aa]/50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Desktop Sidebar */}
      <aside className={cn('hidden lg:block w-64 flex-shrink-0', className)}>
        <div className="sticky top-28 sidebar-filter p-5">
          <h2 className="text-lg font-bold text-[#f0f0f5] mb-4">{title}</h2>
          {children}
        </div>
      </aside>

      {/* Mobile Slide-out Panel */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#0a0a0f] border-r border-[#2a2a3a] transform transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a3a]">
              <h2 className="text-lg font-bold text-[#f0f0f5]">{title}</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#9090a0] hover:text-[#f0f0f5] hover:bg-[#12121a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2a2a3a]">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full px-4 py-2.5 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-medium text-sm hover:bg-[#00f0c0] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#2a2a3a] last:border-b-0 pb-4 mb-4 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-sm font-medium text-[#f0f0f5]">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#606070] transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'space-y-2 overflow-hidden transition-all',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface FilterOptionProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: string;
}

export function FilterOption({ label, count, checked, onChange, color }: FilterOptionProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          'w-4 h-4 rounded border-2 transition-colors flex items-center justify-center',
          checked
            ? 'bg-[#00d4aa] border-[#00d4aa]'
            : 'border-[#2a2a3a] group-hover:border-[#606070]'
        )}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-[#0a0a0f]" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
          </svg>
        )}
      </div>
      <div className="flex items-center gap-2 flex-1">
        {color && (
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-sm text-[#9090a0] group-hover:text-[#f0f0f5] transition-colors">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-[#606070]">{count}</span>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
