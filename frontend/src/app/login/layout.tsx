import type { Metadata } from 'next';
import { AuthProvider } from '@/src/lib/auth';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Sign in',
  'Sign in to LeetO to review your LeetCode progress, submissions, and algorithmic pattern analytics.'
);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
