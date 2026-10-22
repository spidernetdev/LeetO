'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Code2,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Target,
  Search,
  Plus,
  Shuffle,
  LogOut
} from 'lucide-react';
import { UserSettings, Problem } from '../../lib/types';
import { useAuth } from '../../lib/auth';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  solvedCount: number;
  todaySolvedCount?: number;
  problems?: Problem[];
  settings: UserSettings;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onPickRandomProblem?: () => void;
  onOpenSearch?: () => void;
  onOpenNewSubmission?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  solvedCount,
  todaySolvedCount,
  problems,
  settings,
  isCollapsed = false,
  onToggleCollapse,
  onPickRandomProblem,
  onOpenSearch,
  onOpenNewSubmission
}) => {
  const { logout, user } = useAuth();

  // Dynamic daily target from user settings (minimum 1)
  const dailyTarget = Math.max(1, settings?.dailyGoal || 1);

  // Solved submissions for today derived from props or calculated dynamically from problems
  const solvedToday = React.useMemo(() => {
    if (typeof todaySolvedCount === 'number') {
      return todaySolvedCount;
    }
    if (!problems || problems.length === 0) {
      return 0;
    }
    const now = new Date();
    const utcToday = now.toISOString().split('T')[0];
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return problems.filter(p => {
      if (!p.submittedAt) return false;
      const d = p.submittedAt.split('T')[0];
      return d === utcToday || d === localToday;
    }).length;
  }, [problems, todaySolvedCount]);

  const progressPercent = Math.min(100, Math.round((solvedToday / dailyTarget) * 100));
  const isGoalReached = solvedToday >= dailyTarget;
  const remaining = Math.max(0, dailyTarget - solvedToday);

  const navItems = [
    { id: '/overview', label: 'Overview', icon: LayoutDashboard, shortcut: '1' },
    { id: '/problems', label: 'Problems', icon: Code2, badge: solvedCount, shortcut: '2' },
    { id: '/analytics', label: 'Analytics', icon: BarChart3, shortcut: '3' },
    { id: '/settings', label: 'Settings', icon: Settings, shortcut: '4' }
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  // Expanded sidebar content (used on desktop expanded and inside mobile drawer)
  const expandedContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-[#0A0A0A] border-r border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#A1A1AA]">
      <div>
        {/* Brand / Logo header */}
        <div className="flex items-center justify-between px-3.5 py-3.5 border-b border-neutral-200 dark:border-[#262626]">
          <div
            onClick={() => handleNav('/overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex h-7 w-7 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="LeetO Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900 dark:text-[#EDEDED] text-sm tracking-tight">
                LeetO
              </span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-[#A1A1AA]">
                v1.2
              </span>
            </div>
          </div>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-neutral-400 hover:text-neutral-800 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#181818] rounded transition-colors"
              title="Collapse sidebar ([)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-800 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#181818] rounded transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation items */}
        <div className="px-2 pt-3 pb-2">
          <div className="px-2 pb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-[#A1A1AA]">
            <span>Platform</span>
            <span className="text-[10px] font-mono lowercase opacity-60">keys 1-4</span>
          </div>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                item.id === '/overview'
                  ? currentRoute === '/overview'
                  : currentRoute.startsWith(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-[#181818] text-neutral-900 dark:text-[#EDEDED] font-semibold'
                      : 'text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-neutral-900 dark:text-[#EDEDED]'
                          : 'text-neutral-400 dark:text-[#A1A1AA]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className="text-[11px] font-mono tabular-nums text-neutral-400 dark:text-[#A1A1AA]">
                        {item.badge}
                      </span>
                    )}
                    <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-neutral-400 dark:text-[#525252] opacity-60">
                      {item.shortcut}
                    </kbd>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions inside mobile drawer */}
          {(onOpenSearch || onOpenNewSubmission || onPickRandomProblem) && (
            <div className="pt-4 lg:hidden">
              <div className="px-2 pb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-[#A1A1AA]">
                <span>Quick Actions</span>
              </div>
              <div className="space-y-0.5">
                {onOpenSearch && (
                  <button
                    onClick={() => {
                      onCloseMobile();
                      onOpenSearch();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#121212] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA]" />
                      <span>Search Library</span>
                    </div>
                    <kbd className="px-1 py-0.2 text-[9px] font-mono text-neutral-400 dark:text-[#525252]">
                      ⌘K
                    </kbd>
                  </button>
                )}
                {onOpenNewSubmission && (
                  <button
                    onClick={() => {
                      onCloseMobile();
                      onOpenNewSubmission();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#121212] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA]" />
                      <span>Log New Solution</span>
                    </div>
                    <kbd className="px-1 py-0.2 text-[9px] font-mono text-neutral-400 dark:text-[#525252]">
                      N
                    </kbd>
                  </button>
                )}
                {onPickRandomProblem && (
                  <button
                    onClick={() => {
                      onCloseMobile();
                      onPickRandomProblem();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#121212] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shuffle className="h-4 w-4 text-neutral-400 dark:text-[#A1A1AA]" />
                      <span>Random Problem</span>
                    </div>
                    <kbd className="px-1 py-0.2 text-[9px] font-mono text-neutral-400 dark:text-[#525252]">
                      R
                    </kbd>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Area: Daily Target Goal & User Profile Card */}
      <div>
        {/* Daily Target Goal Progress (dynamic from settings and submissions) */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#222222] bg-neutral-50/70 dark:bg-[#0D0D0D]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <button
              onClick={() => handleNav('/settings')}
              className="flex items-center gap-1.5 text-neutral-700 dark:text-[#D4D4D4] font-medium hover:text-neutral-900 dark:hover:text-white transition-colors group cursor-pointer text-left"
              title="Click to adjust Daily Target in Settings"
            >
              <Target className={`h-3.5 w-3.5 ${isGoalReached ? 'text-emerald-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className="group-hover:underline">Daily Target</span>
            </button>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-[#888888]">
              {solvedToday} / {dailyTarget} solved
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-[#222222] h-1.5 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGoalReached ? 'bg-emerald-500' : 'bg-emerald-500 dark:bg-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-[#A1A1AA]">
            <span>
              {isGoalReached ? (
                solvedToday > dailyTarget ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Goal surpassed! (+{solvedToday - dailyTarget} extra)
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Daily goal achieved! 🎉
                  </span>
                )
              ) : (
                <span>
                  {remaining} more problem{remaining === 1 ? '' : 's'} to hit today&apos;s goal
                </span>
              )}
            </span>
            <span className="font-mono text-[9px] text-neutral-400 dark:text-[#A1A1AA]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => handleNav('/settings')}
                className="h-7 w-7 rounded bg-neutral-100 dark:bg-[#1C1C1C] border border-neutral-300 dark:border-[#333333] flex items-center justify-center font-mono text-xs font-semibold text-neutral-900 dark:text-[#EDEDED] shrink-0 hover:border-neutral-500 transition-colors"
                title="Edit Profile & Settings"
              >
                {(user?.username || settings.name).slice(0, 1).toUpperCase()}
              </button>
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => handleNav('/settings')}
                  className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED] truncate text-left block w-full hover:underline"
                >
                  {user?.username || settings.name}
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-[#A1A1AA] truncate">
                  <span className="truncate">{user?.email || 'Signed In'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-[#181818] rounded transition-colors shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Compact Icon Rail (used when sidebar is collapsed on desktop)
  const collapsedRail = (
    <div className="flex h-full flex-col justify-between items-center py-3 bg-white dark:bg-[#0A0A0A] border-r border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-[#A1A1AA]">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Compact Logo */}
        <button
          onClick={() => handleNav('/overview')}
          className="relative flex h-8 w-8 items-center justify-center p-0.5 rounded transition-transform hover:scale-110"
          title="LeetO (Overview)"
        >
          <Image
            src="/logo.png"
            alt="LeetO Logo"
            width={28}
            height={28}
            className="w-full h-full object-contain"
            priority
          />
        </button>

        {/* Expand toggle button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#181818] rounded transition-colors"
            title="Expand sidebar ([)"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}

        <div className="w-8 h-[1px] bg-neutral-200 dark:border-[#222222]" />

        {/* Icon-only nav list */}
        <nav className="flex flex-col items-center gap-1 w-full px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              item.id === '/overview'
                ? currentRoute === '/overview'
                : currentRoute.startsWith(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative flex items-center justify-center h-9 w-9 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-[#181818] text-neutral-900 dark:text-[#EDEDED]'
                    : 'text-neutral-500 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-50 dark:hover:bg-[#141414]'
                }`}
                title={`${item.label} (Press ${item.shortcut})`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-neutral-900 dark:text-[#EDEDED]' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapsed footer Daily Target, avatar & Logout */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handleNav('/settings')}
          className="relative flex items-center justify-center h-7 w-7 rounded text-neutral-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-[#181818] transition-colors"
          title={`Daily Target: ${solvedToday} / ${dailyTarget} solved (${progressPercent}%)`}
        >
          <Target className={`h-3.5 w-3.5 ${isGoalReached ? 'text-emerald-500' : 'text-neutral-400 dark:text-[#A1A1AA]'}`} />
          {isGoalReached && (
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => handleNav('/settings')}
          className="h-7 w-7 rounded bg-neutral-100 dark:bg-[#1C1C1C] border border-neutral-300 dark:border-[#333333] flex items-center justify-center font-mono text-xs font-semibold text-neutral-900 dark:text-[#EDEDED] hover:border-neutral-500 transition-colors"
          title={`Settings - ${user?.username || settings.name}`}
        >
          {(user?.username || settings.name).slice(0, 1).toUpperCase()}
        </button>
        <button
          onClick={logout}
          className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
          title="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 z-30 transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-14' : 'w-56'
        }`}
      >
        {isCollapsed ? collapsedRail : expandedContent}
      </aside>

      {/* Mobile drawer (always renders expanded full content when open) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {expandedContent}
          </div>
        </div>
      )}
    </>
  );
};
