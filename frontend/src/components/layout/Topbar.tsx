'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Plus,
  ChevronRight,
  Maximize2,
  Minimize2,
  Shuffle,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Code2,
  BarChart3,
  Settings as SettingsIcon
} from 'lucide-react';
import { UserSettings, Problem, DashboardStats } from '../../lib/types';
import { StreakBadge } from './StreakBadge';

interface TopbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNewSubmission: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  settings: UserSettings;
  problemTitle?: string;
  problems?: Problem[];
  stats?: DashboardStats | null;
  onPickRandomProblem?: () => void;
  onOpenShortcuts?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNewSubmission,
  isDark,
  onToggleTheme,
  settings,
  problemTitle,
  problems = [],
  stats,
  onPickRandomProblem,
  onOpenShortcuts,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  const getBreadcrumbs = () => {
    if (currentRoute === '/overview') {
      return [{ label: 'Overview', path: '/overview' }];
    }
    if (currentRoute === '/analytics') {
      return [
        { label: 'Overview', path: '/overview' },
        { label: 'Analytics', path: '/analytics' }
      ];
    }
    if (currentRoute === '/settings') {
      return [
        { label: 'Overview', path: '/overview' },
        { label: 'Settings', path: '/settings' }
      ];
    }
    if (currentRoute.startsWith('/problems/')) {
      return [
        { label: 'Problems', path: '/problems' },
        { label: problemTitle || 'Problem', path: currentRoute }
      ];
    }
    return [{ label: 'Problems', path: '/problems' }];
  };

  const breadcrumbs = getBreadcrumbs();

  // Navigation tabs for when sidebar is collapsed (to preserve rapid switching)
  const navTabs = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/problems', label: 'Problems', icon: Code2, count: problems.length },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header
      className={`sticky top-0 z-20 flex h-13 sm:h-14 w-full items-center justify-between gap-1.5 sm:gap-2 md:gap-4 border-b border-neutral-200 dark:border-[#262626] bg-white/95 dark:bg-[#0A0A0A]/95 px-2.5 sm:px-4 md:px-5 backdrop-blur-md transition-colors ${
        isFullscreen ? 'ring-1 ring-emerald-500/20' : ''
      }`}
    >
      {/* Zone 1: Navigation context (Sidebar Toggle / Mobile Hamburger / Brand / Breadcrumbs / Quick Tabs) */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 sm:p-2 text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 shrink-0"
          aria-label="Open mobile navigation menu"
          title="Open Menu"
        >
          <Menu className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
        </button>

        {/* Mobile Brand indicator (only shown on mobile/tablet when sidebar is offscreen) */}
        <div
          onClick={() => onNavigate('/overview')}
          className="flex lg:hidden items-center gap-1.5 cursor-pointer shrink-0 select-none group mr-0.5 sm:mr-1"
          title="LeetO Overview"
        >
          <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="LeetO Logo"
              width={26}
              height={26}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-[#EDEDED] tracking-tight hidden min-[440px]:inline">
            LeetO
          </span>
        </div>

        {/* Desktop Sidebar Toggle button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] rounded-md transition-colors focus-visible:outline-none shrink-0"
            title={isSidebarCollapsed ? 'Expand sidebar ([)' : 'Collapse sidebar ([)'}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs min-w-0">
          <ol className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={crumb.path} className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-neutral-400 dark:text-[#525252] shrink-0" />
                  )}
                  {isLast ? (
                    <span
                      title={crumb.label}
                      className="text-neutral-900 dark:text-[#EDEDED] font-medium truncate max-w-[85px] min-[380px]:max-w-[120px] min-[480px]:max-w-[170px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-xs"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate(crumb.path)}
                      className="text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors truncate focus-visible:outline-none hidden sm:inline"
                    >
                      {crumb.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Responsive Quick Navigation Tabs */}
        {/* Shown on tablet (md:flex lg:hidden) AND on desktop when sidebar is collapsed (isSidebarCollapsed && lg:flex) */}
        {/* Avoids duplication: hidden when desktop sidebar is expanded, hidden on small mobile */}
        <div
          className={`items-center gap-1 ml-2 pl-2 border-l border-neutral-200 dark:border-[#262626] ${
            isSidebarCollapsed ? 'hidden md:flex' : 'hidden md:flex lg:hidden'
          }`}
        >
          {navTabs.map(tab => {
            const isActive =
              tab.path === '/'
                ? currentRoute === '/'
                : currentRoute.startsWith(tab.path);
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => onNavigate(tab.path)}
                className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-900 dark:text-[#EDEDED]'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#141414]'
                }`}
              >
                <Icon
                  className={`h-3 w-3 shrink-0 ${
                    isActive ? 'text-neutral-900 dark:text-[#EDEDED]' : 'text-neutral-400 dark:text-[#A1A1AA]'
                  }`}
                />
                <span className="hidden min-[860px]:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-[#A1A1AA] hidden min-[860px]:inline">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Zone: Fullscreen focus indicator (only displayed in fullscreen mode on widescreen) */}
      {isFullscreen && (
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Full Screen Focus</span>
        </div>
      )}

      {/* Zone 2: Workspace utilities and quick actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        {/* Streak & Daily Target Widget */}
        <StreakBadge
          stats={stats || null}
          settings={settings}
          problems={problems}
          targetDaily={settings?.dailyGoal}
          onViewCalendar={() => onNavigate('/')}
          onNavigateSettings={() => onNavigate('/settings')}
        />

        {/* Pick Random Problem button (visible on sm+, hidden on small mobile to avoid crowding) */}
        {onPickRandomProblem && (
          <button
            onClick={onPickRandomProblem}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#161616] border border-neutral-200 dark:border-[#262626] rounded-md transition-colors shrink-0"
            title="Pick Random Problem to Practice (Press R)"
            aria-label="Pick Random Problem"
          >
            <Shuffle className="h-3 w-3 text-neutral-500 dark:text-[#A1A1AA] shrink-0" />
            <span className="hidden xl:inline text-xs">Random</span>
          </button>
        )}

        {/* Quick Search command trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 md:gap-2 px-2 sm:px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#A1A1AA] bg-neutral-100/80 hover:bg-neutral-100 dark:bg-[#121212] dark:hover:bg-[#161616] border border-neutral-200 hover:border-neutral-300 dark:border-[#262626] dark:hover:border-[#333333] rounded-md transition-colors shrink-0"
          title="Search problems (Ctrl+K or Cmd+K)"
          aria-label="Search problems"
        >
          <Search className="h-3.5 w-3.5 sm:h-3 sm:w-3 text-neutral-500 dark:text-[#A1A1AA] shrink-0" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center px-1 py-0.2 text-[10px] font-mono text-neutral-500 dark:text-[#A1A1AA] bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2B2B2B] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Primary CTA: Log submission action */}
        <button
          onClick={onOpenNewSubmission}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs active:bg-neutral-700 dark:active:bg-[#D4D4D4]"
          title="Track new solved problem (Press N)"
          aria-label="Log Solution"
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Log Solution</span>
        </button>

        {/* Fullscreen Toggle (desktop and tablet) */}
        <button
          onClick={handleToggleFullscreen}
          className={`hidden sm:flex p-1.5 rounded-md border transition-colors shrink-0 ${
            isFullscreen
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#161616] border-neutral-200 dark:border-[#262626]'
          }`}
          aria-label={isFullscreen ? 'Exit full screen (F)' : 'Enter full screen (F)'}
          title={isFullscreen ? 'Exit Full Screen Mode (Press F or Esc)' : 'Enter Full Screen Mode (Press F)'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="hidden md:flex p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#161616] rounded-md border border-neutral-200 dark:border-[#262626] transition-colors shrink-0"
            aria-label="Keyboard Shortcuts (?)"
            title="Keyboard Shortcuts Cheatsheet (Press ?)"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#161616] rounded-md border border-neutral-200 dark:border-[#262626] transition-colors shrink-0"
          aria-label={isDark ? 'Switch to light mode (T)' : 'Switch to dark mode (T)'}
          title={isDark ? 'Switch to Light Mode (Press T)' : 'Switch to Dark Mode (Press T)'}
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* User avatar: ONLY shown on mobile/tablet or when sidebar is collapsed on desktop */}
        <button
          onClick={() => onNavigate('/settings')}
          className={`h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#2C2C2C] hover:border-neutral-400 dark:hover:border-[#404040] flex items-center justify-center text-[11px] font-mono font-medium text-neutral-900 dark:text-[#EDEDED] transition-colors shrink-0 ml-0.5 ${
            isSidebarCollapsed ? 'flex' : 'flex lg:hidden'
          }`}
          title={`User Settings - ${settings.name}`}
          aria-label="User Settings"
        >
          {settings.name.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
};
