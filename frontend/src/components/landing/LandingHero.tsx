import React from 'react';
import Link from 'next/link';
import {
  Download,
  ArrowRight,
  Flame,
  Target,
  Sparkles,
  CheckCircle2,
  Code2,
  Activity
} from 'lucide-react';

interface LandingHeroProps {
  extensionUrl: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ extensionUrl }) => {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Background radial ambient glow - strictly using existing neutral/slate tone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-neutral-200/40 dark:bg-neutral-800/20 blur-3xl rounded-full"
      />

      <div className="relative text-center space-y-5 sm:space-y-6 max-w-4xl mx-auto">
        {/* Release Status Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] text-xs text-neutral-600 dark:text-[#A1A1AA] shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-neutral-800 dark:text-[#EDEDED]">LeetO for Developers</span>
          <span className="text-neutral-300 dark:text-[#3A3A3A]">·</span>
          <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Chrome Extension & Progress Suite</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.12] sm:leading-[1.1]">
          Turn Every LeetCode Submission{' '}
          <br className="hidden sm:inline" />
          <span className="text-neutral-500 dark:text-[#888888]">Into Measurable Progress.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
          Track your coding journey, understand the patterns behind your solutions, and build a smarter, more structured approach to solving technical interview problems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={extensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-neutral-950 dark:bg-white dark:hover:bg-neutral-200 rounded-lg transition-all shadow-sm hover:shadow group cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-300 dark:text-neutral-700 group-hover:-translate-y-0.5 transition-transform" />
            <span>Download Chrome Extension</span>
          </a>

          <Link
            href="/overview"
            prefetch={false}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-neutral-800 dark:text-[#EDEDED] bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#383838] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] rounded-lg transition-all shadow-2xs group"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Quiet Benefit Indicators */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-[#A1A1AA]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero manual logging</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-[#333333]">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>12 algorithmic pattern classes</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-[#333333]">·</span>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            <span>90-day consistency calendar</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Mockup Preview */}
      <div className="mt-10 sm:mt-12 relative max-w-4xl mx-auto">
        {/* Floating Accents */}
        <div className="hidden lg:flex absolute -left-12 top-10 z-20 items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414] shadow-lg animate-in fade-in slide-in-from-left-4 duration-300">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500/20" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-neutral-400 dark:text-[#A1A1AA]">Active Streak</div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-[#EDEDED]">14 Days Consistent</div>
          </div>
        </div>

        <div className="hidden lg:flex absolute -right-10 top-16 z-20 items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414] shadow-lg animate-in fade-in slide-in-from-right-4 duration-300">
          <Target className="h-4 w-4 text-emerald-500" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-neutral-400 dark:text-[#A1A1AA]">Daily Target</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">2 / 2 Problems Solved</div>
          </div>
        </div>

        {/* IDE-style Window Container */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#0D0D0D] shadow-2xl overflow-hidden text-left">
          {/* Top Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-100/80 dark:bg-[#141414] border-b border-neutral-200 dark:border-[#202020]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
                leeto.app / solution-inspector
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-[#888888]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Auto-Captured Solution</span>
            </div>
          </div>

          {/* Problem Header Information */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neutral-500 dark:text-[#A1A1AA]">
                  #42
                </span>
                <div className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white">
                  Trapping Rain Water
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25">
                  Hard
                </span>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-[#A1A1AA]">
                  Python
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Accepted submission from leetcode.com · Linear two-pointer approach
              </p>
            </div>

            {/* Pattern Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40">
                Two Pointers
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                Monotonic Stack
              </span>
            </div>
          </div>

          {/* Code & Insight Split Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-[#1C1C1C]">
            {/* Left: Code Snippet */}
            <div className="md:col-span-7 p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/50 dark:border-[#1E1E1E] text-[10px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3 w-3 text-neutral-500" />
                  <span>solution.py</span>
                </span>
                <span>O(n) time · O(1) space</span>
              </div>
              <pre className="text-xs sm:text-[11px] leading-relaxed text-neutral-800 dark:text-[#D4D4D4]">
                <code>{`class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max, right_max = 0, 0
        water = 0
        while left < right:
            if height[left] < height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water`}</code>
              </pre>
            </div>

            {/* Right: AI Pattern Breakdown & Insights */}
            <div className="md:col-span-5 p-4 space-y-3 bg-white dark:bg-[#0D0D0D] text-xs">
              <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-[#EDEDED]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Pattern Classification</span>
              </div>

              <div className="space-y-2 text-[11px] text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
                <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#141414] border border-neutral-200/60 dark:border-[#222222]">
                  <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">Optimal Strategy: </span>
                  Converging boundary pointers maintain maximum elevations, computing trapped water without allocating auxiliary arrays.
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="p-2 rounded bg-neutral-50 dark:bg-[#141414] border border-neutral-200/60 dark:border-[#222222]">
                    <span className="text-neutral-400 block">Time Complexity</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">O(n) Linear</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 dark:bg-[#141414] border border-neutral-200/60 dark:border-[#222222]">
                    <span className="text-neutral-400 block">Space Complexity</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">O(1) Constant</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400 dark:text-[#A1A1AA]">
                  <span>Status: Verified optimal</span>
                  <span className="text-emerald-500 font-mono">92% Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
