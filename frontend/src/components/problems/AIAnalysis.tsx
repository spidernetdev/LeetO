'use client';

import React from 'react';
import { Layers, Cpu, Sparkles } from 'lucide-react';
import { AIAnalysisData } from '../../lib/types';
import { getPatternBadgeStyle } from '../../lib/utils';

interface AIAnalysisProps {
  analysis?: AIAnalysisData;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-8 text-center text-xs text-neutral-500 dark:text-[#A1A1AA]">
        No analysis data available for this submission yet.
      </div>
    );
  }

  const backend = analysis.backendAnalysis;
  const patterns = backend?.patterns || [];
  const dataStructures = backend?.data_structures || [];
  const algorithms = backend?.algorithms || [];

  const timeComplexity = analysis.timeComplexity || backend?.time_complexity || 'O(n)';
  const spaceComplexity = analysis.spaceComplexity || backend?.space_complexity || 'O(1)';
  const explanation = backend?.explanation || analysis.approach || analysis.whyItWorks;

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] divide-y divide-neutral-200 dark:divide-[#262626] text-xs shadow-2xs">
      {/* 1. Detected Patterns & AI Reasoning */}
      {patterns.length > 0 && (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5" />
            <span>Detected Algorithmic Patterns ({patterns.length})</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {patterns.map((pat, idx) => {
              const badgeStyle = getPatternBadgeStyle(pat.main_pattern);
              const confPct = pat.confidence != null ? Math.round(pat.confidence * 100) : null;

              return (
                <div
                  key={idx}
                  className="rounded border border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#171717] p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${badgeStyle.text} ${badgeStyle.bg} ${badgeStyle.border}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                        <span>{pat.main_pattern}</span>
                      </span>

                      {pat.subpattern && (
                        <span className="text-[11px] font-medium text-neutral-600 dark:text-[#A1A1AA] bg-white dark:bg-[#202020] px-2 py-0.5 rounded border border-neutral-200 dark:border-[#2C2C2C]">
                          {pat.subpattern}
                        </span>
                      )}
                    </div>

                    {confPct != null && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        {confPct}% confidence
                      </span>
                    )}
                  </div>

                  {pat.reason && (
                    <p className="text-[11px] text-neutral-600 dark:text-[#A1A1AA] leading-relaxed pt-0.5">
                      {pat.reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Data Structures & Algorithms Applied */}
      {(dataStructures.length > 0 || algorithms.length > 0) && (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            <Cpu className="h-3.5 w-3.5" />
            <span>Underlying Mechanics</span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            {dataStructures.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] block">
                  Data Structures:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dataStructures.map((ds, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-[#1F1F1F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-[#2D2D2D]"
                    >
                      {ds}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {algorithms.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] block">
                  Algorithms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {algorithms.map((algo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-[#1F1F1F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-[#2D2D2D]"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Complexity Analysis */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border border-neutral-200/80 dark:border-[#222222] bg-neutral-50/40 dark:bg-[#151515] p-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
              Time Complexity
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-[#EDEDED] px-1.5 py-0.5 rounded bg-neutral-200/50 dark:bg-[#202020]">
              {timeComplexity}
            </span>
          </div>
          {analysis.timeComplexityExplanation && (
            <p className="text-[11px] text-neutral-600 dark:text-[#A1A1AA] leading-relaxed mt-1">
              {analysis.timeComplexityExplanation}
            </p>
          )}
        </div>

        <div className="rounded border border-neutral-200/80 dark:border-[#222222] bg-neutral-50/40 dark:bg-[#151515] p-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
              Auxiliary Space
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-[#EDEDED] px-1.5 py-0.5 rounded bg-neutral-200/50 dark:bg-[#202020]">
              {spaceComplexity}
            </span>
          </div>
          {analysis.spaceComplexityExplanation && (
            <p className="text-[11px] text-neutral-600 dark:text-[#A1A1AA] leading-relaxed mt-1">
              {analysis.spaceComplexityExplanation}
            </p>
          )}
        </div>
      </div>

      {/* 4. Algorithmic Approach & Explanation */}
      {explanation && (
        <div className="p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Approach & Mechanics</span>
          </div>
          {analysis.approach && analysis.approach !== explanation && (
            <div className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
              {analysis.approach}
            </div>
          )}
          <p className="text-neutral-600 dark:text-[#A1A1AA] leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
          {analysis.whyItWorks && analysis.whyItWorks !== explanation && (
            <p className="text-neutral-600 dark:text-[#A1A1AA] leading-relaxed pt-1">
              {analysis.whyItWorks}
            </p>
          )}
        </div>
      )}

      {/* 5. Invariants & Observations */}
      {analysis.keyObservations && analysis.keyObservations.length > 0 && (
        <div className="p-4 space-y-2">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            Invariants & Observations
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-[#A1A1AA]">
            {analysis.keyObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-[#525252] select-none font-mono">·</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Alternative Approaches */}
      {analysis.alternativeApproaches && analysis.alternativeApproaches.length > 0 && (
        <div className="p-4 space-y-2">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            Alternative Approaches
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-[#262626] text-neutral-500 dark:text-[#A1A1AA] text-[11px]">
                  <th className="py-1.5 pr-3 font-medium">Approach</th>
                  <th className="py-1.5 px-3 font-mono font-medium">Time</th>
                  <th className="py-1.5 px-3 font-mono font-medium">Space</th>
                  <th className="py-1.5 pl-3 font-medium">Trade-off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-[#1F1F1F]">
                {analysis.alternativeApproaches.map((alt, idx) => (
                  <tr key={idx} className="text-neutral-600 dark:text-[#A1A1AA]">
                    <td className="py-2 pr-3 font-medium text-neutral-900 dark:text-[#EDEDED]">{alt.name}</td>
                    <td className="py-2 px-3 font-mono text-neutral-900 dark:text-[#EDEDED]">{alt.timeComplexity}</td>
                    <td className="py-2 px-3 font-mono text-neutral-500 dark:text-[#A1A1AA]">{alt.spaceComplexity}</td>
                    <td className="py-2 pl-3 text-neutral-500 dark:text-[#A1A1AA]">{alt.tradeOff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
