'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TimeRangeActivity } from '../../lib/types';

interface ProgressChartProps {
  activityData?: {
    sevenDays?: TimeRangeActivity[];
    thirtyDays?: TimeRangeActivity[];
    ninetyDays?: TimeRangeActivity[];
  };
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ activityData }) => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  const currentData =
    (range === '7d'
      ? activityData?.sevenDays
      : range === '30d'
      ? activityData?.thirtyDays
      : activityData?.ninetyDays) || [];

  const totalInRange = currentData.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div>
          <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
            Solve Velocity
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            <span className="font-mono text-neutral-900 dark:text-[#EDEDED] tabular-nums">{totalInRange} problems</span> completed in this timeframe
          </p>
        </div>

        {/* Time-range segmented selector */}
        <div className="flex items-center gap-0.5 p-0.5 bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] rounded self-start sm:self-auto">
          <button
            onClick={() => setRange('7d')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              range === '7d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              range === '30d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setRange('90d')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              range === '90d'
                ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#A1A1AA]'
            }`}
          >
            90D
          </button>
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#888888" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#888888" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#888888', strokeOpacity: 0.25 }}
              dy={6}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] px-3 py-2 text-xs shadow-lg font-mono">
                      <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mb-1 font-sans font-medium">{data.label}</div>
                      <div className="text-neutral-900 dark:text-[#EDEDED] font-semibold text-xs mb-1.5">
                        {data.count} {data.count === 1 ? 'problem' : 'problems'}
                      </div>
                      <div className="pt-1 border-t border-neutral-200 dark:border-[#262626] text-[10px] space-y-0.5">
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
            <Area
              type="monotone"
              dataKey="count"
              stroke="#71717A"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#velocityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
