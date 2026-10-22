export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type LeetCodeVerdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error'
  | 'Compile Error';

export type AlgorithmicPattern =
  | 'Arrays'
  | 'Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Binary Search'
  | 'Stack'
  | 'Linked List'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Backtracking'
  | 'Greedy Algorithms'
  | 'Heaps';

export type ProgrammingLanguage = 'Python' | 'C++' | 'Java' | 'JavaScript' | 'TypeScript';

export interface BackendPatternResult {
  main_pattern: string;
  subpattern?: string | null;
  confidence?: number;
  reason?: string;
}

export interface BackendSolutionAnalysis {
  patterns: BackendPatternResult[];
  data_structures: string[];
  algorithms: string[];
  time_complexity: string | null;
  space_complexity: string | null;
  explanation: string | null;
}

export interface AIAnalysisData {
  approach: string;
  whyItWorks: string;
  timeComplexity: string;
  timeComplexityExplanation: string;
  spaceComplexity: string;
  spaceComplexityExplanation: string;
  keyObservations: string[];
  alternativeApproaches: {
    name: string;
    timeComplexity: string;
    spaceComplexity: string;
    tradeOff: string;
  }[];
  backendAnalysis?: BackendSolutionAnalysis;
}

export interface Problem {
  id: string; // Submission UUID or slug identifier
  slug?: string; // Canonical problem slug (e.g. "two-sum")
  leetcodeNumber: number; // Problem index
  title: string;
  difficulty: Difficulty;
  leetcodeUrl: string;
  patterns: AlgorithmicPattern[];
  topics?: string[];
  language?: ProgrammingLanguage;
  languages?: ProgrammingLanguage[]; // All languages used across submissions (from the problems API)
  status?: LeetCodeVerdict; // Genuine LeetCode verdict reported by user (defaults to 'Accepted')
  submittedAt: string; // ISO date string
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  approach: string;
  explanation: string;
  aiAnalysis: AIAnalysisData;
  submissions?: Problem[];
  // Deprecated unpersisted fields from legacy mock data (strictly pruned from display)
  notes?: string;
  runtimeMs?: number;
  memoryMb?: number;
}

export interface GroupedProblem {
  key: string;
  id: string; // Canonical / latest submission ID
  slug: string;
  leetcodeNumber: number;
  title: string;
  difficulty: Difficulty;
  leetcodeUrl: string;
  patterns: AlgorithmicPattern[]; // Unique DSA patterns across all submissions
  topics?: string[];
  submissionCount: number; // Total solutions submitted
  submissions: Problem[]; // All individual submissions (newest first)
  latestSubmission: Problem;
  languages: ProgrammingLanguage[];
}

export interface SubmissionCreatePayload {
  problem: {
    title: string;
    slug: string;
    url: string;
    difficulty: Difficulty;
    topics: string[];
    description?: string | null;
  };
  code: string;
  language: string;
  status: LeetCodeVerdict;
}

export interface SubmissionApiResponse {
  success: boolean;
  message: string;
  submission_id?: string;
  analysis?: BackendSolutionAnalysis;
}

export interface DashboardStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPatternsCount: number;
  patternCounts: Record<string, number>;
  streakDays: number;
  longestStreakDays: number;
  acceptanceRate?: number;
}

export interface TimeRangeActivity {
  date: string;
  label: string;
  count: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface AnalyticsData {
  timeActivity: {
    sevenDays: TimeRangeActivity[];
    thirtyDays: TimeRangeActivity[];
    ninetyDays: TimeRangeActivity[];
  };
  difficultyDistribution: {
    name: Difficulty;
    value: number;
    color: string;
  }[];
  patternDistribution: {
    pattern: AlgorithmicPattern;
    count: number;
    percentage: number;
  }[];
  languageDistribution: {
    language: ProgrammingLanguage;
    count: number;
    percentage: number;
  }[];
  strongestPatterns: {
    pattern: AlgorithmicPattern;
    count: number;
  }[];
  growthAreas: {
    pattern: AlgorithmicPattern;
    count: number;
  }[];
}

export interface UserSettings {
  name: string;
  leetcodeUsername: string;
  targetRole: string;
  dailyGoal: number;
  theme: 'dark' | 'light' | 'system';
  defaultSort: 'newest' | 'oldest' | 'alphabetical' | 'difficulty';
  preferredLanguage: ProgrammingLanguage;
  showComplexityInTable: boolean;
  compactView: boolean;
}

export const ALGORITHMIC_PATTERNS: AlgorithmicPattern[] = [
  'Arrays',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack',
  'Linked List',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Greedy Algorithms',
  'Heaps'
];

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  leetcodeUsername: '',
  targetRole: '',
  dailyGoal: 2,
  theme: 'dark',
  defaultSort: 'newest',
  preferredLanguage: 'Python',
  showComplexityInTable: true,
  compactView: false
};
