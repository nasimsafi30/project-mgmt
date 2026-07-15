'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Calendar, Clock, CheckCircle2, AlertCircle,
  BarChart3, GanttChart, Sparkles, ArrowUpRight, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInDays, addWeeks, subWeeks, startOfWeek, addMonths, subMonths } from 'date-fns';
import { useKanbanStore } from '@/store';

export default function GanttPage() {
  const { tasks } = useKanbanStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState(2); // weeks to show
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const ganttTasks = tasks.filter(t => t.dueDate).map((t, i) => ({
    ...t,
    startDate: new Date(t.createdAt || Date.now()),
    endDate: new Date(t.dueDate || Date.now()),
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'][i % 7],
    progress: t.status === 'done' ? 100 : t.status === 'in_review' ? 80 : t.status === 'in_progress' ? 50 : 20,
  }));

  const startDate = startOfWeek(currentDate);
  const endDate = addWeeks(startDate, zoom);
  const totalDays = differenceInDays(endDate, startDate);

  const getBarStyle = (task: any) => {
    const left = Math.max(0, differenceInDays(new Date(task.startDate), startDate));
    const width = Math.max(2, differenceInDays(new Date(task.endDate), new Date(task.startDate)) + 1);
    return {
      left: `${(left / totalDays) * 100}%`,
      width: `${(width / totalDays) * 100}%`,
    };
  };

  const todayPos = (() => {
    const now = new Date();
    if (now < startDate || now > endDate) return null;
    return `${(differenceInDays(now, startDate) / totalDays) * 100}%`;
  })();

  // Generate date headers
  const dateHeaders = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  const stats = [
    { 
      label: 'Total', 
      value: ganttTasks.length, 
      icon: BarChart3, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Completed', 
      value: ganttTasks.filter(t => t.status === 'done').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    { 
      label: 'In Progress', 
      value: ganttTasks.filter(t => t.status === 'in_progress').length, 
      icon: Clock, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      gradient: 'from-amber-500 to-amber-600'
    },
    { 
      label: 'Overdue', 
      value: ganttTasks.filter(t => new Date(t.endDate) < new Date() && t.status !== 'done').length, 
      icon: AlertCircle, 
      color: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-50 dark:bg-red-950/30',
      gradient: 'from-red-500 to-red-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <GanttChart className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gantt Chart</h1>
              <p className="text-slate-300 mt-1">
                {ganttTasks.length} tasks • {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.max(1, zoom - 1))}
                className="text-white hover:bg-white/20 rounded-lg h-8 w-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="text-sm text-white min-w-[80px] text-center font-medium">
                {zoom} {zoom === 1 ? 'week' : 'weeks'}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.min(12, zoom + 1))}
                className="text-white hover:bg-white/20 rounded-lg h-8 w-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="relative flex items-center justify-center gap-4 mt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentDate(subWeeks(currentDate, zoom))}
            className="text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setCurrentDate(new Date())}
            className="text-white hover:bg-white/20 rounded-xl px-4 font-medium"
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentDate(addWeeks(currentDate, zoom))}
            className="text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <Card 
            key={s.label}
            className={cn(
              "relative overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
              "dark:bg-gray-900 dark:border-gray-800 border-2",
              s.label === 'Total' ? 'border-blue-100 dark:border-blue-900/30' :
              s.label === 'Completed' ? 'border-emerald-100 dark:border-emerald-900/30' :
              s.label === 'In Progress' ? 'border-amber-100 dark:border-amber-900/30' :
              'border-red-100 dark:border-red-900/30'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              `from-${s.gradient.split(' ')[1]}/10 to-${s.gradient.split(' ')[3]}/10`
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

      {/* Gantt Chart */}
      <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <CardTitle className="dark:text-white">Timeline</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Drag to scroll • Scroll to zoom</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded-full bg-blue-500" /> In Progress
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
                <div className="w-3 h-3 rounded-full bg-red-500" /> Overdue
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {ganttTasks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">No tasks with due dates</p>
                  <p className="text-sm text-gray-400 mt-1">Add due dates to your tasks to see them here</p>
                </div>
              ) : (
                <>
                  {/* Date Headers */}
                  <div className="flex border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <div className="w-72 min-w-[288px] border-r border-gray-100 dark:border-gray-800 p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Task</span>
                    </div>
                    <div className="flex-1 flex">
                      {dateHeaders.map((date, i) => (
                        <div 
                          key={i}
                          className={cn(
                            'flex-1 text-center py-3 text-[10px] font-medium',
                            i % 7 === 0 || i % 7 === 6 
                              ? 'text-cyan-500 dark:text-cyan-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          )}
                        >
                          {format(date, 'd')}
                          {i === 0 && <div className="text-[8px]">{format(date, 'MMM')}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Task Rows */}
                  {ganttTasks.map((task, i) => {
                    const { left, width } = getBarStyle(task);
                    const isHovered = hoveredTask === task.id;
                    const isOverdue = new Date(task.endDate) < new Date() && task.status !== 'done';
                    
                    return (
                      <div 
                        key={task.id} 
                        className={cn(
                          'flex border-b border-gray-50 dark:border-gray-800/50 transition-colors duration-200',
                          isHovered ? 'bg-gray-50 dark:bg-gray-800/30' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20'
                        )}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        <div className="w-72 min-w-[288px] border-r border-gray-100 dark:border-gray-800 p-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg" 
                              style={{ backgroundColor: task.color }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-200">
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge className={cn(
                                  'text-[10px] border-0 font-medium',
                                  task.priority === 'urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                                  task.priority === 'high' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                                  'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                                )}>
                                  {task.priority}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ 
                                        width: `${task.progress}%`,
                                        backgroundColor: task.color 
                                      }}
                                    />
                                  </div>
                                  <span>{task.progress}%</span>
                                </div>
                              </div>
                              {isHovered && (
                                <div className="text-[10px] text-gray-400 mt-1">
                                  {format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.endDate), 'MMM d, yyyy')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 relative py-4">
                          {/* Grid lines */}
                          {Array.from({ length: Math.ceil(totalDays / 7) }, (_, i) => (
                            <div 
                              key={i}
                              className="absolute top-0 bottom-0 border-l border-gray-50 dark:border-gray-800/30"
                              style={{ left: `${(i * 7 / totalDays) * 100}%` }}
                            />
                          ))}
                          
                          {/* Today line */}
                          {todayPos && (
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 to-red-500 z-20" 
                              style={{ left: todayPos }}
                            >
                              <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                              <div className="absolute top-0 -left-8 text-[10px] font-bold text-red-500 bg-white dark:bg-gray-900 px-1">
                                TODAY
                              </div>
                            </div>
                          )}
                          
                          {/* Task Bar */}
                          <div 
                            className={cn(
                              'absolute top-2 h-8 rounded-xl cursor-pointer transition-all duration-200',
                              'hover:shadow-xl hover:-translate-y-0.5',
                              isOverdue && 'animate-pulse'
                            )}
                            style={{ left, width, backgroundColor: task.color }}
                          >
                            {/* Progress fill */}
                            <div 
                              className="h-full rounded-xl relative overflow-hidden"
                              style={{ 
                                width: `${task.progress}%`, 
                                backgroundColor: task.color, 
                                filter: 'brightness(0.7)' 
                              }}
                            >
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>
                            
                            {/* Hover tooltip */}
                            {isHovered && (
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl z-30">
                                <p className="font-medium">{task.title}</p>
                                <p className="text-gray-300 mt-1">
                                  {task.progress}% complete • {isOverdue ? '⚠️ Overdue' : 'On track'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

