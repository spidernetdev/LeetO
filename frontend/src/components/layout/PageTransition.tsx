'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Lightweight page transition. Uses a CSS animation so the initial HTML paints
 * immediately (the previous JS-driven animation started at opacity: 0, which
 * delayed Lighthouse's LCP detection and added ~30 KB of animation runtime).
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition w-full min-w-0 flex-1">
      {children}
    </div>
  );
};
