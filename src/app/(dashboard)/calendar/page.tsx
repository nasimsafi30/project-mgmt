'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Loader2, RefreshCw, Edit, Trash2, AlertCircle, Calendar as CalendarIcon, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { toast } from 'sonner';

export default function CalendarPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: format(new Date(), 'yyyy-MM-dd') });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      const taskList = data.data || data || [];
      console.log('Fetched tasks:', taskList.length, taskList);
      setTasks(taskList);
      if (taskList.length === 0) setError('No tasks found. Add an event!');
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // CREATE - ensures dueDate is set
  const handleCreate = async () => {
    if (!newTask.title.trim()) { toast.error('Title required'); return; }
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTask.title, 
          priority: newTask.priority, 
          status: 'todo', 
          dueDate: newTask.dueDate + 'T00:00:00Z'
        }),
      });
      if (res.ok) {
        toast.success('Event created!');
        setNewTask({ title: '', priority: 'medium', dueDate: format(new Date(), 'yyyy-MM-dd') });
        setOpen(false);
        fetchTasks();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed');
      }
    } catch { toast.error('Failed'); }
  };

  const openEditDialog = (task: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask({ ...task, dueDate: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd') });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTask) return;
    try {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingTask.title,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate + 'T00:00:00Z',
        }),
      });
      toast.success('Updated!');
      setEditOpen(false);
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      toast.success('Deleted!');
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Show ALL tasks, not just ones with dueDate
  const selectedTasks = selectedDate ? tasks.filter(t => {
    const taskDate = t.due_date || t.dueDate;
    return taskDate && isSameDay(new Date(taskDate), selectedDate);
  }) : [];
  
  const upcomingTasks = tasks
    .filter(t => t.due_date || t.dueDate)
    .sort((a,b) => new Date(a.due_date || a.dueDate).getTime() - new Date(b.due_date || b.dueDate).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse flex items-center justify-center">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <CalendarIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Calendar</h1>
              <p className="text-violet-100 mt-1">{tasks.length} total tasks scheduled</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchTasks} 
              className="text-white hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-violet-600 hover:bg-violet-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Sparkles className="w-4 h-4" />Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Add New Event
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title *</Label>
                    <Input 
                      value={newTask.title} 
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter event title"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date *</Label>
                    <Input 
                      type="date" 
                      value={newTask.dueDate} 
                      onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select value={newTask.priority} onValueChange={v => setNewTask({...newTask, priority: v})}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low</SelectItem>
                        <SelectItem value="medium">🟡 Medium</SelectItem>
                        <SelectItem value="high">🟠 High</SelectItem>
                        <SelectItem value="urgent">🔴 Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">Create Event</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Month Navigation */}
        <div className="relative flex items-center justify-center gap-4 mt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentDate(subMonths(currentDate,1))}
            className="text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-white min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentDate(addMonths(currentDate,1))}
            className="text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3 dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div 
                  key={day} 
                  className="text-center"
                >
                  <span className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    index === 0 || index === 6 
                      ? 'text-violet-500 dark:text-violet-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const dayTasks = tasks.filter(t => {
                  const taskDate = t.due_date || t.dueDate;
                  return taskDate && isSameDay(new Date(taskDate), day);
                });
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(day)} 
                    className={cn(
                      'min-h-[100px] p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 relative group',
                      'hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-900/30',
                      isCurrentMonth 
                        ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' 
                        : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-50 dark:border-gray-800',
                      isSelected && 'border-violet-400 dark:border-violet-600 ring-2 ring-violet-200 dark:ring-violet-900/30 shadow-lg',
                      isToday(day) && !isSelected && 'border-violet-200 dark:border-violet-900/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        'font-semibold text-sm w-7 h-7 flex items-center justify-center rounded-full transition-colors',
                        isToday(day) && 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25',
                        !isToday(day) && isCurrentMonth && 'text-gray-700 dark:text-gray-300',
                        !isCurrentMonth && 'text-gray-300 dark:text-gray-600'
                      )}>
                        {format(day, 'd')}
                      </span>
                      {dayTasks.length > 0 && (
                        <Badge className="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400 border-0 text-[10px] font-medium">
                          {dayTasks.length}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(t => (
                        <div 
                          key={t.id} 
                          className={cn(
                            'px-2 py-1 rounded-lg truncate text-white text-[10px] font-medium bg-gradient-to-r shadow-sm',
                            getPriorityColor(t.priority)
                          )}
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 px-2">
                          +{dayTasks.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Tasks */}
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                  <CalendarIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">
                    {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a Date'}
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedTasks.length} tasks</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">No tasks for this date</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTasks.map(t => (
                    <div 
                      key={t.id} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-all duration-200"
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full bg-gradient-to-r',
                        getPriorityColor(t.priority)
                      )} />
                      <span className="text-sm flex-1 truncate text-gray-700 dark:text-gray-300 font-medium">
                        {t.title}
                      </span>
                      <Badge className={cn(
                        'text-[10px] border-0',
                        t.priority === 'urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                        t.priority === 'high' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      )}>
                        {t.priority}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg" 
                          onClick={(e) => openEditDialog(t, e)}
                        >
                          <Edit className="w-3 h-3 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg" 
                          onClick={(e) => handleDelete(t.id, e)}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg dark:text-white">Upcoming</CardTitle>
                    <p className="text-xs text-gray-400 mt-0.5">{upcomingTasks.length} events</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((t, index) => (
                    <div 
                      key={t.id} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-all duration-200"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br text-white shadow-lg',
                        getPriorityColor(t.priority)
                      )}>
                        {t.due_date ? format(new Date(t.due_date), 'd') : t.dueDate ? format(new Date(t.dueDate), 'd') : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {t.due_date ? format(new Date(t.due_date), 'MMM d, yyyy') : t.dueDate ? format(new Date(t.dueDate), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge className={cn(
                        'text-[10px] border-0',
                        t.priority === 'urgent' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                        t.priority === 'high' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      )}>
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Edit Event
            </DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <Input 
                  value={editingTask.title} 
                  onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Input 
                  type="date" 
                  value={editingTask.dueDate || ''} 
                  onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                <Select value={editingTask.priority} onValueChange={v => setEditingTask({...editingTask, priority: v})}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

