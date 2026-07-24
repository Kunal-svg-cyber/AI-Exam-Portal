'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 pr-10 text-sm text-zinc-100 transition-all focus:border-primary/50 focus:bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-primary/30',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-medium pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
