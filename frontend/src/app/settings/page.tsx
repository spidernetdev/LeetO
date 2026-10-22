'use client';

import React from 'react';
import { useApp } from '@/src/components/layout/AppShell';
import { SettingsView } from '@/src/components/settings/SettingsView';

export default function SettingsPage() {
  const { settings, saveSettings, resetSettings } = useApp();

  return (
    <SettingsView
      settings={settings}
      onSaveSettings={saveSettings}
      onResetSettings={resetSettings}
    />
  );
}
