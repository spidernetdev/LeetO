import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Flame, Trophy, Target, Calendar, ChevronDown } from 'lucide-react';
import { DashboardStats, UserSettings, Problem } from '../../lib/types';
import { getLocalSettings } from '../../lib/api';

interface StreakBadgeProps {
  stats: DashboardStats | null;
  onViewCalendar?: () => void;
  targetDaily?: number;
  solvedToday?: number;
  settings?: UserSettings;
  problems?: Problem[];
  onNavigateSettings?: () => void;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  stats,
  onViewCalendar,
  targetDaily: propTargetDaily,
  solvedToday: propSolvedToday,
  settings,
  problems = [],
  onNavigateSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const streakDays = stats?.streakDays ?? 0;
  const longestStreak = stats?.longestStreakDays ?? 0;

  // Dynamic daily target from user settings (minimum 1)
  const targetDaily = useMemo(() => {
    if (typeof propTargetDaily === 'number' && propTargetDaily > 0) {
      return propTargetDaily;
    }
    if (settings?.dailyGoal && settings.dailyGoal > 0) {
      return settings.dailyGoal;
    }
    if (typeof window !== 'undefined') {
      const local = getLocalSettings();
      if (local?.dailyGoal && local.dailyGoal > 0) {
        return local.dailyGoal;
      }
    }
    return 2;
  }, [propTargetDaily, settings?.dailyGoal]);

  // Solved submissions for today: synced from prop or calculated dynamically from problems
  const solvedToday = useMemo(() => {
    if (typeof propSolvedToday === 'number') {
      return propSolvedToday;
    }

    const problemList = problems || [];

    if (!problemList || problemList.length === 0) {
      return 0;
    }

    const now = new Date();
    const utcToday = now.toISOString().split('T')[0];
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return problemList.filter(p => {
      if (!p.submittedAt) return false;
      const d = p.submittedAt.split('T')[0];
      return d === utcToday || d === localToday;
    }).length;
  }, [propSolvedToday, problems]);

  const percentComplete = Math.min(100, Math.round((solvedToday / targetDaily) * 100));
  const isGoalReached = solvedToday >= targetDaily;
  const remaining = Math.max(0, targetDaily - solvedToday);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 text-xs rounded border transition-colors cursor-pointer select-none shrink-0 ${
          isOpen
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400'
            : 'bg-neutral-100/80 hover:bg-neutral-100 dark:bg-[#141414] dark:hover:bg-[#1A1A1A] border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED]'
        }`}
        title="Active Practice Streak & Daily Goals"
      >
        <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
        <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-[#EDEDED]">
          {streakDays}d
        </span>
        <span className="hidden xl:inline text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
          streak
        </span>
        <ChevronDown className={`hidden sm:inline h-3 w-3 text-neutral-400 dark:text-[#A1A1AA] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 max-w-[calc(100vw-1.5rem)] z-50 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#2B2B2B] rounded-lg shadow-xl p-3 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-3">
            <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-[#EDEDED]">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Practice Streak</span>
            </div>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
              {streakDays} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-[#262626]">
              <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-[#A1A1AA] mb-1">
                <Flame className="h-3 w-3 text-amber-500" />
                <span>Current</span>
              </div>
              <div className="text-base font-mono font-bold text-neutral-900 dark:text-[#EDEDED]">
                {streakDays} <span className="text-[10px] font-normal text-neutral-500">days</span>
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-[#262626]">
              <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-[#A1A1AA] mb-1">
                <Trophy className="h-3 w-3 text-amber-500" />
                <span>Best Record</span>
              </div>
              <div className="text-base font-mono font-bold text-neutral-900 dark:text-[#EDEDED]">
                {longestStreak} <span className="text-[10px] font-normal text-neutral-500">days</span>
              </div>
            </div>
          </div>

          {/* Today's Goal Progress */}
          <div className="mb-3 p-2 rounded bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-[#262626]">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-800 dark:text-[#EDEDED] mb-1.5">
              <span className="flex items-center gap-1">
                <Target className={`h-3 w-3 ${isGoalReached ? 'text-emerald-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>Today&apos;s Target</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-[#A1A1AA]">
                {solvedToday} of {targetDaily} solved
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-[#2A2A2A] h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-[#A1A1AA]">
              <span>
                {isGoalReached ? (
                  solvedToday > targetDaily ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Goal surpassed! (+{solvedToday - targetDaily} extra)
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Daily goal reached! 🎉
                    </span>
                  )
                ) : (
                  <span>
                    {remaining} more problem{remaining === 1 ? '' : 's'} needed today
                  </span>
                )}
              </span>
              <span className="font-mono text-[9px] text-neutral-400 dark:text-[#A1A1AA]">
                {percentComplete}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {onViewCalendar && (
              <button
                onClick={() => {
                  onViewCalendar();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-[#202020] dark:hover:bg-[#2A2A2A] text-neutral-700 dark:text-[#EDEDED] font-medium transition-colors text-xs cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
                <span>View Heatmap Calendar</span>
              </button>
            )}
            {onNavigateSettings && (
              <button
                onClick={() => {
                  onNavigateSettings();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-neutral-50 hover:bg-neutral-100 dark:bg-[#181818] dark:hover:bg-[#222222] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors text-[11px] cursor-pointer"
              >
                <Target className="h-3 w-3 text-emerald-500" />
                <span>Adjust Target in Settings</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
