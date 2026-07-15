'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useTeams() {
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error('Failed to fetch teams');
      return res.json();
    },
  });

  const createTeam = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create team');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created');
    },
    onError: () => toast.error('Failed to create team'),
  });

  const updateTeam = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update team');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team updated');
    },
    onError: () => toast.error('Failed to update team'),
  });

  return {
    teams, isLoading, refetch,
    createTeam: createTeam.mutate,
    updateTeam: updateTeam.mutate,
    isCreating: createTeam.isPending,
  };
}