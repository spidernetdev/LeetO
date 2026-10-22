import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/overview', '/problems', '/analytics', '/settings', '/login', '/signup']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
