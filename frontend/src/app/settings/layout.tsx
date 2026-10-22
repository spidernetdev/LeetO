import type { Metadata } from 'next';
import { AppShell } from '@/src/components/layout/AppShell';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Settings',
  'Manage your LeetO account preferences, appearance, and submission tracking settings.'
);

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
