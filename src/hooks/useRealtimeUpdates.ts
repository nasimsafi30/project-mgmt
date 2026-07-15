'use client';

import { useEffect } from 'react';
import { pusherClient, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher';
import { useKanbanStore } from '@/store';
import { toast } from 'sonner';

export function useRealtimeUpdates(projectId?: string) {
  const { addTask, updateTask, moveTask } = useKanbanStore();

  useEffect(() => {
    if (!projectId) return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.PROJECT(projectId));

    channel.bind(PUSHER_EVENTS.TASK_CREATED, (task: any) => {
      addTask(task);
      toast.info(`New task: ${task.title}`, {
        action: { label: 'View', onClick: () => window.location.href = '/board' },
      });
    });

    channel.bind(PUSHER_EVENTS.TASK_UPDATED, (task: any) => {
      updateTask(task.id, task);
    });

    channel.bind(PUSHER_EVENTS.TASK_MOVED, (data: { taskId: string; newStatus: string }) => {
      moveTask(data.taskId, data.newStatus as any);
    });

    channel.bind(PUSHER_EVENTS.TASK_DELETED, (data: { taskId: string }) => {
      useKanbanStore.getState().removeTask(data.taskId);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(PUSHER_CHANNELS.PROJECT(projectId));
    };
  }, [projectId]);
}