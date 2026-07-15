'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckSquare, Activity, Target, Zap, Plus, ChevronRight, ListTodo, Loader2, RefreshCw, TrendingUp, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const urgent = tasks.filter(t => t.priority === 'urgent').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-white absolute inset-0 m-auto" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>
            <p className="text-gray-400 ml-14">Welcome back! Here's your project overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchData} 
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105" 
              onClick={() => router.push('/board')}
            >
              <Plus className="w-4 h-4 mr-2" />New Task
            </Button>
          </div>
        </div>
        
        {/* Stats Mini Overview */}
        <div className="relative grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs text-gray-400">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{inProgress}</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{completed}</p>
            <p className="text-xs text-gray-400">Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{urgent}</p>
            <p className="text-xs text-gray-400">Urgent</p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Tasks', 
            value: total, 
            icon: CheckSquare, 
            color: 'text-blue-600 dark:text-blue-400', 
            bg: 'bg-blue-50 dark:bg-blue-950/30',
            border: 'border-blue-100 dark:border-blue-900/30',
            gradient: 'from-blue-500/10 to-blue-600/10'
          },
          { 
            label: 'In Progress', 
            value: inProgress, 
            icon: Activity, 
            color: 'text-amber-600 dark:text-amber-400', 
            bg: 'bg-amber-50 dark:bg-amber-950/30',
            border: 'border-amber-100 dark:border-amber-900/30',
            gradient: 'from-amber-500/10 to-amber-600/10'
          },
          { 
            label: 'Completed', 
            value: completed, 
            icon: Target, 
            color: 'text-emerald-600 dark:text-emerald-400', 
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
            border: 'border-emerald-100 dark:border-emerald-900/30',
            gradient: 'from-emerald-500/10 to-emerald-600/10'
          },
          { 
            label: 'Urgent', 
            value: urgent, 
            icon: Zap, 
            color: 'text-red-600 dark:text-red-400', 
            bg: 'bg-red-50 dark:bg-red-950/30',
            border: 'border-red-100 dark:border-red-900/30',
            gradient: 'from-red-500/10 to-red-600/10'
          },
        ].map((s, index) => (
          <Card 
            key={s.label} 
            className={cn(
              "relative overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer",
              "dark:bg-gray-900 dark:border-gray-800",
              s.border
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              s.gradient
            )} />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className={cn('p-3 rounded-xl', s.bg, 'group-hover:scale-110 transition-transform duration-300')}>
                  <s.icon className={cn('w-5 h-5', s.color)} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <p className={cn('text-3xl font-bold mt-1', s.color)}>{s.value}</p>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    s.label === 'Total Tasks' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    s.label === 'In Progress' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                    s.label === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                    'bg-gradient-to-r from-red-500 to-red-600'
                  )}
                  style={{ width: `${s.value > 0 ? (s.value / total) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Rate Card */}
      {total > 0 && (
        <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                    className="text-emerald-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Tasks Card */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="dark:text-white">Recent Tasks</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">{tasks.length} total tasks</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/board')} 
            className="dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ListTodo className="w-10 h-10 text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">No tasks yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first task to get started</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 rounded-xl"
                onClick={() => router.push('/board')}
              >
                <Plus className="w-4 h-4 mr-2" />Create Task
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {tasks.slice(0, 8).map((task, index) => (
                <div 
                  key={task.id} 
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                  onClick={() => router.push('/board')}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      task.priority === 'urgent' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 
                      task.priority === 'high' ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : 
                      'bg-blue-500 shadow-lg shadow-blue-500/50'
                    )} />
                    <div className={cn(
                      'absolute inset-0 rounded-full animate-ping opacity-75',
                      task.priority === 'urgent' ? 'bg-red-500' : 
                      task.priority === 'high' ? 'bg-orange-500' : 
                      'bg-blue-500'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        task.status === 'done' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                        task.status === 'in_progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                        'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      )}>
                        {task.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs border-2 font-medium',
                        task.priority === 'urgent' ? 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400' :
                        task.priority === 'high' ? 'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400' :
                        'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400'
                      )}
                    >
                      {task.priority}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
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

