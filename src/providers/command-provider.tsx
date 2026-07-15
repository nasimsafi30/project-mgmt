'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category: 'navigation' | 'action' | 'search' | 'settings';
  handler: () => void;
}

interface CommandContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  commands: Command[];
  registerCommand: (command: Command) => void;
  unregisterCommand: (id: string) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([
    {
      id: 'go-dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to main dashboard',
      icon: '📊',
      shortcut: 'G D',
      category: 'navigation',
      handler: () => router.push('/'),
    },
    {
      id: 'go-board',
      label: 'Go to Board',
      description: 'Navigate to Kanban board',
      icon: '📋',
      shortcut: 'G B',
      category: 'navigation',
      handler: () => router.push('/board'),
    },
    {
      id: 'go-calendar',
      label: 'Go to Calendar',
      description: 'Navigate to calendar view',
      icon: '📅',
      shortcut: 'G C',
      category: 'navigation',
      handler: () => router.push('/calendar'),
    },
    {
      id: 'go-teams',
      label: 'Go to Teams',
      description: 'Navigate to teams page',
      icon: '👥',
      shortcut: 'G T',
      category: 'navigation',
      handler: () => router.push('/teams'),
    },
    {
      id: 'go-settings',
      label: 'Go to Settings',
      description: 'Navigate to settings',
      icon: '⚙️',
      shortcut: 'G S',
      category: 'settings',
      handler: () => router.push('/settings'),
    },
    {
      id: 'new-task',
      label: 'Create New Task',
      description: 'Open task creation dialog',
      icon: '➕',
      shortcut: 'N',
      category: 'action',
      handler: () => {
        // Trigger new task dialog
        window.dispatchEvent(new CustomEvent('open-create-task'));
      },
    },
    {
      id: 'search',
      label: 'Search',
      description: 'Search tasks, projects, and more',
      icon: '🔍',
      shortcut: '⌘K',
      category: 'search',
      handler: () => setIsOpen(true),
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: '🌓',
      shortcut: '⌘⇧T',
      category: 'settings',
      handler: () => {
        document.documentElement.classList.toggle('dark');
      },
    },
  ]);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const registerCommand = useCallback((command: Command) => {
    setCommands(prev => [...prev.filter(c => c.id !== command.id), command]);
  }, []);

  const unregisterCommand = useCallback((id: string) => {
    setCommands(prev => prev.filter(c => c.id !== id));
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  return (
    <CommandContext.Provider value={{
      isOpen,
      setIsOpen,
      toggle,
      commands,
      registerCommand,
      unregisterCommand,
    }}>
      {children}
    </CommandContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error('useCommandPalette must be used within a CommandProvider');
  }
  return context;
}