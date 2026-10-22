'use client';

import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Global Navigation',
      items: [
        { keys: ['1'], description: 'Go to Overview / Dashboard' },
        { keys: ['2'], description: 'Go to Problems Library' },
        { keys: ['3'], description: 'Go to Analytics & Progress' },
        { keys: ['4'], description: 'Go to User Settings' },
      ]
    },
    {
      title: 'Quick Actions',
      items: [
        { keys: ['['], description: 'Toggle sidebar (collapse / expand)' },
        { keys: ['⌘', 'K'], description: 'Quick search problems & patterns' },
        { keys: ['N'], description: 'Log new solution modal' },
        { keys: ['R'], description: 'Pick random problem to solve' },
        { keys: ['F'], description: 'Toggle full screen mode' },
        { keys: ['T'], description: 'Toggle light / dark theme' },
        { keys: ['?'], description: 'Open keyboard shortcuts cheatsheet' },
      ]
    },
    {
      title: 'General',
      items: [
        { keys: ['Esc'], description: 'Close modals & overlays' },
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-98 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2B2B2B] text-neutral-700 dark:text-[#EDEDED]">
              <Keyboard className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-[#EDEDED]">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] rounded hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map(group => (
            <div key={group.title}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-[#A1A1AA] mb-2.5">
                {group.title}
              </div>
              <div className="space-y-1.5">
                {group.items.map(item => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-neutral-50 dark:hover:bg-[#181818] transition-colors text-xs"
                  >
                    <span className="text-neutral-700 dark:text-[#A1A1AA]">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, idx) => (
                        <kbd
                          key={idx}
                          className="min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-mono font-medium rounded bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2B2B2B] text-neutral-800 dark:text-[#EDEDED] shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-neutral-50 dark:bg-[#0D0D0D] border-t border-neutral-200 dark:border-[#262626] flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#A1A1AA]">
          <span>Tip: Press <kbd className="font-mono px-1 py-0.5 rounded bg-neutral-200 dark:bg-[#1F1F1F]">F</kbd> anytime to enter or exit distraction-free full screen mode</span>
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-[#1F1F1F] dark:hover:bg-[#2A2A2A] text-neutral-800 dark:text-[#EDEDED] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
