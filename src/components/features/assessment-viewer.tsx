'use client';

import React, { useState, useEffect } from 'react';
import { useAssessment } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { QuestionRenderer } from '@/components/features/question-renderer';
import { GlassCard } from '@/components/shared/glass-card';
import { ChevronLeft, ChevronRight, CheckSquare, Clock, BookOpen, GraduationCap, CheckCircle2, Bookmark, HelpCircle, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentResult, QuestionResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { EvaluationEngine } from '@/lib/evaluation-engine';

export function AssessmentViewer() {
  const { assessment, userAnswers, setUserAnswers, setStep, setResult, showToast } = useAssessment();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [visited, setVisited] = useState<number[]>([0]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'skipped' | 'bookmarked'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep track of visited question indices to compute 'Skipped' states
  useEffect(() => {
    if (!visited.includes(currentIdx)) {
      setVisited((prev) => [...prev, currentIdx]);
    }
  }, [currentIdx, visited]);

  // Toggle Bookmark helper
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const totalSeconds = assessment ? assessment.questions.length * 120 : 0; // 2 minutes per question
  const remainingSeconds = Math.max(0, totalSeconds - secondsElapsed);

  // Timer effect
  useEffect(() => {
    if (isSubmitting) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  // Auto-submit on countdown expiry
  useEffect(() => {
    if (remainingSeconds === 0 && assessment && assessment.questions.length > 0) {
      showToast("Time has expired! Submitting your assessment automatically...", "warning");
      handleSubmit();
    }
  }, [remainingSeconds, assessment]);

  // Keyboard navigation & option selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return; // Lock shortcuts
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement;

      if (isTyping) {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          if (currentIdx < questions.length - 1) {
            handleNext();
          } else {
            handleSubmit();
          }
        }
        return;
      }

      // Navigation arrows
      if (e.key === 'ArrowLeft' && currentIdx > 0) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && currentIdx < questions.length - 1) {
        handleNext();
      }

      // Explicit navigation keys 'n' and 'p'
      if (e.key.toLowerCase() === 'n' && currentIdx < questions.length - 1) {
        e.preventDefault();
        handleNext();
      } else if (e.key.toLowerCase() === 'p' && currentIdx > 0) {
        e.preventDefault();
        handlePrev();
      }

      // Bookmark toggle with 'b'
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleBookmark(currentQuestion.id);
      }

      // Option selections (1, 2, 3, 4 for options)
      if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
        const options = currentQuestion.options || [];
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < options.length) {
          e.preventDefault();
          handleSelectAnswer(options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, assessment, userAnswers, visited, bookmarks]);

  if (!assessment) return null;
  const questions = assessment.questions;
  const currentQuestion = questions[currentIdx];

  const handleSelectAnswer = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setDirection(1);
      setCurrentIdx((prev) => prev + 1);
    }
  };

  function handleSubmit() {
    setIsSubmitting(true);
    
    // Simulate assessment grading schema validation loader
    setTimeout(() => {
      const finalResult = EvaluationEngine.evaluate(assessment, userAnswers);
      finalResult.timeTaken = secondsElapsed;
      setResult(finalResult);
      setStep('RESULTS');
    }, 2800);
  }

  const currentAnswer = userAnswers[currentQuestion.id] || '';
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  // Statistics counters
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] && userAnswers[k].trim().length > 0).length;
  const remainingCount = questions.length - answeredCount;
  const bookmarkedCount = bookmarks.length;
  const skippedCount = questions.filter((_, idx) => visited.includes(idx) && currentIdx !== idx && !(userAnswers[questions[idx].id] && userAnswers[questions[idx].id].trim().length > 0)).length;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return {
      hours: h < 10 ? `0${h}` : `${h}`,
      minutes: m < 10 ? `0${m}` : `${m}`,
      seconds: s < 10 ? `0${s}` : `${s}`,
    };
  };

  // Threshold notifications watcher
  useEffect(() => {
    if (remainingSeconds === 600) {
      showToast("Attention: 10 minutes remaining on the exam!", "warning");
    } else if (remainingSeconds === 300) {
      showToast("Warning: 5 minutes remaining! Finalize your answers.", "warning");
    } else if (remainingSeconds === 60) {
      showToast("Critical Alert: Only 1 minute remaining! Auto-submission imminent.", "error");
    }
  }, [remainingSeconds]);

  // Dynamic warning class mapper
  const getTimerStyles = (secs: number) => {
    if (secs <= 60) {
      return {
        card: "border-rose-500 bg-rose-950/15 shadow-[0_0_20px_rgba(239,68,68,0.15)] text-rose-400",
        icon: "text-rose-400 animate-bounce",
        label: "CRITICAL: Under 1 minute",
        glow: "rose" as const
      };
    }
    if (secs <= 300) {
      return {
        card: "border-orange-500/40 bg-orange-950/8 shadow-[0_0_15px_rgba(249,115,22,0.12)] text-orange-400",
        icon: "text-orange-400",
        label: "WARNING: Under 5 minutes",
        glow: "none" as const
      };
    }
    if (secs <= 600) {
      return {
        card: "border-yellow-500/30 bg-yellow-950/5 text-yellow-400",
        icon: "text-yellow-400",
        label: "ALERT: Under 10 minutes",
        glow: "none" as const
      };
    }
    return {
      card: "border-zinc-800 bg-zinc-900/20 text-zinc-300",
      icon: "text-primary",
      label: "Remaining Time",
      glow: "none" as const
    };
  };

  const timerStyle = getTimerStyles(remainingSeconds);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      
      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar (3 Columns): Question Navigator Sticky Floating Panel */}
        <div className="lg:col-span-3 space-y-6 no-print lg:sticky lg:top-6 z-20">
          <GlassCard className="p-5 border border-zinc-800 shadow-glass-md hover:shadow-primary/5 transition-all duration-300 relative" glowColor="none">
            
            {/* Title Section */}
            <div className="flex items-center justify-between mb-4 border-b border-zinc-855 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-[10px] font-extrabold text-zinc-350 uppercase tracking-widest">Question Palette</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-wider uppercase border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950">
                Exam Mode
              </span>
            </div>

            {/* Filter Selector Tabs */}
            <div className="flex gap-1 mb-4 bg-zinc-950 p-1 rounded-xl border border-zinc-900 overflow-x-auto scrollbar-none">
              {(['all', 'answered', 'skipped', 'bookmarked'] as const).map((filter) => {
                const count = filter === 'all' 
                  ? questions.length 
                  : filter === 'answered'
                    ? answeredCount
                    : filter === 'bookmarked'
                      ? bookmarks.length
                      : skippedCount;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setPaletteFilter(filter)}
                    className={cn(
                      "flex-1 text-[8px] font-extrabold uppercase py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1",
                      paletteFilter === filter
                        ? "bg-zinc-900 border border-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-350"
                    )}
                  >
                    <span>{filter}</span>
                    <span className={cn(
                      "px-1 py-0.2 rounded text-[7px] font-black",
                      paletteFilter === filter ? "bg-primary/20 text-primary" : "bg-zinc-900 text-zinc-650"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid of Navigator Squares (Responsive flex scrollable on mobile, grids on desktop) */}
            <div className="flex lg:grid lg:grid-cols-5 gap-2 max-h-[220px] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0 pr-1 scrollbar-thin">
              {questions.map((q, idx) => {
                const isSelected = currentIdx === idx;
                const isAnswered = userAnswers[q.id] && userAnswers[q.id].trim().length > 0;
                const isMarked = bookmarks.includes(q.id);
                const isSkipped = visited.includes(idx) && !isSelected && !isAnswered;

                // Apply filter criteria
                if (paletteFilter === 'answered' && !isAnswered) return null;
                if (paletteFilter === 'bookmarked' && !isMarked) return null;
                if (paletteFilter === 'skipped' && !isSkipped) return null;

                return (
                  <motion.button
                    key={q.id}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Question ${idx + 1}${isSelected ? ", active question" : ""}${isAnswered ? ", answered" : ", unanswered"}${isMarked ? ", bookmarked" : ""}${isSkipped ? ", skipped" : ""}`}
                    onClick={() => {
                      if (isSubmitting) return;
                      setDirection(idx > currentIdx ? 1 : -1);
                      setCurrentIdx(idx);
                    }}
                    className={cn(
                      "h-8.5 w-8.5 shrink-0 rounded-lg border font-extrabold text-[10px] flex items-center justify-center relative transition-all outline-none focus:ring-1 focus:ring-primary/20",
                      isSelected
                        ? "bg-zinc-950 border-primary text-white shadow-glow-blue scale-105"
                        : isAnswered
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30"
                          : isMarked
                            ? "bg-amber-950/20 border-amber-500/30 text-amber-400 hover:bg-amber-950/30"
                            : isSkipped
                              ? "bg-rose-950/15 border-dashed border-rose-500/30 text-rose-400 hover:bg-rose-950/25"
                              : "bg-zinc-900/30 border-zinc-850 text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
                    )}
                  >
                    <span>{idx + 1}</span>
                    {/* Corner dots */}
                    {isMarked && (
                      <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-amber-450" />
                    )}
                    {isAnswered && !isMarked && (
                      <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-emerald-400" />
                    )}
                    {isSkipped && !isMarked && !isAnswered && (
                      <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-rose-400 animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Status Legend Panel with Live Counts */}
            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-zinc-850/60 text-[9px] font-bold uppercase tracking-wider text-left">
              {/* Current */}
              <div className="p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Current
                </span>
                <span className="text-[10px] font-black text-white">{currentIdx + 1}</span>
              </div>
              {/* Answered */}
              <div className="p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-450" />
                  Answered
                </span>
                <span className="text-[10px] font-black text-emerald-400">{answeredCount}</span>
              </div>
              {/* Skipped */}
              <div className="p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-450 animate-pulse" />
                  Skipped
                </span>
                <span className="text-[10px] font-black text-rose-400">{skippedCount}</span>
              </div>
              {/* Bookmarked */}
              <div className="p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Bookmarked
                </span>
                <span className="text-[10px] font-black text-amber-400">{bookmarks.length}</span>
              </div>
              {/* Remaining */}
              <div className="col-span-2 p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-650" />
                  Remaining
                </span>
                <span className="text-[10px] font-black text-zinc-300">{questions.length - answeredCount}</span>
              </div>
            </div>

          </GlassCard>

          {/* Keyboard Shortcuts Card */}
          <GlassCard className="p-4 border border-zinc-850/80 shadow-glass-sm space-y-3 hidden lg:block" glowColor="none">
            <div className="flex items-center gap-2 border-b border-zinc-850 pb-2">
              <Keyboard className="h-3.5 w-3.5 text-zinc-500" />
              <h4 className="text-[9px] font-extrabold text-zinc-350 uppercase tracking-widest">Keyboard Guide</h4>
            </div>
            <div className="space-y-2 text-[10px] text-zinc-400 font-medium">
              <div className="flex justify-between items-center">
                <span>Navigate Card</span>
                <span className="flex gap-1">
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">←</kbd>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">→</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Next / Prev Key</span>
                <span className="flex gap-1">
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">N</kbd>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">P</kbd>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Select Option</span>
                <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">1-4</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Bookmark Item</span>
                <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[8px] text-zinc-300">B</kbd>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Center: Current Question (6 Columns) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Transitioning Question Space */}
          <div className="relative min-h-[350px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIdx}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <QuestionRenderer
                  question={currentQuestion}
                  value={currentAnswer}
                  onChange={handleSelectAnswer}
                  questionNumber={currentIdx + 1}
                  totalQuestions={questions.length}
                  difficulty={assessment.difficulty}
                  isBookmarked={bookmarks.includes(currentQuestion.id)}
                  onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  hasPrev={currentIdx > 0 && !isSubmitting}
                  hasNext={currentIdx < questions.length - 1 && !isSubmitting}
                  disabled={isSubmitting}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Shortcut guide underneath */}
          <div className="hidden lg:flex justify-center items-center gap-4 text-[9px] text-zinc-650 uppercase tracking-widest font-extrabold">
            <span><kbd className="bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-zinc-500">←</kbd> <kbd className="bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-zinc-500">→</kbd> Arrows Navigate</span>
            { (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
              <span><kbd className="bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded text-zinc-500">1</kbd>–<kbd className="bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded text-zinc-500">4</kbd> Select Option</span>
            )}
          </div>

        </div>

        {/* Right Sidebar (3 Columns): Stats & Meta Information */}
        {/* Right Sidebar (3 Columns): Assessment Countdown & Stats Dashboard */}
        <div className="lg:col-span-3 space-y-6 no-print">
          
          {/* Remaining Time Countdown Card */}
          <GlassCard 
            className={cn(
              "p-5 border transition-all duration-300 shadow-glass-sm text-center flex flex-col items-center justify-center gap-3 relative overflow-hidden",
              timerStyle.card,
              remainingSeconds <= 60 && "animate-[pulse_1s_infinite]"
            )}
            glowColor={timerStyle.glow}
          >
            {/* Ambient warning lights */}
            {remainingSeconds <= 60 && (
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent pointer-events-none" />
            )}
            
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">
              <Clock className={cn("h-3.5 w-3.5", timerStyle.icon)} />
              <span>{timerStyle.label}</span>
            </div>

            {/* Elite Digital Hours-Minutes-Seconds layout */}
            <div className="flex gap-2 justify-center items-center font-mono my-1.5 select-none relative z-10">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="h-11 w-11 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center text-base font-black tracking-tight text-white shadow-inner">
                  {formatTime(remainingSeconds).hours}
                </div>
                <span className="text-[7px] text-zinc-500 uppercase font-black tracking-wider mt-1">HR</span>
              </div>
              <span className="text-zinc-650 font-bold mb-3">:</span>
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="h-11 w-11 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center text-base font-black tracking-tight text-white shadow-inner">
                  {formatTime(remainingSeconds).minutes}
                </div>
                <span className="text-[7px] text-zinc-500 uppercase font-black tracking-wider mt-1">MIN</span>
              </div>
              <span className="text-zinc-650 font-bold mb-3">:</span>
              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-11 w-11 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center text-base font-black tracking-tight text-white shadow-inner",
                  remainingSeconds <= 60 && "text-rose-400"
                )}>
                  {formatTime(remainingSeconds).seconds}
                </div>
                <span className="text-[7px] text-zinc-500 uppercase font-black tracking-wider mt-1">SEC</span>
              </div>
            </div>

            {/* Under 1 minute warning caption */}
            {remainingSeconds <= 60 && (
              <span className="text-[8px] font-extrabold text-rose-500 uppercase tracking-widest animate-bounce">
                Auto-Submitting Soon
              </span>
            )}
          </GlassCard>

          {/* Assessment Context Information */}
          <GlassCard className="p-5 border border-zinc-800/80 shadow-glass-sm space-y-3" glowColor="none">
            <span className="text-[9px] font-extrabold tracking-widest text-primary uppercase">Subject Focus</span>
            <h2 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight">{assessment.title}</h2>
            
            <div className="flex items-center gap-2 border-t border-zinc-850/60 pt-2 text-xs text-zinc-400">
              <BookOpen className="h-4 w-4 text-zinc-500 shrink-0" />
              <span className="font-semibold text-zinc-350">{assessment.subject}</span>
            </div>
          </GlassCard>

          {/* Live Progress & Stats Dashboard */}
          <GlassCard className="p-5 border border-zinc-800/80 shadow-glass-sm space-y-4" glowColor="none">
            
            {/* Progress Label & Current Question Indicator */}
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
              <span>Current Question</span>
              <span className="text-zinc-500 font-extrabold">{currentIdx + 1} of {questions.length}</span>
            </div>

            {/* Horizontal Progress Track */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>COMPLETION RATE</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Detailed Stats Cards */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-zinc-850/60">
              <div className="p-2 bg-zinc-950/40 rounded-xl border border-zinc-900">
                <span className="text-base font-extrabold text-emerald-400">{answeredCount}</span>
                <span className="text-[8px] uppercase font-bold text-zinc-500 block mt-0.5">Answered</span>
              </div>
              <div className="p-2 bg-zinc-950/40 rounded-xl border border-zinc-900">
                <span className="text-base font-extrabold text-zinc-400">{remainingCount}</span>
                <span className="text-[8px] uppercase font-bold text-zinc-500 block mt-0.5">Remaining</span>
              </div>
              <div className="p-2 bg-zinc-950/40 rounded-xl border border-zinc-900">
                <span className="text-base font-extrabold text-amber-400">{bookmarkedCount}</span>
                <span className="text-[8px] uppercase font-bold text-zinc-500 block mt-0.5">Marked</span>
              </div>
            </div>

            {/* Submit Assessment Call-to-Action */}
            <Button
              variant="gradient"
              leftIcon={<CheckSquare className="h-4 w-4" />}
              onClick={() => setShowSubmitModal(true)}
              className="w-full text-xs font-bold h-10 shadow-glow-purple pt-2.5"
            >
              Submit Assessment
            </Button>
          </GlassCard>

        </div>

      </div>

      {/* Assessment Confirmation Modal Dialog */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            {/* Confirmation Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-md relative z-10"
            >
              <GlassCard className="p-8 border border-zinc-850 shadow-glass-md glow-border relative overflow-hidden" glowColor="purple">
                
                {/* Close modal X button */}
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple mb-3">
                    <CheckSquare className="h-5 w-5 text-purple" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-100">Submit Assessment?</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Review your statistics below before completing the test.
                  </p>
                </div>

                {/* Statistics Grid */}
                <div className="space-y-4 mb-6">
                  
                  {/* Grid 1: Answered & Skipped */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Answered:
                      </span>
                      <span className="font-extrabold text-emerald-400">{answeredCount}</span>
                    </div>
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-450 animate-pulse" />
                        Skipped:
                      </span>
                      <span className="font-extrabold text-rose-400">{skippedCount}</span>
                    </div>
                  </div>

                  {/* Grid 2: Bookmarked & Remaining */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Bookmarked:
                      </span>
                      <span className="font-extrabold text-amber-400">{bookmarkedCount}</span>
                    </div>
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                        Remaining:
                      </span>
                      <span className="font-extrabold text-zinc-300">{remainingCount}</span>
                    </div>
                  </div>

                  {/* Estimated Completion Box */}
                  <div className="p-4 bg-purple/5 border border-purple/20 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple uppercase tracking-wider block">Estimated Completion</span>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-normal">
                        Percentage of assessment completed.
                      </p>
                    </div>
                    <span className="text-2xl font-black text-purple">
                      {Math.round((answeredCount / questions.length) * 100)}%
                    </span>
                  </div>

                </div>

                {/* Actions: Continue / Submit */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-xs font-bold h-11"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Continue Exam
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    className="flex-1 text-xs font-bold h-11 shadow-glow-purple pt-2"
                    onClick={() => {
                      setShowSubmitModal(false);
                      handleSubmit();
                    }}
                  >
                    Submit Assessment
                  </Button>
                </div>

              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submitting Loading Overlay Panel */}
      <AnimatePresence>
        {isSubmitting && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/95 flex flex-col items-center justify-center p-6 no-print">
            {/* Shimmer style variables */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes eval-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .eval-skeleton {
                background: linear-gradient(90deg, #09090b 25%, #18181b 37%, #09090b 63%);
                background-size: 200% 100%;
                animation: eval-shimmer 1.5s infinite linear;
              }
            `}} />

            {/* Background Skeleton Dashboard mockup */}
            <div className="w-full max-w-7xl mx-auto opacity-10 pointer-events-none space-y-8 py-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="h-6 w-1/3 bg-zinc-900 rounded eval-skeleton" />
                <div className="h-6 w-24 bg-zinc-900 rounded eval-skeleton" />
              </div>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score circle card */}
                <div className="p-6 border border-zinc-900 rounded-2xl h-56 flex flex-col items-center justify-center space-y-3">
                  <div className="h-24 w-24 rounded-full bg-zinc-900 eval-skeleton" />
                  <div className="h-4 w-1/2 bg-zinc-900 rounded eval-skeleton" />
                </div>
                {/* Stats */}
                <div className="p-6 border border-zinc-900 rounded-2xl h-56 space-y-4">
                  <div className="h-10 w-full bg-zinc-900 rounded eval-skeleton" />
                  <div className="h-10 w-full bg-zinc-900 rounded eval-skeleton" />
                  <div className="h-10 w-full bg-zinc-900 rounded eval-skeleton" />
                </div>
                {/* Stacked breakdown */}
                <div className="p-6 border border-zinc-900 rounded-2xl h-56 space-y-4">
                  <div className="h-5 w-1/3 bg-zinc-900 rounded eval-skeleton" />
                  <div className="h-8 w-full bg-zinc-900 rounded eval-skeleton" />
                  <div className="h-8 w-full bg-zinc-900 rounded eval-skeleton" />
                </div>
              </div>
            </div>

            {/* Central Holographic Loading Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute z-10 w-full max-w-sm"
            >
              <GlassCard className="p-8 border border-zinc-850 shadow-glass-md glow-border relative overflow-hidden flex flex-col items-center justify-center gap-6" glowColor="purple">
                <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-transparent pointer-events-none" />
                
                {/* Glowing tech loader */}
                <div className="h-16 w-16 relative flex items-center justify-center">
                  <svg className="animate-spin h-12 w-12 text-purple" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <Brain className="h-5.5 w-5.5 text-primary absolute animate-pulse" />
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="text-sm font-extrabold text-zinc-150 uppercase tracking-widest">Assessment Submitted</h2>
                  <p className="text-xs text-purple font-black uppercase tracking-widest animate-pulse">
                    Evaluating Responses...
                  </p>
                </div>

                <p className="text-[10px] text-zinc-500 text-center leading-relaxed font-semibold max-w-[250px]">
                  Analyzing difficulty performance levels and formulating cognitive improvement strategies.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
