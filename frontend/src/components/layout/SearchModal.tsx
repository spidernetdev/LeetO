'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Problem } from '../../lib/types';
import { getDifficultyColor, groupProblems } from '../../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  onSelectProblem: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  problems,
  onSelectProblem
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const grouped = groupProblems(problems);
  const filtered = grouped.filter(p => {
    const q = query.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.leetcodeNumber.toString().includes(q) ||
      p.patterns.some(pat => pat.toLowerCase().includes(q)) ||
      p.languages.some(lang => lang.toLowerCase().includes(q))
    );
  }).slice(0, 7);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-98 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-3.5 py-3 border-b border-neutral-200 dark:border-[#262626] gap-2.5">
          <Search className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, patterns, numbers..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 dark:text-[#EDEDED] placeholder-neutral-400 dark:placeholder-[#525252] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#1A1A1A]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-neutral-100 dark:divide-[#1F1F1F]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 dark:text-[#A1A1AA]">
              No problems found matching "{query}"
            </div>
          ) : (
            filtered.map(problem => {
              const diffColors = getDifficultyColor(problem.difficulty);
              return (
                <button
                  key={problem.id}
                  onClick={() => {
                    onSelectProblem(problem.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[11px] text-neutral-400 dark:text-[#A1A1AA] w-7 shrink-0 tabular-nums">
                      #{problem.leetcodeNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-900 group-hover:text-black dark:text-[#EDEDED] dark:group-hover:text-white truncate">
                          {problem.title}
                        </span>
                        <span className={`text-[10px] px-1 py-0.2 rounded font-medium border ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] truncate mt-0.5">
                        {problem.patterns.join(', ')} · {problem.submissionCount === 1 ? '1 Solution' : `${problem.submissionCount} Solutions`}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:text-neutral-900 dark:text-[#525252] dark:group-hover:text-[#EDEDED] transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 bg-neutral-50 dark:bg-[#0E0E0E] border-t border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-400 dark:text-[#A1A1AA] flex items-center justify-between font-mono">
          <span>Navigate with arrows</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
