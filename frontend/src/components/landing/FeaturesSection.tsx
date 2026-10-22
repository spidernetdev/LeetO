import React from 'react';
import {
  Zap,
  Sparkles,
  Layers,
  TrendingUp,
  Code2,
  Target,
  CheckCircle2
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'tracking',
      icon: Zap,
      title: 'Automatic Submission Tracking',
      description:
        'Keep track of LeetCode submissions without manually maintaining a separate spreadsheet or notes document. Accepted verdicts are captured instantaneously.',
      preview: (
        <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#222222] font-mono text-[10px] space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Accepted</span>
            </span>
            <span>0.18s intake</span>
          </div>
          <div className="text-neutral-700 dark:text-[#CCCCCC]">
            Captured #15 3Sum (Medium · Python)
          </div>
        </div>
      )
    },
    {
      id: 'patterns',
      icon: Sparkles,
      title: 'Smart Pattern Recognition',
      description:
        'Organize solved problems by algorithmic patterns such as Two Pointers, Sliding Window, Binary Search, Trees, and Dynamic Programming to build transferable intuition.',
      preview: (
        <div className="flex flex-wrap gap-1 text-[10px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40">
            Two Pointers
          </span>
          <span className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
            Sliding Window
          </span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
            Binary Search
          </span>
        </div>
      )
    },
    {
      id: 'history',
      icon: Layers,
      title: 'Centralized Problem History',
      description:
        'Revisit previously solved problems with intelligent deduplication. Compare your C++, Python, or TypeScript solutions for the exact same problem side by side.',
      preview: (
        <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#222222] text-[10px] font-mono flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-neutral-900 dark:text-white">#1 Two Sum</span>
            <span className="text-neutral-400">· 2 solutions</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-200/70 dark:bg-[#242424] text-neutral-600 dark:text-[#A1A1AA]">
            Python + C++
          </span>
        </div>
      )
    },
    {
      id: 'progress',
      icon: TrendingUp,
      title: 'Visual Progress Tracking',
      description:
        'Understand your problem-solving volume through clean statistics, difficulty breakdown charts, and active practice streaks to maintain consistency.',
      preview: (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex justify-between text-neutral-500 dark:text-[#A1A1AA]">
            <span>Solved: 27</span>
            <span>Target: 100%</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-[#242424] h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: '37%' }} />
            <div className="bg-amber-500 h-full" style={{ width: '48%' }} />
            <div className="bg-rose-500 h-full" style={{ width: '15%' }} />
          </div>
        </div>
      )
    },
    {
      id: 'review',
      icon: Code2,
      title: 'Solution Review & Complexity',
      description:
        'Revisit available submission details, algorithm observations, and Big-O time/space complexities anytime to reinforce understanding before interviews.',
      preview: (
        <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#222222] font-mono text-[10px] flex items-center justify-between">
          <span className="text-neutral-700 dark:text-[#CCCCCC]">Complexity: O(n log n)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">O(1) Aux Space</span>
        </div>
      )
    },
    {
      id: 'gaps',
      icon: Target,
      title: 'Identify Knowledge Gaps',
      description:
        'Use topic distribution and progress insights to spot weak areas early, ensuring you do not over-index on easy arrays while under-preparing dynamic programming or graphs.',
      preview: (
        <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/60 dark:border-[#222222] text-[10px] font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-[#A1A1AA]">Dynamic Programming</span>
            <span className="text-amber-500 font-medium">3 Solved (Focus Area)</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-[#242424] h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: '30%' }} />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-600 dark:text-[#A1A1AA] border border-neutral-200 dark:border-[#282828]">
          Core Capabilities
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Engineered for Deep Technical Mastery
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
          Move beyond counting raw numbers. Organize, review, and reinforce your algorithm intuition with features tailored for interview success.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(feature => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-[#383838] transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-800 dark:text-[#EDEDED] border border-neutral-200 dark:border-[#2C2C2C] group-hover:scale-105 transition-transform">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-[#8E8E93] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-[#1E1E1E]">
                {feature.preview}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
