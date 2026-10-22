'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import {
  Problem,
  DashboardStats,
  AnalyticsData,
  UserSettings
} from '../../lib/types';
import {
  getProblems,
  getDashboardStats,
  getAnalyticsData,
  getLocalSettings,
  saveLocalSettings,
  purgeLegacyMockStorage
} from '../../lib/api';
import { groupProblems } from '../../lib/utils';
import { AuthProvider, ProtectedRoute, useAuth } from '../../lib/auth';
import { PageTransition } from './PageTransition';
import { Check, Loader2 } from 'lucide-react';

// The authenticated shell is intentionally code-split away from the public
// landing page. Its chunks are only requested for protected routes (or when a
// modal is opened) instead of inflating the first visit.
const Sidebar = dynamic(() => import('./Sidebar').then((mod) => mod.Sidebar));
const Topbar = dynamic(() => import('./Topbar').then((mod) => mod.Topbar));
const SearchModal = dynamic(
  () => import('./SearchModal').then((mod) => mod.SearchModal),
  { ssr: false }
);
const NewSubmissionModal = dynamic(
  () => import('./NewSubmissionModal').then((mod) => mod.NewSubmissionModal),
  { ssr: false }
);
const ShortcutsModal = dynamic(
  () => import('./ShortcutsModal').then((mod) => mod.ShortcutsModal),
  { ssr: false }
);

