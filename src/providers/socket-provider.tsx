'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pusherClient, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';

interface SocketContextType {
  isConnected: boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  bind: (channel: string, event: string, handler: Function) => void;
  unbind: (channel: string, event: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(new Set());

  useEffect(() => {
    pusherClient.connection.bind('connected', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to Pusher');
    });

    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected from Pusher');
    });

    pusherClient.connection.bind('error', (err: any) => {
      console.error('[Socket] Connection error:', err);
      setIsConnected(false);
    });

    // Subscribe to user channel for notifications
    if (user?.id) {
      const userChannel = pusherClient.subscribe(PUSHER_CHANNELS.USER(user.id));
      userChannel.bind(PUSHER_EVENTS.NOTIFICATION, (data: any) => {
        toast(data.title || 'Notification', {
          description: data.message,
          action: data.link ? {
            label: 'View',
            onClick: () => window.location.href = data.link,
          } : undefined,
        });
      });
    }

    return () => {
      pusherClient.connection.unbind_all();
      if (user?.id) {
        pusherClient.unsubscribe(PUSHER_CHANNELS.USER(user.id));
      }
    };
  }, [user?.id]);

  const subscribe = useCallback((channel: string) => {
    if (!subscribedChannels.has(channel)) {
      pusherClient.subscribe(channel);
      setSubscribedChannels(prev => new Set(prev).add(channel));
    }
  }, [subscribedChannels]);

  const unsubscribe = useCallback((channel: string) => {
    pusherClient.unsubscribe(channel);
    setSubscribedChannels(prev => {
      const next = new Set(prev);
      next.delete(channel);
      return next;
    });
  }, []);

  const bind = useCallback((channel: string, event: string, handler: Function) => {
    const pusherChannel = pusherClient.channel(channel);
    if (pusherChannel) {
      pusherChannel.bind(event, handler);
    }
  }, []);

  const unbind = useCallback((channel: string, event: string) => {
    const pusherChannel = pusherClient.channel(channel);
    if (pusherChannel) {
      pusherChannel.unbind(event);
    }
  }, []);

  return (
    <SocketContext.Provider value={{
      isConnected,
      subscribe,
      unsubscribe,
      bind,
      unbind,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}