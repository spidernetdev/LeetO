'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Layers,
  History
} from 'lucide-react';
import { Problem } from '../../lib/types';
import {
  getDifficultyColor,
  getPatternBadgeStyle,
  formatDate,
  formatSolutionsCount,
  groupProblems
} from '../../lib/utils';
import { CodeViewer } from './CodeViewer';
import { AIAnalysis } from './AIAnalysis';

interface ProblemDetailViewProps {
  problem: Problem | null;
  isLoadingDetail?: boolean;
  onBack: () => void;
  onSelectProblem: (id: string) => void;
  allProblems: Problem[];
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  problem,
  isLoadingDetail: _isLoadingDetail = false,
  onBack,
  onSelectProblem,
  allProblems
}) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');

  // Collect all submissions for this problem (prefer embedded submissions with full code & analysis)
  const problemSubmissions = useMemo(() => {
    if (!problem) return [];
    if (problem.submissions && problem.submissions.length > 0) {
      return [...problem.submissions].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    }
    const matched = allProblems
      .filter(
        p =>
          (p.slug && problem.slug && p.slug === problem.slug) ||
          p.leetcodeNumber === problem.leetcodeNumber ||
          p.title.toLowerCase().trim() === problem.title.toLowerCase().trim()
      )
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return matched.length > 0 ? matched : [problem];
  }, [problem, allProblems]);

  // Sync state whenever the problem or its submissions change
  useEffect(() => {
    if (problem) {
      if (problem.submissions && problem.submissions.length > 0) {
        setSelectedSubmissionId(problem.submissions[0].id);
      } else {
        setSelectedSubmissionId(problem.id);
      }
    }
  }, [problem?.id, problem?.submissions]);

  // Unique problems list for prev/next navigation
  const uniqueProblems = useMemo(() => {
    return groupProblems(allProblems);
  }, [allProblems]);

  if (!problem) {
    return (
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-10 text-center max-w-lg mx-auto my-12 shadow-2xs">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-[#EDEDED]">Problem Not Found</h2>
        <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-1">
          The requested problem solution could not be located in your synchronized store.
        </p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problems</span>
        </button>
      </div>
    );
  }

  // Active submission for code viewing and analysis
  const activeSubmission =
    problemSubmissions.find(s => s.id === selectedSubmissionId) || problem;

  // Distinct patterns across all submissions for this problem
  const allDistinctPatterns = Array.from(
    new Set(problemSubmissions.flatMap(s => s.patterns))
  );

  const currentUniqueIndex = uniqueProblems.findIndex(
    p => (p.slug && problem.slug && p.slug === problem.slug) || p.leetcodeNumber === problem.leetcodeNumber
  );
  const prevProblem = currentUniqueIndex > 0 ? uniqueProblems[currentUniqueIndex - 1] : null;
  const nextProblem =
    currentUniqueIndex >= 0 && currentUniqueIndex < uniqueProblems.length - 1
      ? uniqueProblems[currentUniqueIndex + 1]
      : null;

  const diffColors = getDifficultyColor(problem.difficulty);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Top action row */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problems</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => prevProblem && onSelectProblem(prevProblem.slug || prevProblem.id)}
            disabled={!prevProblem}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] bg-white hover:bg-neutral-50 dark:bg-[#121212] dark:hover:bg-[#181818] border border-neutral-200 dark:border-[#262626] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs"
            title={prevProblem ? prevProblem.title : undefined}
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Prev</span>
          </button>

          <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA] px-1 tabular-nums">
            {currentUniqueIndex >= 0 ? currentUniqueIndex + 1 : 1} / {uniqueProblems.length}
          </span>

          <button
            onClick={() => nextProblem && onSelectProblem(nextProblem.slug || nextProblem.id)}
            disabled={!nextProblem}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] bg-white hover:bg-neutral-50 dark:bg-[#121212] dark:hover:bg-[#181818] border border-neutral-200 dark:border-[#262626] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs"
            title={nextProblem ? nextProblem.title : undefined}
          >
            <span>Next</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Problem Header Information */}
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs text-neutral-400 dark:text-[#A1A1AA]">
                #{problem.leetcodeNumber}
              </span>
              <span
                className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}
              >
                {problem.difficulty}
              </span>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-[#A1A1AA] flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Last solved: {formatDate(activeSubmission.submittedAt)}</span>
              </span>

              {/* Submissions count badge */}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-[#D4D4D8] border border-neutral-200 dark:border-[#262626] text-[10px] font-mono">
                <History className="h-2.5 w-2.5 text-neutral-500" />
                <span>{formatSolutionsCount(problemSubmissions.length)}</span>
              </span>
            </div>

            <h1 className="text-lg font-semibold text-neutral-900 dark:text-[#EDEDED] tracking-tight">
              {problem.title}
            </h1>
          </div>

          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#161616] dark:hover:bg-[#1C1C1C] rounded border border-neutral-200 dark:border-[#262626] transition-colors self-start shrink-0 shadow-2xs"
          >
            <span>LeetCode</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Distinct DSA Patterns Tags List */}
        <div className="pt-2.5 border-t border-neutral-200 dark:border-[#262626] flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] flex items-center gap-1 mr-1">
            <Layers className="h-3 w-3" />
            <span>DSA Patterns ({allDistinctPatterns.length}):</span>
          </span>
          {allDistinctPatterns.map(pat => {
            const patStyle = getPatternBadgeStyle(pat);
            return (
              <span
                key={pat}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${patStyle.text} ${patStyle.bg} ${patStyle.border}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${patStyle.dot}`} />
                <span>{pat}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Multiple Submissions Selector / History Switcher */}
      {problemSubmissions.length > 1 && (
        <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-3 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
              <History className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
              <span>Solution History ({problemSubmissions.length} Solutions Submitted)</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 dark:text-[#A1A1AA]">
              Select solution to view approach & code
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {problemSubmissions.map((sub, idx) => {
              const isSelected = sub.id === activeSubmission.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubmissionId(sub.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-[#0A0A0A] border-neutral-900 dark:border-neutral-100 shadow-2xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-[#181818] dark:hover:bg-[#202020] text-neutral-700 dark:text-[#A1A1AA] border-neutral-200 dark:border-[#262626]'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-75">#{problemSubmissions.length - idx}</span>
                  <span className="font-medium">{sub.language || '—'}</span>
                  <span className="opacity-50">·</span>
                  <span className="text-[11px] truncate max-w-[140px]">{sub.patterns.join(', ')}</span>
                  {sub.status && (
                    <span className="text-[10px] font-mono opacity-80 px-1 py-0.2 rounded bg-black/10 dark:bg-white/10">
                      {sub.status}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submitted Code Solution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
          <span>Submitted Solution</span>
          {activeSubmission.submittedAt && (
            <span className="text-[11px] font-mono text-neutral-400 dark:text-[#A1A1AA]">
              Submitted on {formatDate(activeSubmission.submittedAt)}
            </span>
          )}
        </div>
        <CodeViewer
          code={activeSubmission.code}
          language={activeSubmission.language}
          status={activeSubmission.status}
        />
      </div>

      {/* AI Algorithmic Analysis */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
          Pattern & Complexity Analysis
        </div>
        <AIAnalysis analysis={activeSubmission.aiAnalysis} />
      </div>
    </div>
  );
};
