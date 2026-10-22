import type { Metadata } from 'next';
import { AppShell } from '@/src/components/layout/AppShell';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Analytics',
  'Analyze LeetCode practice velocity, difficulty distribution, language usage, and algorithmic pattern coverage.'
);

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
