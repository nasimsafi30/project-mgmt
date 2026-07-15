'use client';

import { useState, useEffect, useCallback } from 'react';
import { PluginManifest } from '@/lib/plugin-system/PluginManager';

interface UsePluginReturn {
  plugins: PluginManifest[];
  isLoaded: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlugins(): UsePluginReturn {
  const [plugins, setPlugins] = useState<PluginManifest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlugins = useCallback(async () => {
    try {
      const response = await fetch('/api/plugins');
      if (!response.ok) throw new Error('Failed to fetch plugins');
      const data = await response.json();
      setPlugins(data.plugins || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchPlugins();
  }, [fetchPlugins]);

  return { plugins, isLoaded, error, refresh: fetchPlugins };
}

export function usePluginInstall() {
  const [installing, setInstalling] = useState(false);

  const install = async (pluginId: string) => {
    setInstalling(true);
    try {
      const response = await fetch('/api/plugins/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId }),
      });
      if (!response.ok) throw new Error('Installation failed');
      return await response.json();
    } finally {
      setInstalling(false);
    }
  };

  const uninstall = async (pluginId: string) => {
    setInstalling(true);
    try {
      const response = await fetch('/api/plugins/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId }),
      });
      if (!response.ok) throw new Error('Uninstallation failed');
      return await response.json();
    } finally {
      setInstalling(false);
    }
  };

  return { install, uninstall, installing };
}