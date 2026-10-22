import {
  Problem,
  DashboardStats,
  AnalyticsData,
  UserSettings,
  SubmissionCreatePayload,
  SubmissionApiResponse,
  DEFAULT_SETTINGS
} from './types';
import { normalizeLanguage } from './utils';

// Public backend base URL (no secrets or credentials)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Configurable Chrome extension bundle URL
export const CHROME_EXTENSION_URL =
  process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL || 'https://github.com/your-repo/leet-tracker-extension';

// Extensible Authorization Header Provider for Bearer JWT support
export type AuthHeaderProvider = () => Promise<Record<string, string>> | Record<string, string>;



let currentAuthHeaderProvider: AuthHeaderProvider = () => {
  if (typeof window !== 'undefined') {
    const token =
      sessionStorage.getItem('leeto_auth_token') ||
      sessionStorage.getItem('leettracker_auth_token');
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export function setAuthHeaderProvider(provider: AuthHeaderProvider) {
  currentAuthHeaderProvider = provider;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    return await currentAuthHeaderProvider();
  } catch {
    return {};
  }
}

// Typed API Error Hierarchies
export class ApiError extends Error {
  status?: number;
  code: string;
  endpoint?: string;
  isCorsError?: boolean;
  validationDetails?: any;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      endpoint?: string;
      isCorsError?: boolean;
      validationDetails?: any;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.code = options?.code || 'API_ERROR';
    this.endpoint = options?.endpoint;
    this.isCorsError = options?.isCorsError || false;
    this.validationDetails = options?.validationDetails;
  }
}

export class ApiEndpointNotFoundError extends ApiError {
  constructor(endpoint: string, message?: string) {
    super(message || `API Endpoint Not Found: The backend service has not implemented ${endpoint}.`, {
      status: 404,
      code: 'ENDPOINT_NOT_FOUND',
      endpoint
    });
    this.name = 'ApiEndpointNotFoundError';
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, {
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
      endpoint
    });
    this.name = 'ResourceNotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized: Authentication required to access this resource.') {
    super(message, {
      status: 401,
      code: 'UNAUTHORIZED'
    });
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden: Access to this resource is denied.') {
    super(message, {
      status: 403,
      code: 'FORBIDDEN'
    });
    this.name = 'ForbiddenError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, isCorsError = false, endpoint?: string) {
    super(message, {
      code: 'NETWORK_ERROR',
      isCorsError,
      endpoint
    });
    this.name = 'NetworkError';
  }
}

/**
 * Enhanced fetch wrapper with timeout, credentials sending, authorization injection, and CORS diagnostics.
 */
export async function fetchWithTimeout(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const authHeaders = await getAuthHeaders();
  const headers = new Headers(options.headers || {});
  Object.entries(authHeaders).forEach(([k, v]) => {
    if (!headers.has(k) && v) headers.set(k, v);
  });

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials || 'include',
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new NetworkError(
        `Request to backend timed out after ${timeoutMs / 1000} seconds at ${url}. Please verify backend responsiveness.`,
        false,
        endpoint
      );
    }

    const isLikelyCors =
      err instanceof TypeError &&
      (err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('Load failed'));

    if (isLikelyCors) {
      throw new NetworkError(
        `Network or CORS restriction encountered while connecting to ${url}. Ensure the backend service is running and configured with CORS credentials.`,
        true,
        endpoint
      );
    }

    throw new NetworkError(
      `Network error connecting to backend at ${url}: ${err.message || 'Server unreachable'}.`,
      false,
      endpoint
    );
  }
}

/**
 * Check backend health via GET /api/
 */
export async function checkBackendHealth(): Promise<{
  connected: boolean;
  message: string;
  url: string;
  statusCode?: number;
}> {
  try {
    const res = await fetchWithTimeout('/api/', { method: 'GET' }, 5000);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        connected: true,
        message: data.message || 'Connected to backend service',
        url: API_BASE_URL,
        statusCode: res.status
      };
    }
    return {
      connected: false,
      message: `Backend returned HTTP ${res.status}: ${res.statusText}`,
      url: API_BASE_URL,
      statusCode: res.status
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || 'Backend unreachable',
      url: API_BASE_URL
    };
  }
}

