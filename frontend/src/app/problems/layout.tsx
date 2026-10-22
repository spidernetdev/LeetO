import type { Metadata } from 'next';
import { AppShell } from '@/src/components/layout/AppShell';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Problem Library',
  'Search, filter, and review your tracked LeetCode solutions by difficulty, language, and algorithmic pattern.'
);

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
