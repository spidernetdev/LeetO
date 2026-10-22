'use client';

import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StatsOverviewProps {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  patternsCount: number;
  acceptanceRate?: number;
  currentStreak?: number;
  longestStreak?: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalSolved,
  easySolved,
  mediumSolved,
  hardSolved,
  patternsCount,
  acceptanceRate,
  currentStreak = 0,
  longestStreak = 0
}) => {
  const metrics = [
    {
      id: 'total',
      label: 'Total Solved',
      value: totalSolved,
      detail: acceptanceRate ? `${acceptanceRate}% acc.` : 'Recorded'
    },
    {
      id: 'easy',
      label: 'Easy',
      value: easySolved,
      detail: `${Math.round((easySolved / (totalSolved || 1)) * 100)}%`
    },
    {
      id: 'medium',
      label: 'Medium',
      value: mediumSolved,
      detail: `${Math.round((mediumSolved / (totalSolved || 1)) * 100)}%`
    },
    {
      id: 'hard',
      label: 'Hard',
      value: hardSolved,
      detail: `${Math.round((hardSolved / (totalSolved || 1)) * 100)}%`
    },
    {
      id: 'patterns',
      label: 'Patterns',
      value: `${patternsCount} / 12`,
      detail: 'coverage'
    },
    {
      id: 'current-streak',
      label: 'Current Streak',
      value: `${currentStreak}d`,
      detail: 'Active',
      isStreak: true,
      badgeColor: 'text-emerald-500'
    },
    {
      id: 'longest-streak',
      label: 'Longest Streak',
      value: `${longestStreak}d`,
      detail: 'Record',
      isRecord: true,
      badgeColor: 'text-[#737373]'
    }
  ];

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-neutral-200 dark:bg-[#262626] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px overflow-hidden shadow-2xs">
      {metrics.map((item, idx) => (
        <div
          key={item.id}
          className={`bg-white dark:bg-[#121212] px-3.5 py-3 ${
            idx === 6 ? 'col-span-2 md:col-span-2 lg:col-span-1' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] tracking-wide">
            {item.isStreak && (
              <Flame className="h-3 w-3 text-amber-500/90 fill-amber-500/20 shrink-0" />
            )}
            {item.isRecord && (
              <Trophy className="h-3 w-3 text-amber-500/80 shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-medium tracking-tight text-neutral-900 dark:text-[#EDEDED] tabular-nums">
              {item.value}
            </span>
            {item.detail && (
              <span className={`font-mono text-[10px] ${item.badgeColor || 'text-neutral-500 dark:text-[#A1A1AA]'}`}>
                {item.detail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatsCard: React.FC<{
  label: string;
  value: number | string;
  subtext?: string;
  badge?: string;
}> = ({ label, value, subtext, badge }) => {
  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] px-3.5 py-2.5 shadow-2xs">
      <div className="text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA]">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-mono text-lg font-medium text-neutral-900 dark:text-[#EDEDED] tabular-nums">{value}</span>
        {badge && <span className="font-mono text-[10px] text-neutral-500 dark:text-[#A1A1AA]">{badge}</span>}
      </div>
      {subtext && <div className="text-[10px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">{subtext}</div>}
    </div>
  );
};
