import type { Metadata } from 'next';
import { AuthProvider } from '@/src/lib/auth';
import { privatePageMetadata } from '@/src/lib/seo';

export const metadata: Metadata = privatePageMetadata(
  'Create account',
  'Create a LeetO account to start automatically tracking LeetCode submissions and algorithmic patterns.'
);

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
