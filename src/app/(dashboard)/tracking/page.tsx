'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, StopCircle, Clock, Plus, Loader2, RefreshCw, Trash2, Sparkles, Timer, TrendingUp, Calendar, ArrowUpRight, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInSeconds, format } from 'date-fns';
import { toast } from 'sonner';

export default function TrackingPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();
  const startRef = useRef<Date>();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/time-entries');
      const data = await res.json();
      setEntries(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  useEffect(() => {
    if (running && startRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsed(differenceInSeconds(new Date(), startRef.current!));
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const start = () => {
    if (!taskTitle.trim()) { toast.error('Enter task title first'); return; }
    startRef.current = new Date();
    setRunning(true);
    toast.success('Timer started');
  };

  const stop = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const endTime = new Date();
    const duration = differenceInSeconds(endTime, startRef.current!);
    setRunning(false);
    setElapsed(0);

    try {
      await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle,
          description,
          startTime: startRef.current!.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          billable: true,
        }),
      });
      toast.success(`Time logged: ${fmt(duration)}`);
      setTaskTitle('');
      setDescription('');
      fetchEntries();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete entry?')) return;
    try {
      await fetch(`/api/time-entries/${id}`, { method: 'DELETE' });
      toast.success('Deleted!');
      fetchEntries();
    } catch { toast.error('Failed'); }
  };

  const todayTotal = entries
    .filter((e: any) => new Date(e.start_time || e.created_at).toDateString() === new Date().toDateString())
    .reduce((s: number, e: any) => s + (e.duration || 0), 0);

  const weekTotal = entries.reduce((s: number, e: any) => s + (e.duration || 0), 0);
  const billableTotal = entries.filter((e: any) => e.billable).reduce((s: number, e: any) => s + (e.duration || 0), 0);

  const stats = [
    { label: 'Today', value: fmt(todayTotal), icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'This Week', value: fmt(weekTotal), icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Billable', value: fmt(billableTotal), icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Entries', value: entries.length, icon: BarChart3, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', gradient: 'from-purple-500 to-pink-500' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse flex items-center justify-center">
            <Timer className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading tracker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Timer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Time Tracking</h1>
              <p className="text-emerald-100 mt-1">{entries.length} time entries recorded</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchEntries} 
            className="text-white hover:bg-white/20 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Timer Card */}
      <Card className={cn(
        'relative overflow-hidden transition-all duration-500 border-2',
        running 
          ? 'border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-xl shadow-emerald-500/10' 
          : 'border-gray-200 dark:border-gray-800 hover:shadow-lg'
      )}>
        {running && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
        )}
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6 w-full">
              {running ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/30">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Tracking Active</span>
                  </div>
                  <div className="text-7xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {fmt(elapsed)}
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{taskTitle}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Title *</Label>
                    <Input 
                      value={taskTitle} 
                      onChange={e => setTaskTitle(e.target.value)} 
                      placeholder="What are you working on?"
                      className="h-12 rounded-xl text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                    <Input 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Add details (optional)"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              {running ? (
                <Button 
                  onClick={stop} 
                  size="lg" 
                  className="rounded-full w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
                >
                  <StopCircle className="w-12 h-12" />
                </Button>
              ) : (
                <Button 
                  onClick={start} 
                  size="lg" 
                  className="rounded-full w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-12 h-12 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <Card 
            key={s.label}
            className={cn(
              "relative overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
              "dark:bg-gray-900 dark:border-gray-800 border-2",
              s.label === 'Today' ? 'border-blue-100 dark:border-blue-900/30' :
              s.label === 'This Week' ? 'border-emerald-100 dark:border-emerald-900/30' :
              s.label === 'Billable' ? 'border-amber-100 dark:border-amber-900/30' :
              'border-purple-100 dark:border-purple-900/30'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              s.gradient
            )} />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className={cn('p-2.5 rounded-xl', s.bg, 'group-hover:scale-110 transition-transform duration-300')}>
                  <s.icon className={cn('w-5 h-5', s.color)} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <p className={cn('text-2xl font-bold mt-1 font-mono', s.color)}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Entries List */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <CardTitle className="dark:text-white">Time Entries</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{entries.length} total entries</p>
              </div>
            </div>
            <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0">
              Recent
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">No time entries yet</p>
              <p className="text-sm text-gray-400 mt-1">Start the timer to track your work</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn(
                      'w-3 h-3 rounded-full flex-shrink-0 shadow-lg',
                      entry.billable ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-400 shadow-gray-400/50'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-200 truncate">
                        {entry.task_title}
                      </p>
                      {entry.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {entry.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.start_time ? format(new Date(entry.start_time), 'h:mm a') : '?'} - {entry.end_time ? format(new Date(entry.end_time), 'h:mm a') : 'Running'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                      {fmt(entry.duration || 0)}
                    </p>
                    <Badge className={cn(
                      'border-0 text-[10px] font-medium',
                      entry.billable 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                      {entry.billable ? 'Billable' : 'Non-billable'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200" 
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

