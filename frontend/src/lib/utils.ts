import { Difficulty, Problem, GroupedProblem, ProgrammingLanguage } from './types';

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  python: 'Python',
  python3: 'Python3',
  py: 'Python',
  cpp: 'C++',
  'c++': 'C++',
  c: 'C',
  csharp: 'C#',
  'c#': 'C#',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  go: 'Go',
  golang: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  php: 'PHP',
  ruby: 'Ruby',
  dart: 'Dart'
};

/**
 * Normalizes raw backend language values (e.g. "cpp", "javascript") into
 * consistent display labels without inventing a language when none is present.
 */
export function normalizeLanguage(language: string): string {
  const trimmed = language.trim();
  if (!trimmed) return '';
  return LANGUAGE_DISPLAY_NAMES[trimmed.toLowerCase()] || trimmed;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const now = Math.max(Date.now(), new Date('2026-10-09T08:50:00Z').getTime());
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    if (diffMs < 60 * 1000) {
      return 'Just now';
    }
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMinutes}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

export function getDifficultyColor(diff: Difficulty): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (diff) {
    case 'Easy':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/25',
        dot: 'bg-emerald-500'
      };
    case 'Medium':
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/25',
        dot: 'bg-amber-500'
      };
    case 'Hard':
      return {
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/25',
        dot: 'bg-rose-500'
      };
  }
}

/**
 * Returns consistent, visually distinct styling for DSA pattern badges.
 */
export function getPatternBadgeStyle(pattern: string): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (pattern) {
    case 'Two Pointers':
      return {
        text: 'text-sky-700 dark:text-sky-300',
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-sky-200 dark:border-sky-800/40',
        dot: 'bg-sky-500'
      };
    case 'Sliding Window':
      return {
        text: 'text-teal-700 dark:text-teal-300',
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        border: 'border-teal-200 dark:border-teal-800/40',
        dot: 'bg-teal-500'
      };
    case 'Binary Search':
      return {
        text: 'text-indigo-700 dark:text-indigo-300',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        border: 'border-indigo-200 dark:border-indigo-800/40',
        dot: 'bg-indigo-500'
      };
    case 'Arrays and Hashing':
    case 'Hash Map':
    case 'Hashing':
      return {
        text: 'text-violet-700 dark:text-violet-300',
        bg: 'bg-violet-50 dark:bg-violet-950/40',
        border: 'border-violet-200 dark:border-violet-800/40',
        dot: 'bg-violet-500'
      };
    case 'Dynamic Programming':
      return {
        text: 'text-purple-700 dark:text-purple-300',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        border: 'border-purple-200 dark:border-purple-800/40',
        dot: 'bg-purple-500'
      };
    case 'Greedy Algorithms':
    case 'Greedy':
      return {
        text: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800/40',
        dot: 'bg-emerald-500'
      };
    case 'Stack':
      return {
        text: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800/40',
        dot: 'bg-amber-500'
      };
    case 'Linked List':
      return {
        text: 'text-blue-700 dark:text-blue-300',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        border: 'border-blue-200 dark:border-blue-800/40',
        dot: 'bg-blue-500'
      };
    case 'Trees':
      return {
        text: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800/40',
        dot: 'bg-emerald-500'
      };
    case 'Graphs':
      return {
        text: 'text-cyan-700 dark:text-cyan-300',
        bg: 'bg-cyan-50 dark:bg-cyan-950/40',
        border: 'border-cyan-200 dark:border-cyan-800/40',
        dot: 'bg-cyan-500'
      };
    case 'Backtracking':
      return {
        text: 'text-rose-700 dark:text-rose-300',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-200 dark:border-rose-800/40',
        dot: 'bg-rose-500'
      };
    case 'Heaps':
      return {
        text: 'text-orange-700 dark:text-orange-300',
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        border: 'border-orange-200 dark:border-orange-800/40',
        dot: 'bg-orange-500'
      };
    default:
      return {
        text: 'text-neutral-700 dark:text-neutral-300',
        bg: 'bg-neutral-100 dark:bg-[#1C1C1C]',
        border: 'border-neutral-200 dark:border-[#2C2C2C]',
        dot: 'bg-neutral-400'
      };
  }
}

