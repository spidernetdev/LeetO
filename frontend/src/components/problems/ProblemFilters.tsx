'use client';

import React, { useState } from 'react';
import { Search, X, Download, RotateCcw } from 'lucide-react';
import { Problem, GroupedProblem, ALGORITHMIC_PATTERNS } from '../../lib/types';
import { exportProblemsToCSV, exportProblemsToJSON } from '../../lib/utils';

interface ProblemFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (val: string) => void;
  selectedPattern: string;
  onPatternChange: (val: string) => void;
  selectedLanguage: string;
  onLanguageChange: (val: string) => void;
  sort: string;
  onSortChange: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalFiltered: number;
  totalAll: number;
  totalSubmissions?: number;
  filteredProblems: (GroupedProblem | Problem)[];
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  search,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedPattern,
  onPatternChange,
  selectedLanguage,
  onLanguageChange,
  sort,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  totalFiltered,
  totalAll,
  totalSubmissions,
  filteredProblems
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-medium text-neutral-900 dark:text-[#EDEDED] tracking-tight">Problems Library</h1>
            <span className="font-mono text-xs text-neutral-500 dark:text-[#A1A1AA] tabular-nums">
              ({totalFiltered} / {totalAll})
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            {totalSubmissions
              ? `${totalSubmissions} solutions tracked across ${totalAll} unique problems with consolidated DSA patterns`
              : 'Tracked problems with distinct algorithmic patterns and complexity analysis'}
          </p>
        </div>

        {/* Export dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] bg-white hover:bg-neutral-50 dark:bg-[#121212] dark:hover:bg-[#161616] border border-neutral-200 dark:border-[#262626] rounded transition-colors shadow-2xs"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-1 w-36 rounded border border-neutral-200 dark:border-[#2B2B2B] bg-white dark:bg-[#161616] p-1 shadow-lg z-20 text-xs"
              onClick={() => setShowExportMenu(false)}
            >
              <button
                onClick={() => exportProblemsToCSV(filteredProblems)}
                className="w-full text-left px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#202020] rounded transition-colors"
              >
                CSV file (.csv)
              </button>
              <button
                onClick={() => exportProblemsToJSON(filteredProblems)}
                className="w-full text-left px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#202020] rounded transition-colors"
              >
                JSON file (.json)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400 dark:text-[#525252]" />
          <input
            type="text"
            placeholder="Search problems, numbers, keywords..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] placeholder-neutral-400 dark:placeholder-[#525252] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-700 dark:text-[#525252] dark:hover:text-[#A1A1AA]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty */}
        <div className="lg:col-span-2">
          <select
            value={selectedDifficulty}
            onChange={e => onDifficultyChange(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded text-neutral-700 dark:text-[#A1A1AA] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Pattern */}
        <div className="lg:col-span-3">
          <select
            value={selectedPattern}
            onChange={e => onPatternChange(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded text-neutral-700 dark:text-[#A1A1AA] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] truncate"
          >
            <option value="All">All Patterns ({ALGORITHMIC_PATTERNS.length})</option>
            {ALGORITHMIC_PATTERNS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="lg:col-span-2">
          <select
            value={selectedLanguage}
            onChange={e => onLanguageChange(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded text-neutral-700 dark:text-[#A1A1AA] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
          >
            <option value="All">All Languages</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
          </select>
        </div>

        {/* Sort */}
        <div className="lg:col-span-1">
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded text-neutral-700 dark:text-[#A1A1AA] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono text-[11px]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">A-Z</option>
            <option value="difficulty">Diff.</option>
          </select>
        </div>
      </div>

      {/* Active filter count & clear action */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-[#A1A1AA] pt-0.5">
          <span>Active filters applied</span>
          <span>·</span>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-neutral-700 hover:text-black dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] font-medium transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
