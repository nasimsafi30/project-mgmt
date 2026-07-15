'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSprints(projectId?: string) {
  const queryClient = useQueryClient();

  const { data: sprints = [], isLoading, refetch } = useQuery({
    queryKey: ['sprints', projectId],
    queryFn: async () => {
      const params = projectId ? `?projectId=${projectId}` : '';
      const res = await fetch(`/api/sprints${params}`);
      if (!res.ok) throw new Error('Failed to fetch sprints');
      const data = await res.json();
      return data.sprints || data;
    },
  });

  const createSprint = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create sprint');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Sprint created');
    },
    onError: () => toast.error('Failed to create sprint'),
  });

  const startSprint = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sprints/${id}/start`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start sprint');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Sprint started!');
    },
    onError: () => toast.error('Failed to start sprint'),
  });

  const completeSprint = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sprints/${id}/complete`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to complete sprint');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Sprint completed!');
    },
    onError: () => toast.error('Failed to complete sprint'),
  });

  return {
    sprints, isLoading, refetch,
    createSprint: createSprint.mutate,
    startSprint: startSprint.mutate,
    completeSprint: completeSprint.mutate,
    isCreating: createSprint.isPending,
  };
}