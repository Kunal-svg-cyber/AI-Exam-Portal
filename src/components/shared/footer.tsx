'use client';

import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/app/providers';

export function Footer() {
  const { step } = useAssessment();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (step === 'TAKING') {
    return null;
  }

  return (
    <footer role="contentinfo" className="border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-md text-zinc-500 py-12 no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-white">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 22h20L12 2zm0 3.6L19 19H5l7-13.4zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-zinc-200 tracking-tight">
                QuestionForge<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Supporting SDG 4 by allowing students and educators to instantly generate high-quality assessment systems using secure, browser-session Groq key connections.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation" className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="file:///C:/Users/kunal/.gemini/antigravity-ide/brain/36d924f3-694d-4cde-b039-56c7631bd23f/ui_design_system.md" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-zinc-200 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-zinc-200 transition-colors cursor-default" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-zinc-200 transition-colors cursor-default" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>

          {/* Connect & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center hover:text-zinc-200 hover:border-zinc-700 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center hover:text-zinc-200 hover:border-zinc-700 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@questionforge.ai"
                className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center hover:text-zinc-200 hover:border-zinc-700 transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[10px] text-zinc-500">
              API connections are routed safely. Keys are never persistent.
            </p>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs">
          <p>© {new Date().getFullYear()} QuestionForge AI. Supporting SDG 4 (Quality Education) Globally.</p>
          
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-3.5 py-1.5 font-semibold text-zinc-300 hover:text-foreground transition-all"
          >
            Back to Top
            <ArrowUp className="h-3.5 w-3.5" />
          </motion.button>
        </div>

      </div>
    </footer>
  );
}

