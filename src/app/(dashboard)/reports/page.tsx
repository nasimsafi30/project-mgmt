'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Download, CheckSquare, Clock, Target, TrendingUp, FileText, BarChart3, PieChart, ArrowUpRight, Sparkles, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;
  const review = tasks.filter(t => t.status === 'in_review').length;
  const urgent = tasks.filter(t => t.priority === 'urgent').length;
  const high = tasks.filter(t => t.priority === 'high').length;
  const medium = tasks.filter(t => t.priority === 'medium').length;
  const low = tasks.filter(t => t.priority === 'low').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // WORKING EXPORT FUNCTION
  const handleExportCSV = () => {
    if (tasks.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    // Create CSV content
    const headers = ['Title', 'Status', 'Priority', 'Description', 'Created At'];
    const rows = tasks.map(t => [
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.status || '',
      t.priority || '',
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.created_at ? new Date(t.created_at).toLocaleDateString() : '',
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projecthub-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${tasks.length} tasks to CSV!`);
  };

  const handleExportJSON = () => {
    if (tasks.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const json = JSON.stringify(tasks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projecthub-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${tasks.length} tasks to JSON!`);
  };

  const statusData = [
    { name: 'Done', value: completed, color: '#10B981', gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: Target },
    { name: 'In Progress', value: inProgress, color: '#3B82F6', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Clock },
    { name: 'In Review', value: review, color: '#8B5CF6', gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30', icon: TrendingUp },
    { name: 'To Do', value: todo, color: '#F59E0B', gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: CheckSquare },
    { name: 'Backlog', value: backlog, color: '#6B7280', gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50 dark:bg-gray-800', icon: FileText },
  ];

  const priorityData = [
    { name: 'Urgent', value: urgent, color: '#EF4444', gradient: 'from-red-500 to-red-600', icon: '🔴' },
    { name: 'High', value: high, color: '#F59E0B', gradient: 'from-orange-500 to-orange-600', icon: '🟠' },
    { name: 'Medium', value: medium, color: '#3B82F6', gradient: 'from-blue-500 to-blue-600', icon: '🟡' },
    { name: 'Low', value: low, color: '#10B981', gradient: 'from-green-500 to-green-600', icon: '🟢' },
  ];

  const stats = [
    { label: 'Total Tasks', value: total, icon: CheckSquare, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: completed, icon: Target, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Completion', value: `${completionRate}%`, icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30', gradient: 'from-violet-500 to-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading reports...</p>
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
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
              <p className="text-emerald-100 mt-1">{total} total tasks tracked</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchData} 
              className="text-white hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost"
              onClick={handleExportCSV}
              className="text-white hover:bg-white/20 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />CSV
            </Button>
            <Button 
              variant="ghost"
              onClick={handleExportJSON}
              className="text-white hover:bg-white/20 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <Card 
            key={s.label}
            className={cn(
              "relative overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
              "dark:bg-gray-900 dark:border-gray-800 border-2",
              s.label === 'Total Tasks' ? 'border-blue-100 dark:border-blue-900/30' :
              s.label === 'Completed' ? 'border-emerald-100 dark:border-emerald-900/30' :
              s.label === 'In Progress' ? 'border-amber-100 dark:border-amber-900/30' :
              'border-violet-100 dark:border-violet-900/30'
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
                <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="dark:text-white">Status Distribution</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{total} tasks across {statusData.filter(d => d.value > 0).length} statuses</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {statusData.map((d, index) => {
                const Icon = d.icon;
                const percentage = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div key={d.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1 rounded-lg', d.bg)}>
                          <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{d.value}</span>
                        <span className="text-xs text-gray-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                          d.gradient
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Status Overview Circles */}
            <div className="grid grid-cols-5 gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              {statusData.map(d => (
                <div key={d.name} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br shadow-lg"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${d.color}, ${d.color}dd)` }}
                  >
                    {d.value}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{d.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                <BarChart3 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="dark:text-white">Priority Breakdown</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{urgent} urgent tasks require attention</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {priorityData.map((d, index) => {
                const percentage = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div key={d.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{d.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{d.value}</span>
                        <span className="text-xs text-gray-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                          d.gradient
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Priority Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              {priorityData.map(d => (
                <div 
                  key={d.name}
                  className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{d.icon}</span>
                    <Badge className={cn(
                      'border-0 font-bold',
                      d.name === 'Urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                      d.name === 'High' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                      d.name === 'Medium' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                    )}>
                      {d.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{d.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                <CheckSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <CardTitle className="dark:text-white">All Tasks</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{total} total tasks</p>
              </div>
            </div>
            <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0">
              Last 20 shown
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <CheckSquare className="w-10 h-10 text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">No tasks yet</p>
              <p className="text-sm text-gray-400 mt-1">Start adding tasks to see reports</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 20).map((task, index) => (
                <div 
                  key={task.id} 
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      'w-3 h-3 rounded-full flex-shrink-0 shadow-lg',
                      task.status === 'done' ? 'bg-emerald-500 shadow-emerald-500/50' :
                      task.status === 'in_progress' ? 'bg-blue-500 shadow-blue-500/50' :
                      task.status === 'in_review' ? 'bg-violet-500 shadow-violet-500/50' :
                      'bg-gray-400 shadow-gray-400/50'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          task.status === 'done' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                          task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                          task.status === 'in_review' ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400' :
                          'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        )}>
                          {task.status?.replace('_', ' ')}
                        </span>
                        <Badge className={cn(
                          'text-[10px] border-0',
                          task.priority === 'urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                          task.priority === 'high' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                          'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                        )}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {task.created_at && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200" />
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

