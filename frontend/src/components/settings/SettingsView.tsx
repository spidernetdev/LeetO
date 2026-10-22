'use client';

import React, { useState, useEffect } from 'react';
import { UserSettings, ProgrammingLanguage, DEFAULT_SETTINGS } from '../../lib/types';
import { Check, RotateCcw, Moon, Sun, Laptop, RadioTower, Copy } from 'lucide-react';
import { checkBackendHealth } from '../../lib/api';
import { connectChromeExtension } from '../../lib/auth';


interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onResetSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetSettings
}) => {
  const [form, setForm] = useState<UserSettings>(settings);
  const [savedToast, setSavedToast] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<string | null>(null);
  const [isConnectingExtension, setIsConnectingExtension] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleConnectExtension = async () => {
    setIsConnectingExtension(true);
    setExtensionStatus('Generating extension token...');
    try {
      const res = await connectChromeExtension();
      setGeneratedToken(res.token);
      if (res.autoSynced) {
        setExtensionStatus(`Extension synced automatically! Active for ${Math.round((res.expires_in_minutes || 10080) / 60 / 24)} days.`);
      } else {
        setExtensionStatus('Extension token generated! Copy this token and paste it into your LeetCode Tracker extension popup in Chrome.');
      }
    } catch (err: any) {
      setExtensionStatus(err instanceof Error ? err.message : 'Failed to connect extension.');
    } finally {
      setIsConnectingExtension(false);
    }
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Verify and maintain backend connection seamlessly behind the scenes
  useEffect(() => {
    checkBackendHealth().catch(() => {
      // Connects silently behind the scenes without interrupting user workflow
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
    onResetSettings();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <h1 className="text-base font-medium text-neutral-900 dark:text-[#EDEDED] tracking-tight">Settings</h1>
          <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] mt-0.5">
            Manage your developer profile and preferences
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] text-emerald-600 dark:text-emerald-400 text-xs">
            <Check className="h-3 w-3" />
            <span>Preferences saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Card */}
        <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-2xs">
          <div className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
            Profile
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">LeetCode Username</label>
              <input
                type="text"
                value={form.leetcodeUsername}
                onChange={e => setForm({ ...form, leetcodeUsername: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">Target Engineering Role</label>
              <input
                type="text"
                value={form.targetRole}
                onChange={e => setForm({ ...form, targetRole: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">Daily Target Problems</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.dailyGoal}
                onChange={e => setForm({ ...form, dailyGoal: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-2xs">
          <div className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
            Preferences
          </div>

          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">Primary Language</label>
                <select
                  value={form.preferredLanguage}
                  onChange={e => setForm({ ...form, preferredLanguage: e.target.value as ProgrammingLanguage })}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                >
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1">Default Sort Order</label>
                <select
                  value={form.defaultSort}
                  onChange={e => setForm({ ...form, defaultSort: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#262626] rounded text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:border-neutral-400 dark:focus:border-[#404040]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Problem Title (A-Z)</option>
                  <option value="difficulty">Difficulty (Hard to Easy)</option>
                </select>
              </div>
            </div>

            {/* Theme selector */}
            <div>
              <label className="block text-[11px] text-neutral-600 dark:text-[#A1A1AA] mb-1.5">Theme</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, theme: 'dark' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors ${
                    form.theme === 'dark'
                      ? 'bg-neutral-900 text-white dark:bg-[#EDEDED] dark:text-[#0A0A0A] border-neutral-900 dark:border-[#EDEDED]'
                      : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#A1A1AA] border-neutral-200 dark:border-[#262626]'
                  }`}
                >
                  <Moon className="h-3 w-3" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, theme: 'light' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors ${
                    form.theme === 'light'
                      ? 'bg-neutral-900 text-white dark:bg-[#EDEDED] dark:text-[#0A0A0A] border-neutral-900 dark:border-[#EDEDED]'
                      : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#A1A1AA] border-neutral-200 dark:border-[#262626]'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, theme: 'system' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors ${
                    form.theme === 'system'
                      ? 'bg-neutral-900 text-white dark:bg-[#EDEDED] dark:text-[#0A0A0A] border-neutral-900 dark:border-[#EDEDED]'
                      : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#A1A1AA] border-neutral-200 dark:border-[#262626]'
                  }`}
                >
                  <Laptop className="h-3 w-3" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Toggle options */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-[#A1A1AA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showComplexityInTable}
                  onChange={e => setForm({ ...form, showComplexityInTable: e.target.checked })}
                  className="rounded border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#0D0D0D] text-neutral-800 focus:ring-0"
                />
                <span>Display complexity badges in Problems Table</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-[#A1A1AA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.compactView}
                  onChange={e => setForm({ ...form, compactView: e.target.checked })}
                  className="rounded border-neutral-300 dark:border-[#262626] bg-white dark:bg-[#0D0D0D] text-neutral-800 focus:ring-0"
                />
                <span>Compact table row density</span>
              </label>
            </div>
          </div>
        </div>

        {/* Chrome Extension Integration Card */}
        <div className="rounded border border-neutral-200 dark:border-[#262626] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-neutral-900 dark:text-[#EDEDED]">
              Chrome Extension Sync
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-500 dark:text-[#888888]">
              Automated Intake
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-[#A1A1AA] leading-relaxed">
            Link your installed Chrome extension to sync your LeetCode accepted solutions directly to your backend repository.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleConnectExtension}
              disabled={isConnectingExtension}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
            >
              <RadioTower className={`h-3.5 w-3.5 ${isConnectingExtension ? 'animate-pulse' : ''}`} />
              <span>{isConnectingExtension ? 'Connecting Extension...' : 'Connect / Get Token'}</span>
            </button>
          </div>

          {extensionStatus && (
            <div className={`p-2.5 rounded border text-xs font-mono leading-relaxed ${
              extensionStatus.toLowerCase().includes('success') || extensionStatus.toLowerCase().includes('synced') || extensionStatus.toLowerCase().includes('generated')
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'
            }`}>
              {extensionStatus}
            </div>
          )}

          {generatedToken && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-[#1E1E1E]">
              <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-[#A1A1AA]">
                <span>Extension Token:</span>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 hover:underline cursor-pointer"
                >
                  {copiedToken ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedToken ? 'Copied!' : 'Copy Token'}</span>
                </button>
              </div>

              <div className="p-2 rounded bg-neutral-100 dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#222222] font-mono text-[10px] text-neutral-700 dark:text-neutral-300 break-all select-all">
                {generatedToken}
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-[#A1A1AA] leading-relaxed">
                <strong>Manual Setup:</strong> Click the LeetCode Tracker extension icon in your Chrome toolbar, paste the token above into the box, and click <strong>Save Token</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1AA] dark:hover:text-[#EDEDED] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:text-[#0A0A0A] dark:bg-[#EDEDED] dark:hover:bg-[#FFFFFF] rounded transition-colors active:bg-neutral-700 dark:active:bg-[#D4D4D4] shadow-2xs"
          >
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
