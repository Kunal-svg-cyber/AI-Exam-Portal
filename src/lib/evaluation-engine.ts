import { Assessment, Question, QuestionResult, AssessmentResult } from './types';

export interface GradedAssessmentResult extends AssessmentResult {
  wrongCount: number;
  skippedCount: number;
  accuracy: number; // Accuracy percentage (0-100)
  timeTaken?: number; // Duration in seconds
}

export class EvaluationEngine {
  /**
   * Evaluates the assessment by comparing user answers against correct answer templates.
   * Calculates Score, Wrong counts, Skipped counts, and overall accuracy percentages.
   */
  static evaluate(
    assessment: Assessment,
    userAnswers: Record<string, string>
  ): GradedAssessmentResult {
    const questions = assessment.questions;

    const results: QuestionResult[] = questions.map((q) => {
      const rawUserAns = userAnswers[q.id] || '';
      const uAns = rawUserAns.trim();
      const cAns = q.correctAnswer.trim();

      const isSkipped = uAns.length === 0;
      let isCorrect = false;

      if (!isSkipped) {
        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          // 1. MCQ and True/False: case-insensitive exact string match
          isCorrect = uAns.toLowerCase() === cAns.toLowerCase();
        } else if (q.type === 'fill-in-the-blank') {
          // 2. Fill in the Blank: match spelling ignoring punctuation, hyphens, and spaces
          const cleanUser = uAns.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanCorrect = cAns.toLowerCase().replace(/[^a-z0-9]/g, '');
          isCorrect = cleanUser === cleanCorrect;
        } else if (q.type === 'short-answer') {
          // 3. Short Answer: conceptual checking based on keyword intersection density
          const stopWords = new Set(['the', 'and', 'a', 'of', 'to', 'in', 'is', 'that', 'it', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'this', 'are', 'was']);
          
          // Tokenize correct answer keywords of length > 3, excluding common stop words
          const keywords = cAns
            .toLowerCase()
            .split(/[^a-z0-9]+/i)
            .filter((w) => w.length > 3 && !stopWords.has(w));

          if (keywords.length === 0) {
            // Fallback to simple matching if no long keywords exist
            isCorrect = uAns.toLowerCase().includes(cAns.toLowerCase());
          } else {
            // Count how many keywords appear in the user's answer
            const matchedCount = keywords.filter((w) => uAns.toLowerCase().includes(w)).length;
            
            // Expect at least 33% keyword density matching for passing conceptual check (min 1 keyword)
            const passThreshold = Math.max(1, Math.ceil(keywords.length * 0.33));
            isCorrect = matchedCount >= passThreshold;
          }
        }
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        type: q.type,
        userAnswer: rawUserAns,
        correctAnswer: cAns,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = questions.length;
    const score = results.filter((r) => r.isCorrect).length;
    
    // Count skipped answers (empty strings)
    const skippedCount = questions.filter(
      (q) => !userAnswers[q.id] || userAnswers[q.id].trim().length === 0
    ).length;

    const wrongCount = totalQuestions - score - skippedCount;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return {
      assessmentId: assessment.id,
      score,
      wrongCount,
      skippedCount,
      totalQuestions,
      percentage,
      accuracy: percentage, // Same as percentage of correct answers
      completedAt: new Date().toISOString(),
      results,
    };
  }
}