/**
 * Live submission intake to backend via POST /api/submissions
 */
export async function submitSolutionToBackend(
  payload: SubmissionCreatePayload
): Promise<SubmissionApiResponse> {
  const res = await fetchWithTimeout('/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let errorDetail = `HTTP ${res.status} ${res.statusText}`;
    let validationDetails = null;

    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        if (Array.isArray(errorJson.detail)) {
          errorDetail = errorJson.detail
            .map((d: any) => `${d.loc?.join('.') || 'field'}: ${d.msg}`)
            .join('; ');
          validationDetails = errorJson.detail;
        } else if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        }
      } else if (errorJson.message) {
        errorDetail = errorJson.message;
      } else if (errorJson.error) {
        errorDetail = errorJson.error;
      }
    } catch {
      // Non-JSON error body
    }

    if (res.status === 404) {
      throw new ApiEndpointNotFoundError(
        '/api/submissions',
        `Submission intake endpoint (/api/submissions) was not found on the backend service.`
      );
    }
    if (res.status === 401) {
      throw new UnauthorizedError('Please sign in to submit solutions to your repository.');
    }

    throw new ApiError(`Submission failed (${res.status}): ${errorDetail}`, {
      status: res.status,
      code: 'SUBMISSION_FAILED',
      endpoint: '/api/submissions',
      validationDetails
    });
  }

  try {
    const data: SubmissionApiResponse = await res.json();
    return data;
  } catch {
    throw new ApiError('Invalid JSON response received from backend on submission intake.', {
      status: res.status,
      code: 'INVALID_JSON',
      endpoint: '/api/submissions'
    });
  }
}

// Local storage key strictly for client UI preferences (theme, daily goal, table density)
const PREFERENCES_STORAGE_KEY = 'leettracker_settings_store';

/**
 * One-time cleanup utility to remove legacy mock data from client storage.
 */
export function purgeLegacyMockStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('leettracker_problems_store_v5');
    localStorage.removeItem('leettracker_problems_store_v4');
    localStorage.removeItem('leettracker_problems_store_v3');
    sessionStorage.removeItem('leettracker_auth_session_v1');
  } catch {
    // Ignore storage access errors
  }
}

/**
 * Load user UI preferences (theme, view mode, daily target).
 */
export function getLocalSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user UI preferences.
 */
