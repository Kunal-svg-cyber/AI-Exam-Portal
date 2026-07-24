'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  glowColor?: 'blue' | 'purple' | 'cyan' | 'none';
}

export function GlassCard({
  children,
  className,
  interactive = false,
  glowColor = 'none',
  ...props
}: GlassCardProps) {
  const glowClasses = {
    blue: 'shadow-glow-blue hover:shadow-blue-500/20',
    purple: 'shadow-glow-purple hover:shadow-purple-500/20',
    cyan: 'shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-cyan-500/20',
    none: '',
  };

  const Component = interactive ? motion.div : 'div';

  const animationProps = interactive
    ? {
        whileHover: { y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
        whileTap: { scale: 0.995 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 ease-out-expo',
        interactive ? 'glass-panel-interactive will-change-transform' : 'glass-panel',
        glowColor !== 'none' && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
