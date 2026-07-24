'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/app/providers';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  ShieldAlert,
  ListOrdered,
  FileText,
  Brain,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export function StartExam() {
  const { assessment, setStep } = useAssessment();
  const [showRulesModal, setShowRulesModal] = useState(false);

  if (!assessment) return null;

  const totalQuestions = assessment.questions.length;
  // Calculate total duration (2 minutes per question is the standard default)
  const durationMinutes = totalQuestions * 2;

  // Extract bloom level or use default
  const bloomLevel = assessment.bloomTaxonomy || assessment.questions[0]?.bloomLevel || 'Understanding';

  // Floating animations container variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => setStep('GENERATOR')}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors group outline-none"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Generator</span>
        </button>
      </motion.div>

      {/* Main Grid Layout: 2-Columns on Desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        
        {/* Left Column (5 columns): Professional Illustration & Stats Grid */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Illustration Card */}
          <GlassCard
            className="flex-1 flex flex-col items-center justify-center p-8 border border-zinc-850 relative overflow-hidden h-[340px] sm:h-[400px]"
            glowColor="blue"
          >
            {/* Background dynamic blur gradients */}
            <div className="absolute top-[10%] left-[10%] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] h-[150px] w-[150px] rounded-full bg-purple/10 blur-[50px] pointer-events-none" />
            
            {/* Premium Animated Vector Illustration */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-full max-w-[280px] h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Holographic backdrop circle */}
                <circle cx="100" cy="95" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="animate-spin-slow origin-center opacity-40 text-cyan" />
                <circle cx="100" cy="95" r="70" stroke="currentColor" strokeWidth="0.25" strokeDasharray="8 4" className="animate-spin-reverse origin-center opacity-20 text-purple" />

                {/* Cybernetic connections */}
                <path d="M40 95h20M140 95h20M100 35v20M100 135v20" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                <circle cx="40" cy="95" r="2" fill="#3B82F6" className="animate-pulse" />
                <circle cx="160" cy="95" r="2" fill="#06B6D4" className="animate-pulse" />
                
                {/* Floating Graduation Cap */}
                <motion.g
                  animate={{
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Cap diamond */}
                  <path d="M100 50l40 18-40 18-40-18 40-18z" fill="url(#grad)" stroke="#8B5CF6" strokeWidth="1.5" className="opacity-90 shadow-lg" />
                  {/* Cap stand */}
                  <path d="M78 77v10c0 5 10 10 22 10s22-5 22-10V77" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
                  {/* Tassel */}
                  <path d="M100 68c0 4 18 12 18 20" stroke="#06B6D4" strokeWidth="1.2" strokeLinecap="round" />
                  <rect x="116" y="88" width="4" height="8" rx="1" fill="#06B6D4" />
                </motion.g>

                {/* Floating Glassmorphic Checkmark Board */}
                <motion.g
                  animate={{
                    y: [0, 6, 0],
                    rotate: [0, 1, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Glass Card Plate */}
                  <rect x="65" y="105" width="70" height="50" rx="8" fill="#18181B" fillOpacity="0.75" stroke="#27272A" strokeWidth="1.5" />
                  {/* Text lines */}
                  <line x1="77" y1="120" x2="105" y2="120" stroke="#3F3F46" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="77" y1="132" x2="123" y2="132" stroke="#3F3F46" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="77" y1="144" x2="112" y2="144" stroke="#3F3F46" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Small glowing check badge */}
                  <circle cx="120" cy="116" r="8" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
                  <path d="M117 116l2 2 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>

                {/* Floating tech nodes */}
                <circle cx="55" cy="140" r="3" fill="#3B82F6" className="opacity-70" />
                <circle cx="150" cy="65" r="4" fill="#8B5CF6" className="opacity-80 animate-pulse" />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="grad" x1="60" y1="50" x2="140" y2="86" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" stopOpacity="0.3" />
                    <stop stopColor="#3B82F6" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 mt-4 relative z-10 text-center">
              AI Evaluation Lobby
            </h4>
          </GlassCard>

          {/* Stats Summary Grid (4 items) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Stat 1: Total Questions */}
            <GlassCard className="p-4 border border-zinc-850 text-center flex flex-col justify-center items-center gap-1">
              <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">Total Questions</span>
              <span className="text-2xl font-black text-white">{totalQuestions}</span>
              <span className="text-[9px] text-zinc-400 font-semibold">{assessment.questions.filter(q => q.type === 'multiple-choice').length} MCQs included</span>
            </GlassCard>

            {/* Stat 2: Estimated Duration */}
            <GlassCard className="p-4 border border-zinc-850 text-center flex flex-col justify-center items-center gap-1">
              <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">Estimated Duration</span>
              <span className="text-2xl font-black text-primary flex items-center gap-1 justify-center">
                <Clock className="h-5 w-5 shrink-0 animate-pulse text-primary" />
                {durationMinutes} <span className="text-xs font-bold text-zinc-400">Min</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-semibold">120 seconds / question</span>
            </GlassCard>

            {/* Stat 3: Bloom Taxonomy Tier */}
            <GlassCard className="p-4 border border-zinc-850 text-center flex flex-col justify-center items-center gap-1">
              <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">Bloom Tier</span>
              <span className="text-sm font-extrabold text-purple flex items-center gap-1 mt-1 justify-center capitalize">
                <Brain className="h-4 w-4 shrink-0 text-purple" />
                {bloomLevel}
              </span>
              <span className="text-[9px] text-zinc-400 font-semibold block mt-1">Cognitive depth mapping</span>
            </GlassCard>

            {/* Stat 4: Difficulty Level */}
            <GlassCard className="p-4 border border-zinc-850 text-center flex flex-col justify-center items-center gap-1">
              <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">Difficulty</span>
              <span className="text-sm font-extrabold text-cyan flex items-center gap-1 mt-1 justify-center capitalize">
                <Award className="h-4 w-4 shrink-0 text-cyan" />
                {assessment.difficulty}
              </span>
              <span className="text-[9px] text-zinc-400 font-semibold block mt-1">Difficulty standard scale</span>
            </GlassCard>

          </div>
        </div>

        {/* Right Column (7 columns): Assessment Details, Instructions, and Action Buttons */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <GlassCard className="p-6 sm:p-8 border border-zinc-800/80 shadow-glass-md flex flex-col h-full justify-between" glowColor="purple">
            
            {/* Header section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-[10px] font-extrabold text-primary uppercase tracking-widest">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Official Examination Module
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight pt-1">
                  {assessment.title}
                </h1>
              </div>

              {/* Assessment Context attributes */}
              <div className="flex gap-6 border-b border-zinc-850 pb-4 text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-zinc-500" />
                  Subject: <span className="text-zinc-200">{assessment.subject || 'Not specified'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  Topic: <span className="text-zinc-200">{assessment.topic}</span>
                </span>
              </div>

              {/* Instructions Section */}
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListOrdered className="h-4 w-4 text-primary" />
                  Exam Instructions
                </h3>
                <ul className="space-y-2.5 text-xs text-zinc-400 leading-relaxed font-medium pl-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Ensure your workspace is quiet and free from distractions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Verify that your internet connection is stable and active before launching.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Read each question carefully before entering or selecting your response.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>You can mark questions using the bookmark icon to review them later from the Question Map.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Rules and Penalties Section */}
              <motion.div variants={itemVariants} className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  Strict Lobby Rules
                </h3>
                <div className="space-y-2.5 text-xs text-zinc-400 leading-relaxed font-medium pl-1">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>**Timed Test:** Once started, the timer cannot be paused or stopped under any circumstances.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>**Single Tab Session:** Navigating away, shifting focus, or refreshing will forfeit current progression.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>**No External Assistance:** Using unauthorized tabs or seeking external help is strictly prohibited.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>**Auto-Submission:** When the remaining time hits zero, your sheet will be instantly submitted for grading.</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Tray */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-8 mt-4 border-t border-zinc-850"
            >
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => setStep('GENERATOR')}
                className="flex-1 font-bold h-12 text-zinc-350 border-zinc-850 hover:text-white"
              >
                Back to Settings
              </Button>
              <Button
                variant="gradient"
                rightIcon={<Play className="h-4 w-4" />}
                onClick={() => setShowRulesModal(true)}
                className="flex-1 font-bold h-12 shadow-glow-purple pt-2.5 group relative overflow-hidden"
              >
                Start Exam
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Button>
            </motion.div>

          </GlassCard>
        </div>

      </motion.div>

      {/* Examination Rules Confirmation Modal Dialog */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
              className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm"
            />

            {/* Confirmation Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-md relative z-10"
            >
              <GlassCard className="p-8 border border-zinc-850 shadow-glass-md glow-border relative overflow-hidden text-left" glowColor="purple">
                
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-6 border-b border-zinc-850 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-150">Read Carefully</h2>
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block mt-0.5">Examination Rules</span>
                  </div>
                </div>

                {/* Rules Bullet List */}
                <ul className="space-y-4 text-xs text-zinc-400 font-semibold mb-8 pl-1">
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Answers cannot be viewed before submission.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Questions may be skipped.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>You may navigate freely.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Timer starts immediately.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Results appear only after submission.</span>
                  </li>
                </ul>

                {/* Actions: Cancel / Start Exam */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-xs font-bold h-11"
                    onClick={() => setShowRulesModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    className="flex-1 text-xs font-bold h-11 shadow-glow-purple pt-2"
                    onClick={() => {
                      setShowRulesModal(false);
                      setStep('TAKING');
                    }}
                  >
                    Start Exam
                  </Button>
                </div>

              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