export function saveLocalSettings(settings: UserSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

/**
 * Fetch problems list from backend API: GET /api/problems
 * Strictly relies on backend API as single source of truth without mock fallbacks.
 */
export async function getProblems(params?: {
  search?: string;
  difficulty?: string;
  pattern?: string;
  language?: string;
  sort?: string;
}): Promise<Problem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
  if (params?.pattern && params.pattern !== 'All') query.set('pattern', params.pattern);
  if (params?.language && params.language !== 'All') query.set('language', params.language);
  if (params?.sort) query.set('sort', params.sort);

  const endpoint = `/api/problems${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetchWithTimeout(endpoint, { method: 'GET' }, 8000);

  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiEndpointNotFoundError(
        '/api/problems',
        'The problems API endpoint (/api/problems) was not found on the backend service.'
      );
    }
    if (res.status === 401) {
      throw new UnauthorizedError('Please sign in to view your problems repository.');
    }
    if (res.status === 403) {
      throw new ForbiddenError('You do not have permission to access this problem repository.');
    }

    let detail = res.statusText;
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || detail;
    } catch {
      // Non-JSON error
    }
    throw new ApiError(`Failed to fetch problems from backend (${res.status}): ${detail}`, {
      status: res.status,
      code: 'FETCH_PROBLEMS_FAILED',
      endpoint
    });
  }

  const data = await res.json();
  const rawList = Array.isArray(data) ? data : data && Array.isArray(data.problems) ? data.problems : [];

  return rawList.map((p: any, idx: number): Problem => {
    const rawLanguages: string[] = [
      ...(Array.isArray(p.languages) ? p.languages : []),
      ...(typeof p.language === 'string' && p.language ? [p.language] : [])
    ].filter((language: unknown): language is string => typeof language === 'string' && language.trim().length > 0);

    const languages = Array.from(
      new Set(rawLanguages.map((language: string) => normalizeLanguage(language)).filter(Boolean))
    ) as Problem['languages'];

    return {
      id: String(p.id || p.slug || idx),
      slug: p.slug || '',
      leetcodeNumber: p.leetcodeNumber || p.number || idx + 1,
      title: p.title || 'Untitled Problem',
      difficulty: (p.difficulty ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase() : 'Easy') as any,
      leetcodeUrl: p.url || p.leetcodeUrl || (p.slug ? `https://leetcode.com/problems/${p.slug}` : ''),
      patterns: (p.distinct_patterns || p.patterns || []).map((pat: string) => pat as any),
      topics: p.topics || [],
      language: languages && languages.length > 0 ? languages[0] : undefined,
      languages,
      status: (p.status || 'Accepted') as any,
      submittedAt: p.latest_submitted_at || p.submittedAt || new Date().toISOString(),
      code: p.code || '',
      timeComplexity: p.timeComplexity || p.time_complexity || 'O(n)',
      spaceComplexity: p.spaceComplexity || p.space_complexity || 'O(1)',
      approach: p.approach || '',
      explanation: p.explanation || '',
      aiAnalysis: p.aiAnalysis || {
        approach: '',
        whyItWorks: '',
        timeComplexity: '',
        timeComplexityExplanation: '',
        spaceComplexity: '',
        spaceComplexityExplanation: '',
        keyObservations: [],
        alternativeApproaches: []
      }
    };
  });
}

/**
 * Fetch problem by slug or id from backend API: GET /api/problems/{slug}
 * Strictly relies on backend API without mock fallbacks.
 */
