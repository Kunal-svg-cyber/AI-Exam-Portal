'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'block w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-primary/50 focus:bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-primary/30',
              leftIcon && 'pl-10',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
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

Input.displayName = 'Input';
