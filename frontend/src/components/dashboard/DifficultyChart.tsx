'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Difficulty } from '../../lib/types';

interface DifficultyChartProps {
  distribution?: {
    name: Difficulty;
    value: number;
    color: string;
  }[];
  totalSolved: number;
}

export const DifficultyChart: React.FC<DifficultyChartProps> = ({
  distribution = [],
  totalSolved
}) => {
  const safeDistribution = distribution || [];

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 flex flex-col justify-between shadow-2xs">
      <div>
        <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
          Difficulty Breakdown
        </h3>
        <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
          Distribution across problem difficulty tiers
        </p>
      </div>

      <div className="relative my-2 h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={68}
              paddingAngle={3}
              stroke="transparent"
            >
              {safeDistribution.map(entry => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const pct = totalSolved ? Math.round((data.value / totalSolved) * 100) : 0;
                  return (
                    <div className="rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] px-2.5 py-1.5 shadow-lg text-xs font-mono">
                      <div className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{data.name}</div>
                      <div className="text-neutral-600 dark:text-[#A1A1AA] text-[11px]">
                        {data.value} problems ({pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-lg font-medium text-neutral-900 dark:text-[#EDEDED] tabular-nums">
            {totalSolved}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-[#A1A1AA] uppercase tracking-wider font-mono">
            Total
          </span>
        </div>
      </div>

      {/* Clean breakdown legend */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-200 dark:border-[#262626]">
        {safeDistribution.map(item => {
          const pct = totalSolved ? Math.round((item.value / totalSolved) * 100) : 0;
          return (
            <div key={item.name} className="px-2 py-1.5 rounded bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626]/60 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-neutral-600 dark:text-[#A1A1AA]">{item.name}</span>
              </div>
              <div className="font-mono text-xs font-medium text-neutral-900 dark:text-[#EDEDED] tabular-nums">
                {item.value} <span className="text-[10px] text-neutral-400 dark:text-[#A1A1AA] font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
