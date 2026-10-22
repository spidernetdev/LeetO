import React from 'react';
import Link from 'next/link';
import { Download, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DownloadCtaSectionProps {
  extensionUrl: string;
}

export const DownloadCtaSection: React.FC<DownloadCtaSectionProps> = ({ extensionUrl }) => {
  return (
    <section className="py-16 sm:py-24 border-t border-neutral-200 dark:border-[#222222] bg-neutral-100/50 dark:bg-[#0E0E0E] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#141414] text-xs font-mono text-neutral-600 dark:text-[#A1A1AA] shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Zero Configuration · Ready in 30 Seconds</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Your Next Breakthrough <br className="hidden sm:inline" />
          Starts With Better Practice.
        </h2>

        {/* Supporting text */}
        <p className="text-sm sm:text-base text-neutral-600 dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
          Keep your solutions organized, discover recurring patterns, and make every coding session more meaningful. Install the extension and launch your dashboard today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={extensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-neutral-950 dark:bg-white dark:hover:bg-neutral-200 rounded-lg transition-all shadow-sm hover:shadow group cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-300 dark:text-neutral-700 group-hover:-translate-y-0.5 transition-transform" />
            <span>Download Chrome Extension</span>
          </a>

          <Link
            href="/overview"
            prefetch={false}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-neutral-800 dark:text-[#EDEDED] bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#383838] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] rounded-lg transition-all shadow-2xs group"
          >
            <span>Explore the Dashboard</span>
            <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Reassurance points */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-[#A1A1AA]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Lightweight background extension</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-[#333333]">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Automatic intake upon submission</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-[#333333]">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Free and developer-first</span>
          </div>
        </div>
      </div>
    </section>
  );
};
