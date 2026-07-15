'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ModalConfig {
  title: string;
  description?: string;
  content: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  showClose?: boolean;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  closeAll: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: ModalConfig) => {
    setModals(prev => [...prev, config]);
  }, []);

  const closeModal = useCallback(() => {
    setModals(prev => {
      const next = [...prev];
      const closed = next.pop();
      closed?.onClose?.();
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    modals.forEach(m => m.onClose?.());
    setModals([]);
  }, [modals]);

  const currentModal = modals[modals.length - 1];
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-[90vw] sm:max-h-[90vh]',
  };

  return (
    <ModalContext.Provider value={{
      openModal,
      closeModal,
      closeAll,
      isOpen: modals.length > 0,
    }}>
      {children}
      {currentModal && (
        <Dialog open={!!currentModal} onOpenChange={() => closeModal()}>
          <DialogContent className={sizeClasses[currentModal.size || 'md']}>
            <DialogHeader>
              <DialogTitle>{currentModal.title}</DialogTitle>
              {currentModal.description && (
                <DialogDescription>{currentModal.description}</DialogDescription>
              )}
            </DialogHeader>
            {typeof currentModal.content === 'function'
              ? currentModal.content({ close: closeModal })
              : currentModal.content}
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}