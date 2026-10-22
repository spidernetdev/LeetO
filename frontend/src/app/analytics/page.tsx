'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useApp } from '@/src/components/layout/AppShell';
import { AlgorithmicPattern } from '@/src/lib/types';
import { Loader2, BarChart2 } from 'lucide-react';
import { ApiErrorState } from '@/src/components/layout/ApiErrorState';

// Recharts is only needed once analytics data is available. Keeping it out of
// the initial route bundle makes the analytics screen interactive sooner.
const AnalyticsCharts = dynamic(
  () => import('@/src/components/analytics/AnalyticsCharts').then((mod) => mod.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-4 animate-pulse" aria-hidden="true">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 h-64 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
          <div className="h-64 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
        </div>
      </div>
    )
  }
);

export default function AnalyticsPage() {
  const router = useRouter();
  const { analytics, analyticsError, problems, loading, refreshData, onOpenNewSubmission } = useApp();

  const handleSelectPattern = (pattern: AlgorithmicPattern) => {
    router.push(`/problems?pattern=${encodeURIComponent(pattern)}`);
  };

  if (loading && !analytics) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-[#1C1C1C] rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 h-64 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
          <div className="h-64 bg-neutral-200 dark:bg-[#1C1C1C] rounded-lg" />
        </div>
        <div className="flex items-center justify-center py-6 text-xs text-neutral-500 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          <span>Loading analytics metrics...</span>
        </div>
      </div>
    );
  }

  if (analyticsError && !analytics) {
    return (
      <ApiErrorState
        error={analyticsError}
        endpoint="/api/analytics"
        onRetry={refreshData}
        title="Analytics Data Unavailable"
        description="The backend analytics endpoint (/api/analytics) could not be retrieved. Ensure your FastAPI service is running."
      />
    );
  }

  if (!analytics) {
    return (
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-12 text-center max-w-lg mx-auto my-12 shadow-2xs space-y-3">
        <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-md border border-neutral-200 dark:border-[#282828] bg-neutral-50 dark:bg-[#181818] text-neutral-500">
          <BarChart2 className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-[#EDEDED]">
          No Analytics Recorded Yet
        </h3>
        <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] leading-relaxed">
          Log submissions from LeetCode to generate pattern breakdowns, difficulty distributions, and language metrics.
        </p>
        <button
          onClick={onOpenNewSubmission}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors"
        >
          <span>Log Submission</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnalyticsCharts
        analytics={analytics}
        totalSolved={problems.length}
        onSelectPattern={handleSelectPattern}
      />
    </div>
  );
}
