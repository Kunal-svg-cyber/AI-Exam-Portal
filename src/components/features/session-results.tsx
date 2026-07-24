'use client';

import React, { useState, useEffect } from 'react';
import { useAssessment } from '@/app/providers';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft, Eye, Trash2, Calendar, Clock, Award, Sparkles, Star, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Assessment, AssessmentResult } from '@/lib/types';
import { GradedAssessmentResult } from '@/lib/evaluation-engine';

interface SavedOutcome {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  timestamp: number;
  assessment: Assessment;
  userAnswers: Record<string, string>;
  result: GradedAssessmentResult;
}

export function SessionResultsPage() {
  const { setStep, setAssessment, setUserAnswers, setResult, showToast } = useAssessment();
  const [outcomes, setOutcomes] = useState<SavedOutcome[]>([]);

  // Load outcomes from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('qf_session_outcomes');
      if (stored) {
        setOutcomes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading session outcomes', e);
    }
  }, []);

  const handleRevisit = (outcome: SavedOutcome) => {
    // Inject the saved outcome into active context state
    setAssessment(outcome.assessment);
    setUserAnswers(outcome.userAnswers);
    setResult(outcome.result);
    
    // Redirect steps to Results dashboard
    setStep('RESULTS');
    showToast(`Loaded results for: ${outcome.title}`, 'success');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click revisit trigger
    try {
      const updated = outcomes.filter(o => o.id !== id);
      setOutcomes(updated);
      window.sessionStorage.setItem('qf_session_outcomes', JSON.stringify(updated));
      showToast('Assessment result cleared from session memory.', 'info');
    } catch (err) {
      console.error('Error deleting outcome', err);
    }
  };

  const formatPace = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const getRankBadge = (percent: number) => {
    if (percent >= 90) return { title: "Groq Master", color: "text-purple border-purple/20 bg-purple-950/10", icon: Sparkles };
    if (percent >= 70) return { title: "Proficient Expert", color: "text-emerald-450 border-emerald-500/20 bg-emerald-950/10", icon: Award };
    if (percent >= 50) return { title: "Competent Analyst", color: "text-amber-400 border-amber-500/20 bg-amber-950/10", icon: Star };
    return { title: "Apprentice Scholar", color: "text-rose-455 border-rose-500/10 bg-rose-950/10", icon: AlertCircle };
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 text-left">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-850 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-zinc-50 tracking-tight flex items-center gap-2">
            <History className="h-5.5 w-5.5 text-primary" />
            Session Results Hub
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Active browser memory logs. All records are automatically cleared when this browser session ends.
          </p>
        </div>

        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => setStep('GENERATOR')}
          className="text-xs font-bold border-zinc-850 h-9"
        >
          Generator lobby
        </Button>
      </div>

      {/* Main Content list */}
      <AnimatePresence mode="wait">
        {outcomes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="py-16 text-center space-y-4"
          >
            <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-600 mx-auto">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-zinc-400">No Assessment Records Found</h3>
              <p className="text-xs text-zinc-650 max-w-xs mx-auto leading-normal">
                Complete an assessment exam inside the lobby to serialize score metrics here.
              </p>
            </div>
            <Button
              variant="gradient"
              onClick={() => setStep('GENERATOR')}
              className="text-xs font-bold h-9 pt-2"
            >
              Generate Exam
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4"
          >
            {outcomes.map((outcome, idx) => {
              const badge = getRankBadge(outcome.percentage);
              const BadgeIcon = badge.icon;
              const formattedDate = new Date(outcome.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={outcome.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleRevisit(outcome)}
                  className="cursor-pointer group"
                >
                  <GlassCard 
                    className="p-5 border border-zinc-850 hover:border-zinc-800 shadow-glass-sm hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden" 
                    glowColor="none"
                  >
                    {/* Title & Metadata details */}
                    <div className="space-y-2.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded">
                          {outcome.difficulty}
                        </span>
                        <span className={cn("text-[8px] font-black uppercase tracking-widest border px-2 py-0.5 rounded flex items-center gap-1", badge.color)}>
                          <BadgeIcon className="h-3 w-3 shrink-0" />
                          {badge.title}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-550 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                          {outcome.title}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider truncate flex items-center gap-1.5">
                          <BookOpen className="h-3 w-3 text-zinc-650" />
                          {outcome.subject}  •  {outcome.topic}
                        </p>
                      </div>
                    </div>

                    {/* Score Wheel/Ratio & Pacing stats */}
                    <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                      <div className="text-left md:text-right space-y-0.5">
                        <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest block">Accuracy Index</span>
                        <span className="text-lg font-black text-white font-mono">{outcome.percentage}%</span>
                        <span className="text-[9px] text-zinc-500 font-bold block">{outcome.score}/{outcome.totalQuestions} items</span>
                      </div>

                      <div className="text-left md:text-right space-y-0.5">
                        <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest block">Duration</span>
                        <span className="text-xs font-black text-zinc-300 font-mono flex items-center gap-1 justify-start md:justify-end">
                          <Clock className="h-3.5 w-3.5 text-zinc-500" />
                          {formatPace(outcome.timeTaken)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevisit(outcome);
                          }}
                          className="h-8.5 w-8.5 border-zinc-850 hover:border-primary/20 hover:text-white"
                          title="View analysis"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleDelete(outcome.id, e)}
                          className="h-8.5 w-8.5 border-zinc-850 hover:border-rose-500/20 hover:text-rose-455 text-zinc-500"
                          title="Clear from memory"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
