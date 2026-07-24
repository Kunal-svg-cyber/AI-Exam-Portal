'use client';

import React, { useState } from 'react';
import { useApiKey, useAssessment, ErrorType } from '@/app/providers';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft, ShieldAlert, WifiOff, Clock, Server, FileQuestion, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ErrorView() {
  const { apiKey } = useApiKey();
  const { errorDetails, setStep, setAssessment, setErrorDetails } = useAssessment();
  const [isRetrying, setIsRetrying] = useState(false);

  if (!errorDetails) return null;

  const handleBack = () => {
    setErrorDetails(null);
    setStep('GENERATOR');
  };

  const handleRetry = async () => {
    if (!errorDetails.lastParams) {
      handleBack();
      return;
    }

    setIsRetrying(true);
    setStep('PROCESSING');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(errorDetails.lastParams),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error || `HTTP error ${response.status}`);
      }

      const assessmentData = await response.json();
      setAssessment(assessmentData);
      setErrorDetails(null);
      setStep('TAKING');
    } catch (err: any) {
      console.error('Retry failed:', err);
      
      // Classify error type
      let type: ErrorType = 'unknown';
      const msg = (err.message || "").toLowerCase();
      
      if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('401')) {
        type = 'invalid-key';
      } else if (msg.includes('expired')) {
        type = 'expired-key';
      } else if (msg.includes('rate limit') || msg.includes('429')) {
        type = 'rate-limit';
      } else if (msg.includes('timeout') || msg.includes('deadline') || msg.includes('abort') || msg.includes('504')) {
        type = 'ai-timeout';
      } else if (msg.includes('network') || msg.includes('fetch')) {
        type = 'network-failure';
      } else if (msg.includes('server') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
        type = 'server-error';
      } else if (msg.includes('json') || msg.includes('malformed')) {
        type = 'malformed-response';
      }

      setErrorDetails({
        type,
        message: err.message || 'An unexpected error occurred during retry.',
        lastParams: errorDetails.lastParams,
      });
      setStep('ERROR');
    } finally {
      setIsRetrying(false);
    }
  };

  // Error configurations containing premium illustrations and styled parameters
  const errorConfigs = {
    'invalid-key': {
      title: 'Invalid API Key',
      description: 'Your Grok API key was rejected by the xAI gateway. Please confirm that your credentials are correct and format is xai- prefixed.',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      illustration: (
        <svg className="h-32 w-48 text-rose-500" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="96" cy="60" r="30" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
          <path d="M96 35c-14 0-25 11-25 25s11 25 25 25 25-11 25-25-11-25-25-25z" fill="currentColor" fillOpacity="0.05" />
          <rect x="87" y="46" width="18" height="28" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="96" cy="60" r="2" fill="currentColor" />
          <line x1="96" y1="64" x2="96" y2="69" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    'expired-key': {
      title: 'Expired API Key',
      description: 'The Grok console credentials provided have expired or are no longer active on the xAI portal. Check your account billing.',
      icon: Clock,
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
      illustration: (
        <svg className="h-32 w-48 text-orange-400" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="96" cy="60" r="32" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="96" cy="60" r="32" fill="currentColor" fillOpacity="0.03" />
          <path d="M96 36v24h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="140" y1="35" x2="148" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="35" x2="44" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    'network-failure': {
      title: 'Network Connection Failure',
      description: 'Unable to connect to the server proxy. Please verify your internet status, VPN routes, or local proxy parameters.',
      icon: WifiOff,
      color: 'text-rose-455 border-rose-500/20 bg-rose-500/5',
      illustration: (
        <svg className="h-32 w-48 text-rose-400" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 45a60 60 0 0 1 80 0m-70 14a45 45 0 0 1 60 0m-50 14a30 30 0 0 1 40 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4" />
          <circle cx="96" cy="85" r="3.5" fill="currentColor" />
          <line x1="45" y1="25" x2="147" y2="95" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    'ai-timeout': {
      title: 'AI Generation Timeout',
      description: 'The Grok model response exceeded our maximum processing time window. This can occur when xAI servers are heavily congested. Retrying usually succeeds.',
      icon: Clock,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      illustration: (
        <svg className="h-32 w-48 text-amber-500" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="96" cy="60" r="32" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="96" cy="60" r="32" fill="currentColor" fillOpacity="0.03" />
          <path d="M96 36v24h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M140 45a45 45 0 0 0-88 0" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="animate-pulse" />
        </svg>
      ),
    },
    'rate-limit': {
      title: 'API Rate Limit Exceeded',
      description: 'Too many generation requests have been triggered in a short window. Please wait a minute before retrying.',
      icon: Clock,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      illustration: (
        <svg className="h-32 w-48 text-amber-500" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="76" y="30" width="40" height="60" rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.8" />
          <line x1="86" y1="42" x2="106" y2="42" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
          <line x1="86" y1="52" x2="106" y2="52" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
          <path d="M96 68v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-bounce" />
        </svg>
      ),
    },
    'server-error': {
      title: 'xAI Server Interruption',
      description: 'Grok API returned a 50x server error. The service may be experiencing high load or temporary maintenance issues.',
      icon: Server,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      illustration: (
        <svg className="h-32 w-48 text-rose-455" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="66" y="25" width="60" height="20" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.8" />
          <rect x="66" y="52" width="60" height="20" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.8" />
          <rect x="66" y="79" width="60" height="20" rx="3" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1.8" />
          <circle cx="76" cy="35" r="2.5" fill="#10B981" />
          <circle cx="76" cy="62" r="2.5" fill="#10B981" />
          <circle cx="76" cy="89" r="2.5" fill="#EF4444" className="animate-pulse" />
        </svg>
      ),
    },
    'malformed-response': {
      title: 'Malformed AI Format',
      description: 'Grok generated an assessment structure that could not be parsed or validated against internal structures. Retrying usually fixes this.',
      icon: FileQuestion,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      illustration: (
        <svg className="h-32 w-48 text-purple-400" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="66" y="25" width="60" height="70" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
          <line x1="78" y1="42" x2="114" y2="42" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
          <line x1="78" y1="54" x2="104" y2="54" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
          <path d="M78 70l28 14m0-14L78 84" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
    'empty-response': {
      title: 'Empty Response Returned',
      description: 'The Grok API returned successfully but delivered an empty completion payload. Retrying may solve the generation block.',
      icon: FileQuestion,
      color: 'text-zinc-400 border-zinc-700/50 bg-zinc-800/10',
      illustration: (
        <svg className="h-32 w-48 text-zinc-500" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="66" y="25" width="60" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="96" cy="60" r="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="96" y1="56" x2="96" y2="60" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="96" cy="65" r="0.8" fill="currentColor" />
        </svg>
      ),
    },
    'unknown': {
      title: 'Unexpected Incident',
      description: 'An unexpected issue occurred while parsing assessment data. Check credentials and retry.',
      icon: AlertTriangle,
      color: 'text-rose-455 border-rose-500/20 bg-rose-500/5',
      illustration: (
        <svg className="h-32 w-48 text-rose-500" viewBox="0 0 192 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="96 25 140 100 52 100" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.05" strokeLinejoin="round" />
          <line x1="96" y1="54" x2="96" y2="74" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="96" cy="84" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
  };

  const current = errorConfigs[errorDetails.type] || errorConfigs['unknown'];
  const Icon = current.icon;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className={`p-8 border shadow-glass-md space-y-6 ${current.color}`} role="alert" glowColor="none">
          
          {/* Visual Illustration */}
          <div className="w-full flex justify-center overflow-hidden">
            {current.illustration}
          </div>

          {/* Text Descriptions */}
          <div className="space-y-3 text-center">
            <h2 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2.5">
              <Icon className="h-5.5 w-5.5 text-current shrink-0" />
              {current.title}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              {current.description}
            </p>
          </div>

          {/* Real Error Diagnostic Details log */}
          <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-900 text-left">
            <span className="text-[9px] text-zinc-550 font-black uppercase tracking-wider block mb-1">Diagnostic Log</span>
            <p className="font-mono text-[10px] text-zinc-500 whitespace-pre-wrap break-all leading-relaxed">
              {errorDetails.message}
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleBack}
              disabled={isRetrying}
              className="text-xs font-bold border-zinc-850 h-10 w-full sm:w-auto"
            >
              Adjust Settings
            </Button>
            {errorDetails.lastParams && (
              <Button
                variant="gradient"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={handleRetry}
                isLoading={isRetrying}
                className="text-xs font-bold h-10 w-full sm:w-auto"
              >
                Retry Generation
              </Button>
            )}
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}
