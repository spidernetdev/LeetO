'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/src/components/layout/AppShell';
import { ProblemFilters } from '@/src/components/problems/ProblemFilters';
import { ProblemsTable } from '@/src/components/problems/ProblemsTable';
import { groupProblems } from '@/src/lib/utils';
import { AlgorithmicPattern } from '@/src/lib/types';
import { ApiErrorState } from '@/src/components/layout/ApiErrorState';

export default function ProblemsPage() {
  const router = useRouter();
  const { problems, problemsError, loading, refreshData, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPattern, setSelectedPattern] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortOrder, setSortOrder] = useState<string>(settings.defaultSort || 'newest');

  // Group problems so each distinct problem is represented once with consolidated patterns & submissions
  const groupedProblems = useMemo(() => {
    return groupProblems(problems);
  }, [problems]);

  // Filtered problems for Problems Library page
  const filteredProblems = useMemo(() => {
    return groupedProblems.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.leetcodeNumber.toString().includes(q) ||
          p.patterns.some(pat => pat.toLowerCase().includes(q)) ||
          p.submissions.some(
            s =>
              s.approach.toLowerCase().includes(q) ||
              s.explanation.toLowerCase().includes(q)
          );
        if (!match) return false;
      }
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedPattern !== 'All' && !p.patterns.includes(selectedPattern as AlgorithmicPattern)) {
        return false;
      }
      if (selectedLanguage !== 'All' && !p.languages.includes(selectedLanguage as any)) {
        return false;
      }
      return true;
    });
  }, [groupedProblems, searchQuery, selectedDifficulty, selectedPattern, selectedLanguage]);

  // Sorting
  const sortedProblems = useMemo(() => {
    return [...filteredProblems].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.latestSubmission.submittedAt).getTime() - new Date(b.latestSubmission.submittedAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'difficulty': {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          return order[b.difficulty] - order[a.difficulty];
        }
        case 'newest':
        default:
          return new Date(b.latestSubmission.submittedAt).getTime() - new Date(a.latestSubmission.submittedAt).getTime();
      }
    });
  }, [filteredProblems, sortOrder]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDifficulty !== 'All' ||
    selectedPattern !== 'All' ||
    selectedLanguage !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedPattern('All');
    setSelectedLanguage('All');
  };

  if (problemsError && problems.length === 0 && !loading) {
    return (
      <ApiErrorState
        error={problemsError}
        endpoint="/api/problems"
        onRetry={refreshData}
        title="Problems Repository Unavailable"
        description="Could not load problem submissions from the backend (/api/problems)."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProblemFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedPattern={selectedPattern}
        onPatternChange={setSelectedPattern}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        sort={sortOrder}
        onSortChange={setSortOrder}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={sortedProblems.length}
        totalAll={groupedProblems.length}
        totalSubmissions={problems.length}
        filteredProblems={sortedProblems}
      />

      <ProblemsTable
        problems={sortedProblems}
        onSelectProblem={id => router.push(`/problems/${id}`)}
        onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
        showComplexity={settings.showComplexityInTable}
      />
    </div>
  );
}
