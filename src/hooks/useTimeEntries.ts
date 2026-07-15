'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { differenceInSeconds } from 'date-fns';
import { toast } from 'sonner';

export function useTimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [billable, setBillable] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startRef = useRef<Date>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isRunning && startRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsed(differenceInSeconds(new Date(), startRef.current!));
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const { data: entries = [], refetch } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: async () => {
      const res = await fetch('/api/time-entries');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.entries || data;
    },
  });

  const start = useCallback(() => {
    if (!selectedTask) { toast.error('Select a task first'); return; }
    startRef.current = new Date();
    setIsRunning(true);
    toast.success('Timer started');
  }, [selectedTask]);

  const stop = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const endTime = new Date();
    const duration = differenceInSeconds(endTime, startRef.current!);

    try {
      await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: selectedTask,
          description,
          billable,
          startTime: startRef.current!.toISOString(),
          endTime: endTime.toISOString(),
          duration,
        }),
      });
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      toast.success(`Time saved: ${formatTime(duration)}`);
    } catch {
      toast.error('Failed to save time entry');
    }

    setIsRunning(false);
    setElapsed(0);
    setDescription('');
  }, [selectedTask, description, billable, queryClient]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const todayTotal = entries
    .filter((e: any) => new Date(e.date || e.startTime).toDateString() === new Date().toDateString())
    .reduce((sum: number, e: any) => sum + (e.duration || 0), 0);

  return {
    isRunning, elapsed, formatTime,
    selectedTask, setSelectedTask,
    description, setDescription,
    billable, setBillable,
    entries, todayTotal,
    start, stop, refetch,
  };
}