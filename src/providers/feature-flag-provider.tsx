'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { featureFlags } from '@/lib/feature-flags/FeatureFlagManager';
import { useAuth } from './auth-provider';

interface FeatureFlagContextType {
  isEnabled: (flag: string) => boolean;
  getFlag: (flag: string) => any;
  allFlags: Array<{ key: string; name: string; enabled: boolean }>;
  setFlag: (key: string, enabled: boolean) => void;
  refreshFlags: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [flags, setFlags] = useState(featureFlags.getAllFlags());

  const refreshFlags = useCallback(() => {
    setFlags(featureFlags.getAllFlags());
  }, []);

  const isEnabled = useCallback((flag: string): boolean => {
    return featureFlags.isEnabled(flag, {
      userId: user?.id,
      environment: process.env.NODE_ENV,
    });
  }, [user?.id]);

  const getFlag = useCallback((flag: string) => {
    return featureFlags.getFlag(flag);
  }, []);

  const setFlag = useCallback((key: string, enabled: boolean) => {
    featureFlags.setEnabled(key, enabled);
    refreshFlags();
  }, [refreshFlags]);

  return (
    <FeatureFlagContext.Provider value={{
      isEnabled,
      getFlag,
      allFlags: flags.map(f => ({ key: f.key, name: f.name, enabled: f.enabled })),
      setFlag,
      refreshFlags,
    }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flagKey: string): boolean {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return context.isEnabled(flagKey);
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}