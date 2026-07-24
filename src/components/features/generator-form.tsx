'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiKey, useAssessment, ErrorType } from '@/app/providers';
import { generatorSchema, GeneratorInput } from '@/lib/schemas';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Settings, Brain, AlertCircle, FileText, ChevronRight, HelpCircle, Globe, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function GeneratorForm() {
  const { apiKey } = useApiKey();
  const { setStep, setAssessment, setErrorDetails } = useAssessment();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<GeneratorInput>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      subject: '',
      topic: '',
      difficulty: 'Medium',
      educationalLevel: 'High School',
      questionType: 'multiple-choice',
      bloomTaxonomy: 'Understanding',
      language: 'English',
      questionCount: 5,
      additionalInstructions: '',
    },
  });

  const subjectWatch = watch('subject');
  const topicWatch = watch('topic');
  const typeWatch = watch('questionType');
  const difficultyWatch = watch('difficulty');
  const bloomWatch = watch('bloomTaxonomy');
  const languageWatch = watch('language');
  const countWatch = watch('questionCount');

  const onSubmit = async (data: GeneratorInput) => {
    setIsGenerating(true);
    setApiError(null);
    setStep('PROCESSING');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error || `HTTP error ${response.status}`);
      }

      const assessmentData = await response.json();
      setAssessment(assessmentData);
      setStep('START_EXAM');
    } catch (err: any) {
      console.error(err);
      
      // Classify error type
      let type: ErrorType = 'unknown';
      const msg = (err.message || "").toLowerCase();
      
      if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('401')) {
        type = 'invalid-key';
      } else if (msg.includes('expired')) {
        type = 'expired-key';
      } else if (msg.includes('rate limit') || msg.includes('429')) {
        type = 'rate-limit';
      } else if (msg.includes('network') || msg.includes('fetch')) {
        type = 'network-failure';
      } else if (msg.includes('server') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
        type = 'server-error';
      } else if (msg.includes('json') || msg.includes('malformed')) {
        type = 'malformed-response';
      } else if (msg.includes('empty')) {
        type = 'empty-response';
      }

      setErrorDetails({
        type,
        message: err.message || 'An unexpected error occurred during assessment generation.',
        lastParams: data
      });
      setStep('ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
    { value: 'Expert', label: 'Expert' },
  ];

  const levelOptions = [
    { value: 'Primary School', label: 'Primary School' },
    { value: 'Middle School', label: 'Middle School' },
    { value: 'High School', label: 'High School' },
    { value: 'University', label: 'University / College' },
    { value: 'Professional/Adult Education', label: 'Professional / Adult Education' },
  ];

  const typeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice (MCQ)' },
    { value: 'true-false', label: 'True / False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'fill-in-the-blank', label: 'Fill in the Blank' },
    { value: 'mixed', label: 'Mixed (All Formats)' },
  ];

  const bloomOptions = [
    { value: 'Remembering', label: '1. Remembering' },
    { value: 'Understanding', label: '2. Understanding' },
    { value: 'Applying', label: '3. Applying' },
    { value: 'Analyzing', label: '4. Analyzing' },
    { value: 'Evaluating', label: '5. Evaluating' },
    { value: 'Creating', label: '6. Creating' },
    { value: 'Mixed', label: 'Mixed (Full Spectrum)' },
  ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish (Español)' },
    { value: 'French', label: 'French (Français)' },
    { value: 'German', label: 'German (Deutsch)' },
    { value: 'Hindi', label: 'Hindi (हिन्दी)' },
    { value: 'Arabic', label: 'Arabic (العربية)' },
    { value: 'Portuguese', label: 'Portuguese (Português)' },
    { value: 'Chinese', label: 'Chinese (中文)' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      
      {/* Page Title */}
      <div className="text-left mb-8">
        <h2 className="text-2xl font-extrabold text-zinc-50 tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          Assessment Generator Console
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Configure educational evaluation models. Inputs are parsed by Grok AI in real time.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Input Configuration Form (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 border border-zinc-800/80 shadow-glass-md glow-border" glowColor="purple">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-850 pb-4">
              <Settings className="h-4 w-4 text-purple" />
              <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">Generator Settings</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Subject Input */}
              <Input
                placeholder="e.g. Biology, Computer Science, Modern History"
                label="Subject"
                error={errors.subject?.message}
                {...register('subject')}
                leftIcon={<GraduationCap className="h-4 w-4 text-zinc-400" />}
              />

              {/* Topic Subject */}
              <Input
                placeholder="e.g. Photosynthesis, Binary Search Trees, Cold War causes"
                label="Topic / Target Concept"
                error={errors.topic?.message}
                {...register('topic')}
                leftIcon={<BookOpen className="h-4 w-4 text-zinc-400" />}
              />

              {/* Question Type & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Question Format"
                  options={typeOptions}
                  error={errors.questionType?.message}
                  {...register('questionType')}
                />

                <Select
                  label="Difficulty Scale"
                  options={difficultyOptions}
                  error={errors.difficulty?.message}
                  {...register('difficulty')}
                />
              </div>

              {/* Bloom Taxonomy & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Bloom's Taxonomy Tier"
                  options={bloomOptions}
                  error={errors.bloomTaxonomy?.message}
                  {...register('bloomTaxonomy')}
                />

                <Select
                  label="Output Language"
                  options={languageOptions}
                  error={errors.language?.message}
                  {...register('language')}
                />
              </div>

              {/* Target Audience & Question Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Target Audience"
                  options={levelOptions}
                  error={errors.educationalLevel?.message}
                  {...register('educationalLevel')}
                />

                <Controller
                  name="questionCount"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      label="Question Volume"
                      min={1}
                      max={20}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Additional Reference Text area */}
              <div className="w-full">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Additional Instructions (Optional)
                </label>
                <textarea
                  placeholder="e.g. 'Focus on dark reaction phases', 'Use simple terminology suitable for beginners', 'Ensure code is written in ES6 script syntax'..."
                  className="w-full h-20 rounded-xl bg-zinc-900 border border-zinc-850 p-4 text-xs text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-primary/50 focus:bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  {...register('additionalInstructions')}
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full font-bold text-xs h-11"
                isLoading={isGenerating}
                rightIcon={<Sparkles className="h-4 w-4" />}
              >
                Generate Assessment Sheet
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Right Panel: Workspace Live Preview (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 border border-zinc-850 h-[620px] flex flex-col justify-between" glowColor="none">
            
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">Interactive Preview</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase border border-zinc-800 px-2 py-0.5 rounded-md bg-zinc-900">Virtual Copy</span>
            </div>

            {/* Preview Sheet Area */}
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              
              {/* Conditional high fidelity mock rendering */}
              <div className="max-w-md space-y-6 relative z-10 w-full">
                
                {/* Mock Card Preview representing a draft question */}
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850/80 text-left space-y-4 shadow-glass-sm animate-float">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-zinc-500" />
                      {languageWatch}
                    </span>
                    <span className="text-cyan uppercase">{typeWatch.replace('-', ' ')}</span>
                  </div>
                  
                  {subjectWatch && (
                    <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-md">
                      {subjectWatch}
                    </span>
                  )}
                  
                  <h4 className="text-sm font-semibold text-zinc-200">
                    {topicWatch ? `A high-quality assessment question targeting "${topicWatch}" will appear here...` : 'What are the main goals of Sustainable Development Goal 4 (Quality Education)?'}
                  </h4>
                  
                  {/* Option preview blocks */}
                  {(typeWatch === 'multiple-choice' || typeWatch === 'true-false' || typeWatch === 'mixed') && (
                    <div className="space-y-2">
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850/50 text-xs text-zinc-400 flex items-center justify-between">
                        <span>Option A: Propose free primary/secondary access</span>
                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                      </div>
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850/50 text-xs text-zinc-400 flex items-center justify-between">
                        <span>Option B: Restrict educational software targets</span>
                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                      </div>
                    </div>
                  )}

                  {typeWatch === 'short-answer' && (
                    <div className="w-full h-16 rounded-xl border border-zinc-850/40 bg-zinc-950/40 p-3 text-[10px] text-zinc-500 italic">
                      User input typing box area...
                    </div>
                  )}

                  {typeWatch === 'fill-in-the-blank' && (
                    <div className="w-full h-9 rounded-xl border border-zinc-850/40 bg-zinc-950/40 px-3 flex items-center text-[10px] text-zinc-500 italic">
                      Fill in blank space prompt...
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-350">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    Cognitive Objective
                  </span>
                  <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                    Evaluating <span className="text-purple font-semibold">{bloomWatch}</span> cognitive properties. Layout renders {countWatch} total questions at {difficultyWatch} difficulty level.
                  </p>
                </div>

              </div>
            </div>

            {/* Preview Sheet Footer */}
            <div className="border-t border-zinc-850 pt-4 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Paper Size: A4 Portrait</span>
              <span>Grok 2 structured validation engine</span>
            </div>

          </GlassCard>
        </div>

      </div>
    </div>
  );
}
