'use client';

import React from 'react';
import { AlgorithmicPattern } from '../../lib/types';
import { ArrowUpRight } from 'lucide-react';

interface PatternBreakdownProps {
  patternDistribution?: {
    pattern: AlgorithmicPattern;
    count: number;
    percentage: number;
  }[];
  onSelectPattern?: (pattern: AlgorithmicPattern) => void;
}

export const PatternBreakdown: React.FC<PatternBreakdownProps> = ({
  patternDistribution = [],
  onSelectPattern
}) => {
  const safeList = patternDistribution || [];
  const maxCount = safeList.length > 0 ? Math.max(...safeList.map(p => p.count), 1) : 1;

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
            Pattern Coverage
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Solutions categorized across 12 algorithmic patterns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {safeList.map(({ pattern, count, percentage }) => {
          const barWidth = Math.round((count / maxCount) * 100);

          return (
            <div
              key={pattern}
              onClick={() => onSelectPattern?.(pattern)}
              className="group cursor-pointer rounded px-2.5 py-1.5 hover:bg-neutral-50 dark:hover:bg-[#181818] transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] text-neutral-700 dark:text-[#A1A1AA] group-hover:text-neutral-900 dark:group-hover:text-[#EDEDED] transition-colors truncate">
                    {pattern}
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-neutral-400 dark:text-[#525252] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-1.5 font-mono tabular-nums text-[10px] text-neutral-400 dark:text-[#A1A1AA] shrink-0">
                  <span className="text-neutral-900 dark:text-[#EDEDED] font-medium">{count}</span>
                  <span>({percentage}%)</span>
                </div>
              </div>

              {/* Restrained horizontal progress bar */}
              <div className="h-1 w-full bg-neutral-100 dark:bg-[#1E1E1E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-800 dark:bg-neutral-300 rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
