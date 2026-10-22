import type { Metadata } from 'next';
import { AppShell } from '@/src/components/layout/AppShell';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Problem Details',
  'Review an individual tracked LeetCode solution, including language, pattern, and submission history.'
);

export default function ProblemDetailLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