export async function getProblemByIdOrSlug(idOrSlug: string): Promise<Problem> {
  const endpoint = `/api/problems/${encodeURIComponent(idOrSlug)}`;
  const res = await fetchWithTimeout(endpoint, { method: 'GET' }, 8000);

  if (!res.ok) {
    if (res.status === 404) {
      let isResourceNotFound = false;
      let detail = '';
      try {
        const errJson = await res.json();
        detail = errJson.detail || errJson.message || '';
        if (detail.toLowerCase().includes('not found') || errJson.error) {
          isResourceNotFound = true;
        }
      } catch {
        // If HTML returned, likely missing endpoint
      }

      if (isResourceNotFound || detail) {
        throw new ResourceNotFoundError(
          detail || `Problem "${idOrSlug}" was not found in your problem repository.`,
          endpoint
        );
      }

      throw new ApiEndpointNotFoundError(
        endpoint,
        `Problem details endpoint (${endpoint}) was not found on the backend service.`
      );
    }

    if (res.status === 401) {
      throw new UnauthorizedError('Please sign in to view problem details.');
    }

    let detail = res.statusText;
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || detail;
    } catch {
      // Non-JSON error
    }

    throw new ApiError(`Failed to fetch problem "${idOrSlug}" (${res.status}): ${detail}`, {
      status: res.status,
      code: 'FETCH_PROBLEM_FAILED',
      endpoint
    });
  }

  const raw = await res.json();
  const rawSubmissions: any[] = Array.isArray(raw.submissions) ? raw.submissions : [];

  const mappedSubmissions: Problem[] = rawSubmissions.map((s: any, idx: number): Problem => {
    const subPatterns = (s.analysis?.patterns || [])
      .map((p: any) => p.main_pattern || p.pattern_name)
      .filter(Boolean);
    const effectivePatterns = subPatterns.length > 0 ? subPatterns : raw.distinct_patterns || [];
    const language = s.language ? normalizeLanguage(s.language) : undefined;

    return {
      id: String(s.id || `${raw.slug}-${idx}`),
      slug: raw.slug || idOrSlug,
      leetcodeNumber: raw.leetcodeNumber || 1,
      title: raw.title || idOrSlug,
      difficulty: (raw.difficulty ? raw.difficulty.charAt(0).toUpperCase() + raw.difficulty.slice(1).toLowerCase() : 'Easy') as any,
      leetcodeUrl: raw.url || (raw.slug ? `https://leetcode.com/problems/${raw.slug}` : ''),
      patterns: effectivePatterns.map((pat: string) => pat as any),
      topics: raw.topics || [],
      language: language as any,
      languages: language ? [language as any] : [],
      status: (s.status || 'Accepted') as any,
      submittedAt: s.submitted_at || new Date().toISOString(),
      code: s.code || '',
      timeComplexity: s.analysis?.time_complexity || 'O(n)',
      spaceComplexity: s.analysis?.space_complexity || 'O(1)',
      approach: s.analysis?.explanation || '',
      explanation: s.analysis?.explanation || '',
      aiAnalysis: {
        approach: s.analysis?.explanation || '',
        whyItWorks: '',
        timeComplexity: s.analysis?.time_complexity || 'O(n)',
        timeComplexityExplanation: '',
        spaceComplexity: s.analysis?.space_complexity || 'O(1)',
        spaceComplexityExplanation: '',
        keyObservations: s.analysis?.data_structures?.length > 0 ? [`Data Structures: ${s.analysis.data_structures.join(', ')}`] : [],
        alternativeApproaches: [],
        backendAnalysis: s.analysis
      }
    };
  });

  const latestProblem = mappedSubmissions.length > 0 ? mappedSubmissions[0] : {
    id: String(raw.id || raw.slug || idOrSlug),
    slug: raw.slug || idOrSlug,
    leetcodeNumber: raw.leetcodeNumber || 1,
    title: raw.title || idOrSlug,
    difficulty: (raw.difficulty ? raw.difficulty.charAt(0).toUpperCase() + raw.difficulty.slice(1).toLowerCase() : 'Easy') as any,
    leetcodeUrl: raw.url || (raw.slug ? `https://leetcode.com/problems/${raw.slug}` : ''),
    patterns: (raw.distinct_patterns || raw.patterns || []).map((pat: string) => pat as any),
    topics: raw.topics || [],
    language: undefined,
    languages: [],
    status: 'Accepted' as any,
    submittedAt: new Date().toISOString(),
    code: '',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    approach: '',
    explanation: '',
    aiAnalysis: {
      approach: '',
      whyItWorks: '',
      timeComplexity: 'O(n)',
      timeComplexityExplanation: '',
      spaceComplexity: 'O(1)',
      spaceComplexityExplanation: '',
      keyObservations: [],
      alternativeApproaches: []
    }
  };

  return {
    ...latestProblem,
    submissions: mappedSubmissions
  };
}

