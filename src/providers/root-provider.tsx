'use client';

import React from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { SocketProvider } from './socket-provider';
import { ToastProvider } from './toast-provider';
import { CommandProvider } from './command-provider';
import { ModalProvider } from './modal-provider';
import { FeatureFlagProvider } from './feature-flag-provider';
import { SidebarProvider } from './sidebar-provider';

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" defaultAccent="blue">
        <AuthProvider>
          <FeatureFlagProvider>
            <SocketProvider>
              <CommandProvider>
                <SidebarProvider>
                  <ModalProvider>
                    <ToastProvider>
                      {children}
                    </ToastProvider>
                  </ModalProvider>
                </SidebarProvider>
              </CommandProvider>
            </SocketProvider>
          </FeatureFlagProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}