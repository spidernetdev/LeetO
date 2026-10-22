'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sparkles,
  Code2,
  Calendar,
  Flame,
  ExternalLink
} from 'lucide-react';

export const ProductPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'code' | 'calendar'>('overview');

  const tabs = [
    { id: 'overview', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { id: 'patterns', label: 'Pattern Intelligence', icon: Sparkles },
    { id: 'code', label: 'Solution Inspector', icon: Code2 },
    { id: 'calendar', label: 'Activity Heatmap', icon: Calendar }
  ] as const;

  return (
    <section id="preview" className="py-16 sm:py-24 border-t border-neutral-200 dark:border-[#222222] bg-neutral-100/40 dark:bg-[#0A0A0A]/50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-200/60 dark:bg-[#1C1C1C] text-neutral-700 dark:text-[#A1A1AA]">
            Product Experience
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            An IDE-Grade Interface Built for Speed
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] max-w-xl mx-auto leading-relaxed">
            Every screen is crafted for density, keyboard-first navigation, and clear algorithmic insights without clutter or distraction.
          </p>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-lg bg-neutral-200/70 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] flex flex-wrap gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#222222] text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-[#A1A1AA]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser Window Frame */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] shadow-xl overflow-hidden">
          {/* Top Browser Bar */}
          <div className="px-4 py-2.5 bg-neutral-100/70 dark:bg-[#181818] border-b border-neutral-200 dark:border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-neutral-400 dark:text-[#A1A1AA]">
                leeto.app/{activeTab}
              </span>
            </div>
            <Link
              href="/overview"
              prefetch={false}
              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span>Launch Live App</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Interactive Screen Content */}
          <div className="p-4 sm:p-6 min-h-[380px]">
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#161616]">
                    <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Total Solved</div>
                    <div className="text-2xl font-mono font-bold text-neutral-900 dark:text-white mt-1">27</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">78.4% Acceptance</div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#161616]">
                    <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Easy Problems</div>
                    <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">10</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">37% of volume</div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#161616]">
                    <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Medium Problems</div>
                    <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">13</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">48% of volume</div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#161616]">
                    <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Hard Problems</div>
                    <div className="text-2xl font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">4</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">15% of volume</div>
                  </div>
                </div>

                {/* Recent Submissions Table Preview */}
                <div className="rounded-lg border border-neutral-200 dark:border-[#262626] overflow-hidden">
                  <div className="px-3.5 py-2 bg-neutral-50 dark:bg-[#181818] border-b border-neutral-200 dark:border-[#262626] flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-[#D4D4D4]">
                    <span>Recent Solutions Ingested</span>
                    <span className="font-mono text-[10px] text-neutral-400">Sync Active</span>
                  </div>
                  <div className="divide-y divide-neutral-100 dark:divide-[#202020] text-xs">
                    <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-neutral-400 text-[11px]">#1</span>
                        <span className="font-medium text-neutral-900 dark:text-[#EDEDED]">Two Sum</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">Easy</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">Hash Map Complement</span>
                        <span className="text-[10px] font-mono text-neutral-400">Just now</span>
                      </div>
                    </div>
                    <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-neutral-400 text-[11px]">#3</span>
                        <span className="font-medium text-neutral-900 dark:text-[#EDEDED]">Longest Substring Without Repeating Characters</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25">Medium</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">Sliding Window</span>
                        <span className="text-[10px] font-mono text-neutral-400">3h ago</span>
                      </div>
                    </div>
                    <div className="px-3.5 py-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-neutral-400 text-[11px]">#42</span>
                        <span className="font-medium text-neutral-900 dark:text-[#EDEDED]">Trapping Rain Water</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/25">Hard</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">Two Pointers</span>
                        <span className="text-[10px] font-mono text-neutral-400">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patterns' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">Pattern Coverage Breakdown</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Identified through automatic solution analysis</p>
                  </div>
                  <span className="font-mono text-xs text-neutral-500 dark:text-[#A1A1AA]">12 Categories Tracked</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { pattern: 'Two Pointers', count: 6, pct: 22, color: 'bg-sky-500', tier: 'text-sky-700 dark:text-sky-300' },
                    { pattern: 'Sliding Window', count: 5, pct: 18, color: 'bg-teal-500', tier: 'text-teal-700 dark:text-teal-300' },
                    { pattern: 'Arrays & Hashing', count: 5, pct: 19, color: 'bg-violet-500', tier: 'text-violet-700 dark:text-violet-300' },
                    { pattern: 'Binary Search', count: 4, pct: 15, color: 'bg-indigo-500', tier: 'text-indigo-700 dark:text-indigo-300' },
                    { pattern: 'Dynamic Programming', count: 3, pct: 11, color: 'bg-purple-500', tier: 'text-purple-700 dark:text-purple-300' },
                    { pattern: 'Trees & DFS', count: 4, pct: 15, color: 'bg-emerald-500', tier: 'text-emerald-700 dark:text-emerald-300' }
                  ].map(item => (
                    <div key={item.pattern} className="p-3 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/40 dark:bg-[#161616]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-neutral-800 dark:text-[#EDEDED]">{item.pattern}</span>
                        <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">{item.count} problems ({item.pct}%)</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-[#262626] h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct * 3.5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#242424]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">#33 Search in Rotated Sorted Array</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25">Medium</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-[#A1A1AA]">Python 3 · O(log n)</span>
                </div>
                <div className="p-3.5 rounded bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#222222] text-[11px] leading-relaxed text-neutral-800 dark:text-[#D4D4D4] overflow-x-auto">
                  <pre><code>{`def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`}</code></pre>
                </div>
                <div className="p-3 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#242424] text-[11px] text-neutral-600 dark:text-[#A1A1AA]">
                  <span className="font-semibold text-neutral-900 dark:text-white">Pattern Logic: </span>
                  At least one half is always strictly monotonically sorted. We compare bounds against target to discard half each step.
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">90-Day Contribution Grid</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">Live consistency heatmap modeled after GitHub & LeetCode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Flame className="h-3.5 w-3.5 fill-amber-500/20" />
                      14-Day Streak
                    </span>
                  </div>
                </div>

                {/* Heatmap Visual Matrix */}
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#141414] overflow-x-auto">
                  <div className="flex items-center gap-1.5 min-w-[500px]">
                    {Array.from({ length: 14 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1.5">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const isFilled = (colIdx * 7 + rowIdx) % 3 === 0 || colIdx > 10;
                          const intensity = (colIdx + rowIdx) % 4;
                          return (
                            <div
                              key={rowIdx}
                              className={`h-3 w-3 rounded-2xs transition-colors ${
                                !isFilled
                                  ? 'bg-neutral-200 dark:bg-[#202020]'
                                  : intensity === 3
                                  ? 'bg-emerald-500'
                                  : intensity === 2
                                  ? 'bg-emerald-600 dark:bg-emerald-600'
                                  : 'bg-emerald-300 dark:bg-emerald-800'
                              }`}
                              title={`Activity: ${isFilled ? intensity + 1 : 0} problems`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>90 Days Window</span>
                    <div className="flex items-center gap-1">
                      <span>Less</span>
                      <span className="h-2 w-2 rounded-2xs bg-neutral-200 dark:bg-[#202020]" />
                      <span className="h-2 w-2 rounded-2xs bg-emerald-300 dark:bg-emerald-800" />
                      <span className="h-2 w-2 rounded-2xs bg-emerald-500" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
