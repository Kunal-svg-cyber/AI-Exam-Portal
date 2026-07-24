'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min, max, value, onChange, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {label}
            </label>
          )}
          <span className="text-sm font-semibold text-primary">{value}</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            ref={ref}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              'w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none transition-all',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
