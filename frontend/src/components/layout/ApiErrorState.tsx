'use client';

import React, { useState } from 'react';
import { AlertTriangle, RadioTower, RefreshCw, ArrowLeft } from 'lucide-react';
import { ApiEndpointNotFoundError, ResourceNotFoundError, NetworkError, checkBackendHealth, API_BASE_URL } from '@/src/lib/api';
import Link from 'next/link';

interface ApiErrorStateProps {
  error: Error | null;
  endpoint?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  title?: string;
  description?: string;
}

export const ApiErrorState: React.FC<ApiErrorStateProps> = ({
  error,
  endpoint,
  onRetry,
  backHref = '/overview',
  backLabel = 'Back to Overview',
  title,
  description
}) => {
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const isEndpointNotFound = error instanceof ApiEndpointNotFoundError || error?.message?.includes('404');
  const isResourceNotFound = error instanceof ResourceNotFoundError;
  const isNetwork = error instanceof NetworkError || error?.message?.includes('Network');

  const detectedEndpoint = endpoint || (error as any)?.endpoint;

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);
    try {
      const result = await checkBackendHealth();
      if (result.connected) {
        setHealthStatus(`Connected to backend root (${result.url}) with status: ${result.message}`);
      } else {
        setHealthStatus(`Backend unreachable at ${result.url}: ${result.message}`);
      }
    } catch (err: any) {
      setHealthStatus(`Failed to connect to ${API_BASE_URL}: ${err.message}`);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const displayTitle =
    title ||
    (isEndpointNotFound
      ? 'Backend API Endpoint Not Found'
      : isResourceNotFound
      ? 'Resource Not Found'
      : isNetwork
      ? 'Backend Service Unreachable'
      : 'Error Loading Data');

  const displayDescription =
    description ||
    (isEndpointNotFound
      ? `The requested endpoint ${detectedEndpoint ? `(${detectedEndpoint})` : ''} has not been implemented or is unavailable on the FastAPI backend.`
      : isResourceNotFound
      ? error?.message || 'The requested item does not exist in your repository.'
      : isNetwork
      ? `Could not establish a connection to the backend service at ${API_BASE_URL}. Ensure your backend server is running.`
      : error?.message || 'An unexpected error occurred while communicating with the backend API.');

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-6 sm:p-8 max-w-2xl mx-auto my-8 shadow-2xs space-y-5">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 shrink-0">
          {isNetwork ? <RadioTower className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-[#EDEDED]">
              {displayTitle}
            </h3>
            {isEndpointNotFound && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-500 border border-neutral-200 dark:border-[#2C2C2C]">
                HTTP 404
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-600 dark:text-[#A1A1AA] leading-relaxed">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Diagnostic Details */}
      {detectedEndpoint && (
        <div className="rounded border border-neutral-200 dark:border-[#202020] bg-neutral-50 dark:bg-[#0A0A0A] p-3 text-[11px] font-mono space-y-1 text-neutral-600 dark:text-[#888888]">
          <div className="flex justify-between items-center text-[10px] text-neutral-400">
            <span>Diagnostic Details</span>
            <span>Target: {API_BASE_URL}</span>
          </div>
          <div className="text-neutral-900 dark:text-[#D4D4D4] break-all">
            Target Endpoint: <code>{detectedEndpoint}</code>
          </div>
        </div>
      )}

      {/* Health Check Feedback */}
      {healthStatus && (
        <div className="rounded border border-neutral-200 dark:border-[#2A2A2A] bg-neutral-50 dark:bg-[#161616] p-2.5 text-xs font-mono text-neutral-700 dark:text-[#CCCCCC]">
          {healthStatus}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-[#1F1F1F] flex-wrap">
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Request</span>
            </button>
          )}

          <button
            onClick={handleCheckHealth}
            disabled={isCheckingHealth}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-600 dark:text-[#A1A1AA] hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-[#181818] hover:bg-neutral-200 dark:hover:bg-[#222222] border border-neutral-200 dark:border-[#282828] rounded transition-colors disabled:opacity-50"
          >
            <RadioTower className={`h-3 w-3 ${isCheckingHealth ? 'animate-pulse' : ''}`} />
            <span>{isCheckingHealth ? 'Pinging...' : 'Check Backend'}</span>
          </button>
        </div>

        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>{backLabel}</span>
        </Link>
      </div>
    </div>
  );
};
