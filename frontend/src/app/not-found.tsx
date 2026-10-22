import Link from 'next/link';
import { ArrowLeft, Inbox } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-10 text-center max-w-lg mx-auto my-12 shadow-2xs">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded border border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#161616] text-neutral-400 dark:text-[#A1A1AA] mb-3">
        <Inbox className="h-4 w-4" />
      </div>
      <h2 className="text-sm font-medium text-neutral-900 dark:text-[#EDEDED]">Page Not Found</h2>
      <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-1">
        The requested page or route could not be found.
      </p>
      <Link
        href="/problems"
        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Problems</span>
      </Link>
    </div>
  );
}
