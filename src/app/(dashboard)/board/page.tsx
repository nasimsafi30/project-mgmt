'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Calendar, Loader2, RefreshCw, Edit, Trash2, GripVertical, Sparkles, Filter, LayoutGrid } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const columns = [
  { id: 'backlog', title: 'Backlog', bg: 'bg-gray-50 dark:bg-gray-900/50', border: 'border-gray-200 dark:border-gray-800', icon: '📋', gradient: 'from-gray-400 to-gray-500' },
  { id: 'todo', title: 'To Do', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900/30', icon: '📌', gradient: 'from-blue-400 to-blue-500' },
  { id: 'in_progress', title: 'In Progress', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900/30', icon: '🔄', gradient: 'from-amber-400 to-amber-500' },
  { id: 'in_review', title: 'In Review', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900/30', icon: '👀', gradient: 'from-purple-400 to-purple-500' },
  { id: 'done', title: 'Done', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-900/30', icon: '✅', gradient: 'from-emerald-400 to-emerald-500' },
] as const;

export default function BoardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'backlog' });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // FETCH
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // CREATE
  const handleCreate = async () => {
    if (!newTask.title.trim()) { toast.error('Title required'); return; }
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      toast.success('Task created!');
      setNewTask({ title: '', description: '', priority: 'medium', status: 'backlog' });
      setOpen(false);
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  // OPEN EDIT DIALOG
  const openEdit = (task: any) => {
    setEditingTask({ ...task });
    setEditOpen(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!editingTask) return;
    try {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          status: editingTask.status,
        }),
      });
      toast.success('Task updated!');
      setEditOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  // DELETE
  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      toast.success('Task deleted!');
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  // MOVE (Drag & Drop)
  const handleDragEnd = async (event: any) => {
    setActiveTask(null);
    if (!event.over) return;
    const taskId = event.active.id;
    const newStatus = event.over.id;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch { fetchTasks(); }
  };

  const filtered = tasks.filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase()));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30';
      default: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
            <LayoutGrid className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6 mb-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <LayoutGrid className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
              <p className="text-gray-400 text-sm">{tasks.length} tasks across {columns.length} columns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search tasks..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:bg-white/20 transition-all duration-200" 
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchTasks} 
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-4 h-4" />Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Create New Task
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title *</Label>
                    <Input 
                      value={newTask.title} 
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea 
                      rows={3} 
                      value={newTask.description} 
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Add a description..."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority</Label>
                      <Select value={newTask.priority} onValueChange={v => setNewTask({...newTask, priority: v})}>
                        <SelectTrigger className="rounded-xl">
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select value={newTask.status} onValueChange={v => setNewTask({...newTask, status: v})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Board */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={e => setActiveTask(tasks.find(t => t.id === e.active.id) || null)} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                className={cn(
                  'flex-shrink-0 w-80 rounded-2xl p-4 border transition-all duration-200',
                  col.bg,
                  col.border
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-3 h-3 rounded-full bg-gradient-to-r',
                      col.gradient
                    )} />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {col.icon} {col.title}
                    </h3>
                  </div>
                  <Badge className={cn(
                    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 border-0 font-medium',
                  )}>
                    {colTasks.length}
                  </Badge>
                </div>
                <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 min-h-[200px]">
                    {colTasks.map(task => (
                      <Card 
                        key={task.id} 
                        className="cursor-grab active:cursor-grabbing hover:shadow-xl border-0 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 group relative overflow-hidden"
                      >
                        <div className={cn(
                          'absolute top-0 left-0 w-1 h-full bg-gradient-to-b',
                          task.priority === 'urgent' ? 'from-red-500 to-red-600' :
                          task.priority === 'high' ? 'from-orange-500 to-orange-600' :
                          task.priority === 'medium' ? 'from-yellow-500 to-yellow-600' :
                          'from-blue-500 to-blue-600'
                        )} />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <p className="font-medium text-sm flex-1 text-gray-900 dark:text-gray-200">{task.title}</p>
                            </div>
                            <Badge className={cn('text-[10px] border', getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-3 ml-6">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 ml-6 mb-3">
                              <Calendar className="w-3 h-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          {/* Action Buttons */}
                          <div className="flex gap-1 pt-3 border-t border-gray-50 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors" 
                              onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors" 
                              onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-300 dark:text-gray-600">
                        <Filter className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs">No tasks</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <Card className="w-80 shadow-2xl rotate-3 border-2 border-blue-300 dark:border-blue-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-blue-400" />
                  <p className="font-medium text-sm">{activeTask.title}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Edit Task
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
                <Label className="text-sm font-medium">Description</Label>
                <Textarea 
                  rows={3} 
                  value={editingTask.description || ''} 
                  onChange={e => setEditingTask({...editingTask, description: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <Select value={editingTask.priority} onValueChange={v => setEditingTask({...editingTask, priority: v})}>
                    <SelectTrigger className="rounded-xl">
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={editingTask.status} onValueChange={v => setEditingTask({...editingTask, status: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

