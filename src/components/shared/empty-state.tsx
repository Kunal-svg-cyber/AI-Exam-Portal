'use client';

import React from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Key, HelpCircle, RefreshCw, WifiOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export type EmptyStateType = 'no-key' | 'no-questions' | 'failed' | 'no-internet';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  
  // Custom Inline SVG illustrations mapping
  const renderIllustration = () => {
    switch (type) {
      case 'no-key':
        return (
          <svg className="w-48 h-32 text-purple" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              d="M100 20v25m0 0a20 20 0 11-15 0 20 20 0 0115 0zm0 0v55m0-35h15m-15 15h10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            <rect x="55" y="85" width="90" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="100" cy="45" r="5" fill="currentColor" className="animate-pulse" />
          </svg>
        );
      case 'no-questions':
        return (
          <svg className="w-48 h-32 text-primary" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="70" y="25" width="60" height="75" rx="6" stroke="currentColor" strokeWidth="2.5" />
            <line x1="85" y1="45" x2="115" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="75" x2="105" y2="75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="130" cy="35" r="14" fill="#09090B" stroke="#00D4FF" strokeWidth="2" />
            <text x="130" y="39" fill="#00D4FF" fontSize="13" fontWeight="bold" textAnchor="middle">?</text>
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-48 h-32 text-amber-500" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="55" r="35" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6" />
            <path d="M100 35v30m0 10h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 95l15-15m65 15l-15-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'no-internet':
        return (
          <svg className="w-48 h-32 text-rose-500" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 60a40 40 0 0180 0m-70 10a25 25 0 0160 0m-50 10a10 10 0 0140 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="35" x2="140" y2="85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="85" r="4" fill="currentColor" />
          </svg>
        );
    }
  };

  // Default content texts mappers
  const getDefaultContent = () => {
    switch (type) {
      case 'no-key':
        return {
          title: title || 'Connection Required',
          desc: description || 'You must connect your Groq API Key to access active test generation parameters.',
          btn: actionLabel || 'Connect API Key',
          icon: <Key className="h-4 w-4" />,
        };
      case 'no-questions':
        return {
          title: title || 'Empty Assessment',
          desc: description || 'No questions have been loaded yet. Set your curriculum parameters and trigger generation.',
          btn: actionLabel || 'Configure Form',
          icon: <ArrowRight className="h-4 w-4" />,
        };
      case 'failed':
        return {
          title: title || 'Generation Terminated',
          desc: description || 'The assessment generator encountered an invalid schema formatting issue. Please try compiling again.',
          btn: actionLabel || 'Retry Generation',
          icon: <RefreshCw className="h-4 w-4" />,
        };
      case 'no-internet':
        return {
          title: title || 'Connection Interrupted',
          desc: description || 'Could not contact Groq completions endpoints. Verify local internet connection parameters.',
          btn: actionLabel || 'Check Status',
          icon: <WifiOff className="h-4 w-4" />,
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="flex justify-center items-center py-12 px-4 w-full">
      <GlassCard className="p-10 border border-zinc-850 shadow-glass-md max-w-lg text-center flex flex-col items-center justify-center gap-6" glowColor="none">
        
        {/* SVG Drawing container */}
        <div className="h-32 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-zinc-950/20 blur-2xl rounded-full" />
          {renderIllustration()}
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-zinc-150 tracking-tight">{content.title}</h3>
          <p className="text-xs text-zinc-550 leading-relaxed max-w-sm mx-auto">{content.desc}</p>
        </div>

        {/* Buttons actions container */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          {onAction && (
            <Button
              variant="gradient"
              leftIcon={content.icon}
              onClick={onAction}
              className="text-xs font-bold w-full sm:w-auto px-6 h-10"
            >
              {content.btn}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="text-xs font-semibold w-full sm:w-auto px-6 h-10 border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>

      </GlassCard>
    </div>
  );
}
