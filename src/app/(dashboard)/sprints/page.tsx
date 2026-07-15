'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Play, CheckCircle2, Loader2, RefreshCw, Trash2, Sparkles, Zap, Target, Calendar, Clock, TrendingUp, ArrowUpRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInDays, isAfter, isBefore } from 'date-fns';
import { toast } from 'sonner';

export default function SprintsPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: '', goal: '', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), totalPoints: 30 });

  const fetchSprints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sprints');
      const data = await res.json();
      setSprints(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSprints(); }, [fetchSprints]);

  const handleCreate = async () => {
    if (!newSprint.name.trim()) { toast.error('Name required'); return; }
    try {
      await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSprint),
      });
      toast.success('Sprint created!');
      setNewSprint({ name: '', goal: '', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), totalPoints: 30 });
      setOpen(false);
      fetchSprints();
    } catch { toast.error('Failed'); }
  };

  const handleStart = async (id: string) => {
    try {
      await fetch(`/api/sprints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      toast.success('Sprint started!');
      fetchSprints();
    } catch { toast.error('Failed'); }
  };

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/sprints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      toast.success('Sprint completed!');
      fetchSprints();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete sprint?')) return;
    try {
      await fetch(`/api/sprints/${id}`, { method: 'DELETE' });
      toast.success('Deleted!');
      fetchSprints();
    } catch { toast.error('Failed'); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-emerald-500 to-teal-500';
      case 'completed': return 'from-blue-500 to-cyan-500';
      case 'planning': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
      case 'completed': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/30';
      case 'planning': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading sprints...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sprints</h1>
              <p className="text-amber-100 mt-1">{sprints.length} sprints • {sprints.filter(s => s.status === 'active').length} active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchSprints} 
              className="text-white hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-orange-600 hover:bg-amber-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Sparkles className="w-4 h-4" />Create Sprint
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Create New Sprint
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name *</Label>
                    <Input 
                      value={newSprint.name} 
                      onChange={e => setNewSprint({...newSprint, name: e.target.value})}
                      placeholder="e.g., Sprint 1 - User Authentication"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Goal</Label>
                    <Input 
                      value={newSprint.goal} 
                      onChange={e => setNewSprint({...newSprint, goal: e.target.value})}
                      placeholder="What do you want to achieve?"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Date</Label>
                      <Input 
                        type="date" 
                        value={newSprint.startDate} 
                        onChange={e => setNewSprint({...newSprint, startDate: e.target.value})}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Date</Label>
                      <Input 
                        type="date" 
                        value={newSprint.endDate} 
                        onChange={e => setNewSprint({...newSprint, endDate: e.target.value})}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Story Points</Label>
                    <Input 
                      type="number" 
                      value={newSprint.totalPoints} 
                      onChange={e => setNewSprint({...newSprint, totalPoints: parseInt(e.target.value) || 0})}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">Create Sprint</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Sprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map((sprint, index) => {
          const progress = sprint.total_points > 0 ? Math.round((sprint.completed_points / sprint.total_points) * 100) : 0;
          const daysLeft = differenceInDays(new Date(sprint.end_date), new Date());
          const isOverdue = daysLeft < 0 && sprint.status === 'active';
          const isActive = sprint.status === 'active';
          
          return (
            <Card 
              key={sprint.id} 
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient accent top */}
              <div className={cn(
                'absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r',
                getStatusColor(sprint.status)
              )} />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {sprint.name}
                      </CardTitle>
                      <Badge className={cn('border text-[10px] font-medium', getStatusBadge(sprint.status))}>
                        {sprint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {sprint.goal || 'No goal set'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={() => handleDelete(sprint.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    </div>
                    <span className={cn(
                      'text-sm font-bold',
                      progress >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                      progress >= 50 ? 'text-amber-600 dark:text-amber-400' :
                      'text-gray-600 dark:text-gray-400'
                    )}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                        progress >= 80 ? 'from-emerald-500 to-teal-500' :
                        progress >= 50 ? 'from-amber-500 to-orange-500' :
                        'from-blue-500 to-cyan-500'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Points</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {sprint.completed_points || 0}/{sprint.total_points}
                    </p>
                  </div>
                  <div className={cn(
                    'p-3 rounded-xl',
                    isOverdue 
                      ? 'bg-red-50 dark:bg-red-950/30' 
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  )}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {isOverdue ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">Days</span>
                    </div>
                    <p className={cn(
                      'text-sm font-bold',
                      isOverdue ? 'text-red-600 dark:text-red-400' : 
                      daysLeft <= 3 ? 'text-amber-600 dark:text-amber-400' :
                      'text-emerald-600 dark:text-emerald-400'
                    )}>
                      {isOverdue ? `${Math.abs(daysLeft)} overdue` : `${daysLeft} left`}
                    </p>
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {format(new Date(sprint.start_date), 'MMM d')} - {format(new Date(sprint.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {sprint.status === 'planning' && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                      onClick={() => handleStart(sprint.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />Start Sprint
                    </Button>
                  )}
                  {sprint.status === 'active' && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                      onClick={() => handleComplete(sprint.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />Complete
                    </Button>
                  )}
                  {sprint.status === 'completed' && (
                    <div className="flex-1 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Empty State */}
        {sprints.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 flex items-center justify-center">
                <Zap className="w-12 h-12 text-amber-400 dark:text-amber-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium text-lg">No sprints yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first sprint to start tracking progress</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Sparkles className="w-4 h-4" />Create Your First Sprint
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

