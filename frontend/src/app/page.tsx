import type { Metadata } from 'next';
import { LandingNav } from '@/src/components/landing/LandingNav';
import { LandingHero } from '@/src/components/landing/LandingHero';
import { ProductPreviewSection } from '@/src/components/landing/ProductPreviewSection';
import { FeaturesSection } from '@/src/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/src/components/landing/HowItWorksSection';
import { StatsShowcaseSection } from '@/src/components/landing/StatsShowcaseSection';
import { DownloadCtaSection } from '@/src/components/landing/DownloadCtaSection';
import { FaqSection } from '@/src/components/landing/FaqSection';
import { LandingFooter } from '@/src/components/landing/LandingFooter';
import { FAQ_ITEMS } from '@/src/lib/faqs';
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL
} from '@/src/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url]
  }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en'
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE.url}`,
      description: SITE_DESCRIPTION,
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Coding interview preparation',
      operatingSystem: 'Chrome, Chromium, Microsoft Edge, Brave',
      browserRequirements: 'Requires a Chromium-based browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: [
        'Automatic LeetCode submission tracking',
        'Algorithmic pattern classification',
        'Submission history and code review',
        'Progress analytics and consistency heatmap'
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  ]
};

export default function LandingPage() {
  const extensionUrl =
    process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL ||
    'https://github.com/your-repo/leet-tracker-extension';

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#18181B] dark:text-[#EDEDED] flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Navigation Bar */}
      <LandingNav extensionUrl={extensionUrl} />

      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section */}
        <LandingHero extensionUrl={extensionUrl} />

        {/* 3. Product Preview Section */}
        <ProductPreviewSection />

        {/* 4. Features Section */}
        <FeaturesSection />

        {/* 5. How It Works Section */}
        <HowItWorksSection extensionUrl={extensionUrl} />

        {/* 6. Dashboard & Analytics Showcase */}
        <StatsShowcaseSection />

        {/* 7. Download Extension CTA Section */}
        <DownloadCtaSection extensionUrl={extensionUrl} />

        {/* 8. FAQ Section */}
        <FaqSection />
      </main>

      {/* 9. Minimal Footer */}
      <LandingFooter extensionUrl={extensionUrl} />
    </div>
  );
}
