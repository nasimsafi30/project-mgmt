'use client';

import React from 'react';

interface PluginGuardProps {
  pluginId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PluginGuard({ pluginId, children, fallback = null }: PluginGuardProps) {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    // Check if plugin is installed and active
    const stored = localStorage.getItem(`plugin:${pluginId}:enabled`);
    setIsActive(stored === 'true');
  }, [pluginId]);

  if (!isActive) return <>{fallback}</>;
  return <>{children}</>;
}

export function PluginSlot({ name, props = {} }: { name: string; props?: any }) {
  const [components, setComponents] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    // Get registered components for this slot
    const registeredComponents = (window as any).__PLUGIN_COMPONENTS__?.[name] || [];
    setComponents(registeredComponents.map((Comp: any, i: number) => <Comp key={i} {...props} />));
  }, [name, props]);

  return <>{components}</>;
}