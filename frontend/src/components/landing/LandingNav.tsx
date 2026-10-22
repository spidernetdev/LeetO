'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, ArrowRight, Menu, X } from 'lucide-react';

interface LandingNavProps {
  extensionUrl: string;
}

export const LandingNav: React.FC<LandingNavProps> = ({ extensionUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'border-neutral-200/90 dark:border-[#262626] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md shadow-xs'
          : 'border-neutral-200/60 dark:border-[#202020] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-7 w-7 items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="LeetO Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white">
              LeetO
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200/60 dark:border-[#2A2A2A] text-neutral-500 dark:text-[#888888]">
              v1.2
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-600 dark:text-[#A1A1AA]">
          <a
            href="#features"
            className="hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#preview"
            className="hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
          >
            Dashboard Preview
          </a>
          <a
            href="#faq"
            className="hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={extensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 dark:text-[#EDEDED] dark:hover:text-white bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#161616] dark:hover:bg-[#202020] border border-neutral-200 dark:border-[#2A2A2A] rounded-md transition-colors"
            title="Download Chrome Extension"
          >
            <Download className="h-3.5 w-3.5 text-neutral-500 dark:text-[#A1A1AA]" />
            <span>Download Extension</span>
          </a>

          <Link
            href="/overview"
            prefetch={false}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-neutral-950 dark:bg-white dark:hover:bg-neutral-200 rounded-md transition-colors shadow-2xs"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={extensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-[#EDEDED] bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-[#2A2A2A] rounded-md"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Extension</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-neutral-600 dark:text-[#A1A1AA] hover:bg-neutral-100 dark:hover:bg-[#161616] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#0E0E0E] px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-neutral-700 dark:text-[#D4D4D4]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-neutral-50 dark:hover:bg-[#181818]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-neutral-50 dark:hover:bg-[#181818]"
            >
              How It Works
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-neutral-50 dark:hover:bg-[#181818]"
            >
              Dashboard Preview
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-neutral-50 dark:hover:bg-[#181818]"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-neutral-100 dark:border-[#222222] flex flex-col gap-2">
            <Link
              href="/overview"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-950 rounded-md"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <a
              href={extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-neutral-800 dark:text-[#EDEDED] bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] rounded-md"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Chrome Extension</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
