'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiKey, useAssessment } from '@/app/providers';
import { apiKeySchema, ApiKeyInput } from '@/lib/schemas';
import { GlassCard } from '@/components/shared/glass-card';
import { ApiStatus } from '@/components/shared/api-status';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, ShieldAlert, Cpu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ApiKeyModal() {
  const { apiKey, setApiKey, isKeyConnected } = useApiKey();
  const { step, setStep } = useAssessment();
  const [showKey, setShowKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiKeyInput>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: apiKey || '',
    },
  });

  const onSubmit = (data: ApiKeyInput) => {
    setApiKey(data.apiKey);
    // Go to generator console once key is set
    setStep('GENERATOR');
  };

  const handleCancel = () => {
    // Return to landing page or generator if already connected
    if (isKeyConnected) {
      setStep('GENERATOR');
    } else {
      setStep('LANDING');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Vercel-like dimming blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />

      {/* Modal Dialog Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 border border-zinc-800 shadow-glass-md glow-border relative overflow-hidden" glowColor="blue">
          
          {/* Close Trigger Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors"
            aria-label="Close Modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
              <Key className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-zinc-150">Connect API Credentials</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Provide your API key to access live AI generation.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* API Status Indicator */}
            <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl text-xs">
              <span className="text-zinc-400 font-semibold">Active Status:</span>
              <ApiStatus state={isKeyConnected ? 'connected' : 'not-connected'} />
            </div>

            {/* Provider (Locked to Groq) */}
            <div className="w-full">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                AI Provider
              </label>
              <div className="flex items-center justify-between w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-sm text-zinc-200">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-semibold">Groq</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase border border-zinc-800 px-2 py-0.5 rounded-md bg-zinc-950">Active</span>
              </div>
            </div>

            {/* API Key Password Input with Show/Hide Trigger */}
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="gsk_..."
                label="API Key"
                error={errors.apiKey?.message}
                {...register('apiKey')}
                leftIcon={<Key className="h-4 w-4" />}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 bottom-3.5 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Session Storage Memory Consent */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-850">
              <input
                type="checkbox"
                id="rememberSession"
                checked
                disabled
                className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-primary focus:ring-primary focus:ring-offset-background"
              />
              <label htmlFor="rememberSession" className="text-xs text-zinc-400 cursor-default select-none">
                <span className="font-semibold text-zinc-300 block">Remember During Session</span>
                Key exists solely in temporary browser memory. Wiped on tab closure.
              </label>
            </div>

            {/* Actions: Connect / Cancel */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 text-xs" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="flex-1 text-xs font-bold">
                Connect Key
              </Button>
            </div>

          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