interface AppContextType {
  problems: Problem[];
  problemsError: Error | null;
  stats: DashboardStats | null;
  statsError: Error | null;
  analytics: AnalyticsData | null;
  analyticsError: Error | null;
  settings: UserSettings;
  loading: boolean;
  refreshData: () => Promise<void>;
  recordSubmission: (problemData: Omit<Problem, 'id' | 'submittedAt'>) => Promise<void>;
  saveSettings: (newSettings: UserSettings) => void;
  resetSettings: () => void;
  showToast: (msg: string) => void;
  onOpenSearch: () => void;
  onOpenNewSubmission: () => void;
  onPickRandomProblem: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppShell');
  }
  return context;
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuth();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [newSubmissionOpen, setNewSubmissionOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Responsive Sidebar state (persisted)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('leettracker_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('leettracker_sidebar_collapsed', String(next));
      } catch (_e) {
        void _e;
      }
      return next;
    });
  }, []);

  // Core Data State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsError, setProblemsError] = useState<Error | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsError, setAnalyticsError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<UserSettings>(getLocalSettings);
  const [loading, setLoading] = useState(true);

  // Today's solved submissions dynamically calculated from real submissions list
  const todaySolvedCount = useMemo(() => {
    if (!problems || problems.length === 0) return 0;
    const now = new Date();
    const utcToday = now.toISOString().split('T')[0];
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return problems.filter(p => {
      if (!p.submittedAt) return false;
      const d = p.submittedAt.split('T')[0];
      return d === utcToday || d === localToday;
    }).length;
  }, [problems]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return settings.theme !== 'light';
  });

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      const nextTheme = next ? 'dark' : 'light';
      setSettings(s => {
        const updated = { ...s, theme: nextTheme as 'dark' | 'light' };
        saveLocalSettings(updated);
        return updated;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [probResult, statsResult, analyticsResult] = await Promise.allSettled([
        getProblems(),
        getDashboardStats(),
        getAnalyticsData()
      ]);

      if (probResult.status === 'fulfilled') {
        setProblems(probResult.value);
        setProblemsError(null);
      } else {
        setProblemsError(probResult.reason);
      }

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
        setStatsError(null);
      } else {
        setStatsError(statsResult.reason);
      }

      if (analyticsResult.status === 'fulfilled') {
        setAnalytics(analyticsResult.value);
        setAnalyticsError(null);
      } else {
        setAnalyticsError(analyticsResult.reason);
      }
    } catch (err) {
      console.error('Failed to load initial repository data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    purgeLegacyMockStorage();
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Record a new submission
  const recordSubmission = useCallback(
    async (problemData: Omit<Problem, 'id' | 'submittedAt'>) => {
      try {
        const created: Problem = {
          ...problemData,
          id: `sub_${Date.now()}`,
          submittedAt: new Date().toISOString()
        };
        setProblems(prev => [created, ...prev]);
        showToast(`Submission logged for #${created.leetcodeNumber} ${created.title}`);
        await loadData();
      } catch (err) {
        console.error('Failed to save submission:', err);
        showToast('Error recording submission');
      }
    },
    [loadData, showToast]
  );

  // Save Settings
  const handleSaveSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
    saveLocalSettings(newSettings);
    setIsDark(newSettings.theme !== 'light');
    showToast('Settings saved successfully');
  }, [showToast]);

  // Reset Settings
  const handleResetSettings = useCallback(() => {
    const defaultSettings = getLocalSettings();
    setSettings(defaultSettings);
    saveLocalSettings(defaultSettings);
    setIsDark(true);
    showToast('Settings reset to defaults');
  }, [showToast]);

  // Pick random unsolved/available problem
  const handlePickRandomProblem = useCallback(() => {
    if (problems.length === 0) return;
    const grouped = groupProblems(problems);
    const randomIndex = Math.floor(Math.random() * grouped.length);
    const targetProblem = grouped[randomIndex];
    if (targetProblem) {
      router.push(`/problems/${targetProblem.slug}`);
      showToast(`Selected random problem: #${targetProblem.leetcodeNumber} ${targetProblem.title}`);
    }
  }, [problems, router, showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handlePickRandomProblem();
        }
      } else if (e.key === 't' || e.key === 'T') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          toggleTheme();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setNewSubmissionOpen(true);
        }
      } else if (e.key === '[' || ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B'))) {
        e.preventDefault();
        toggleSidebar();
      } else if (e.key === '1') {
        router.push('/overview');
      } else if (e.key === '2') {
        router.push('/problems');
      } else if (e.key === '3') {
        router.push('/analytics');
      } else if (e.key === '4') {
        router.push('/settings');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handlePickRandomProblem, toggleTheme, router, toggleSidebar]);

  const contextValue = useMemo<AppContextType>(
    () => ({
      problems,
      problemsError,
      stats,
      statsError,
      analytics,
      analyticsError,
      settings,
      loading,
      refreshData: loadData,
      recordSubmission,
      saveSettings: handleSaveSettings,
      resetSettings: handleResetSettings,
      showToast,
      onOpenSearch: () => setSearchModalOpen(true),
      onOpenNewSubmission: () => setNewSubmissionOpen(true),
      onPickRandomProblem: handlePickRandomProblem
    }),
    [
      problems,
      problemsError,
      stats,
      statsError,
      analytics,
      analyticsError,
      settings,
      loading,
      loadData,
      recordSubmission,
      handleSaveSettings,
      handleResetSettings,
      showToast,
      handlePickRandomProblem
    ]
  );

  // Protected application routes
  return (
    <AppContext.Provider value={contextValue}>
      <ProtectedRoute>
        <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'dark bg-[#0A0A0A] text-[#EDEDED]' : 'bg-[#FAFAFA] text-[#18181B]'}`}>
          {/* Toast alert banner */}
          {toastMessage && (
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900 dark:bg-[#161616] border border-neutral-800 dark:border-[#2B2B2B] text-white dark:text-[#EDEDED] text-xs font-mono shadow-xl animate-in slide-in-from-bottom-2">
              <Check className="h-3 w-3 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Sidebar Navigation */}
          <Sidebar
            currentRoute={pathname}
            onNavigate={route => router.push(route)}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            solvedCount={problems.length}
            todaySolvedCount={todaySolvedCount}
            problems={problems}
            settings={settings}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            onPickRandomProblem={handlePickRandomProblem}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenNewSubmission={() => setNewSubmissionOpen(true)}
          />

          {/* Main Body */}
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar
              currentRoute={pathname}
              onNavigate={route => router.push(route)}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onOpenSearch={() => setSearchModalOpen(true)}
              onOpenNewSubmission={() => setNewSubmissionOpen(true)}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              settings={settings}
              problems={problems}
              stats={stats}
              onPickRandomProblem={handlePickRandomProblem}
              onOpenShortcuts={() => setShortcutsModalOpen(true)}
              isSidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={toggleSidebar}
            />

            <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
              {loading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-[#737373]">
                    <Loader2 className="h-5 w-5 animate-spin text-[#A1A1AA]" />
                    <span className="text-xs font-mono">Loading repository...</span>
                  </div>
                </div>
              ) : (
                <PageTransition>
                  {children}
                </PageTransition>
              )}
            </main>
          </div>

          {/* Global Modals */}
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            problems={problems}
            onSelectProblem={id => router.push(`/problems/${id}`)}
          />

          <NewSubmissionModal
            isOpen={newSubmissionOpen}
            onClose={() => setNewSubmissionOpen(false)}
            onSubmit={recordSubmission}
          />

          <ShortcutsModal
            isOpen={shortcutsModalOpen}
            onClose={() => setShortcutsModalOpen(false)}
          />
        </div>
      </ProtectedRoute>
    </AppContext.Provider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShellInner>{children}</AppShellInner>
    </AuthProvider>
  );
}
