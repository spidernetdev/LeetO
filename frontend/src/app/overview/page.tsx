'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useApp } from '@/src/components/layout/AppShell';
import { useAuth } from '@/src/lib/auth';
import { StatsOverview } from '@/src/components/dashboard/StatsCard';
import { ContributionCalendar } from '@/src/components/dashboard/ContributionCalendar';
import { PatternBreakdown } from '@/src/components/dashboard/PatternBreakdown';
import { RecentProblems } from '@/src/components/dashboard/RecentProblems';
import { AlgorithmicPattern } from '@/src/lib/types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

// Progress and difficulty charts are the only overview widgets that depend on
// Recharts. Split them out so the dashboard shell, stats, and calendar paint
// before the charting runtime is evaluated.
const ProgressChart = dynamic(
  () => import('@/src/components/dashboard/ProgressChart').then((mod) => mod.ProgressChart),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-lg bg-neutral-200 dark:bg-[#1C1C1C] animate-pulse" aria-hidden="true" />
  }
);

const DifficultyChart = dynamic(
  () => import('@/src/components/dashboard/DifficultyChart').then((mod) => mod.DifficultyChart),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-lg bg-neutral-200 dark:bg-[#1C1C1C] animate-pulse" aria-hidden="true" />
  }
);

export default function OverviewPage() {
  const router = useRouter();
  const { problems, problemsError, stats, analytics, refreshData } = useApp();
  const { backendAuthStatus } = useAuth();

  const handleSelectPattern = (pattern: AlgorithmicPattern) => {
    router.push(`/problems?pattern=${encodeURIComponent(pattern)}`);
  };

  return (
    <div className="space-y-4">
      {/* Notice if Problems Failed to Fetch */}
      {problemsError && (
        <div className="rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 px-3.5 py-2.5 text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>
              <strong>Backend Connection Notice:</strong> {problemsError.message}
            </span>
          </div>
          <button
            onClick={refreshData}
            className="text-[11px] font-medium underline hover:text-rose-950 dark:hover:text-white cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}
      {/* Notice if in Preview Mode / Backend Auth Pending */}
      {backendAuthStatus === 'endpoint_missing' && (
        <div className="rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Backend Auth Endpoint Missing</strong> — The FastAPI session verification endpoint (<code>/api/auth/me</code>) was not found on the backend service.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/40 shrink-0">
            HTTP 404
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <h1 className="text-base font-medium text-neutral-900 dark:text-[#EDEDED] tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Your problem-solving velocity and pattern mastery at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>FastAPI intake active</span>
        </div>
      </div>

      {/* Compact Horizontal Statistics Strip */}
      <StatsOverview
        totalSolved={stats?.totalSolved ?? problems.length}
        easySolved={stats?.easySolved ?? 0}
        mediumSolved={stats?.mediumSolved ?? 0}
        hardSolved={stats?.hardSolved ?? 0}
        patternsCount={stats?.totalPatternsCount ?? 0}
        acceptanceRate={stats?.acceptanceRate}
        currentStreak={stats?.streakDays ?? 0}
        longestStreak={stats?.longestStreakDays ?? 0}
      />

      {/* 90-Day Contribution Heatmap Calendar */}
      <ContributionCalendar
        problems={problems}
        currentStreak={stats?.streakDays ?? 0}
        longestStreak={stats?.longestStreakDays ?? 0}
        onSelectProblem={id => router.push(`/problems/${id}`)}
      />

      {/* Charts Grid: Problems Solved Progress & Difficulty Donut */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <ProgressChart activityData={analytics.timeActivity} />
          </div>
          <div className="lg:col-span-1">
            <DifficultyChart
              distribution={analytics.difficultyDistribution}
              totalSolved={stats?.totalSolved || problems.length}
            />
          </div>
        </div>
      )}

      {/* Pattern Breakdown */}
      {analytics && (
        <PatternBreakdown
          patternDistribution={analytics.patternDistribution}
          onSelectPattern={handleSelectPattern}
        />
      )}

      {/* Recent Submissions Table */}
      <RecentProblems
        problems={problems}
        onViewDetails={id => router.push(`/problems/${id}`)}
        onViewAll={() => router.push('/problems')}
      />
    </div>
  );
}