/**
 * Fetch aggregated dashboard statistics from backend API: GET /api/dashboard/stats
 * Strictly relies on backend API without mock fallbacks or fabricated streak numbers.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const endpoint = '/api/dashboard/stats';
  const res = await fetchWithTimeout(endpoint, { method: 'GET' }, 8000);

  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiEndpointNotFoundError(
        endpoint,
        'Dashboard statistics endpoint (/api/dashboard/stats) was not found on the backend service.'
      );
    }
    if (res.status === 401) {
      throw new UnauthorizedError('Please sign in to view dashboard statistics.');
    }

    let detail = res.statusText;
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || detail;
    } catch {
      // Non-JSON error
    }

    throw new ApiError(`Failed to fetch dashboard statistics (${res.status}): ${detail}`, {
      status: res.status,
      code: 'FETCH_STATS_FAILED',
      endpoint
    });
  }

  const raw = await res.json();
  const diff = raw.difficulty_breakdown || {};
  const easy = diff.Easy || diff.easy || raw.easySolved || 0;
  const medium = diff.Medium || diff.medium || raw.mediumSolved || 0;
  const hard = diff.Hard || diff.hard || raw.hardSolved || 0;
  const totalSolved = raw.total_problems_solved ?? raw.totalSolved ?? (easy + medium + hard);
  const totalSubmissions = raw.total_submissions ?? totalSolved;
  const patternCounts = raw.pattern_counts ?? raw.patternCounts ?? {};
  const uniquePatternsSolved = Object.keys(patternCounts).filter(k => patternCounts[k] > 0).length;

  const acceptanceRate = totalSubmissions > 0
    ? Math.round((totalSolved / totalSubmissions) * 1000) / 10
    : 100;

  return {
    totalSolved,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    totalPatternsCount: uniquePatternsSolved,
    patternCounts,
    streakDays: raw.streakDays ?? 0,
    longestStreakDays: raw.longestStreakDays ?? 0,
    acceptanceRate
  };
}

/**
 * Fetch analytics distribution data from backend API: GET /api/analytics
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
  const endpoint = '/api/analytics';
  const res = await fetchWithTimeout(endpoint, { method: 'GET' }, 8000);

  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiEndpointNotFoundError(
        endpoint,
        'Analytics endpoint (/api/analytics) was not found on the backend service.'
      );
    }
    if (res.status === 401) {
      throw new UnauthorizedError('Please sign in to view analytics metrics.');
    }

    let detail = res.statusText;
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || detail;
    } catch {
      // Non-JSON error
    }

    throw new ApiError(`Failed to fetch analytics from backend (${res.status}): ${detail}`, {
      status: res.status,
      code: 'FETCH_ANALYTICS_FAILED',
      endpoint
    });
  }

  const raw = await res.json();
  const rawPatterns: { name: string; count: number }[] = Array.isArray(raw.patterns) ? raw.patterns : [];
  const rawLanguages: { name: string; count: number }[] = Array.isArray(raw.languages) ? raw.languages : [];

  const totalPatternCount = rawPatterns.reduce((sum, p) => sum + (p.count || 0), 0) || 1;
  const patternDistribution = rawPatterns.map(p => ({
    pattern: p.name as any,
    count: p.count,
    percentage: Math.round((p.count / totalPatternCount) * 100)
  }));

  const totalLangCount = rawLanguages.reduce((sum, l) => sum + (l.count || 0), 0) || 1;
  const languageDistribution = rawLanguages.map(l => ({
    language: l.name as any,
    count: l.count,
    percentage: Math.round((l.count / totalLangCount) * 100)
  }));

  let problemsList: Problem[] = [];
  try {
    problemsList = await getProblems();
  } catch {
    // Non-blocking fallback
  }

  const easy = problemsList.filter(p => p.difficulty === 'Easy').length;
  const medium = problemsList.filter(p => p.difficulty === 'Medium').length;
  const hard = problemsList.filter(p => p.difficulty === 'Hard').length;

  const difficultyDistribution = [
    { name: 'Easy' as const, value: easy, color: '#10B981' },
    { name: 'Medium' as const, value: medium, color: '#F59E0B' },
    { name: 'Hard' as const, value: hard, color: '#EF4444' }
  ];

  const getDailyActivity = (days: number) => {
    let anchor = new Date();
    const timestamps = problemsList
      .map(p => new Date(p.submittedAt).getTime())
      .filter(t => !isNaN(t));
    if (timestamps.length > 0) {
      anchor = new Date(Math.max(...timestamps));
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const list = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = days <= 7 ? dayNames[d.getDay()] : `${monthNames[d.getMonth()]} ${d.getDate()}`;

      const matches = problemsList.filter(p => p.submittedAt && p.submittedAt.startsWith(dateStr));
      const easyCount = matches.filter(p => p.difficulty === 'Easy').length;
      const mediumCount = matches.filter(p => p.difficulty === 'Medium').length;
      const hardCount = matches.filter(p => p.difficulty === 'Hard').length;

      list.push({
        date: dateStr,
        label,
        count: matches.length,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount
      });
    }
    return list;
  };

  return {
    timeActivity: {
      sevenDays: getDailyActivity(7),
      thirtyDays: getDailyActivity(30),
      ninetyDays: getDailyActivity(90)
    },
    difficultyDistribution,
    patternDistribution,
    languageDistribution,
    strongestPatterns: patternDistribution.slice(0, 3),
    growthAreas: patternDistribution.slice(-2)
  };
}
