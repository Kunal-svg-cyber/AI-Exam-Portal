'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/app/providers';
import { Question, QuestionType } from '@/lib/types';
import { GlassCard } from '@/components/shared/glass-card';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Bookmark, Copy, Check, AlertOctagon, ChevronLeft, ChevronRight, Clock, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  showFeedback?: boolean; // True when reviewing grading results
  isCorrect?: boolean;
  
  // MCQ Card Context Attributes
  questionNumber?: number;
  totalQuestions?: number;
  difficulty?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;

  // Curriculum Reference context for Review sheets
  subject?: string;
  topic?: string;
}

// 1. Memoized MCQ / Option Selector Card
const MultipleChoiceCard = React.memo(({
  question,
  value,
  onChange,
  disabled = false,
  showFeedback = false
}: Omit<QuestionRendererProps, 'isCorrect'>) => {
  const options = question.options || [];

  return (
    <div className="grid grid-cols-1 gap-3.5" role="radiogroup" aria-label="Multiple Choice Options">
      {options.map((opt, idx) => {
        const isSelected = value === opt;
        const isCorrectOption = question.correctAnswer === opt;
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        
        let borderClass = 'border-zinc-800 bg-zinc-900/40 text-zinc-350 hover:bg-zinc-850/50 hover:border-zinc-700';
        let badgeClass = 'bg-zinc-800 border-zinc-700 text-zinc-400';
        
        if (isSelected) {
          borderClass = 'bg-zinc-900/60 border-primary/80 shadow-glow-blue text-white';
          badgeClass = 'bg-primary border-primary text-white';
        }

        // Apply feedback highlights when grading results are visible
        if (showFeedback) {
          if (isCorrectOption) {
            borderClass = 'bg-emerald-950/20 border-emerald-500/80 text-emerald-300 shadow-glow-emerald';
            badgeClass = 'bg-emerald-500 border-emerald-500 text-white';
          } else if (isSelected && !isCorrectOption) {
            borderClass = 'bg-rose-950/20 border-rose-500/80 text-rose-300';
            badgeClass = 'bg-rose-500 border-rose-500 text-white';
          } else {
            borderClass = 'border-zinc-900 bg-zinc-950/20 text-zinc-550 pointer-events-none opacity-40';
            badgeClass = 'bg-zinc-900 border-zinc-850 text-zinc-650';
          }
        }

        return (
          <motion.button
            key={idx}
            type="button"
            role="radio"
            aria-checked={isSelected}
            whileHover={{ scale: disabled || showFeedback ? 1 : 1.008 }}
            whileTap={{ scale: disabled || showFeedback ? 1 : 0.995 }}
            disabled={disabled || showFeedback}
            onClick={() => onChange?.(opt)}
            className={cn(
              "w-full text-left rounded-xl p-4 border transition-all text-xs font-semibold flex items-center justify-between outline-none focus:ring-1 focus:ring-primary/20",
              borderClass,
              (disabled || showFeedback) && 'cursor-default'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold border transition-colors",
                badgeClass
              )}>
                {letter}
              </span>
              <span>{opt}</span>
            </div>
            {isSelected && !showFeedback && (
              <motion.div
                layoutId={`indicator-${question.id}`}
                className="h-2 w-2 rounded-full bg-primary"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
});
MultipleChoiceCard.displayName = 'MultipleChoiceCard';


// 2. Memoized Short Answer Card
const ShortAnswerCard = React.memo(({
  value,
  onChange,
  disabled = false,
  showFeedback = false,
  question
}: QuestionRendererProps) => {
  return (
    <div className="space-y-3">
      {showFeedback ? (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-300">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Your Submission</span>
            <p className="whitespace-pre-wrap leading-relaxed">{value || <span className="italic text-zinc-600">Left unanswered.</span>}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20 text-xs text-emerald-300/90">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">Model Solution Target</span>
            <p className="leading-relaxed">{question.correctAnswer}</p>
          </div>
        </div>
      ) : (
        <textarea
          placeholder="Type your explanation answer here. Focus on core concepts and criteria..."
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-32 rounded-xl bg-zinc-900 border border-zinc-850 p-4 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
        />
      )}
    </div>
  );
});
ShortAnswerCard.displayName = 'ShortAnswerCard';


// 3. Memoized Fill in the Blank Card
const FillInTheBlankCard = React.memo(({
  value,
  onChange,
  disabled = false,
  showFeedback = false,
  question
}: QuestionRendererProps) => {
  return (
    <div className="space-y-3">
      {showFeedback ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-300">
            <span className="text-[9px] font-bold text-zinc-500 uppercase block mb-0.5">Your Answer</span>
            <span className="font-semibold">{value || <span className="italic text-zinc-600">Left blank.</span>}</span>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-emerald-950/10 border border-emerald-500/20 text-xs text-emerald-300">
            <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-0.5">Correct Term</span>
            <span className="font-bold">{question.correctAnswer}</span>
          </div>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Type missing phrase..."
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
        />
      )}
    </div>
  );
});
FillInTheBlankCard.displayName = 'FillInTheBlankCard';


// 4. Central Render Router
export const QuestionRenderer = React.memo(({
  question,
  value,
  onChange,
  disabled = false,
  showFeedback = false,
  isCorrect = false,
  
  // MCQ Card Context Attributes
  questionNumber,
  totalQuestions,
  difficulty = "Medium",
  isBookmarked = false,
  onToggleBookmark,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,

  subject,
  topic
}: QuestionRendererProps) => {
  const { showToast } = useAssessment();
  const [copied, setCopied] = useState(false);

  // Copy to clipboard helper
  const handleCopy = () => {
    try {
      const textToCopy = `${question.questionText}\n${
        question.options ? question.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join('\n') : ''
      }`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('Question copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
      showToast('Failed to copy question.', 'error');
    }
  };

  // Report mock alert dialog helper
  const handleReport = () => {
    showToast('Question flagged for review.', 'info');
  };

  // Color-coded difficulty badges mapper
  const getDifficultyBadge = (level: string) => {
    const norm = level.toLowerCase();
    if (norm === 'easy') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (norm === 'hard') return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    if (norm === 'expert') return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    return 'bg-blue-500/10 border-blue-500/20 text-blue-400'; // Default Medium
  };

  const bloomBadgeText = question.bloomLevel || "Understanding";
  const estimatedTimeText = question.estimatedTime || "1.5 mins";

  const renderInnerCard = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <MultipleChoiceCard
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
            showFeedback={showFeedback}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswerCard
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
            showFeedback={showFeedback}
          />
        );
      case 'fill-in-the-blank':
        return (
          <FillInTheBlankCard
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
            showFeedback={showFeedback}
          />
        );
      default:
        return <p className="text-xs text-rose-400">Unsupported question format.</p>;
    }
  };

  return (
    <GlassCard
      className={cn(
        "p-6 sm:p-8 border transition-all duration-300 shadow-glass-md relative overflow-hidden",
        showFeedback 
          ? isCorrect
            ? 'border-emerald-500/25 bg-emerald-950/2'
            : 'border-rose-500/25 bg-rose-950/2'
          : 'border-zinc-800 bg-zinc-900/10 glow-border'
      )}
      glowColor={showFeedback ? (isCorrect ? 'emerald' : 'rose') : 'blue'}
    >
      
      {/* Top Header Grid: Question Numbers, Action Badges */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-850/80 pb-4 mb-6 text-xs">
        
        {/* Left Header Column: Number Index */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-850">
            {questionNumber && totalQuestions 
              ? `Question ${questionNumber} of ${totalQuestions}` 
              : `Question Review`}
          </span>
          {showFeedback && (
            <div className="flex items-center gap-1.5">
              {isCorrect ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Correct
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <XCircle className="h-3 w-3" />
                  Incorrect
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Header Column: Badges (Difficulty, Bloom, Time, Curriculum reference) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* Curricular Reference Badge */}
          {showFeedback && subject && topic && (
            <span className="inline-flex items-center gap-1 bg-zinc-950 border border-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
              <BookOpen className="h-3.5 w-3.5 text-zinc-650 shrink-0" />
              <span>Ref: {subject} &rsaquo; {topic}</span>
            </span>
          )}

          {/* Difficulty Badge */}
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
            getDifficultyBadge(difficulty)
          )}>
            {difficulty}
          </span>

          {/* Bloom Badge */}
          <span className="inline-flex items-center gap-1 bg-purple/10 border border-purple/20 text-purple px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            {bloomBadgeText}
          </span>

          {/* Estimated Time Badge */}
          <span className="inline-flex items-center gap-1 bg-cyan/10 border border-cyan/20 text-cyan px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {estimatedTimeText}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <h3 className="text-sm sm:text-base font-semibold text-zinc-150 leading-relaxed mb-6">
        {question.questionText}
      </h3>

      {/* Interactive Choice list/Text area */}
      <div className="mb-8">
        {renderInnerCard()}
      </div>

      {/* Graded Review pedagogical explanation block */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-5 border-t border-zinc-900 space-y-2.5 text-left text-xs"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-purple uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-purple" />
            <span>Explanation Review</span>
          </div>
          <p className="text-zinc-400 leading-relaxed text-[11px] bg-zinc-950/40 p-4 rounded-xl border border-zinc-900 font-medium">
            {question.explanation}
          </p>
        </motion.div>
      )}

      {/* Bottom Actions Tray: Bookmark, Copy, Report & Card Navigations */}
      {!showFeedback && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-850/80 text-zinc-500">
          
          {/* Card Utility Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Bookmark button */}
            <button
              type="button"
              onClick={onToggleBookmark}
              className={cn(
                "p-2 rounded-lg border border-zinc-850 hover:bg-zinc-900 transition-colors hover:text-zinc-300",
                isBookmarked ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:text-amber-300' : 'bg-zinc-900/40'
              )}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
              aria-label={isBookmarked ? 'Remove bookmark from this question' : 'Bookmark this question'}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && 'fill-current')} />
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-900 transition-colors hover:text-zinc-300"
              title="Copy Question to Clipboard"
              aria-label="Copy question and options text to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* Report button */}
            <button
              type="button"
              onClick={handleReport}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-900 transition-colors hover:text-rose-400"
              title="Report Question Error"
              aria-label="Report an issue or error with this question"
            >
              <AlertOctagon className="h-4 w-4" />
            </button>

          </div>

          {/* Card Navigations */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:text-zinc-500 transition-colors hover:text-zinc-300"
              title="Previous Question"
              aria-label="Go to the previous question card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:text-zinc-500 transition-colors hover:text-zinc-300"
              title="Next Question"
              aria-label="Go to the next question card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </GlassCard>
  );
});
QuestionRenderer.displayName = 'QuestionRenderer';
