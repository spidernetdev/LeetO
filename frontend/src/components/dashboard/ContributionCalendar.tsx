'use client';

import React, { useState, useMemo } from 'react';
import { Problem } from '../../lib/types';
import { Flame, Trophy, Calendar as CalendarIcon, Check } from 'lucide-react';

interface ContributionCalendarProps {
  problems: Problem[];
  currentStreak?: number;
  longestStreak?: number;
  onSelectProblem?: (id: string) => void;
}

interface DayData {
  dateStr: string; // YYYY-MM-DD
  dateObj: Date;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  problems: Problem[];
}

interface MonthGroup {
  monthKey: string;
  monthLabel: string;
  weeks: (DayData | null)[][];
}

export const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  problems,
  currentStreak = 0,
  longestStreak = 0,
  onSelectProblem
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Generate 90 days of activity terminating on today
  // Each new month starts from a brand-new column
  const { monthGroups, totalInWindow, activeDaysCount } = useMemo(() => {
    const today = new Date();
    
    // Index existing problems by YYYY-MM-DD
    const problemMap: Record<string, Problem[]> = {};
    problems.forEach(p => {
      try {
        if (!p.submittedAt) return;
        const dStr = p.submittedAt.split('T')[0];
        if (!problemMap[dStr]) problemMap[dStr] = [];
        problemMap[dStr].push(p);
      } catch {
        // ignore
      }
    });

    // Generate dates starting from 89 days ago up to today (90 days total)
    const days: DayData[] = [];
    let runningTotal = 0;
    let activeDays = 0;

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

      const recordedProblems = problemMap[dStr] || [];
      const count = recordedProblems.length;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else if (count >= 4) level = 4;

      if (count > 0) activeDays++;
      runningTotal += count;

      days.push({
        dateStr: dStr,
        dateObj: d,
        dayOfWeek,
        count,
        level,
        problems: recordedProblems
      });
    }

    // Group into month blocks so that every new month starts on a new column
    const groups: MonthGroup[] = [];
    let currentWeekCol: (DayData | null)[] = Array(7).fill(null);

    for (const day of days) {
      const m = day.dateObj.getUTCMonth();
      const y = day.dateObj.getUTCFullYear();
      const mKey = `${y}-${m}`;

      const activeGroup = groups.length > 0 ? groups[groups.length - 1] : null;

      // When encountering a new month, flush previous week column and start a fresh column
      if (!activeGroup || activeGroup.monthKey !== mKey) {
        if (activeGroup && currentWeekCol.some(d => d !== null)) {
          activeGroup.weeks.push([...currentWeekCol]);
        }
        const label = day.dateObj.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: 'UTC'
        });
        const newGroup: MonthGroup = {
          monthKey: mKey,
          monthLabel: label,
          weeks: []
        };
        groups.push(newGroup);
        currentWeekCol = Array(7).fill(null);
      }

      const currentGroup = groups[groups.length - 1];

      // If Sunday (dayOfWeek === 0) and current week already has days placed, advance to next column
      if (day.dayOfWeek === 0 && currentWeekCol.some(d => d !== null)) {
        currentGroup.weeks.push([...currentWeekCol]);
        currentWeekCol = Array(7).fill(null);
      }

      // Place day in corresponding weekday slot (0 = Sun, ..., 6 = Sat)
      currentWeekCol[day.dayOfWeek] = day;

      // If Saturday (dayOfWeek === 6), week is completed in this month
      if (day.dayOfWeek === 6) {
        currentGroup.weeks.push([...currentWeekCol]);
        currentWeekCol = Array(7).fill(null);
      }
    }

    // Flush any pending week column in the final month
    const finalGroup = groups.length > 0 ? groups[groups.length - 1] : null;
    if (finalGroup && currentWeekCol.some(d => d !== null)) {
      finalGroup.weeks.push([...currentWeekCol]);
    }

    return {
      monthGroups: groups,
      totalInWindow: runningTotal,
      activeDaysCount: activeDays
    };
  }, [problems]);

  // Color classes for green intensity levels (adapted for light and dark themes)
  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return 'bg-[#9be9a8] border-[#82d690] hover:border-emerald-600 dark:bg-[#0e4429] dark:border-[#166534]/50 dark:hover:border-emerald-400';
      case 2:
        return 'bg-[#40c463] border-[#30b352] hover:border-emerald-700 dark:bg-[#006d32] dark:border-[#15803d]/60 dark:hover:border-emerald-400';
      case 3:
        return 'bg-[#30a14e] border-[#218c3e] hover:border-emerald-800 dark:bg-[#26a641] dark:border-[#22c55e]/60 dark:hover:border-emerald-400';
      case 4:
        return 'bg-[#216e39] border-[#1b582d] hover:border-emerald-900 dark:bg-[#39d353] dark:border-[#4ade80]/70 dark:hover:border-emerald-300';
      case 0:
      default:
        return 'bg-[#EBEDF0] border-[#E1E4E8] hover:border-neutral-400 dark:bg-[#161616] dark:border-[#222222] dark:hover:border-[#333333]';
    }
  };

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 text-xs shadow-2xs">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED] flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
              <span>Contribution Calendar</span>
            </h3>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA] tabular-nums">
              ({totalInWindow} submissions / 90 days)
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Daily problem-solving activity partitioned by month
          </p>
        </div>

        {/* Quick Streak KPI pills */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#EDEDED]">
            <Flame className="h-3 w-3 text-amber-500 fill-amber-500/20" />
            <span className="text-neutral-500 dark:text-[#A1A1AA]">Current:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{currentStreak}d</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-[#EDEDED]">
            <Trophy className="h-3 w-3 text-amber-500/80" />
            <span className="text-neutral-500 dark:text-[#A1A1AA]">Best:</span>
            <span className="text-neutral-900 dark:text-[#EDEDED] font-semibold">{longestStreak}d</span>
          </div>
        </div>
      </div>

      {/* Grid container: Each new month starts in a new column */}
      <div className="pt-3 overflow-x-auto">
        <div className="inline-flex items-start gap-2 min-w-full">
          {/* Weekday indicators (Mon, Wed, Fri) */}
          <div className="flex flex-col select-none shrink-0">
            {/* Height spacer matching month title row */}
            <div className="h-4 mb-1" />
            <div className="grid grid-rows-7 gap-[3px] text-[9px] font-mono text-neutral-400 dark:text-[#A1A1AA] w-3.5">
              <span className="h-[13px] flex items-center justify-center"></span>
              <span className="h-[13px] flex items-center justify-center">M</span>
              <span className="h-[13px] flex items-center justify-center"></span>
              <span className="h-[13px] flex items-center justify-center">W</span>
              <span className="h-[13px] flex items-center justify-center"></span>
              <span className="h-[13px] flex items-center justify-center">F</span>
              <span className="h-[13px] flex items-center justify-center"></span>
            </div>
          </div>

          {/* Month Columns: Separated cleanly, with each month beginning on a new column */}
          <div className="flex items-start gap-3">
            {monthGroups.map((group) => (
              <div key={group.monthKey} className="flex flex-col shrink-0">
                {/* Month Label header right above this month's columns */}
                <div className="h-4 mb-1 text-[11px] font-sans font-medium text-neutral-500 dark:text-[#A1A1AA]">
                  {group.monthLabel}
                </div>

                {/* Week columns inside this month */}
                <div className="flex items-center gap-[3px]">
                  {group.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                      {week.map((day, rIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${group.monthKey}-${wIdx}-${rIdx}`}
                              className="w-[13px] h-[13px]"
                            />
                          );
                        }

                        const isHovered = hoveredDay?.dateStr === day.dateStr;
                        const isSelected = selectedDay?.dateStr === day.dateStr;

                        return (
                          <div
                            key={day.dateStr}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => setSelectedDay(day.dateStr === selectedDay?.dateStr ? null : day)}
                            className={`w-[13px] h-[13px] rounded-[2px] border transition-all cursor-pointer ${getCellColor(
                              day.level
                            )} ${
                              isSelected
                                ? 'ring-1 ring-neutral-900 dark:ring-white scale-110 z-10'
                                : isHovered
                                ? 'scale-110 z-10'
                                : ''
                            }`}
                            title={`${day.count} solved on ${day.dateStr}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status readout & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 mt-3 border-t border-neutral-200 dark:border-[#262626] text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
        {/* Active Hover / Selected readout */}
        <div className="min-h-[18px] flex items-center gap-2">
          {hoveredDay || selectedDay ? (
            (() => {
              const active = hoveredDay || selectedDay!;
              const formattedDate = active.dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC'
              });
              return (
                <div className="flex items-center gap-1.5 text-neutral-900 dark:text-[#EDEDED] font-mono animate-in fade-in duration-100">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {active.count} {active.count === 1 ? 'problem' : 'problems'}
                  </span>
                  <span className="text-neutral-400 dark:text-[#A1A1AA]">on</span>
                  <span>{formattedDate}</span>
                  {active.problems.length > 0 && (
                    <span className="text-[10px] text-neutral-600 dark:text-[#A1A1AA] bg-neutral-100 dark:bg-[#1A1A1A] px-1.5 py-0.2 rounded border border-neutral-200 dark:border-[#2B2B2B]">
                      {active.problems[0].title}
                    </span>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-neutral-500 dark:text-[#A1A1AA]">
              Active on <span className="font-mono text-neutral-900 dark:text-[#EDEDED]">{activeDaysCount}</span> of last 90 days (
              {Math.round((activeDaysCount / 90) * 100)}% consistency)
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto font-mono text-[10px] select-none text-neutral-500 dark:text-[#A1A1AA]">
          <span>Less</span>
          <div className="flex items-center gap-[3px]">
            <span className="w-[11px] h-[11px] rounded-[2px] bg-[#EBEDF0] border border-[#E1E4E8] dark:bg-[#161616] dark:border-[#222222]" />
            <span className="w-[11px] h-[11px] rounded-[2px] bg-[#9be9a8] border border-[#82d690] dark:bg-[#0e4429] dark:border-[#166534]/50" />
            <span className="w-[11px] h-[11px] rounded-[2px] bg-[#40c463] border-[#30b352] dark:bg-[#006d32] dark:border-[#15803d]/60" />
            <span className="w-[11px] h-[11px] rounded-[2px] bg-[#30a14e] border-[#218c3e] dark:bg-[#26a641] dark:border-[#22c55e]/60" />
            <span className="w-[11px] h-[11px] rounded-[2px] bg-[#216e39] border-[#1b582d] dark:bg-[#39d353] dark:border-[#4ade80]/70" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Detailed day problem inspector drawer (when clicked) */}
      {selectedDay && selectedDay.problems.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-[#262626] animate-in fade-in">
          <div className="text-[11px] font-medium text-neutral-600 dark:text-[#A1A1AA] mb-1.5">
            Solutions recorded on {selectedDay.dateStr}:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedDay.problems.map(prob => (
              <button
                key={prob.id}
                onClick={() => onSelectProblem?.(prob.id)}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#404040] text-xs text-neutral-800 dark:text-[#EDEDED] transition-colors group"
              >
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">#{prob.leetcodeNumber}</span>
                <span className="group-hover:text-black dark:group-hover:text-white">{prob.title}</span>
                <span className="text-[10px] text-neutral-500 dark:text-[#A1A1AA] ml-1">({prob.difficulty})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
