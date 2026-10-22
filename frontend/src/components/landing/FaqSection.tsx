import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/src/lib/faqs';

export const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-600 dark:text-[#A1A1AA] border border-neutral-200 dark:border-[#282828]">
          Frequently Asked Questions
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
          Common questions regarding automated submission intake, pattern categorization, and getting started.
        </p>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-neutral-200 dark:divide-[#262626] border-y border-neutral-200 dark:border-[#262626]">
        {FAQ_ITEMS.map((faq, index) => (
          <details key={faq.question} name="faq" className="faq-item group py-4" open={index === 0}>
            <summary className="w-full flex items-center justify-between gap-4 text-left font-medium text-sm sm:text-base text-neutral-900 dark:text-[#EDEDED] hover:text-neutral-600 dark:hover:text-white transition-colors cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <ChevronDown
                aria-hidden="true"
                className="faq-chevron h-4 w-4 text-neutral-500 dark:text-[#A1A1AA] shrink-0 transition-transform duration-200"
              />
            </summary>
            <div className="pt-3 pr-6 text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
