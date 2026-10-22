import type { Metadata } from 'next';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

/** Canonical public origin used for metadata, sitemap, and robots. */
export const SITE_URL = (rawSiteUrl || 'https://leeto.app').replace(/\/+$/, '');

/** Backend origin (kept out of crawlable links). */
export const API_ORIGIN = (rawApiUrl || 'http://localhost:8000').replace(/\/+$/, '');

export const SITE_NAME = 'LeetO';
export const SITE_TITLE = 'LeetO — AI-Powered DSA Progress Dashboard';
export const SITE_DESCRIPTION =
  'Track LeetCode submissions automatically, organize solutions by algorithmic pattern, review code, and measure DSA interview preparation progress.';

export const SITE_KEYWORDS = [
  'LeetCode tracker',
  'DSA progress tracker',
  'algorithm pattern analysis',
  'coding interview preparation',
  'LeetCode dashboard',
  'AI code analysis',
  'data structures and algorithms',
  'Chrome extension for LeetCode'
];

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'LeetO dashboard showing LeetCode progress, algorithmic patterns, and submission analytics'
};

/**
 * Metadata for authenticated or account-only routes. These pages should never
 * appear in search results, even if a crawler discovers a link to them.
 */
export function privatePageMetadata(title: string, description: string): Metadata {
  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`
    },
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true
      }
    }
  };
}
