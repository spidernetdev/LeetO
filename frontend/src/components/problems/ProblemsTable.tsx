'use client';

import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Inbox,
  LayoutGrid,
  List,
  CheckCircle2,
  ArrowRight,
  Layers,
  History
} from 'lucide-react';
import { Problem, GroupedProblem } from '../../lib/types';
import {
  getDifficultyColor,
  getPatternBadgeStyle,
  formatDate,
  formatSolutionsCount,
  formatPatternsCount,
  groupProblems
} from '../../lib/utils';

interface ProblemsTableProps {
  problems: (GroupedProblem | Problem)[];
  onSelectProblem: (id: string) => void;
  onClearFilters?: () => void;
  showComplexity?: boolean;
  initialViewMode?: 'table' | 'cards';
}

export const ProblemsTable: React.FC<ProblemsTableProps> = ({
  problems,
  onSelectProblem,
  onClearFilters,
  showComplexity = true,
  initialViewMode = 'table'
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(initialViewMode);
  const [page, setPage] = useState(1);
  const pageSize = viewMode === 'table' ? 12 : 9;

  // Ensure problems are grouped and deduplicated so each problem appears only once
  const groupedProblems: GroupedProblem[] = useMemo(() => {
    if (!problems || problems.length === 0) return [];
    // Check if items are already GroupedProblem instances
    const first = problems[0];
    if ('submissionCount' in first && Array.isArray((first as GroupedProblem).submissions)) {
      return problems as GroupedProblem[];
    }
    return groupProblems(problems as Problem[]);
  }, [problems]);

  const totalPages = Math.ceil(groupedProblems.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const currentProblems = groupedProblems.slice(startIndex, startIndex + pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [groupedProblems.length, viewMode]);

  if (groupedProblems.length === 0) {
    return (
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-10 text-center shadow-2xs">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded border border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#161616] text-neutral-400 dark:text-[#A1A1AA] mb-3">
          <Inbox className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">No matching problems found</h3>
        <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] mt-1 max-w-xs mx-auto">
          Adjust your search query or reset the applied difficulty and pattern filters.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-3.5 px-3 py-1 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* View Switcher & Submissions Count Info Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-[#A1A1AA] text-[11px]">
          <span>
            Showing <span className="font-mono font-medium text-neutral-900 dark:text-[#EDEDED]">{groupedProblems.length}</span> unique problems
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-neutral-400 dark:text-[#A1A1AA]">
            Duplicates consolidated with full submission history
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626]">
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            title="Table View"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#242424] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED]'
            }`}
          >
            <List className="h-3 w-3" />
            <span className="hidden xs:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            aria-label="Cards view"
            title="Cards View"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-[#242424] text-neutral-900 dark:text-[#EDEDED] shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED]'
            }`}
          >
            <LayoutGrid className="h-3 w-3" />
            <span className="hidden xs:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-[#262626] text-neutral-500 dark:text-[#A1A1AA] bg-neutral-50 dark:bg-[#0E0E0E] text-[11px] font-medium">
                  <th className="py-2.5 px-3.5 w-14 font-mono">#</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Problem</th>
                  <th className="py-2.5 px-3 w-24">Difficulty</th>
                  <th className="py-2.5 px-3 min-w-[210px]">DSA Patterns</th>
                  <th className="py-2.5 px-3 w-40">Submissions</th>
                  {showComplexity && (
                    <th className="py-2.5 px-3 hidden xl:table-cell w-32 font-mono">Complexity</th>
                  )}
                  <th className="py-2.5 px-3 hidden lg:table-cell w-28 font-mono">Language</th>
                  <th className="py-2.5 px-3 hidden md:table-cell w-28 font-mono text-right">Last Solved</th>
                  <th className="py-2.5 px-3.5 w-16 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-[#1F1F1F]">
                {currentProblems.map(problem => {
                  const diffColors = getDifficultyColor(problem.difficulty);
                  const isMultiSubmission = problem.submissionCount > 1;

                  return (
                    <tr
                      key={problem.key}
                      onClick={() => onSelectProblem(problem.id)}
                      className="group hover:bg-neutral-50/80 dark:hover:bg-[#171717] cursor-pointer transition-colors"
                    >
                      {/* Number */}
                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-neutral-400 dark:text-[#A1A1AA] tabular-nums">
                        {problem.leetcodeNumber}
                      </td>

                      {/* Title & LeetCode link */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 group-hover:text-black dark:text-[#EDEDED] dark:group-hover:text-white transition-colors">
                            {problem.title}
                          </span>
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-neutral-400 hover:text-neutral-900 dark:text-[#525252] dark:hover:text-[#EDEDED] opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Open on LeetCode (opens in new tab)"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Distinct DSA Patterns Badges */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {problem.patterns.slice(0, 3).map(pat => {
                            const patStyle = getPatternBadgeStyle(pat);
                            return (
                              <span
                                key={pat}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${patStyle.text} ${patStyle.bg} ${patStyle.border} whitespace-nowrap`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${patStyle.dot}`} />
                                <span>{pat}</span>
                              </span>
                            );
                          })}
                          {problem.patterns.length > 3 && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-500 dark:text-[#A1A1AA] bg-neutral-100 dark:bg-[#1E1E1E] border border-neutral-200 dark:border-[#2C2C2C]"
                              title={problem.patterns.slice(3).join(', ')}
                            >
                              +{problem.patterns.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Solutions Submitted (Visually distinct from pattern badges) */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {isMultiSubmission ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-800 dark:text-[#EDEDED]">
                              <History className="h-3 w-3 text-neutral-500 dark:text-[#888888]" />
                              <span className="font-semibold tabular-nums text-[11px]">
                                {problem.submissionCount}
                              </span>
                              <span className="text-[11px] text-neutral-600 dark:text-[#A1A1AA]">
                                Solutions Submitted
                              </span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-neutral-600 dark:text-[#A1A1AA] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-[#525252]" />
                              <span>1 Solution Submitted</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Complexity (latest) */}
                      {showComplexity && (
                        <td className="py-2.5 px-3 hidden xl:table-cell font-mono text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
                          <span className="text-neutral-900 dark:text-[#EDEDED]">
                            {problem.latestSubmission.timeComplexity}
                          </span>
                          <span className="text-neutral-300 dark:text-[#404040] mx-1">/</span>
                          <span>{problem.latestSubmission.spaceComplexity}</span>
                        </td>
                      )}

                      {/* Language */}
                      <td className="py-2.5 px-3 hidden lg:table-cell font-mono text-neutral-500 dark:text-[#A1A1AA] text-[11px]">
                        {problem.languages.length > 0 ? problem.languages.join(' · ') : '—'}
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3 hidden md:table-cell text-neutral-400 dark:text-[#A1A1AA] font-mono text-[11px] text-right whitespace-nowrap">
                        {formatDate(problem.latestSubmission.submittedAt)}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <span className="text-[11px] text-neutral-400 group-hover:text-neutral-900 dark:text-[#A1A1AA] dark:group-hover:text-[#EDEDED] transition-colors">
                          View →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#0E0E0E] text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
              <div>
                Showing <span className="font-mono text-neutral-900 dark:text-[#EDEDED]">{startIndex + 1}–{Math.min(startIndex + pageSize, groupedProblems.length)}</span> of{' '}
                <span className="font-mono text-neutral-900 dark:text-[#EDEDED]">{groupedProblems.length}</span> problems
              </div>

              <div className="flex items-center gap-1 font-mono">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-[#1F1F1F] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-neutral-900 dark:text-[#EDEDED]">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-[#1F1F1F] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Cards Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {currentProblems.map(problem => {
              const diffColors = getDifficultyColor(problem.difficulty);

              return (
                <div
                  key={problem.key}
                  onClick={() => onSelectProblem(problem.id)}
                  className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-[#383838] transition-all hover:shadow-2xs cursor-pointer group space-y-3"
                >
                  {/* Card Header: Number, Difficulty, LeetCode button */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-400 dark:text-[#A1A1AA]">
                          #{problem.leetcodeNumber}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* LeetCode Link Button */}
                      <a
                        href={problem.leetcodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#181818] dark:hover:bg-[#202020] rounded border border-neutral-200 dark:border-[#262626] transition-colors"
                        title="Open problem on LeetCode"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>

                    {/* Problem Title */}
                    <div className="flex items-start gap-1.5">
                      <h3 className="font-medium text-sm text-neutral-900 group-hover:text-black dark:text-[#EDEDED] dark:group-hover:text-white transition-colors leading-snug line-clamp-1">
                        {problem.title}
                      </h3>
                    </div>
                  </div>

                  {/* Distinct DSA Patterns Badges */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-neutral-400 dark:text-[#A1A1AA]">
                      <Layers className="h-3 w-3" />
                      <span>Patterns Identified</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                      {problem.patterns.slice(0, 3).map(pat => {
                        const patStyle = getPatternBadgeStyle(pat);
                        return (
                          <span
                            key={pat}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${patStyle.text} ${patStyle.bg} ${patStyle.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${patStyle.dot}`} />
                            <span>{pat}</span>
                          </span>
                        );
                      })}
                      {problem.patterns.length > 3 && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-500 dark:text-[#A1A1AA] bg-neutral-100 dark:bg-[#1E1E1E] border border-neutral-200 dark:border-[#2C2C2C]"
                          title={problem.patterns.slice(3).join(', ')}
                        >
                          +{problem.patterns.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission Count Card Metric (Visually distinct from pattern badges) */}
                  <div className="rounded border border-neutral-200/80 dark:border-[#222222] bg-neutral-50/70 dark:bg-[#161616] px-2.5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-[#EDEDED]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-medium">
                        {formatSolutionsCount(problem.submissionCount)}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA]">
                      {formatPatternsCount(problem.patterns.length)}
                    </span>
                  </div>

                  {/* Card Footer: Metadata & View Link */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-[#1F1F1F] flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
                    <div className="flex items-center gap-1 font-mono">
                      <span>{problem.languages.length > 0 ? problem.languages.join(', ') : '—'}</span>
                      <span>·</span>
                      <span>{formatDate(problem.latestSubmission.submittedAt)}</span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-medium text-neutral-600 group-hover:text-neutral-900 dark:text-[#A1A1AA] dark:group-hover:text-[#EDEDED] transition-colors">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination for Cards */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
              <div>
                Showing <span className="font-mono text-neutral-900 dark:text-[#EDEDED]">{startIndex + 1}–{Math.min(startIndex + pageSize, groupedProblems.length)}</span> of{' '}
                <span className="font-mono text-neutral-900 dark:text-[#EDEDED]">{groupedProblems.length}</span> problems
              </div>

              <div className="flex items-center gap-1 font-mono">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-[#1F1F1F] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-neutral-900 dark:text-[#EDEDED]">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-[#1F1F1F] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
