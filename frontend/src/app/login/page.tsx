'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/lib/auth';
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  Layers,
  Flame,
  Sparkles
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/overview';

  const { initiateGoogleLogin, isAuthenticated, isLoading, backendAuthError, backendAuthStatus } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);


  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(nextUrl);
    }
  }, [isAuthenticated, nextUrl, router]);

  // Primary action: Redirect browser to backend Google OAuth initiation endpoint
  const handleGoogleSignIn = () => {
    setLocalError(null);
    setIsRedirecting(true);
    try {
      initiateGoogleLogin(nextUrl);
    } catch (err: any) {
      setIsRedirecting(false);
      setLocalError(err.message || 'Failed to initiate Google OAuth redirect');
    }
  };

  const activeError = localError || backendAuthError;

  return (
    <div className="page-transition min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#EDEDED]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Authentication Card (7 cols on lg, full width on mobile) */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto space-y-6">
          {/* Brand Logo & Heading */}
          <div className="text-center sm:text-left space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] hover:border-neutral-300 dark:hover:border-[#383838] transition-colors shadow-2xs group"
            >
              <div className="relative flex h-6 w-6 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="LeetO Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white">
                LeetO
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-500 dark:text-[#888888]">
                v1.2
              </span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white pt-1">
              Welcome to LeetO
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
              Sign in with Google to track your LeetCode journey, organize your solutions, and understand the patterns behind your progress.
            </p>
          </div>

          {/* Next route redirect notice */}
          {nextUrl !== '/overview' && (
            <div className="rounded-md border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-2.5 text-[11px] text-neutral-600 dark:text-[#A1A1AA] flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>
                Authentication required for <code className="font-mono text-neutral-900 dark:text-white">{nextUrl}</code>. Sign in to continue.
              </span>
            </div>
          )}

          {/* Authentication Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-6 sm:p-7 shadow-sm space-y-5">
            {/* Error Banner */}
            {activeError && (
              <div className="rounded-md border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="space-y-1 flex-1">
                  <span className="font-semibold block text-[11px]">Authentication Notice</span>
                  <span className="text-[11px] leading-relaxed block">{activeError}</span>
                </div>
                <button
                  onClick={() => setLocalError(null)}
                  className="text-xs font-mono text-rose-500 hover:text-rose-700 underline shrink-0 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Backend Endpoint Notice if 404 */}
            {backendAuthStatus === 'endpoint_missing' && !activeError && (
              <div className="rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <span className="font-semibold block text-[11px]">Backend OAuth Service</span>
                  <span className="text-[11px] leading-relaxed block">
                    Authentication is driven by the backend at <code>/api/auth/google</code>. Ensure your FastAPI service is online to complete sign-in.
                  </span>
                </div>
              </div>
            )}

            {/* The Sole Primary Authentication Button: Continue with Google */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isRedirecting}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer select-none bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 hover:text-neutral-900 border-neutral-300 hover:border-neutral-400 dark:bg-[#161616] dark:hover:bg-[#1E1E1E] dark:active:bg-[#222222] dark:text-[#EDEDED] dark:hover:text-white dark:border-[#2E2E2E] dark:hover:border-[#3E3E3E] shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Continue with Google"
              >
                {isLoading || isRedirecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-500 dark:text-neutral-400" />
                    <span>Connecting to Backend OAuth...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google G Logo */}
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-semibold text-neutral-800 dark:text-[#EDEDED]">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              {/* Supporting reassurance note */}
              <div className="flex items-center justify-center gap-1.5 text-center text-xs text-neutral-500 dark:text-[#A1A1AA] pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Backend-verified Google OAuth. No separate password required.</span>
              </div>
            </div>


            


            

            {/* Registration and Sign-in unified note */}
            <div className="pt-3 border-t border-neutral-100 dark:border-[#1E1E1E] text-center">
              <p className="text-[11px] text-neutral-400 dark:text-[#A1A1AA]">
                New and returning developers sign in through the same Google flow. Your account and repository are linked automatically by the backend.
              </p>
            </div>
          </div>

          {/* Subtle footer link */}
          <div className="flex items-center justify-start text-xs text-neutral-500 dark:text-[#A1A1AA] px-1">
            <Link
              href="/"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Return to Home
            </Link>
          </div>
        </div>

        {/* Right Column: Subtle Product Preview (hidden on mobile, visible on desktop lg+) */}
        <div className="hidden lg:block lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Workspace Preview
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Backend Synced
              </span>
            </div>

            {/* Visual Overview Summary */}
            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/50 dark:border-[#222222]">
                <div className="text-[10px] text-neutral-400">Target</div>
                <div className="text-base font-bold text-neutral-900 dark:text-white">Daily Goals</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Automated Intake</div>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/50 dark:border-[#222222]">
                <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500" />
                  Streak
                </div>
                <div className="text-base font-bold text-amber-600 dark:text-amber-400">Activity Calendar</div>
                <div className="text-[10px] text-neutral-400">90-Day Tracker</div>
              </div>
            </div>

            {/* Algorithmic Pattern Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-neutral-700 dark:text-[#A1A1AA] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Detected Algorithmic Patterns
              </span>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40">
                  Two Pointers
                </span>
                <span className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
                  Sliding Window
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                  Binary Search
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                  Dynamic Programming
                </span>
              </div>
            </div>

            {/* Problem Sync Notice */}
            <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#161616] border border-neutral-200/50 dark:border-[#222222] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-900 dark:text-white">Chrome Extension Intake</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">
                  Automated
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-[#888888] font-mono">
                Submissions on LeetCode sync directly to your repository
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
