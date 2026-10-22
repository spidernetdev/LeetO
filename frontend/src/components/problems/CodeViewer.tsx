'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProgrammingLanguage, LeetCodeVerdict } from '../../lib/types';

interface CodeViewerProps {
  code: string;
  language?: ProgrammingLanguage;
  status?: LeetCodeVerdict;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  status = 'Accepted'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  // Simple token styling for keywords
  const renderHighlightedLine = (line: string) => {
    const keywordRegex = /\b(def|class|return|if|elif|else|for|while|in|import|from|self|True|False|None|let|const|function|var|public|int|vector|bool)\b/g;
    const parts = line.split(keywordRegex);

    return parts.map((part, i) => {
      if (part.match(keywordRegex)) {
        return (
          <span key={i} className="text-[#A78BFA] dark:text-[#C4B5FD] font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith('#') || part.startsWith('//')) {
        return (
          <span key={i} className="text-[#666666]">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const isAccepted = status === 'Accepted';

  if (!code || !code.trim()) {
    return (
      <div className="rounded border border-neutral-200 dark:border-[#262626] bg-[#0D0D0D] p-8 text-center text-xs font-mono shadow-2xs">
        <FileCode className="h-6 w-6 text-neutral-500 mx-auto mb-2 opacity-60" />
        <div className="text-neutral-400 font-medium">No code recorded for this submission</div>
        <p className="text-[11px] text-neutral-600 dark:text-[#A1A1AA] mt-1">
          Source code was not saved or synchronized with this submission.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-[#0D0D0D] overflow-hidden flex flex-col font-mono shadow-2xs">
      {/* Code Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-100 dark:bg-[#121212] border-b border-neutral-200 dark:border-[#262626] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-neutral-900 dark:text-[#EDEDED] font-medium">
            <FileCode className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
            <span className="text-[11px]">{language || '—'}</span>
          </div>

          {/* Genuine LeetCode Verdict Badge */}
          <div
            className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium border ${
              isAccepted
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400'
            }`}
          >
            {isAccepted ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-amber-500" />
            )}
            <span>{status}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#1C1C1C] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code viewport */}
      <div className="overflow-x-auto p-3 text-xs leading-5 text-[#EDEDED] bg-[#0A0A0A]">
        <pre className="table w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-[#141414]/50">
              <span className="table-cell select-none pr-3 text-right text-[#525252] w-8 text-[11px] tabular-nums">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre text-[#EDEDED]">
                {renderHighlightedLine(line || ' ')}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
