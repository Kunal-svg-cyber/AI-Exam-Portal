'use client';

import React from 'react';
import { useAssessment } from '@/app/providers';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { QuestionRenderer } from '@/components/features/question-renderer';
import { PdfExportButton } from './pdf-export-button';
import { RotateCcw, BookOpen, Clock, Award, CheckCircle2, XCircle, BarChart3, AlertCircle, Sparkles, Star, Brain, CheckSquare, Copy, FileJson, Printer, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ResultsDashboard() {
  const { assessment, result, resetAssessment, showToast } = useAssessment();

  // 1. Copy Entire Assessment
  const handleCopyAssessment = () => {
    if (!assessment) return;
    try {
      const text = assessment.questions.map((q, idx) => {
        let optStr = '';
        if (q.options) {
          optStr = q.options.map((o, oIdx) => `${String.fromCharCode(65 + oIdx)}) ${o}`).join('\n');
        }
        return `${idx + 1}. ${q.questionText}\n${optStr}\nCorrect Answer: ${q.correctAnswer}\nExplanation: ${q.explanation}\n`;
      }).join('\n---\n\n');

      const header = `Assessment: ${assessment.title}\nSubject: ${assessment.subject}\nTopic: ${assessment.topic}\nDifficulty: ${assessment.difficulty}\n\n`;
      navigator.clipboard.writeText(header + text);
      showToast('Entire assessment copied as formatted text!', 'success');
    } catch (e) {
      showToast('Failed to copy assessment.', 'error');
    }
  };

  // 2. Download JSON File
  const handleDownloadJson = () => {
    if (!assessment) return;
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assessment, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `qf_assessment_${assessment.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Assessment JSON downloaded successfully!', 'success');
    } catch (e) {
      showToast('Failed to download JSON.', 'error');
    }
  };

  // 3. Print
  const handlePrint = () => {
    showToast('Opening printer interface...', 'info');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement;
      if (isTyping) return;

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyAssessment();
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        handleDownloadJson();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assessment]);

  if (!result || !assessment) return null;

  const score = result.score;
  const total = result.totalQuestions;
  const percentage = result.percentage;
  
  // Custom type assertions for added GradedAssessmentResult properties
  const resData = result as any;
  const wrongCount = resData.wrongCount ?? 0;
  const skippedCount = resData.skippedCount ?? 0;
  const timeTakenSeconds = resData.timeTaken ?? 0;

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Skill Level calculations based on score
  const getSkillLevel = (percent: number) => {
    if (percent >= 90) return { level: 'Level 5: Master', stars: 5, color: 'text-purple' };
    if (percent >= 70) return { level: 'Level 4: Proficient', stars: 4, color: 'text-emerald-400' };
    if (percent >= 50) return { level: 'Level 3: Competent', stars: 3, color: 'text-amber-400' };
    return { level: 'Level 2: Novice', stars: 2, color: 'text-rose-400' };
  };

  const skill = getSkillLevel(percentage);

  // Difficulty Rating scale calculations
  const getDifficultyRating = (level: string) => {
    const norm = level.toLowerCase();
    if (norm === 'easy') return { label: 'Easy (Low Weight)', filled: 1 };
    if (norm === 'hard' || norm === 'expert') return { label: 'Hard (High Weight)', filled: 3 };
    return { label: 'Medium (Balanced)', filled: 2 };
  };

  const diffRating = getDifficultyRating(assessment.difficulty);

  // Calculate Bloom Taxonomy level distribution dynamically across generated questions
  const bloomCounts: Record<string, number> = {};
  assessment.questions.forEach((q) => {
    const lvl = q.bloomLevel || 'Understanding';
    bloomCounts[lvl] = (bloomCounts[lvl] || 0) + 1;
  });

  const bloomEntries = Object.entries(bloomCounts);
  const maxBloomVal = Math.max(...Object.values(bloomCounts), 1);

  // Completion Rate
  const answeredCount = total - skippedCount;
  const completionRate = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  // AI Cognitive & Difficulty Analysis calculations
  const analysis = React.useMemo(() => {
    const questionsWithMeta = result.results.map((qRes) => {
      const original = assessment.questions.find((q) => q.id === qRes.questionId);
      return {
        ...qRes,
        bloomLevel: original?.bloomLevel || 'Understanding',
        difficulty: assessment.difficulty,
      };
    });

    // 1. Difficulty Analysis
    const diffMap: Record<string, { correct: number; total: number }> = {};
    questionsWithMeta.forEach((q) => {
      const diff = q.difficulty.toLowerCase();
      if (!diffMap[diff]) diffMap[diff] = { correct: 0, total: 0 };
      diffMap[diff].total += 1;
      if (q.isCorrect) diffMap[diff].correct += 1;
    });

    // 2. Bloom/Cognitive Area Performance
    const bloomMap: Record<string, { correct: number; total: number }> = {};
    questionsWithMeta.forEach((q) => {
      const lvl = q.bloomLevel;
      if (!bloomMap[lvl]) bloomMap[lvl] = { correct: 0, total: 0 };
      bloomMap[lvl].total += 1;
      if (q.isCorrect) bloomMap[lvl].correct += 1;
    });

    const strongAreas: string[] = [];
    const weakAreas: string[] = [];
    Object.entries(bloomMap).forEach(([lvl, stats]) => {
      const scoreRatio = stats.correct / stats.total;
      if (scoreRatio >= 0.7) {
        strongAreas.push(`${lvl} (${Math.round(scoreRatio * 100)}% accuracy)`);
      } else {
        weakAreas.push(`${lvl} (${Math.round(scoreRatio * 100)}% accuracy)`);
      }
    });

    if (strongAreas.length === 0) strongAreas.push("None identified in this session");
    if (weakAreas.length === 0) weakAreas.push("None identified (Excellent score!)");

    // 3. Topics to Improve
    const incorrectQuestions = questionsWithMeta.filter(q => !q.isCorrect);
    const topicsToImprove = incorrectQuestions.length > 0
      ? Array.from(new Set(incorrectQuestions.map(q => {
          const text = q.questionText.toLowerCase();
          if (text.includes("react") || text.includes("component") || text.includes("hook")) return "State hooks & rendering cycle";
          if (text.includes("sql") || text.includes("query") || text.includes("database")) return "Relational query optimization";
          if (text.includes("algorithm") || text.includes("complexity") || text.includes("big o")) return "Algorithmic resource bounds";
          if (text.includes("network") || text.includes("http") || text.includes("protocol")) return "Network routing & transfer protocols";
          return `Target Question #${questionsWithMeta.indexOf(q) + 1} conceptual baseline`;
        })))
      : ["All topics mastered in this session!"];

    // 4. Study Strategy recommendations
    const strategies: string[] = [];
    if (percentage < 50) {
      strategies.push("Priority study: Read foundational course materials and review core documentation.");
      strategies.push("Formulate flashcards focusing on critical terms and Bloom memorization tiers.");
    } else if (percentage < 85) {
      strategies.push("Outcome review: Practice scenario questions relating to weak cognitive levels.");
      strategies.push("Analyze incorrect question explanations inside the Grade Sheet logs.");
    } else {
      strategies.push("Advance study: Explore expert-level topics and build small project architectures.");
      strategies.push("Set up peer-review challenges or teach these subjects to peers.");
    }
    
    if (timeTakenSeconds > (assessment.questions.length * 90)) {
      strategies.push("Time management pacing: Try timer exercises to improve response speeds.");
    } else {
      strategies.push("Double-checking pacing: You solved questions quickly. Spend extra seconds verifying edge cases.");
    }

    return {
      diffMap,
      strongAreas,
      weakAreas,
      topicsToImprove,
      strategies
    };
  }, [result, assessment, percentage, timeTakenSeconds]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-50 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Performance Analytics Deck
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Review detailed cognitive matrices, curricular alignments, and response accuracy logs.
          </p>
        </div>
        
        {/* Reset / Retry actions on top */}
        <Button
          variant="outline"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={resetAssessment}
          className="text-xs font-bold border-zinc-800 h-9 shrink-0"
        >
          Create New Assessment
        </Button>
      </div>

      {/* Analytics Cards Grid (6 Cards, 2 rows of 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
        
        {/* Card 1: Accuracy Circular Progress Indicator */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor="blue">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Overall Score & Accuracy</span>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-2xl font-black text-white tracking-tight">{percentage}%</h3>
                <span className="text-xs text-zinc-400 font-bold uppercase">Accuracy</span>
              </div>
            </div>
            
            {/* SVG Circular progress wheel */}
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-zinc-900" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path 
                  className="text-primary" 
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${percentage}, 100` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
              <span className="text-[10px] font-black text-zinc-100 font-mono">{score}/{total}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[10px] text-zinc-500 flex justify-between font-bold">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {score} Correct</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> {wrongCount} Wrong</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-zinc-650" /> {skippedCount} Skipped</span>
          </div>
        </GlassCard>

        {/* Card 2: Completion Rate & Pace Indicator */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor="none">
          <div className="space-y-3">
            <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Completion Rate & Pace</span>
            <div className="flex justify-between items-baseline">
              <h3 className="text-2xl font-black text-white tracking-tight">{completionRate}%</h3>
              <span className="text-[10px] text-zinc-400 font-bold">{answeredCount} of {total} Answered</span>
            </div>
            
            {/* Linear completion track */}
            <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[10px] text-zinc-400">
            Total Time Spent: <span className="font-extrabold text-zinc-250 font-mono flex inline-flex items-center gap-1"><Clock className="h-3 w-3 text-zinc-500 inline" /> {formatTime(timeTakenSeconds)}</span>
          </div>
        </GlassCard>

        {/* Card 3: Response Breakdown Chart */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor="none">
          <div className="space-y-3">
            <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Response Breakdown</span>
            <div className="flex justify-between items-baseline">
              <h3 className="text-2xl font-black text-zinc-100 tracking-tight">{score} Correct</h3>
              <span className="text-[10px] text-zinc-400 font-bold">{wrongCount} Incorrect</span>
            </div>
            
            {/* Stacked visual ratio bar */}
            <div className="w-full h-2 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden flex">
              <motion.div 
                className="h-full bg-emerald-500" 
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (score / total) * 100 : 0}%` }}
                transition={{ duration: 0.6 }}
                title={`Correct: ${score}`}
              />
              <motion.div 
                className="h-full bg-rose-500" 
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (wrongCount / total) * 100 : 0}%` }}
                transition={{ duration: 0.6 }}
                title={`Incorrect: ${wrongCount}`}
              />
              <motion.div 
                className="h-full bg-zinc-700" 
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (skippedCount / total) * 100 : 0}%` }}
                transition={{ duration: 0.6 }}
                title={`Skipped: ${skippedCount}`}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[9px] text-zinc-550 flex gap-3 font-extrabold uppercase">
            <span className="flex items-center gap-1"><span className="h-1 w-1 bg-emerald-500 rounded-full" /> {score} Correct</span>
            <span className="flex items-center gap-1"><span className="h-1 w-1 bg-rose-500 rounded-full" /> {wrongCount} Wrong</span>
            <span className="flex items-center gap-1"><span className="h-1 w-1 bg-zinc-650 rounded-full" /> {skippedCount} Skipped</span>
          </div>
        </GlassCard>

        {/* Card 4: Performance Badge Achievement Card */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor={
          percentage >= 90 ? "purple" : "none"
        }>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Performance Badge</span>
              
              {/* Dynamic Badge Render */}
              {(() => {
                const getBadge = (p: number) => {
                  if (p >= 90) return { title: "Groq Master", desc: "Superb mastery of cognitive concepts.", color: "text-purple", icon: Sparkles };
                  if (p >= 70) return { title: "Proficient Expert", desc: "Strong outcome alignment and logic.", color: "text-emerald-400", icon: Award };
                  if (p >= 50) return { title: "Competent Analyst", desc: "Satisfactory performance on key items.", color: "text-amber-400", icon: Star };
                  return { title: "Apprentice Scholar", desc: "Requires conceptual outcome reviews.", color: "text-rose-400", icon: AlertCircle };
                };
                const b = getBadge(percentage);
                const BIcon = b.icon;
                return (
                  <>
                    <h3 className={cn("text-lg font-black tracking-tight flex items-center gap-1.5", b.color)}>
                      <BIcon className="h-4.5 w-4.5 shrink-0" />
                      {b.title}
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-normal">{b.desc}</p>
                  </>
                );
              })()}
            </div>
            
            <div className="h-9 w-9 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple shrink-0 animate-pulse">
              <Award className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Status Rank:</span>
            <span className="text-[10px] text-zinc-300 font-extrabold uppercase">Certified Candidate</span>
          </div>
        </GlassCard>

        {/* Card 5: Topic & Curricular Alignment */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor="none">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Topic Alignment</span>
              <h3 className="text-xs font-extrabold text-zinc-200 leading-snug tracking-tight uppercase line-clamp-2">
                {assessment.topic}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[10px] text-zinc-500 flex justify-between font-bold">
            <span>Subject: {assessment.subject}</span>
            <span className="text-emerald-450">Aligned 100%</span>
          </div>
        </GlassCard>

        {/* Card 6: Bloom Taxonomy Cognitive Tier Distribution */}
        <GlassCard className="p-6 border border-zinc-800 shadow-glass-sm flex flex-col justify-between" glowColor="none">
          <div className="space-y-3">
            <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Bloom Taxonomy Matrix</span>
            
            {/* Dynamic mini bar grid */}
            <div className="space-y-2 max-h-[85px] overflow-y-auto pr-1 scrollbar-thin">
              {bloomEntries.map(([lvl, val]) => {
                const percent = Math.round((val / maxBloomVal) * 100);
                return (
                  <div key={lvl} className="space-y-0.5 text-[9px]">
                    <div className="flex justify-between text-zinc-400 font-medium">
                      <span>{lvl}</span>
                      <span className="font-extrabold text-zinc-500">{val} items</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple" 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 text-[10px] text-zinc-500 flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-zinc-650" />
            <span>Cognitive mapping complete</span>
          </div>
        </GlassCard>

      </div>

      {/* AI Performance Analysis Report */}
      <GlassCard className="p-8 border border-zinc-800 shadow-glass-md relative overflow-hidden no-print" glowColor="purple">
        {/* Holographic background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-transparent pointer-events-none" />
        
        {/* Report Header */}
        <div className="flex items-center justify-between border-b border-zinc-855 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
              <Brain className="h-5.5 w-5.5 text-purple animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-zinc-150 tracking-tight">AI Cognitive Performance Profile</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Outcome metrics and tailored study strategies generated by Antigravity AI.</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-purple uppercase tracking-widest border border-purple/20 px-2 py-0.5 rounded bg-purple-950/20">
            AI Insight Report
          </span>
        </div>

        {/* Report Grid Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Left Column: Cognitive Strengths, Weaknesses & Improvement */}
          <div className="space-y-6">
            {/* 1. Strong Areas */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Cognitive Strengths
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-350 font-semibold font-sans">
                {analysis.strongAreas.map((area, idx) => (
                  <li key={idx} className="leading-relaxed">{area}</li>
                ))}
              </ul>
            </div>

            {/* 2. Weak Areas */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Areas for Development
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-350 font-semibold font-sans">
                {analysis.weakAreas.map((area, idx) => (
                  <li key={idx} className="leading-relaxed">{area}</li>
                ))}
              </ul>
            </div>

            {/* 3. Topics to Improve */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Topics to Improve
              </h4>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {analysis.topicsToImprove.map((topic, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9px] font-extrabold px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 font-sans"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Difficulty Analysis & Study Strategy */}
          <div className="space-y-6">
            
            {/* 4. Difficulty Analysis */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Difficulty tier Accuracy Analysis
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((diff) => {
                  const stats = analysis.diffMap[diff] || { correct: 0, total: 0 };
                  const percent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                  
                  return (
                    <div key={diff} className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-extrabold text-zinc-550 uppercase tracking-wider">{diff}</span>
                      <span className={cn(
                        "text-base font-black mt-1 tracking-tight font-sans",
                        percent >= 70 ? "text-emerald-400" : percent >= 40 ? "text-amber-400" : "text-rose-455"
                      )}>
                        {percent}%
                      </span>
                      <span className="text-[8px] text-zinc-500 font-bold mt-0.5 font-mono">{stats.correct}/{stats.total} items</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Recommended Study Strategy */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple animate-pulse" />
                Recommended Study Strategy
              </h4>
              
              <div className="space-y-3">
                {analysis.strategies.map((strat, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950/30 border border-zinc-905/30 rounded-xl flex gap-3 items-start">
                    <div className="h-5 w-5 shrink-0 rounded-md bg-purple/10 border border-purple/20 flex items-center justify-center text-[9px] font-black text-purple">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-zinc-350 font-semibold leading-relaxed font-sans text-left">
                      {strat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </GlassCard>

      {/* Document Action & Export Hub */}
      <GlassCard className="p-6 border border-zinc-800 shadow-glass-md flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 no-print" glowColor="none">
        
        {/* Left Section: Printable PDF compiler */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple shrink-0">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-extrabold text-zinc-350 uppercase tracking-widest">Export Document</h4>
              <p className="text-[10px] text-zinc-500 max-w-xs leading-normal">Download candidate papers or complete answer guides.</p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0 sm:ml-auto">
            <PdfExportButton assessment={assessment} result={result} />
          </div>
        </div>

        {/* Vertical divider on desktop */}
        <div className="hidden lg:block w-px h-12 bg-zinc-850" />

        {/* Right Section: Digital Utilities toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-start lg:justify-end">
          {/* Copy Assessment Button */}
          <Button
            variant="outline"
            leftIcon={<Copy className="h-4 w-4" />}
            onClick={handleCopyAssessment}
            className="w-full sm:w-auto text-xs font-semibold h-11 border-zinc-850 hover:border-primary/20 hover:text-zinc-300 relative group"
          >
            Copy Text
            {/* Hover tooltip for shortcut */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-[8px] text-zinc-500 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ctrl+Shift+C
            </span>
          </Button>

          {/* Download JSON Button */}
          <Button
            variant="outline"
            leftIcon={<FileJson className="h-4 w-4" />}
            onClick={handleDownloadJson}
            className="w-full sm:w-auto text-xs font-semibold h-11 border-zinc-850 hover:border-primary/20 hover:text-zinc-300 relative group"
          >
            Save JSON
            {/* Hover tooltip for shortcut */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-[8px] text-zinc-500 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ctrl+Shift+J
            </span>
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            leftIcon={<Printer className="h-4 w-4" />}
            onClick={handlePrint}
            className="w-full sm:w-auto text-xs font-semibold h-11 border-zinc-850 hover:border-primary/20 hover:text-zinc-300 relative group"
          >
            Print Paper
            {/* Hover tooltip for shortcut */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-[8px] text-zinc-500 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ctrl+P
            </span>
          </Button>
        </div>

      </GlassCard>

      {/* Review Answers Grid Section */}
      <div className="space-y-6">
        <div className="border-b border-zinc-850 pb-3 flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Enterprise Assessment Review</h3>
          </div>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950">
            Outcome Mapping
          </span>
        </div>

        <div className="space-y-6">
          {result.results.map((qRes, index) => {
            const originalQuestion = assessment.questions.find(q => q.id === qRes.questionId);
            const difficulty = assessment.difficulty;
            const bloomLevel = originalQuestion?.bloomLevel || "Understanding";

            // Determine status color weights
            const isSkipped = !qRes.userAnswer || qRes.userAnswer.trim().length === 0;
            const statusStyle = isSkipped
              ? { label: "Skipped", border: "border-zinc-850 bg-zinc-900/10 text-zinc-400", bg: "bg-zinc-950/40", badge: "bg-zinc-900 border-zinc-800 text-zinc-400" }
              : qRes.isCorrect
                ? { label: "Correct", border: "border-emerald-500/30 bg-emerald-950/5 text-emerald-400", bg: "bg-emerald-950/5", badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" }
                : { label: "Incorrect", border: "border-rose-500/30 bg-rose-950/5 text-rose-400", bg: "bg-rose-950/5", badge: "bg-rose-500/10 border-rose-500/20 text-rose-455" };

            return (
              <motion.div
                key={qRes.questionId}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
                className="no-break-inside"
              >
                <GlassCard className="p-6 border border-zinc-850 shadow-glass-sm relative hover:border-zinc-800 transition-all duration-300" glowColor="none">
                  
                  {/* Card Header (Question Number + Badges) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">
                        {originalQuestion?.type?.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2">
                      {/* Difficulty Badge */}
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
                        difficulty.toLowerCase() === 'easy'
                          ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-400"
                          : difficulty.toLowerCase() === 'hard'
                            ? "border-rose-500/20 bg-rose-950/10 text-rose-405"
                            : "border-primary/20 bg-primary/10 text-primary"
                      )}>
                        {difficulty}
                      </span>

                      {/* Bloom Taxonomy Level Badge */}
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-purple/20 bg-purple/10 text-purple">
                        {bloomLevel}
                      </span>

                      {/* Correct / Wrong Badge */}
                      <span className={cn("text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border", statusStyle.badge)}>
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-sm font-bold text-zinc-200 tracking-tight leading-relaxed mb-5 text-left font-sans">
                    {qRes.questionText}
                  </h4>

                  {/* Options List (If MCQ/True-False) */}
                  {originalQuestion?.options && originalQuestion.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {originalQuestion.options.map((opt) => {
                        const isCorrectOpt = opt === originalQuestion.correctAnswer;
                        const isUserOpt = opt === qRes.userAnswer;
                        
                        return (
                          <div 
                            key={opt}
                            className={cn(
                              "p-3 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-2.5 text-left",
                              isCorrectOpt
                                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                                : isUserOpt
                                  ? "bg-rose-950/20 border-rose-500/30 text-rose-405"
                                  : "bg-zinc-950/40 border-zinc-900 text-zinc-400"
                            )}
                          >
                            <div className={cn(
                              "h-4 w-4 rounded-full flex items-center justify-center shrink-0 border text-[9px] font-black",
                              isCorrectOpt
                                ? "bg-emerald-500 border-emerald-500 text-black"
                                : isUserOpt
                                  ? "bg-rose-500 border-rose-500 text-white"
                                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            )}>
                              {isCorrectOpt ? "✓" : isUserOpt ? "✗" : ""}
                            </div>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Answer Compare Panels Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {/* Your Answer */}
                    <div className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1 text-left">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-500 block">Your Response</span>
                      <p className={cn(
                        "text-xs font-bold leading-normal",
                        isSkipped 
                          ? "text-zinc-650 italic font-semibold" 
                          : qRes.isCorrect 
                            ? "text-emerald-400" 
                            : "text-rose-455"
                      )}>
                        {qRes.userAnswer || "Skipped / Unanswered"}
                      </p>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1 text-left">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-500 block">Correct Reference</span>
                      <p className="text-xs font-bold text-emerald-400 leading-normal">
                        {qRes.correctAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Explanation card section */}
                  {qRes.explanation && qRes.explanation.trim().length > 0 && (
                    <div className="p-4 bg-purple/5 border border-purple/15 rounded-xl space-y-1.5 relative overflow-hidden text-left">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-widest text-purple">
                        <Brain className="h-3.5 w-3.5 text-purple shrink-0" />
                        <span>Outcome Explanation</span>
                      </div>
                      <p className="text-[11px] text-zinc-405 leading-relaxed font-semibold">
                        {qRes.explanation}
                      </p>
                    </div>
                  )}

                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
