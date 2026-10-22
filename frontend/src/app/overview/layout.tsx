import type { Metadata } from 'next';
import { AppShell } from '@/src/components/layout/AppShell';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Overview',
  'Your LeetO dashboard with solved problem totals, difficulty breakdown, streaks, and recent submissions.'
);

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
