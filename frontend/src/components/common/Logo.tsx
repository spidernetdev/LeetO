'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  version?: string;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 28,
  className = '',
  showText = false,
  version,
  textClassName = 'text-sm font-semibold tracking-tight text-neutral-900 dark:text-[#EDEDED]'
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0 overflow-hidden transition-transform group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="LeetO Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={textClassName}>
            LeetO
          </span>
          {version && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-500 dark:text-[#A1A1AA] border border-neutral-200/60 dark:border-[#262626]">
              {version}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
