'use client';

import React, { useState } from 'react';
import { useApiKey, useAssessment } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { ApiStatus } from '@/components/shared/api-status';
import { Key, Github, HelpCircle, Activity, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { isKeyConnected, setApiKey, isHydrated } = useApiKey();
  const { step, setStep, resetAssessment } = useAssessment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (step === 'TAKING') {
    return null;
  }

  const handleKeyAction = () => {
    if (isKeyConnected) {
      // Allow user to reset key
      if (confirm('Do you want to disconnect your Grok API key?')) {
        setApiKey(null);
        resetAssessment();
        setStep('LANDING');
      }
    } else {
      setStep('KEY_SETUP');
    }
  };

  return (
    <header role="banner" className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => resetAssessment()}>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-cyan text-white shadow-md shadow-primary/20"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 22h20L12 2zm0 3.6L19 19H5l7-13.4zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-bold bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                QuestionForge<span className="text-primary">AI</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">SDG 4 Education</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button 
              onClick={() => resetAssessment()} 
              className={`transition-colors hover:text-foreground ${step === 'LANDING' ? 'text-foreground' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setStep('SESSION_RESULTS')} 
              className={`transition-colors hover:text-foreground ${step === 'SESSION_RESULTS' ? 'text-foreground' : ''}`}
            >
              Session History
            </button>
            <a 
              href="#features-section" 
              onClick={() => {
                if (step !== 'LANDING') setStep('LANDING');
              }}
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a 
              href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/ui_design_system.md" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:text-foreground"
            >
              Documentation
            </a>
            <a 
              href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/enterprise_architecture.md" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:text-foreground"
            >
              About
            </a>
          </nav>

          {/* Right: API Status, 🔑 Put API Key, GitHub, Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isHydrated && (
              <>
                {/* API Status */}
                <ApiStatus state={isKeyConnected ? 'connected' : 'not-connected'} />

                {/* 🔑 Put API Key */}
                <Button
                  variant={isKeyConnected ? 'outline' : 'gradient'}
                  size="sm"
                  leftIcon={<span>🔑</span>}
                  onClick={handleKeyAction}
                  className="h-8 text-xs font-semibold border-zinc-800"
                >
                  {isKeyConnected ? 'Disconnect API Key' : 'Put API Key'}
                </Button>
              </>
            )}

            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-foreground transition-colors hover:bg-zinc-900/50 rounded-lg border border-transparent hover:border-zinc-800"
              aria-label="GitHub Repository"
            >
              <Github className="h-4.5 w-4.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-foreground transition-colors hover:bg-zinc-900/50 rounded-lg border border-transparent hover:border-zinc-800 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-lg no-print overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider flex flex-col">
              <button
                onClick={() => {
                  resetAssessment();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setStep('SESSION_RESULTS');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Session History
              </button>
              <a
                href="#features-section"
                onClick={() => {
                  if (step !== 'LANDING') setStep('LANDING');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 px-4 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/ui_design_system.md"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-3 px-4 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a
                href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/enterprise_architecture.md"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-3 px-4 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                About
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

