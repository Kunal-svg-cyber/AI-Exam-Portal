'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Assessment, AssessmentResult } from '@/lib/types';
import { GradedAssessmentResult } from '@/lib/evaluation-engine';
import { GeneratorInput } from '@/lib/schemas';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// API Key Context
interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isKeyConnected: boolean;
  isHydrated: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}

// Assessment Flow Context
export type AppStep = 'LANDING' | 'KEY_SETUP' | 'GENERATOR' | 'PROCESSING' | 'START_EXAM' | 'TAKING' | 'RESULTS' | 'SESSION_RESULTS' | 'ERROR';

export type ErrorType = 
  | 'invalid-key' 
  | 'expired-key' 
  | 'network-failure' 
  | 'ai-timeout'
  | 'rate-limit' 
  | 'server-error' 
  | 'malformed-response' 
  | 'empty-response' 
  | 'unknown';

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  lastParams?: GeneratorInput;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AssessmentContextType {
  step: AppStep;
  setStep: (step: AppStep) => void;
  assessment: Assessment | null;
  setAssessment: (assessment: Assessment | null) => void;
  userAnswers: Record<string, string>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  result: GradedAssessmentResult | null;
  setResult: (result: GradedAssessmentResult | null) => void;
  errorDetails: ErrorDetails | null;
  setErrorDetails: (details: ErrorDetails | null) => void;
  resetAssessment: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

// Combined Providers wrapper
export function Providers({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const storedKey = window.sessionStorage.getItem('qf_grok_api_key');
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    } catch (e) {
      console.error('Error loading API Key from session storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
    try {
      if (key) {
        window.sessionStorage.setItem('qf_grok_api_key', key);
      } else {
        window.sessionStorage.removeItem('qf_grok_api_key');
      }
    } catch (e) {
      console.error('Error writing API Key to session storage', e);
    }
  };

  const isKeyConnected = !!apiKey;

  // Assessment flow states
  const [step, setStep] = useState<AppStep>('LANDING');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [result, setResultState] = useState<GradedAssessmentResult | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  const setResult = (res: GradedAssessmentResult | null) => {
    setResultState(res);
    if (res && assessment) {
      try {
        const stored = window.sessionStorage.getItem('qf_session_outcomes');
        const outcomes: any[] = stored ? JSON.parse(stored) : [];
        const exists = outcomes.some(o => o.id === assessment.id);
        if (!exists) {
          outcomes.push({
            id: assessment.id,
            title: assessment.title,
            subject: assessment.subject,
            topic: assessment.topic,
            difficulty: assessment.difficulty,
            score: res.score,
            totalQuestions: res.totalQuestions,
            percentage: res.percentage,
            timeTaken: res.timeTaken ?? 0,
            timestamp: Date.now(),
            assessment,
            userAnswers,
            result: res
          });
          window.sessionStorage.setItem('qf_session_outcomes', JSON.stringify(outcomes));
        }
      } catch (e) {
        console.error('Error saving session outcome', e);
      }
    }
  };

  // Load userAnswers from sessionStorage on mount
  useEffect(() => {
    try {
      const storedAnswers = window.sessionStorage.getItem('qf_user_answers');
      if (storedAnswers) {
        setUserAnswers(JSON.parse(storedAnswers));
      }
    } catch (e) {
      console.error('Error loading user answers from session storage', e);
    }
  }, []);

  // Save userAnswers to sessionStorage when modified
  const setPersistedUserAnswers = (
    value: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)
  ) => {
    setUserAnswers((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        window.sessionStorage.setItem('qf_user_answers', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving user answers', e);
      }
      return next;
    });
  };

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const resetAssessment = () => {
    setAssessment(null);
    setUserAnswers({});
    setResult(null);
    setErrorDetails(null);
    setStep('GENERATOR');
    try {
      window.sessionStorage.removeItem('qf_user_answers');
    } catch (e) {
      console.error('Error clearing answers storage', e);
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isKeyConnected, isHydrated }}>
      <AssessmentContext.Provider
        value={{
          step,
          setStep,
          assessment,
          setAssessment,
          userAnswers,
          setUserAnswers: setPersistedUserAnswers,
          result,
          setResult,
          errorDetails,
          setErrorDetails,
          resetAssessment,
          showToast,
        }}
      >
        {children}

        {/* Global Toast Notification Layer */}
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm pointer-events-none no-print">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className={cn(
                  "px-4 py-3 rounded-xl border text-xs font-extrabold pointer-events-auto shadow-lg flex items-center gap-2.5 backdrop-blur-md",
                  t.type === 'success' && 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400',
                  t.type === 'error' && 'bg-rose-950/90 border-rose-500/30 text-rose-400',
                  t.type === 'warning' && 'bg-amber-950/90 border-amber-500/30 text-amber-400',
                  t.type === 'info' && 'bg-zinc-900/95 border-zinc-800 text-zinc-300'
                )}
              >
                {t.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
                {t.type === 'error' && <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />}
                {t.type === 'warning' && <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0" />}
                {t.type === 'info' && <Info className="h-4.5 w-4.5 text-primary shrink-0" />}
                <span>{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </AssessmentContext.Provider>
    </ApiKeyContext.Provider>
  );
}
