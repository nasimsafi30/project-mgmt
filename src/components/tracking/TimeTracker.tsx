'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, StopCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { toast } from 'sonner';

export function TimeTracker() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [task, setTask] = useState('Working on task');
  const ref = useRef<NodeJS.Timeout>();
  const startRef = useRef<Date>();

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed(differenceInSeconds(new Date(), startRef.current!)), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const fmt = (s: number) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const start = () => { startRef.current = new Date(); setRunning(true); toast.success('Timer started'); };
  const stop = () => { setRunning(false); setElapsed(0); toast.success(`Time logged: ${fmt(elapsed)}`); };

  return (
    <div className={cn('p-6 rounded-2xl text-center transition-all', running?'bg-blue-50 border-2 border-blue-200':'bg-gray-50')}>
      {running ? (
        <>
          <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{fmt(elapsed)}</div>
          <Badge className="bg-blue-100 text-blue-700 mb-3"><Clock className="w-3 h-3 mr-1 animate-spin"/>Tracking</Badge>
          <p className="text-sm text-gray-600 mb-4">{task}</p>
          <Button onClick={stop} variant="destructive" size="lg" className="rounded-full w-16 h-16"><StopCircle className="w-8 h-8"/></Button>
        </>
      ) : (
        <>
          <div className="text-4xl font-mono font-bold text-gray-400 mb-4">00:00:00</div>
          <Button onClick={start} size="lg" className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"><Play className="w-8 h-8"/></Button>
        </>
      )}
    </div>
  );
}