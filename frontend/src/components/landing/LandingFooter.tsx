import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface LandingFooterProps {
  extensionUrl: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ extensionUrl }) => {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-[#1E1E1E]">
          {/* Brand & Mission */}
          <div className="space-y-2 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-7 w-7 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="LeetO Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white">
                LeetO
              </span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] leading-relaxed">
              Automated submission tracking, algorithmic pattern classification, and progress analytics for technical interview preparation.
            </p>
          </div>

          {/* Navigation Links Column Groups */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2.5">
              <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">Product</span>
              <ul className="space-y-2 text-neutral-500 dark:text-[#888888]">
                <li>
                  <Link href="/overview" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Dashboard Overview
                  </Link>
                </li>
                <li>
                  <Link href="/problems" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Problems Table
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Velocity Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/settings" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">Extension</span>
              <ul className="space-y-2 text-neutral-500 dark:text-[#888888]">
                <li>
                  <a
                    href={extensionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Download Bundle</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>LeetCode</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">Account</span>
              <ul className="space-y-2 text-neutral-500 dark:text-[#888888]">
                <li>
                  <Link href="/login" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Sign in with Google
                  </Link>
                </li>
                <li>
                  <Link href="/overview" prefetch={false} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Dashboard Overview
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row: copyright & shortcuts reminder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-[#A1A1AA]">
          <div>
            © {new Date().getFullYear()} LeetO. All rights reserved.
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-[#A1A1AA]">
              1
            </kbd>
            <span>Overview</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-[#A1A1AA]">
              2
            </kbd>
            <span>Problems</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-[#A1A1AA]">
              3
            </kbd>
            <span>Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
