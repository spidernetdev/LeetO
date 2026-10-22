'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/src/components/layout/AppShell';
import { ProblemDetailView } from '@/src/components/problems/ProblemDetailView';
import { getProblemByIdOrSlug } from '@/src/lib/api';
import { Problem } from '@/src/lib/types';
import { ApiErrorState } from '@/src/components/layout/ApiErrorState';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { problems } = useApp();
  const slugOrId = params?.slug ? String(params.slug) : '';

  const [directProblem, setDirectProblem] = useState<Problem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  // In-memory summary problem if available (from problems table)
  const summaryProblem =
    problems.find(
      p =>
        p.id === slugOrId ||
        p.slug === slugOrId ||
        p.leetcodeNumber.toString() === slugOrId
    ) || null;

  // The slug to request from backend
  const targetSlug = summaryProblem?.slug || slugOrId;

  useEffect(() => {
    if (!targetSlug) return;

    let cancelled = false;
    setLoadingDetail(true);
    setFetchError(null);

    getProblemByIdOrSlug(targetSlug)
      .then(res => {
        if (!cancelled && res) {
          setDirectProblem(res);
          setFetchError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to fetch full problem detail:', err);
          setFetchError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [targetSlug]);

  // Prefer directProblem with full submissions and code; fallback to summaryProblem
  const activeProblem = directProblem || summaryProblem;

  if (fetchError && !activeProblem) {
    return (
      <ApiErrorState
        error={fetchError}
        endpoint={`/api/problems/${targetSlug}`}
        backHref="/problems"
        backLabel="Back to Problems"
      />
    );
  }

  return (
    <ProblemDetailView
      problem={activeProblem}
      isLoadingDetail={loadingDetail && !directProblem}
      onBack={() => router.push('/problems')}
      onSelectProblem={id => router.push(`/problems/${id}`)}
      allProblems={problems.length > 0 ? problems : (activeProblem ? [activeProblem] : [])}
    />
  );
}

