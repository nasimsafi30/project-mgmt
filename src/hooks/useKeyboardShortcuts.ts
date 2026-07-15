'use client';

import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shiftKey === e.shiftKey;
        const altMatch = !!shortcut.altKey === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}

export const defaultShortcuts = [
  { key: 'k', metaKey: true, handler: () => {}, description: 'Open search' },
  { key: 'n', metaKey: true, handler: () => {}, description: 'New task' },
  { key: 'b', metaKey: true, handler: () => {}, description: 'Go to board' },
  { key: 'c', metaKey: true, handler: () => {}, description: 'Go to calendar' },
  { key: 't', metaKey: true, handler: () => {}, description: 'Go to teams' },
  { key: 's', metaKey: true, handler: () => {}, description: 'Go to settings' },
  { key: 'z', metaKey: true, handler: () => {}, description: 'Undo' },
  { key: 'z', metaKey: true, shiftKey: true, handler: () => {}, description: 'Redo' },
];