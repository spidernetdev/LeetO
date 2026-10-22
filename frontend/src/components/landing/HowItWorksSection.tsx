import React from 'react';
import { Download, Code2, LayoutDashboard, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  extensionUrl: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ extensionUrl }) => {
  const steps = [
    {
      step: '01',
      title: 'Install the Extension',
      description: 'Add LeetO to Chrome in one click and get started immediately with your coding workflow.',
      icon: Download,
      action: 'Download Extension',
      href: extensionUrl,
      isExternal: true
    },
    {
      step: '02',
      title: 'Solve Problems on LeetCode',
      description: 'Continue practicing as usual. As soon as you hit submit, your accepted solutions are captured automatically.',
      icon: Code2,
      action: 'Practice on LeetCode',
      href: 'https://leetcode.com',
      isExternal: true
    },
    {
      step: '03',
      title: 'Review Your Progress',
      description: 'Visit your dashboard to explore solved problems, study algorithmic patterns, and track your practice streak.',
      icon: LayoutDashboard,
      action: 'Open Dashboard',
      href: '/overview',
      isExternal: false
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-neutral-200 dark:border-[#222222] bg-neutral-100/50 dark:bg-[#0E0E0E] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-200/60 dark:bg-[#1A1A1A] text-neutral-600 dark:text-[#A1A1AA] border border-neutral-200 dark:border-[#282828]">
            Simple Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            How LeetO Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
            No manual bookkeeping, no tedious copy-pasting. Focus 100% on algorithm problem solving while LeetO handles the rest.
          </p>
        </div>

        {/* 3 Step Sequence (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-xl border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-6 flex flex-col justify-between shadow-2xs hover:border-neutral-300 dark:hover:border-[#383838] transition-colors"
              >
                {/* Step indicator header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#2C2C2C]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-sm font-bold text-neutral-400 dark:text-[#A1A1AA]">
                      Step {item.step}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-[#8E8E93] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom step link */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-[#1E1E1E]">
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-800 dark:text-[#EDEDED] hover:text-neutral-900 dark:hover:text-white group"
                    >
                      <span>{item.action}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-800 dark:text-[#EDEDED] hover:text-neutral-900 dark:hover:text-white group"
                    >
                      <span>{item.action}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
