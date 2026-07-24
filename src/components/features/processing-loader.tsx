'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Brain, Sparkles, BookOpen, Layers } from 'lucide-react';

const LOADING_STEPS = [
  'Connecting to AI Engine...',
  'Analyzing syllabus domains...',
  'Generating assessment matrix...',
  'Formulating cognitive questions...',
  'Calibrating bloom difficulty levels...',
  'Drafting distractor options...',
  'Generating outcomes key & explanations...',
  'Finishing final paper compile...'
];

export function ProcessingLoader() {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through step text messages
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(stepInterval);
  }, []);

  // Smoothly increment progress bar values
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 98; // Hold just before 100% until API responds
        }
        return prev + 1;
      });
    }, 140);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-label="Assessment generation in progress" className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 text-left relative">
      
      {/* Inject premium CSS shimmer keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer-effect {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #18181b 25%, #27272a 37%, #18181b 63%);
          background-size: 200% 100%;
          animation: shimmer-effect 1.4s infinite linear;
        }
        .skeleton-shimmer-subtle {
          background: linear-gradient(90deg, #09090b 25%, #18181b 37%, #09090b 63%);
          background-size: 200% 100%;
          animation: shimmer-effect 1.8s infinite linear;
        }
      `}} />

      {/* Top Banner Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-850 pb-6">
        
        {/* Step Indicator */}
        <div className="space-y-1.5 flex-grow">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Groq generation pipeline</span>
          </div>
          <div className="h-8 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 text-zinc-100 text-lg font-black tracking-tight"
              >
                <Brain className="h-5.5 w-5.5 text-primary animate-pulse" />
                <span>{LOADING_STEPS[stepIdx]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Value Counter */}
        <div className="flex flex-col items-start md:items-end justify-center shrink-0 space-y-1">
          <span className="text-[8px] font-extrabold text-zinc-550 uppercase tracking-widest">Cognitive progress</span>
          <span className="text-2xl font-black text-white font-sans tracking-tight">{progress}%</span>
        </div>

      </div>

      {/* Progress Animation Bar */}
      <div className="w-full space-y-1.5">
        <div
          className="w-full h-2 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden relative"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Generation progress: ${progress}%`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-purple to-cyan"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Shimmering Skeleton Screen layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Meta Dashboard Skeletons */}
        <div className="space-y-4 lg:col-span-1">
          <GlassCard className="p-5 border border-zinc-850/80 space-y-4" glowColor="none">
            <div className="h-4.5 w-1/3 skeleton-shimmer rounded-lg" />
            <div className="space-y-3">
              <div className="h-9 w-full skeleton-shimmer-subtle rounded-xl" />
              <div className="h-9 w-full skeleton-shimmer-subtle rounded-xl" />
              <div className="h-9 w-full skeleton-shimmer-subtle rounded-xl" />
              <div className="h-9 w-full skeleton-shimmer-subtle rounded-xl" />
            </div>
          </GlassCard>

          <GlassCard className="p-5 border border-zinc-850/40 opacity-50 space-y-2.5" glowColor="none">
            <div className="h-4 w-1/2 skeleton-shimmer rounded-lg" />
            <div className="h-3 w-full skeleton-shimmer-subtle rounded" />
            <div className="h-3 w-2/3 skeleton-shimmer-subtle rounded" />
          </GlassCard>
        </div>

        {/* Right Side: Multiple stacked question skeletons */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Skeleton Q1: MCQ */}
          <GlassCard className="p-6 border border-zinc-850/80 space-y-5" glowColor="none">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="h-5 w-8 skeleton-shimmer rounded-md" />
                <div className="h-5 w-16 skeleton-shimmer rounded-md" />
              </div>
              <div className="h-5 w-24 skeleton-shimmer-subtle rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="h-4.5 w-full skeleton-shimmer rounded" />
              <div className="h-4.5 w-5/6 skeleton-shimmer rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="h-11 w-full border border-zinc-850/30 bg-zinc-900/10 rounded-xl flex items-center px-4 gap-3">
                <div className="h-4.5 w-4.5 skeleton-shimmer rounded" />
                <div className="h-3 w-1/2 skeleton-shimmer rounded" />
              </div>
              <div className="h-11 w-full border border-zinc-850/30 bg-zinc-900/10 rounded-xl flex items-center px-4 gap-3">
                <div className="h-4.5 w-4.5 skeleton-shimmer rounded" />
                <div className="h-3 w-2/3 skeleton-shimmer rounded" />
              </div>
            </div>
          </GlassCard>

          {/* Skeleton Q2: Code Editor Shimmer */}
          <GlassCard className="p-6 border border-zinc-850/50 opacity-70 space-y-4" glowColor="none">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 skeleton-shimmer rounded-md" />
              <div className="h-5 w-16 skeleton-shimmer-subtle rounded-md" />
            </div>
            
            <div className="h-4.5 w-3/4 skeleton-shimmer rounded" />

            {/* Code editor box mockup */}
            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-2">
              <div className="h-3 w-1/3 bg-zinc-900 rounded skeleton-shimmer" />
              <div className="h-3 w-1/2 bg-zinc-900 rounded skeleton-shimmer" />
              <div className="h-3 w-2/3 bg-zinc-900 rounded skeleton-shimmer" />
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
