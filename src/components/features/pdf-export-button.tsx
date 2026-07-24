'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, GraduationCap, Loader2, FileText, Clock } from 'lucide-react';
import { Assessment, Question, AssessmentResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';

interface PdfExportButtonProps {
  assessment: Assessment;
  result?: AssessmentResult;
}

export function PdfExportButton({ assessment, result }: PdfExportButtonProps) {
  const [isExportingStudent, setIsExportingStudent] = useState(false);
  const [isExportingTeacher, setIsExportingTeacher] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);

  // Helper utility for string formatting inside PDF
  const cleanStr = (str?: string) => {
    return (str ?? '').replace(/[^\x00-\x7F]/g, ""); // strip non-ascii characters to avoid jsPDF encoding errors
  };

  const generatePDF = async (includeAnswers: boolean) => {
    const setLoader = includeAnswers ? setIsExportingTeacher : setIsExportingStudent;
    setLoader(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 20;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Subject: ${cleanStr(assessment.subject)} | Topic: ${cleanStr(assessment.topic)}`, margin, 12);
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2);
          doc.line(margin, 14, pageWidth - margin, 14);
          yPosition = 22;
        }
      };

      // --- PAGE 1: OFFICIAL EXAMINATION HEADER BLOCK ---
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.rect(margin, yPosition, contentWidth, 20);
      doc.line(pageWidth / 2 + 10, yPosition, pageWidth / 2 + 10, yPosition + 20);
      doc.line(margin, yPosition + 10, pageWidth / 2 + 10, yPosition + 10);
      doc.line(pageWidth / 2 + 10, yPosition + 10, pageWidth - margin, yPosition + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);

      doc.text('CANDIDATE NAME:', margin + 4, yPosition + 6.5);
      doc.text('DATE:', pageWidth / 2 + 14, yPosition + 6.5);
      doc.text('CLASS / BATCH:', margin + 4, yPosition + 16.5);
      doc.text('SCORE / MARKS:', pageWidth / 2 + 14, yPosition + 16.5);

      yPosition += 28;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('OFFICIAL ASSESSMENT SERIES', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;

      doc.setFontSize(16);
      const titleLines = doc.splitTextToSize(cleanStr(assessment.title.toUpperCase()), contentWidth);
      doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += (titleLines.length * 7) + 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      
      const timeAllowed = assessment.questions.length * 2;
      doc.text(`SUBJECT: ${cleanStr(assessment.subject?.toUpperCase())}`, margin, yPosition);
      doc.text(`TIME ALLOWED: ${timeAllowed} MINUTES`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 5;
      doc.text(`TOPIC: ${cleanStr(assessment.topic.toUpperCase())}`, margin, yPosition);
      doc.text(`DIFFICULTY: ${cleanStr(assessment.difficulty.toUpperCase())}`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 8;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.6);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      doc.setLineWidth(0.2);
      doc.line(margin, yPosition + 1.5, pageWidth - margin, yPosition + 1.5);
      yPosition += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('READ THESE INSTRUCTIONS FIRST', margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const instructions = [
        '1. Write your Candidate Name and Date clearly in the spaces provided at the top of this page.',
        '2. Answer all questions. Do not leave any question unanswered.',
        '3. For multiple-choice questions, circle or check the correct option code (A, B, C, or D) clearly.',
        '4. For fill-in-the-blank and short-answer questions, write your answers in the spaces provided.',
        '5. Do not use dictionaries, notes, or electronic devices during this examination unless explicitly directed.',
      ];

      instructions.forEach((inst) => {
        const instLines = doc.splitTextToSize(inst, contentWidth);
        doc.text(instLines, margin, yPosition);
        yPosition += (instLines.length * 4.5);
      });

      yPosition += 10;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // --- QUESTIONS SECTION ---
      assessment.questions.forEach((q: Question, idx: number) => {
        const qNum = `${idx + 1}.`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);

        const qLines = doc.splitTextToSize(cleanStr(q.questionText), contentWidth - 10);
        const qHeight = qLines.length * 5.5;

        let optionsHeight = 0;
        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          optionsHeight = (q.options?.length || 0) * 6;
        } else if (q.type === 'short-answer') {
          optionsHeight = 22;
        } else if (q.type === 'fill-in-the-blank') {
          optionsHeight = 8;
        }

        const heightNeeded = qHeight + optionsHeight + 10;
        checkPageBreak(heightNeeded);

        doc.setFont('helvetica', 'bold');
        doc.text(qNum, margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(qLines, margin + 6, yPosition);
        yPosition += qHeight + 2;

        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          (q.options || []).forEach((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            const isCorrectOption = includeAnswers && opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            
            doc.setFont('helvetica', isCorrectOption ? 'bold' : 'normal');
            doc.setTextColor(isCorrectOption ? 16 : 50, isCorrectOption ? 185 : 50, isCorrectOption ? 129 : 50);
            
            const checkboxLabel = isCorrectOption ? '[X]' : '[   ]';
            doc.text(`${checkboxLabel}  ${letter}. ${cleanStr(opt)}`, margin + 8, yPosition);
            
            yPosition += 6;
          });
        } else if (q.type === 'short-answer') {
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          for (let i = 0; i < 3; i++) {
            yPosition += 6;
            doc.line(margin + 8, yPosition, pageWidth - margin, yPosition);
          }
          yPosition += 4;
        } else if (q.type === 'fill-in-the-blank') {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9.5);
          doc.setTextColor(150, 150, 150);
          doc.text('Answer: __________________________________________________', margin + 8, yPosition);
          yPosition += 6;
        }

        yPosition += 8;
      });

      // --- PAGE N: MASTER ANSWER KEY (Educator copy only) ---
      if (includeAnswers) {
        doc.addPage();
        yPosition = 25;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('MASTER ANSWER KEY & EXPLANATIONS', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Confidential - For Educator / Grading Reference Only', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        assessment.questions.forEach((q: Question, idx: number) => {
          const qNum = `${idx + 1}.`;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);

          const promptLines = doc.splitTextToSize(`Question: ${cleanStr(q.questionText)}`, contentWidth - 10);
          const answerLines = doc.splitTextToSize(`Correct Answer: ${cleanStr(q.correctAnswer)}`, contentWidth - 15);
          const expLines = doc.splitTextToSize(`Explanation: ${cleanStr(q.explanation)}`, contentWidth - 15);

          const neededHeight = (promptLines.length * 5) + (answerLines.length * 5) + (expLines.length * 4.5) + 18;
          checkPageBreak(neededHeight);

          doc.text(qNum, margin, yPosition);
          doc.setFont('helvetica', 'bold');
          doc.text(promptLines, margin + 6, yPosition);
          yPosition += (promptLines.length * 5) + 2.5;

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(16, 185, 129);
          doc.text(answerLines, margin + 6, yPosition);
          yPosition += (answerLines.length * 5) + 2.5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          doc.text(expLines, margin + 6, yPosition);
          
          yPosition += (expLines.length * 4.5) + 8;
        });
      }

      // --- PAGE COUNT FOOTERS ---
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.25);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
        doc.text('Official assessment paper generated for curricular diagnostics and evaluation.', pageWidth / 2, pageHeight - 9, { align: 'center' });
      }

      const formattedTitle = assessment.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const suffix = includeAnswers ? 'answer_key' : 'exam_paper';
      doc.save(`qf_${formattedTitle}_${suffix}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setLoader(false);
    }
  };

  const generateReportPDF = async () => {
    if (!result) return;
    setIsExportingReport(true);

    const resData = result as any;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 20;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text(`Candidate Report: ${cleanStr(assessment.title)}`, margin, 12);
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          doc.line(margin, 14, pageWidth - margin, 14);
          yPosition = 22;
        }
      };

      // --- PAGE 1: TITLE BLOCK & METRICS DASHBOARD ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('ANTIGRAVITY COGNITIVE ASSESSMENT PLATFORM', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      const titleLines = doc.splitTextToSize(cleanStr(assessment.title.toUpperCase()), contentWidth);
      doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += (titleLines.length * 7) + 6;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
      yPosition += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`SUBJECT: ${cleanStr(assessment.subject?.toUpperCase())}`, margin, yPosition);
      doc.text(`DIFFICULTY: ${cleanStr(assessment.difficulty.toUpperCase())}`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 5;
      doc.text(`TOPIC: ${cleanStr(assessment.topic.toUpperCase())}`, margin, yPosition);
      
      const timeSecs = resData.timeTaken ?? 0;
      const min = Math.floor(timeSecs / 60);
      const sec = timeSecs % 60;
      doc.text(`TIME TAKEN: ${min}m ${sec}s`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 10;

      // Score Plate Rect Box
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPosition, contentWidth, 24, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 110, 110);
      doc.text('TOTAL SCORE', margin + 6, yPosition + 6);
      doc.text('ACCURACY', margin + 42, yPosition + 6);
      doc.text('COMPLETION', margin + 78, yPosition + 6);
      doc.text('PERFORMANCE RANK', margin + 114, yPosition + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${result.score} / ${result.totalQuestions}`, margin + 6, yPosition + 15);
      doc.text(`${result.percentage}%`, margin + 42, yPosition + 15);
      
      const skippedCount = resData.skippedCount ?? 0;
      const answeredCount = result.totalQuestions - skippedCount;
      const compRate = Math.round((answeredCount / result.totalQuestions) * 100);
      doc.text(`${compRate}%`, margin + 78, yPosition + 15);

      const getRank = (p: number) => {
        if (p >= 90) return "Groq Master";
        if (p >= 70) return "Proficient Expert";
        if (p >= 50) return "Competent Analyst";
        return "Apprentice Scholar";
      };
      doc.setFontSize(11);
      doc.text(getRank(result.percentage), margin + 114, yPosition + 15);

      yPosition += 34;

      // AI Analysis Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('AI COGNITIVE INSIGHT SUMMARY', margin, yPosition);
      yPosition += 6;

      const questionsWithMeta = result.results.map((qRes) => {
        const original = assessment.questions.find((q) => q.id === qRes.questionId);
        return {
          ...qRes,
          bloomLevel: original?.bloomLevel || 'Understanding',
          difficulty: assessment.difficulty,
        };
      });

      const bloomMap: Record<string, { correct: number; total: number }> = {};
      questionsWithMeta.forEach((q) => {
        const lvl = q.bloomLevel;
        if (!bloomMap[lvl]) bloomMap[lvl] = { correct: 0, total: 0 };
        bloomMap[lvl].total += 1;
        if (q.isCorrect) bloomMap[lvl].correct += 1;
      });

      const strongs: string[] = [];
      const weaks: string[] = [];
      Object.entries(bloomMap).forEach(([lvl, stats]) => {
        const ratio = stats.correct / stats.total;
        const txt = `${lvl} (${Math.round(ratio * 100)}% correct - ${stats.correct}/${stats.total} items)`;
        if (ratio >= 0.7) strongs.push(txt);
        else weaks.push(txt);
      });

      if (strongs.length === 0) strongs.push("None identified");
      if (weaks.length === 0) weaks.push("None (Excellent score!)");

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text('Cognitive Strengths:', margin, yPosition);
      yPosition += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      strongs.forEach((s) => {
        doc.text(`- ${s}`, margin + 4, yPosition);
        yPosition += 4;
      });
      yPosition += 3;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text('Areas for Development:', margin, yPosition);
      yPosition += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      weaks.forEach((w) => {
        doc.text(`- ${w}`, margin + 4, yPosition);
        yPosition += 4;
      });
      yPosition += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('RECOMMENDED STUDY STRATEGY', margin, yPosition);
      yPosition += 6;

      const strats: string[] = [];
      if (result.percentage < 50) {
        strats.push("Study foundational content domains. Review key concepts and distractor parameters.");
        strats.push("Construct active recall cards focusing on Bloom knowledge definitions.");
      } else if (result.percentage < 85) {
        strats.push("Target outcome gaps: Solve specific worksheets on weak Bloom levels.");
        strats.push("Examine the grade sheet review logs below, reading the custom explanations.");
      } else {
        strats.push("Advance scope: Deep dive into expert topic areas and complex implementations.");
        strats.push("Peer training: Teach these cognitive concepts to challenge your bounds.");
      }
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      strats.forEach((st, idx) => {
        const lines = doc.splitTextToSize(`${idx + 1}. ${st}`, contentWidth);
        doc.text(lines, margin, yPosition);
        yPosition += (lines.length * 4.5) + 1.5;
      });

      doc.addPage();
      yPosition = 25;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('GRADED ITEMS OUTCOME LOGS', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      result.results.forEach((qRes, idx) => {
        const qNum = `${idx + 1}.`;
        const original = assessment.questions.find((q) => q.id === qRes.questionId);
        const difficulty = assessment.difficulty;
        const bloom = original?.bloomLevel || 'Understanding';

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);

        const promptText = `[${difficulty.toUpperCase()} | ${bloom.toUpperCase()}] Question: ${cleanStr(qRes.questionText)}`;
        const pLines = doc.splitTextToSize(promptText, contentWidth - 10);
        const userAns = qRes.userAnswer || "Skipped";
        const correctAns = qRes.correctAnswer;
        
        const userAnsText = `Your Answer: ${cleanStr(userAns)}  [${qRes.isCorrect ? "CORRECT" : "INCORRECT"}]`;
        const uLines = doc.splitTextToSize(userAnsText, contentWidth - 10);
        const cLines = doc.splitTextToSize(`Correct Answer: ${cleanStr(correctAns)}`, contentWidth - 10);
        const eLines = doc.splitTextToSize(`Explanation: ${cleanStr(qRes.explanation)}`, contentWidth - 10);

        const height = (pLines.length * 5) + (uLines.length * 5) + (cLines.length * 5) + (eLines.length * 4.5) + 18;
        checkPageBreak(height);

        doc.text(qNum, margin, yPosition);
        doc.text(pLines, margin + 6, yPosition);
        yPosition += (pLines.length * 5) + 2.5;

        doc.setFont('helvetica', 'bold');
        if (qRes.isCorrect) doc.setTextColor(16, 185, 129);
        else doc.setTextColor(239, 68, 68);
        doc.text(uLines, margin + 6, yPosition);
        yPosition += (uLines.length * 5) + 2.5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text(cLines, margin + 6, yPosition);
        yPosition += (cLines.length * 5) + 2.5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(eLines, margin + 6, yPosition);
        yPosition += (eLines.length * 4.5) + 8;
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.25);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
        doc.text('Official candidate performance analytics report generated by Antigravity diagnostics.', pageWidth / 2, pageHeight - 9, { align: 'center' });
      }

      const titleSlug = assessment.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      doc.save(`qf_performance_report_${titleSlug}.pdf`);
    } catch (err) {
      console.error('Error generating report PDF:', err);
    } finally {
      setIsExportingReport(false);
    }
  };

  const isAnyExporting = isExportingStudent || isExportingTeacher || isExportingReport;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
      <Button
        variant="outline"
        onClick={() => generatePDF(false)}
        className="w-full sm:w-auto h-11 text-xs font-semibold hover:border-primary/30 border-zinc-800"
        leftIcon={isExportingStudent ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Download className="h-4 w-4" />}
        disabled={isAnyExporting}
      >
        Download Student Copy
      </Button>
      <Button
        variant="outline"
        onClick={() => generatePDF(true)}
        className="w-full sm:w-auto h-11 text-xs font-semibold border-zinc-800"
        leftIcon={isExportingTeacher ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <GraduationCap className="h-4 w-4" />}
        disabled={isAnyExporting}
      >
        Download Educator Key & Guide
      </Button>
      {result && (
        <Button
          variant="gradient"
          onClick={generateReportPDF}
          className="w-full sm:w-auto h-11 text-xs font-bold shadow-glow-purple"
          leftIcon={isExportingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          disabled={isAnyExporting}
        >
          Download Assessment Report
        </Button>
      )}

      {/* PDF Compilation Loader Overlay Modal */}
      <AnimatePresence>
        {isAnyExporting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-sm no-print">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes pdf-comp-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .pdf-shimmer-bg {
                background: linear-gradient(90deg, #18181b 25%, #27272a 37%, #18181b 63%);
                background-size: 200% 100%;
                animation: pdf-comp-shimmer 1.5s infinite linear;
              }
            `}} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm text-center relative z-10"
            >
              <GlassCard className="p-8 border border-zinc-850 shadow-glass-md glow-border relative overflow-hidden flex flex-col items-center justify-center gap-6" glowColor="blue">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                
                {/* Simulated A4 document page skeleton compiler */}
                <div className="h-28 w-20 border border-zinc-800 bg-zinc-900/50 rounded-lg p-3 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Page header lines */}
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                    <div className="h-1.5 w-6 bg-zinc-800 rounded pdf-shimmer-bg" />
                    <div className="h-1.5 w-4 bg-zinc-800 rounded pdf-shimmer-bg" />
                  </div>
                  
                  {/* Page body lines */}
                  <div className="space-y-2 py-2 flex-grow">
                    <div className="h-1.5 w-full bg-zinc-800 rounded pdf-shimmer-bg" />
                    <div className="h-1.5 w-5/6 bg-zinc-800 rounded pdf-shimmer-bg" />
                    <div className="h-1.5 w-2/3 bg-zinc-800 rounded pdf-shimmer-bg" />
                  </div>

                  {/* Page footer line */}
                  <div className="pt-1.5 border-t border-zinc-800/80">
                    <div className="h-1.5 w-1/3 bg-zinc-800 rounded pdf-shimmer-bg mx-auto" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-zinc-150 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Compiling PDF Document
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider animate-pulse">
                    {isExportingStudent ? "Formatting student question logs..." : isExportingTeacher ? "Compiling master grading criteria..." : "Assembling AI cognitive analysis pages..."}
                  </p>
                </div>

                <p className="text-[9px] text-zinc-550 leading-relaxed font-semibold max-w-[240px]">
                  Structuring layout grids and formatting text blocks to A4 print resolution bounds.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
