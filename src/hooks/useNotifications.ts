'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pusherClient, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher';
import { toast } from 'sonner';

export function useNotifications(userId?: string) {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 60000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const markAsRead = useMutation({
    mutationFn: async (id?: string) => {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id } : { readAll: true }),
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  useEffect(() => {
    if (!userId) return;
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.USER(userId));
    channel.bind(PUSHER_EVENTS.NOTIFICATION, (notification: any) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast(notification.title, { description: notification.message });
    });
    return () => { pusherClient.unsubscribe(PUSHER_CHANNELS.USER(userId)); };
  }, [userId, queryClient]);

  return { notifications, unreadCount, markAsRead: markAsRead.mutate, refetch };
}