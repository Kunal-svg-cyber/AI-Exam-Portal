'use client';

import React, { useState, useEffect } from 'react';
import { useApiKey, useAssessment } from '@/app/providers';
import dynamic from 'next/dynamic';

const ApiKeyModal = dynamic(() => import('@/components/features/api-key-modal').then(mod => mod.ApiKeyModal), {
  loading: () => <div className="h-40 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const GeneratorForm = dynamic(() => import('@/components/features/generator-form').then(mod => mod.GeneratorForm), {
  loading: () => <div className="h-96 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const AssessmentViewer = dynamic(() => import('@/components/features/assessment-viewer').then(mod => mod.AssessmentViewer), {
  loading: () => <div className="h-96 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const ResultsDashboard = dynamic(() => import('@/components/features/results-dashboard').then(mod => mod.ResultsDashboard), {
  loading: () => <div className="h-96 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const StartExam = dynamic(() => import('@/components/features/start-exam').then(mod => mod.StartExam), {
  loading: () => <div className="h-96 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const ErrorView = dynamic(() => import('@/components/features/error-view').then(mod => mod.ErrorView), {
  loading: () => <div className="h-64 bg-zinc-900/20 rounded-xl animate-pulse" />
});
const SessionResultsPage = dynamic(() => import('@/components/features/session-results').then(mod => mod.SessionResultsPage), {
  loading: () => <div className="h-96 bg-zinc-900/20 rounded-xl animate-pulse" />
});
import { ProcessingLoader } from '@/components/features/processing-loader';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import {
  Sparkles,
  BookOpen,
  Keyboard,
  ShieldCheck,
  Brain,
  ArrowRight,
  GraduationCap,
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const { isKeyConnected, isHydrated } = useApiKey();
  const { step, setStep } = useAssessment();

  // Landing Page View Component
  const renderLanding = () => {
    return (
      <div className="relative py-12 md:py-24 overflow-hidden">
        {/* Floating Gradient Blobs with Premium Motion */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] left-[15%] h-[350px] w-[350px] rounded-full bg-primary/8 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -40, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[15%] h-[400px] w-[400px] rounded-full bg-purple/8 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, 20, -10, 0],
            y: [0, 20, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] left-[45%] h-[250px] w-[250px] rounded-full bg-cyan/6 blur-[90px] pointer-events-none"
        />

        <div className="max-w-5xl mx-auto text-center space-y-8 px-4 relative z-10">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-xs font-semibold text-zinc-400 select-none"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Active SDG 4 Framework
          </motion.div>

          {/* Main Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              AI-Powered <br />
              <span className="bg-gradient-to-r from-primary via-purple to-cyan bg-clip-text text-transparent">
                Assessment Platform
              </span>
            </h1>
            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Generate professional exam questions using Artificial Intelligence.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              variant="gradient"
              size="lg"
              onClick={() => {
                if (isKeyConnected) {
                  setStep('GENERATOR');
                } else {
                  setStep('KEY_SETUP');
                }
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto font-bold px-8 shadow-glow-blue"
            >
              Generate Questions
            </Button>
            <a
              href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/ui_design_system.md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl font-medium h-13 px-8 text-base border border-zinc-800 hover:bg-zinc-800/40 text-zinc-300 hover:text-foreground transition-all duration-200"
            >
              Documentation
            </a>
          </motion.div>

          {/* Premium Features Grid Section */}
          <div id="features-section" className="pt-24 space-y-8 scroll-mt-20">
            <div className="text-left max-w-xl space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Engine Capabilities</span>
              <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Designed for Modern Classrooms</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Everything you need to formulate, conduct, and print educational assessments compliant with global quality standards.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Feature 1: AI Question Generation */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-24 w-24 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow origin-center" />
                      <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                      <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                      <circle cx="50" cy="50" r="6" fill="currentColor" />
                      <circle cx="20" cy="50" r="4" fill="#8B5CF6" />
                      <circle cx="80" cy="50" r="4" fill="#06B6D4" />
                      <circle cx="50" cy="20" r="4" fill="#3B82F6" />
                      <circle cx="50" cy="80" r="4" fill="#3B82F6" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">AI Question Generation</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Harness xAI Grok to instantly generate diverse question formats tailored to your exact topics and syllabi.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 2: MCQ Generator */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-purple" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="124" height="18" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                      <circle cx="22" cy="19" r="4" fill="currentColor" />
                      <rect x="34" y="16" width="80" height="6" rx="2" fill="currentColor" fillOpacity="0.4" />
                      
                      <rect x="10" y="36" width="124" height="18" rx="4" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="1" />
                      <circle cx="22" cy="45" r="4" fill="#8B5CF6" />
                      <rect x="34" y="42" width="70" height="6" rx="2" fill="#8B5CF6" />
                      <path d="M120 42l2 2 4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">MCQ Generator</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Create multiple-choice questions with highly logical distractors and comprehensive options sheets.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 3: Coding Questions */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-cyan" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="124" height="60" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1" />
                      <circle cx="20" cy="18" r="2" fill="#EF4444" />
                      <circle cx="28" cy="18" r="2" fill="#F59E0B" />
                      <circle cx="36" cy="18" r="2" fill="#10B981" />
                      <path d="M16 34l4-4 4 4M24 46l-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="34" y1="33" x2="90" y2="33" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
                      <line x1="34" y1="41" x2="70" y2="41" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
                      <line x1="34" y1="49" x2="100" y2="49" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Coding Questions</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Evaluate technical users with algorithmic code-writing challenges containing expected syntax, logic, and solutions.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 4: Interview Questions */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-amber-500" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="15" y="15" width="50" height="40" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                      <circle cx="40" cy="30" r="6" fill="currentColor" fillOpacity="0.3" />
                      <path d="M25 46c0-4 6-6 15-6s15 2 15 6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                      
                      <rect x="79" y="25" width="50" height="40" rx="4" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="1" />
                      <circle cx="104" cy="40" r="6" fill="#F59E0B" />
                      <path d="M89 56c0-4 6-6 15-6s15 2 15 6" stroke="#F59E0B" strokeWidth="1" />
                      
                      <path d="M68 30h8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-250 uppercase tracking-wider mb-2">Interview Questions</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Generate deep technical or conversational interview questionnaires to vet understanding under mock scenarios.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 5: Question Explanations */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-rose-400" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="15" width="94" height="50" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                      <line x1="37" y1="28" x2="87" y2="28" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                      <line x1="37" y1="38" x2="107" y2="38" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                      <line x1="37" y1="48" x2="70" y2="48" stroke="#FB7185" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-250 uppercase tracking-wider mb-2">Question Explanations</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Provide in-depth pedagogical feedback for correct and incorrect answers to reinforce understanding.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 6: Bloom Taxonomy */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-24 w-36 text-emerald-400" viewBox="0 0 144 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Pyramid levels */}
                      <path d="M72 15l15 25H57l15-25z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
                      <path d="M54 44l36 0 6 10-48 0 6-10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
                      <path d="M45 58l54 0 6 10-66 0 6-10z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
                      <path d="M36 72l72 0 6 10-84 0 6-10z" fill="#34D399" fillOpacity="0.6" stroke="#34D399" strokeWidth="1" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Bloom Taxonomy</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Structure evaluations across levels: Remember, Understand, Apply, Analyze, Evaluate, and Create.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 7: Difficulty Levels */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-cyan" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="72" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                      <path d="M72 50l18-18" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" className="origin-bottom" />
                      <circle cx="72" cy="50" r="3" fill="currentColor" />
                      <rect x="25" y="10" width="34" height="12" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                      <text x="32" y="19" fill="currentColor" fontSize="7" fontWeight="bold">EASY</text>
                      <rect x="85" y="10" width="34" height="12" rx="6" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="1" />
                      <text x="91" y="19" fill="#06B6D4" fontSize="7" fontWeight="bold">EXPERT</text>
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Difficulty Levels</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Map assessments dynamically from Easy and Medium up to Hard and complex Academic Expert configurations.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 8: Export PDF */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-purple" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M45 15h40l14 14v36H45V15z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                      <path d="M85 15v14h14" stroke="currentColor" strokeWidth="1" />
                      <line x1="55" y1="36" x2="80" y2="36" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="55" y1="46" x2="70" y2="46" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                      {/* Download arrow */}
                      <path d="M72 40v14m-4-4l4 4 4-4" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Export PDF</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Compile assessments instantly into standard PDF worksheets for students or full key guides for educators.
                  </p>
                </div>
              </GlassCard>

              {/* Feature 9: Interactive Assessment */}
              <GlassCard className="p-6 text-left border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-[360px]" interactive>
                <div>
                  <div className="h-40 w-full rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-center overflow-hidden mb-5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-20 w-36 text-primary" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="15" width="104" height="42" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1" />
                      <rect x="28" y="24" width="88" height="6" rx="1.5" fill="currentColor" fillOpacity="0.3" />
                      <rect x="28" y="36" width="30" height="10" rx="3" fill="#3B82F6" />
                      <rect x="64" y="36" width="30" height="10" rx="3" fill="currentColor" fillOpacity="0.2" />
                      
                      <rect x="35" y="64" width="74" height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Interactive Assessment</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Deploy assessment sheets directly in the browser with custom option buttons and full keyboard control support.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Investor-Ready SDG-4 Section */}
          <div className="pt-32 border-t border-zinc-900 mt-20 text-left space-y-12">
            <div className="max-w-xl space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-purple">Global Impact</span>
              <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Sustainable Development Goal 4</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Democratizing advanced evaluation resources to promote inclusive, equitable learning environments and empower educators globally.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column: Interactive SDG-4 Pyramid Visual Illustration */}
              <GlassCard className="p-8 border border-zinc-850 h-[420px] flex flex-col justify-between overflow-hidden relative group" glowColor="blue">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Core Target Metrics</span>
                  <h3 className="text-xl font-bold text-zinc-100">Inclusive & Equitable Education</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    SDG Goal 4 targets global access to free, high-quality, and scalable learning tools. By routing customizable assessment builders directly through local browser sandboxes, QuestionForge AI removes expensive paywalls and enables teachers to generate tests anywhere.
                  </p>
                </div>
                
                {/* Visual SDG 4 representation */}
                <div className="h-44 w-full flex items-center justify-center relative mt-4">
                  <svg className="h-36 w-full text-primary" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="80" width="80" height="30" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
                    <rect x="110" y="40" width="80" height="70" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="210" y="10" width="80" height="100" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M50 80l60-40 100-30" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="50" cy="80" r="4" fill="#3B82F6" />
                    <circle cx="110" cy="40" r="4" fill="#8B5CF6" />
                    <circle cx="210" cy="10" r="4" fill="#06B6D4" />
                    <text x="25" y="98" fill="currentColor" fontSize="8" fontWeight="bold" opacity="0.6">EQUITY</text>
                    <text x="122" y="78" fill="currentColor" fontSize="8" fontWeight="bold" opacity="0.8">ACCESS</text>
                    <text x="225" y="63" fill="#06B6D4" fontSize="8" fontWeight="bold">QUALITY</text>
                  </svg>
                </div>
              </GlassCard>

              {/* Right Column: Mission, Vision, and How AI Helps */}
              <div className="space-y-6">
                
                {/* Mission Card */}
                <div className="flex gap-4 p-5 rounded-2xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
                    <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <polygon points="12 2 2 22 22 22" />
                      <line x1="12" y1="9" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-200">Our Mission</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      To empower educators with instant assessment-drafting assistance, cutting exam prep time down by 90% so they can spend more face-to-face time with students.
                    </p>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="flex gap-4 p-5 rounded-2xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                    <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-200">Our Vision</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      A global network of classrooms leveraging customizable AI agents to personalize testing formats, difficulty scales, and pedagogical lessons for every individual.
                    </p>
                  </div>
                </div>

                {/* AI Advantage Card */}
                <div className="flex gap-4 p-5 rounded-2xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-200">How AI Drives Education</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      AI closes learning loops by instantly explaining mistakes, analyzing conceptual misconceptions, and generating immediate, personalized feedback.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // AI Loading Screen View Component
  const renderProcessing = () => {
    return <ProcessingLoader />;
  };

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence mode="wait">
        {step === 'LANDING' && renderLanding()}
        {step === 'KEY_SETUP' && <ApiKeyModal />}
        
        {step === 'GENERATOR' && (
          isKeyConnected 
            ? <GeneratorForm /> 
            : <EmptyState type="no-key" onAction={() => setStep('KEY_SETUP')} />
        )}
        
        {step === 'PROCESSING' && renderProcessing()}
        
        {step === 'START_EXAM' && (
          assessment && assessment.questions.length > 0 
            ? <StartExam /> 
            : <EmptyState type="no-questions" onAction={() => setStep('GENERATOR')} />
        )}
        
        {step === 'TAKING' && (
          assessment && assessment.questions.length > 0 
            ? <AssessmentViewer /> 
            : <EmptyState type="no-questions" onAction={() => setStep('GENERATOR')} />
        )}
        
        {step === 'RESULTS' && (
          result 
            ? <ResultsDashboard /> 
            : <EmptyState type="failed" onAction={() => setStep('GENERATOR')} />
        )}

        {step === 'SESSION_RESULTS' && <SessionResultsPage />}
        
        {step === 'ERROR' && <ErrorView />}
      </AnimatePresence>
    </div>
  );
}
