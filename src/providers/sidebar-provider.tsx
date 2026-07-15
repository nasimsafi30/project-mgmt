'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  collapse: () => void;
  expand: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STATE_KEY = 'sidebar-state';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setIsCollapsed(state.collapsed || false);
        if (!isMobile) setIsOpen(state.open ?? true);
      } catch {}
    }
  }, [isMobile]);

  // Auto-close on mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile]);

  // Save state
  const saveState = useCallback((open: boolean, collapsed: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify({ open, collapsed }));
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      saveState(next, isCollapsed);
      return next;
    });
  }, [isCollapsed, saveState]);

  const open = useCallback(() => {
    setIsOpen(true);
    saveState(true, isCollapsed);
  }, [isCollapsed, saveState]);

  const close = useCallback(() => {
    setIsOpen(false);
    saveState(false, isCollapsed);
  }, [isCollapsed, saveState]);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    setIsOpen(true);
    saveState(true, true);
  }, [saveState]);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    saveState(isOpen, false);
  }, [isOpen, saveState]);

  return (
    <SidebarContext.Provider value={{
      isOpen,
      isCollapsed,
      isMobile,
      toggle,
      open,
      close,
      collapse,
      expand,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}