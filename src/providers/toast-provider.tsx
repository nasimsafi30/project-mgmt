'use client';

import React from 'react';
import { Toaster } from 'sonner';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--foreground)',
          },
        }}
      />
    </>
  );
}