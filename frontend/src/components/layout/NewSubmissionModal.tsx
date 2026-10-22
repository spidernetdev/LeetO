'use client';

import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import {
  Difficulty,
  AlgorithmicPattern,
  ProgrammingLanguage,
  LeetCodeVerdict,
  Problem,
  SubmissionApiResponse,
  ALGORITHMIC_PATTERNS
} from '../../lib/types';
import { submitSolutionToBackend } from '../../lib/api';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (problem: Omit<Problem, 'id' | 'submittedAt'>) => void;
}

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [pattern, setPattern] = useState<AlgorithmicPattern>('Sliding Window');
  const [language, setLanguage] = useState<ProgrammingLanguage>('Python');
  const [verdict, setVerdict] = useState<LeetCodeVerdict>('Accepted');
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [approach, setApproach] = useState('');
  const [code, setCode] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<SubmissionApiResponse | null>(null);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setError(null);
    setSuccessResponse(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    setIsSubmitting(true);

    const num = parseInt(number, 10) || Math.floor(Math.random() * 500) + 100;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const leetcodeUrl = `https://leetcode.com/problems/${slug}/`;
    const submittedCode =
      code.trim() ||
      `# Solution for ${title}\nclass Solution:\n    def solve(self):\n        pass`;

    try {
      // Live intake to backend POST /api/submissions
      const apiResult = await submitSolutionToBackend({
        problem: {
          title: title.trim(),
          slug,
          url: leetcodeUrl,
          difficulty,
          topics: [pattern],
          description: null
        },
        code: submittedCode,
        language: language.toLowerCase(),
        status: verdict
      });

      // 2. Also register in local client store so UI reflects the submission immediately
      onSubmit({
        slug,
        leetcodeNumber: num,
        title: title.trim(),
        difficulty,
        leetcodeUrl,
        patterns: [pattern],
        topics: [pattern],
        language,
        status: verdict,
        code: submittedCode,
        timeComplexity: timeComplexity || 'O(n)',
        spaceComplexity: spaceComplexity || 'O(1)',
        approach: approach || `${pattern} Technique`,
        explanation: `Solved using ${pattern}. The solution achieves ${timeComplexity} runtime complexity.`,
        aiAnalysis: {
          approach: approach || `${pattern} Technique`,
          whyItWorks: `Using ${pattern} satisfies problem constraints while guaranteeing optimal subproblem states.`,
          timeComplexity: timeComplexity || 'O(n)',
          timeComplexityExplanation: `Single pass over the input of size n with O(1) step operations.`,
          spaceComplexity: spaceComplexity || 'O(1)',
          spaceComplexityExplanation: `No dynamic structures proportional to input size allocated.`,
          keyObservations: [
            'Optimal state transition without redundant backtracking.',
            'Constraints verified upfront against boundary conditions.'
          ],
          alternativeApproaches: [
            {
              name: 'Brute Force Evaluation',
              timeComplexity: 'O(n²)',
              spaceComplexity: 'O(1)',
              tradeOff: 'Simple to formulate but times out on large input bounds.'
            }
          ],
          backendAnalysis: apiResult.analysis
        }
      });

      setSuccessResponse(apiResult);
    } catch (err: any) {
      setError(err.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded-lg shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-98 duration-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-neutral-500 dark:text-[#A1A1AA]" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-[#EDEDED] text-xs">
                Log LeetCode Solution
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
                Record submission verdict & analyze code
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] dark:hover:bg-[#1A1A1A]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* If submission succeeded, display confirmation screen */}
        {successResponse ? (
          <div className="p-5 space-y-4">
            <div className="rounded border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Submission received successfully
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {successResponse.submission_id && (
                    <span>Submission ID: <code className="font-mono">{successResponse.submission_id}</code></span>
                  )}
                </p>
              </div>
            </div>

            {/* AI Analysis feedback if provided by backend */}
            {successResponse.analysis && (
              <div className="rounded border border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#161616] p-3 space-y-2 text-xs">
                <span className="font-semibold text-neutral-900 dark:text-[#EDEDED] block text-[11px]">
                  Algorithmic Analysis Received
                </span>
                {successResponse.analysis.patterns && successResponse.analysis.patterns.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {successResponse.analysis.patterns.map((p, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-200 dark:bg-[#2A2A2A] text-neutral-800 dark:text-[#EDEDED] font-mono">
                        {p.main_pattern}{p.subpattern ? ` / ${p.subpattern}` : ''}
                      </span>
                    ))}
                  </div>
                )}
                {successResponse.analysis.time_complexity && (
                  <p className="text-[11px] text-neutral-600 dark:text-[#A1A1AA]">
                    Complexity: <span className="font-mono">{successResponse.analysis.time_complexity}</span> / <span className="font-mono">{successResponse.analysis.space_complexity}</span>
                  </p>
                )}
              </div>
            )}

            {/* Informative notice on backend sync */}
            <div className="rounded bg-neutral-100 dark:bg-[#181818] p-3 text-[11px] text-neutral-600 dark:text-[#A1A1AA] flex items-start gap-2">
              <Info className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                Historical problem list refresh and global statistics depend on backend GET endpoints currently documented in <code className="font-mono">API_CONTRACT.md</code>.
              </span>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {error && (
              <div className="rounded border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-2.5 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="text-[11px]">{error}</span>
              </div>
            )}

            {/* Note clarifying that app logs submissions without judging code */}
            <div className="rounded bg-neutral-50 dark:bg-[#171717] p-2.5 border border-neutral-200/80 dark:border-[#222222] text-[11px] text-neutral-500 dark:text-[#A1A1AA] flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>This tracker logs solutions and analyzes code. It does not execute or judge code.</span>
            </div>

            {/* Number & Title */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  LeetCode #
                </label>
                <input
                  type="number"
                  placeholder="42"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subarray Sum Equals K"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                />
              </div>
            </div>

            {/* Difficulty, Language & Actual LeetCode Verdict */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as ProgrammingLanguage)}
                  className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                >
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>

              {/* Genuine LeetCode Verdict Selector */}
              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  LeetCode Verdict
                </label>
                <select
                  value={verdict}
                  onChange={e => setVerdict(e.target.value as LeetCodeVerdict)}
                  className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Wrong Answer">Wrong Answer</option>
                  <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                  <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
                  <option value="Runtime Error">Runtime Error</option>
                  <option value="Compile Error">Compile Error</option>
                </select>
              </div>
            </div>

            {/* Pattern */}
            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                DSA Pattern
              </label>
              <select
                value={pattern}
                onChange={e => setPattern(e.target.value as AlgorithmicPattern)}
                className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
              >
                {ALGORITHMIC_PATTERNS.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Code textarea */}
            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                Submitted Code
              </label>
              <textarea
                rows={5}
                placeholder="Paste code solution here..."
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
              />
            </div>

            {/* Complexity inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  Time Complexity
                </label>
                <input
                  type="text"
                  placeholder="O(n)"
                  value={timeComplexity}
                  onChange={e => setTimeComplexity(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                  Space Complexity
                </label>
                <input
                  type="text"
                  placeholder="O(1)"
                  value={spaceComplexity}
                  onChange={e => setSpaceComplexity(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
                />
              </div>
            </div>

            {/* Approach */}
            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">
                Solution Approach
              </label>
              <input
                type="text"
                placeholder="e.g. Single-pass sliding window with two pointers"
                value={approach}
                onChange={e => setApproach(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-[#262626]">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded disabled:opacity-50 transition-colors shadow-2xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Record Submission</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
