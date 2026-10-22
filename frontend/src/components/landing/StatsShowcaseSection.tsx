import React from 'react';
import {
  Flame,
  Target
} from 'lucide-react';

export const StatsShowcaseSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-600 dark:text-[#A1A1AA] border border-neutral-200 dark:border-[#282828]">
          Actionable Analytics
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Real Insights Into Your Preparation
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
          Monitor your consistency, balance your difficulty portfolio, and make data-informed study decisions before interview day.
        </p>
      </div>

      {/* Visual Analytics Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Difficulty & Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Difficulty Portfolio & Coverage
              </h3>
              <p className="text-xs text-neutral-500 dark:text-[#A1A1AA]">
                Balanced distribution across technical interview tiers
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
              27 Solved
            </span>
          </div>

          {/* Difficulty Bars */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Easy Tier</span>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">10 of 27 (37.0%)</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '37%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-amber-600 dark:text-amber-400">Medium Tier</span>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">13 of 27 (48.1%)</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '48.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-rose-600 dark:text-rose-400">Hard Tier</span>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">4 of 27 (14.9%)</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '14.9%' }} />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100 dark:border-[#1E1E1E] text-center font-mono">
            <div className="p-2 rounded bg-neutral-50 dark:bg-[#181818]">
              <div className="text-[10px] text-neutral-400">Acceptance</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">78.4%</div>
            </div>
            <div className="p-2 rounded bg-neutral-50 dark:bg-[#181818]">
              <div className="text-[10px] text-neutral-400">Avg Runtime</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">38ms</div>
            </div>
            <div className="p-2 rounded bg-neutral-50 dark:bg-[#181818]">
              <div className="text-[10px] text-neutral-400">Language Primary</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">Python / C++</div>
            </div>
          </div>
        </div>

        {/* Right Column: Streak & Daily Target Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Practice Streak Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Flame className="h-4 w-4 fill-amber-500/20" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Practice Streak
                  </h4>
                  <p className="text-[10px] text-neutral-400">Consecutive days active</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                14 Days Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-center">
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#161616]">
                <div className="text-[10px] text-neutral-400">Current Streak</div>
                <div className="text-base font-bold text-neutral-900 dark:text-white">14 days</div>
              </div>
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#161616]">
                <div className="text-[10px] text-neutral-400">Best Streak</div>
                <div className="text-base font-bold text-neutral-900 dark:text-white">26 days</div>
              </div>
            </div>
          </div>

          {/* Dynamic Daily Target Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Today&apos;s Target
                  </h4>
                  <p className="text-[10px] text-neutral-400">Configurable daily target</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                2 of 2 Solved
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="w-full bg-neutral-100 dark:bg-[#1C1C1C] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#888888]">
                <span>Daily goal completed! 🎉</span>
                <span className="font-mono">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
