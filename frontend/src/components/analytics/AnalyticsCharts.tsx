'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnalyticsData, AlgorithmicPattern } from '../../lib/types';
import {
  TrendingUp,
  Code,
  Zap,
  Target,
  BarChart2,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  ArrowUpRight
} from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: AnalyticsData;
  totalSolved: number;
  onSelectPattern?: (pattern: AlgorithmicPattern) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  analytics,
  totalSolved,
  onSelectPattern
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [patternViewMode, setPatternViewMode] = useState<'chart' | 'grid'>('chart');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive breakpoint tracking with SSR safety
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const activityData = useMemo(() => {
    const raw =
      timeframe === '7d'
        ? analytics.timeActivity.sevenDays
        : timeframe === '30d'
        ? analytics.timeActivity.thirtyDays
        : analytics.timeActivity.ninetyDays;
    return raw || [];
  }, [analytics, timeframe]);

  const totalInSelectedTimeframe = useMemo(() => {
    return activityData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [activityData]);

  // Neutral color palette for languages and themes
  const NEUTRAL_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

  // Summary Metrics calculations
  const topPattern = analytics.strongestPatterns[0] || null;
  const topLanguage = analytics.languageDistribution[0] || null;
  const totalPatternsTracked = analytics.patternDistribution.length;
  const patternsPracticedCount = analytics.patternDistribution.filter(p => p.count > 0).length;
  const patternCoveragePct = totalPatternsTracked > 0
    ? Math.round((patternsPracticedCount / totalPatternsTracked) * 100)
    : 0;

  // Easy / Med / Hard sums
  const easySolved = analytics.difficultyDistribution.find(d => d.name === 'Easy')?.value || 0;
  const mediumSolved = analytics.difficultyDistribution.find(d => d.name === 'Medium')?.value || 0;
  const hardSolved = analytics.difficultyDistribution.find(d => d.name === 'Hard')?.value || 0;

  // Shorten pattern names on narrow mobile screens
  const formatPatternLabel = (label: string) => {
    if (!isMobile) return label;
    return label
      .replace('Arrays and Hashing', 'Arrays & Hash')
      .replace('Dynamic Programming', 'Dyn. Program')
      .replace('Monotonic Stack', 'Mono Stack')
      .replace('Binary Search', 'Bin. Search')
      .replace('Sliding Window', 'Sliding Win.')
      .replace('Two Pointers', '2-Pointers')
      .replace('Backtracking', 'Backtrack')
      .replace('Bit Manipulation', 'Bit Manip.');
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* 1. Header with Title & Responsive Time Segment Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-[#EDEDED] tracking-tight">
              Analytics & Insights
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-600 dark:text-[#A1A1AA] border border-neutral-200 dark:border-[#2B2B2B]">
              {totalSolved} solved
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Quantitative velocity, pattern coverage, and preparation distribution
          </p>
        </div>

        {/* Global time filter: full-width segmented on mobile, compact pill on tablet/desktop */}
        <div className="w-full sm:w-auto flex items-center p-0.5 bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] rounded-md shadow-2xs">
          <button
            onClick={() => setTimeframe('7d')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-all text-center ${
              timeframe === '7d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-all text-center ${
              timeframe === '30d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-all text-center ${
              timeframe === '90d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Grid: 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Total Volume */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-neutral-500 dark:text-[#A1A1AA] mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Solved Volume</span>
            <Award className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-semibold font-mono text-neutral-900 dark:text-[#EDEDED] tabular-nums">
              {totalSolved}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{easySolved}E</span>
              <span>/</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">{mediumSolved}M</span>
              <span>/</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono">{hardSolved}H</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Top Pattern */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-neutral-500 dark:text-[#A1A1AA] mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Top Pattern</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-[#EDEDED] truncate" title={topPattern?.pattern || 'None'}>
              {topPattern?.pattern || 'None'}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] font-mono mt-0.5">
              {topPattern ? `${topPattern.count} problems solved` : 'No data'}
            </div>
          </div>
        </div>

        {/* Metric 3: Primary Language */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-neutral-500 dark:text-[#A1A1AA] mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Main Language</span>
            <Code className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-[#EDEDED] truncate">
              {topLanguage?.language || 'None'}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] font-mono mt-0.5">
              {topLanguage ? `${topLanguage.percentage}% of submissions` : 'No data'}
            </div>
          </div>
        </div>

        {/* Metric 4: Pattern Coverage */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-neutral-500 dark:text-[#A1A1AA] mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pattern Breadth</span>
            <Layers className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-semibold font-mono text-neutral-900 dark:text-[#EDEDED] tabular-nums">
              {patternsPracticedCount} <span className="text-xs text-neutral-400 font-normal">/ {totalPatternsTracked}</span>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] font-mono mt-0.5">
              {patternCoveragePct}% catalog coverage
            </div>
          </div>
        </div>
      </div>

      {/* 3. Row 1: Problem Velocity Chart & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left: Velocity bar chart (2 cols on lg, full width on mobile/tablet) */}
        <div className="lg:col-span-2 rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#EDEDED] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
                <span>Solved Velocity by Difficulty</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
                {totalInSelectedTimeframe} problems in selected timeframe
              </p>
            </div>

            {/* Micro Difficulty Legend */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs font-mono self-start xs:self-auto">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Easy
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Med
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Hard
              </span>
            </div>
          </div>

          <div className="h-52 xs:h-60 sm:h-64 md:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{
                  top: 8,
                  right: isMobile ? 8 : 12,
                  left: isMobile ? -22 : -18,
                  bottom: 0
                }}
              >
                <XAxis
                  dataKey="label"
                  stroke="#888888"
                  fontSize={isMobile ? 9 : 10}
                  tickLine={false}
                  axisLine={{ stroke: '#888888', strokeOpacity: 0.25 }}
                  interval={timeframe === '90d' ? (isMobile ? 14 : 7) : timeframe === '30d' ? (isMobile ? 4 : 2) : 0}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={isMobile ? 9 : 10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] p-2 sm:p-2.5 shadow-lg font-mono text-xs">
                          <div className="font-sans font-medium text-neutral-900 dark:text-[#EDEDED] text-[11px] mb-1">
                            {data.label} ({data.date})
                          </div>
                          <div className="text-neutral-500 dark:text-[#A1A1AA] text-[11px] mb-1">
                            Total: <span className="font-bold text-neutral-900 dark:text-white">{data.count}</span>
                          </div>
                          <div className="pt-1 border-t border-neutral-200 dark:border-[#262626] space-y-0.5 text-[10px]">
                            <div className="text-emerald-600 dark:text-emerald-400">Easy: {data.easy}</div>
                            <div className="text-amber-600 dark:text-amber-400">Medium: {data.medium}</div>
                            <div className="text-rose-600 dark:text-rose-400">Hard: {data.hard}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="easy" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="hard" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Language Distribution Card */}
        {/* Responsive layout: on tablet (md), layout side-by-side using 2 columns; on mobile and desktop, stacked */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#EDEDED] flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
              <span>Languages</span>
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
              Submissions by programming language
            </p>
          </div>

          <div className="sm:grid sm:grid-cols-2 lg:block sm:items-center sm:gap-4 my-2">
            <div className="relative h-36 sm:h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.languageDistribution}
                    dataKey="count"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 38 : 42}
                    outerRadius={isMobile ? 54 : 58}
                    paddingAngle={3}
                  >
                    {analytics.languageDistribution.map((_, index) => (
                      <Cell key={index} fill={NEUTRAL_COLORS[index % NEUTRAL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] p-2 text-xs font-mono shadow-lg">
                            <div className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{data.language}</div>
                            <div className="text-neutral-500 dark:text-[#A1A1AA] text-[11px]">
                              {data.count} ({data.percentage}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 sm:pt-0 lg:pt-2 border-t sm:border-t-0 lg:border-t border-neutral-200 dark:border-[#262626]">
              {analytics.languageDistribution.map((lang, idx) => (
                <div key={lang.language} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: NEUTRAL_COLORS[idx % NEUTRAL_COLORS.length] }}
                      />
                      <span className="text-[11px] text-neutral-700 dark:text-[#A1A1AA] truncate font-medium">
                        {lang.language}
                      </span>
                    </div>
                    <div className="font-mono text-neutral-500 dark:text-[#A1A1AA] text-[11px] tabular-nums shrink-0 ml-2">
                      <span className="text-neutral-900 dark:text-[#EDEDED] font-semibold">{lang.count}</span> ({lang.percentage}%)
                    </div>
                  </div>
                  {/* Visual micro progress bar */}
                  <div className="h-1 w-full bg-neutral-100 dark:bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(4, lang.percentage))}%`,
                        backgroundColor: NEUTRAL_COLORS[idx % NEUTRAL_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 2: Comprehensive Pattern Distribution Chart & Card View */}
      <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3.5 sm:p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#EDEDED] flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
              <span>Full Pattern Coverage</span>
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
              Distribution across all {analytics.patternDistribution.length} tracked DSA patterns. Tap a pattern to filter.
            </p>
          </div>

          {/* Responsive View Switcher: Bar Chart vs Ranked Grid */}
          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] rounded self-start sm:self-auto">
            <button
              onClick={() => setPatternViewMode('chart')}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                patternViewMode === 'chart'
                  ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                  : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
              }`}
            >
              <BarChart2 className="h-3 w-3" />
              <span>Chart</span>
            </button>
            <button
              onClick={() => setPatternViewMode('grid')}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                patternViewMode === 'grid'
                  ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                  : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {patternViewMode === 'chart' ? (
          <div className="h-80 sm:h-96 md:h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.patternDistribution}
                layout="vertical"
                margin={{
                  top: 4,
                  right: isMobile ? 12 : 24,
                  left: isMobile ? 4 : 12,
                  bottom: 4
                }}
              >
                <XAxis
                  type="number"
                  stroke="#888888"
                  fontSize={isMobile ? 9 : 10}
                  tickLine={false}
                  axisLine={{ stroke: '#888888', strokeOpacity: 0.25 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="pattern"
                  stroke="#888888"
                  fontSize={isMobile ? 9 : 11}
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 88 : isTablet ? 115 : 135}
                  tickFormatter={formatPatternLabel}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] p-2.5 font-mono text-xs shadow-lg">
                          <div className="font-sans font-semibold text-neutral-900 dark:text-[#EDEDED]">
                            {data.pattern}
                          </div>
                          <div className="text-neutral-500 dark:text-[#A1A1AA] text-[11px] mt-1">
                            {data.count} solved ({data.percentage}%)
                          </div>
                          <div className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 flex items-center gap-0.5">
                            <span>Click to view problems</span>
                            <ArrowUpRight className="h-2.5 w-2.5" />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#6366F1"
                  radius={[0, 3, 3, 0]}
                  onClick={(entry: any) => {
                    if (entry && typeof entry === 'object' && 'pattern' in entry) {
                      onSelectPattern?.(entry.pattern);
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Responsive Cards Grid alternative */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {analytics.patternDistribution.map((p, idx) => (
              <div
                key={p.pattern}
                onClick={() => onSelectPattern?.(p.pattern)}
                className="group flex flex-col justify-between p-2.5 sm:p-3 rounded-md bg-neutral-50 hover:bg-neutral-100 dark:bg-[#181818] dark:hover:bg-[#202020] border border-neutral-200 hover:border-neutral-300 dark:border-[#262626] dark:hover:border-[#383838] cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-neutral-400 dark:text-[#A1A1AA] shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED] truncate">
                      {p.pattern}
                    </span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">
                    <span>{p.count} Solved</span>
                    <span>{p.percentage}%</span>
                  </div>
                  <div className="h-1 w-full bg-neutral-200 dark:bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, p.percentage))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Row 3: Practice Distribution & Focus Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Most Practiced Patterns */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3.5 w-3.5 text-neutral-900 dark:text-[#EDEDED]" />
              <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#EDEDED]">
                Most Practiced Patterns
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mb-3">
              Algorithmic patterns with your greatest volume of solutions
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {analytics.strongestPatterns.length > 0 ? (
              analytics.strongestPatterns.map((p, idx) => (
                <div
                  key={p.pattern}
                  onClick={() => onSelectPattern?.(p.pattern)}
                  className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 hover:bg-neutral-100 dark:bg-[#181818] hover:dark:bg-[#1F1F1F] border border-neutral-200 hover:border-neutral-300 dark:border-[#262626] dark:hover:border-[#383838] cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0 mr-2">
                    <span className="font-mono text-[10px] text-neutral-400 dark:text-[#A1A1AA] w-4 text-center shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs text-neutral-900 dark:text-[#EDEDED] font-medium truncate">
                      {p.pattern}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA] tabular-nums">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#262626] border border-neutral-200 dark:border-[#333333] font-semibold text-neutral-900 dark:text-white">
                      {p.count}
                    </span>
                    <span className="hidden xs:inline">solved</span>
                    <ChevronRight className="h-3 w-3 text-neutral-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-neutral-500">
                Log problems to calculate top patterns.
              </div>
            )}
          </div>
        </div>

        {/* Areas for Further Practice */}
        <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#EDEDED]">
                Areas for Further Practice
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mb-3">
              Patterns with fewer solutions to target for well-rounded preparation
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {analytics.growthAreas.length > 0 ? (
              analytics.growthAreas.map((p) => (
                <div
                  key={p.pattern}
                  onClick={() => onSelectPattern?.(p.pattern)}
                  className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 hover:bg-neutral-100 dark:bg-[#181818] hover:dark:bg-[#1F1F1F] border border-neutral-200 hover:border-neutral-300 dark:border-[#262626] dark:hover:border-[#383838] cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0 mr-2">
                    <span className="text-[11px] text-neutral-400 dark:text-[#525252] font-mono shrink-0">
                      →
                    </span>
                    <span className="text-xs text-neutral-700 dark:text-[#A1A1AA] truncate">
                      {p.pattern}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-neutral-400 dark:text-[#A1A1AA] tabular-nums">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#202020] border border-neutral-200 dark:border-[#2E2E2E]">
                      {p.count}
                    </span>
                    <span className="hidden xs:inline">solved</span>
                    <ChevronRight className="h-3 w-3 text-neutral-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-neutral-500">
                All patterns covered!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
