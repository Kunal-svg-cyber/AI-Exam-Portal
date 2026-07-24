export type QuestionType = 'multiple-choice' | 'short-answer' | 'true-false' | 'fill-in-the-blank';

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // Used for multiple-choice and true-false questions
  correctAnswer: string; // The text of the correct answer or choice
  explanation: string; // Dynamic AI justification for the correct answer
  bloomLevel?: string; // Bloom cognitive taxonomy level
  estimatedTime?: string; // Estimated time to solve
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  educationalLevel: string;
  questions: Question[];
  createdAt: string;
  bloomTaxonomy?: string;
  language?: string;
  subject?: string;
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  type: QuestionType;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  results: QuestionResult[];
}
