'use client';

import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Problem } from '../../lib/types';
import { getDifficultyColor, formatTimeAgo } from '../../lib/utils';

interface RecentProblemsProps {
  problems: Problem[];
  onViewDetails: (id: string) => void;
  onViewAll: () => void;
}

export const RecentProblems: React.FC<RecentProblemsProps> = ({
  problems,
  onViewDetails,
  onViewAll
}) => {
  const recent = problems.slice(0, 7);

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
            Recent Submissions
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Latest solutions indexed in your repository
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-[#262626] text-neutral-500 dark:text-[#A1A1AA] bg-neutral-50 dark:bg-[#0E0E0E] text-[11px] font-medium">
              <th className="py-2 px-4 w-12 font-mono">#</th>
              <th className="py-2 px-3">Problem</th>
              <th className="py-2 px-3 w-24">Difficulty</th>
              <th className="py-2 px-3 hidden md:table-cell">Pattern</th>
              <th className="py-2 px-3 hidden sm:table-cell w-24">Language</th>
              <th className="py-2 px-3 w-28 text-right font-mono">Solved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-[#1F1F1F]">
            {recent.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-xs text-neutral-500 dark:text-[#A1A1AA]">
                  No problem submissions recorded yet. Submissions captured via the extension or logged manually will appear here.
                </td>
              </tr>
            ) : (
              recent.map(problem => {
              const diffColors = getDifficultyColor(problem.difficulty);

              return (
                <tr
                  key={problem.id}
                  onClick={() => onViewDetails(problem.id)}
                  className="group hover:bg-neutral-50/80 dark:hover:bg-[#171717] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-400 dark:text-[#A1A1AA] tabular-nums">
                    {problem.leetcodeNumber}
                  </td>

                  <td className="py-2.5 px-3 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900 group-hover:text-black dark:text-[#EDEDED] dark:group-hover:text-white transition-colors">
                        {problem.title}
                      </span>
                      <a
                        href={problem.leetcodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-neutral-400 hover:text-neutral-900 dark:text-[#525252] dark:hover:text-[#EDEDED] transition-colors opacity-0 group-hover:opacity-100"
                        title="View on LeetCode"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 hidden md:table-cell">
                    <span className="text-[11px] text-neutral-600 dark:text-[#A1A1AA]">
                      {problem.patterns[0]}
                      {problem.patterns.length > 1 && (
                        <span className="text-neutral-400 dark:text-[#A1A1AA] ml-1 font-mono text-[10px]">
                          +{problem.patterns.length - 1}
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 hidden sm:table-cell">
                    <span className="font-mono text-neutral-500 dark:text-[#A1A1AA] text-[11px]">
                      {problem.language || '—'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-neutral-400 dark:text-[#A1A1AA] font-mono text-[11px] tabular-nums whitespace-nowrap">
                    {formatTimeAgo(problem.submittedAt)}
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