export function formatSolutionsCount(count: number): string {
  if (count === 1) return '1 Solution Submitted';
  return `${count} Solutions Submitted`;
}

export function formatPatternsCount(count: number): string {
  if (count === 1) return '1 Pattern';
  return `${count} Patterns`;
}

export function formatSubmissionSummary(submissionCount: number, patternCount: number): string {
  const subStr = submissionCount === 1 ? '1 Submission' : `${submissionCount} Submissions`;
  const patStr = patternCount === 1 ? '1 Pattern' : `${patternCount} Patterns`;
  return `${subStr} · ${patStr}`;
}

function collectLanguages(prob: Problem): ProgrammingLanguage[] {
  if (Array.isArray(prob.languages) && prob.languages.length > 0) {
    return prob.languages;
  }
  return prob.language ? [prob.language] : [];
}

/**
 * Groups submissions by problem (slug or leetcodeNumber), deduplicating all distinct DSA patterns,
 * tracking total submission count, and aggregating languages.
 * Guarantees each problem appears exactly once in the problem listing.
 */
export function groupProblems(problems: Problem[]): GroupedProblem[] {
  const map = new Map<string, GroupedProblem>();

  for (const prob of problems) {
    const key = prob.slug || (prob.leetcodeNumber > 0 ? String(prob.leetcodeNumber) : prob.title.toLowerCase().trim());

    if (!map.has(key)) {
      map.set(key, {
        key: String(key),
        id: prob.id,
        slug: prob.slug || key,
        leetcodeNumber: prob.leetcodeNumber,
        title: prob.title,
        difficulty: prob.difficulty,
        leetcodeUrl: prob.leetcodeUrl,
        patterns: Array.from(new Set(prob.patterns || [])),
        topics: prob.topics ? [...prob.topics] : [],
        submissionCount: 1,
        submissions: [prob],
        latestSubmission: prob,
        languages: Array.from(new Set(collectLanguages(prob)))
      });
    } else {
      const existing = map.get(key)!;
      existing.submissionCount += 1;
      existing.submissions.push(prob);

      // Deduplicate distinct patterns across submissions
      if (Array.isArray(prob.patterns)) {
        for (const pat of prob.patterns) {
          if (!existing.patterns.includes(pat)) {
            existing.patterns.push(pat);
          }
        }
      }

      // Deduplicate programming languages used
      for (const language of collectLanguages(prob)) {
        if (language && !existing.languages.includes(language)) {
          existing.languages.push(language);
        }
      }

      // Deduplicate topics
      if (Array.isArray(prob.topics)) {
        if (!existing.topics) existing.topics = [];
        for (const top of prob.topics) {
          if (!existing.topics.includes(top)) {
            existing.topics.push(top);
          }
        }
      }

      // Sort submissions by submittedAt descending (newest first)
      existing.submissions.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      existing.latestSubmission = existing.submissions[0];
      existing.id = existing.submissions[0].id;
    }
  }

  return Array.from(map.values());
}

export function exportProblemsToCSV(items: (Problem | GroupedProblem)[]) {
  if (typeof window === 'undefined') return;
  const problems: Problem[] = items.flatMap(item => {
    if ('submissions' in item && Array.isArray((item as GroupedProblem).submissions)) {
      return (item as GroupedProblem).submissions;
    }
    return item as Problem;
  });

  const headers = ['Number', 'Title', 'Difficulty', 'Patterns', 'Language', 'Time Complexity', 'Space Complexity', 'Submitted At', 'URL'];
  const rows = problems.map(p => [
    p.leetcodeNumber,
    `"${p.title.replace(/"/g, '""')}"`,
    p.difficulty,
    `"${p.patterns.join(', ')}"`,
    p.languages?.join(' / ') || p.language || '',
    `"${p.timeComplexity}"`,
    `"${p.spaceComplexity}"`,
    p.submittedAt,
    p.leetcodeUrl
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `leeto_problems_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportProblemsToJSON(items: (Problem | GroupedProblem)[]) {
  if (typeof window === 'undefined') return;
  const problems = items.flatMap(item => {
    if ('submissions' in item && Array.isArray((item as GroupedProblem).submissions)) {
      return (item as GroupedProblem).submissions;
    }
    return item as Problem;
  });

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(problems, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `leeto_export_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.removeChild(downloadAnchor);
}
