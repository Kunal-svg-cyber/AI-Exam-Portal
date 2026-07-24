'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, RefreshCw, ShieldAlert, WifiOff, Activity } from 'lucide-react';

export type ApiConnectionState = 'not-connected' | 'connecting' | 'connected' | 'invalid' | 'network-error';

interface ApiStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  state: ApiConnectionState;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export function ApiStatus({
  state,
  showText = true,
  size = 'sm',
  className,
  ...props
}: ApiStatusProps) {
  
  const stateConfigs = {
    'not-connected': {
      color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
      dotColor: 'bg-zinc-500',
      icon: Activity,
      text: 'Not Connected',
      animation: '',
    },
    'connecting': {
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      dotColor: 'bg-amber-400',
      icon: RefreshCw,
      text: 'Connecting...',
      animation: 'animate-spin',
    },
    'connected': {
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle2,
      text: 'Connected',
      animation: 'animate-pulse',
    },
    'invalid': {
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      dotColor: 'bg-orange-400',
      icon: ShieldAlert,
      text: 'Invalid Key',
      animation: 'animate-bounce',
    },
    'network-error': {
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      dotColor: 'bg-rose-400',
      icon: WifiOff,
      text: 'Network Error',
      animation: 'animate-ping',
    },
  };

  const current = stateConfigs[state] || stateConfigs['not-connected'];
  const Icon = current.icon;

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
  };

  const containerSizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-semibold select-none transition-all duration-300',
        current.color,
        containerSizes[size],
        className
      )}
      {...props}
    >
      <div className="relative flex">
        {/* Animated outer ring for active states */}
        {current.animation && (state === 'connected' || state === 'connecting' || state === 'network-error') && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              current.dotColor,
              state === 'connected' && 'animate-ping',
              state === 'network-error' && 'animate-ping duration-500',
              state === 'connecting' && 'hidden'
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full',
            current.dotColor,
            dotSizes[size]
          )}
        />
      </div>

      <Icon className={cn('h-3.5 w-3.5 shrink-0', state === 'connecting' && 'animate-spin')} />
      
      {showText && <span>{current.text}</span>}
    </div>
  );
}
