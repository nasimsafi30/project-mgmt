'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Loader2, RefreshCw, Edit, Trash2, Briefcase, Calendar, Users, Sparkles, ArrowUpRight, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const colors = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444','#EC4899','#06B6D4','#84CC16','#F97316','#6366F1'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, teamId: '00000000-0000-0000-0000-000000000001' }),
      });
      toast.success('Project created!');
      setForm({ name: '', description: '' });
      setOpen(false);
      fetchProjects();
    } catch { toast.error('Failed'); }
  };

  const handleEdit = (project: any) => { setEditingProject({ ...project }); setEditOpen(true); };

  const handleUpdate = async () => {
    if (!editingProject) return;
    try {
      await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingProject.name, description: editingProject.description }),
      });
      toast.success('Updated!');
      setEditOpen(false);
      fetchProjects();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete project?')) return;
    try { await fetch(`/api/projects/${id}`, { method: 'DELETE' }); toast.success('Deleted!'); fetchProjects(); }
    catch { toast.error('Failed'); }
  };

  const filtered = projects.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  const activeProjects = projects.filter(p => p.status !== 'archived').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 animate-pulse flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-blue-100 mt-1">{activeProjects} active • {projects.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search projects..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-10 w-56 bg-white/10 border-white/20 text-white placeholder:text-blue-200 rounded-xl focus:bg-white/20 transition-all duration-200" 
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchProjects} 
              className="text-white hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Sparkles className="w-4 h-4" />New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Create New Project
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name *</Label>
                    <Input 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      placeholder="Enter project name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea 
                      rows={3} 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})}
                      placeholder="What's this project about?"
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">Create Project</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 border-emerald-100 dark:border-emerald-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeProjects}</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 border-purple-100 dark:border-purple-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedProjects}</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <Card 
            key={p.id} 
            className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-800 cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Color accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: p.color || colors[i % colors.length] }}
            />
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: p.color || colors[i % colors.length] }}
                  >
                    {(p.name || 'P')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {p.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-1 mt-1">
                      {p.description || 'No description yet'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="font-medium">{p.memberCount || 0}</span>
                    <span className="text-xs">members</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span className="text-xs">{p.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    'border-0 font-medium',
                    p.status === 'archived' 
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' 
                      : p.status === 'completed'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  )}>
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      p.status === 'archived' ? 'bg-gray-400' :
                      p.status === 'completed' ? 'bg-purple-500' : 'bg-emerald-500'
                    )} />
                    {p.status || 'active'}
                  </Badge>
                </div>
                
                {/* Progress Bar (simulated) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {p.status === 'completed' ? '100%' : p.status === 'archived' ? '0%' : `${Math.floor(Math.random() * 60) + 20}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r transition-all duration-1000',
                        p.status === 'completed' ? 'from-purple-500 to-pink-500' :
                        p.status === 'archived' ? 'from-gray-400 to-gray-500' :
                        'from-blue-500 to-cyan-500'
                      )}
                      style={{ 
                        width: p.status === 'completed' ? '100%' : 
                               p.status === 'archived' ? '0%' : 
                               `${Math.floor(Math.random() * 60) + 20}%` 
                      }}
                    />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" 
                    onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                  >
                    <Edit className="w-4 h-4 mr-2" />Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-blue-400 dark:text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium text-lg">No projects found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <Button 
                className="mt-4 gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setOpen(true)}
              >
                <Sparkles className="w-4 h-4" />Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Project
            </DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input 
                  value={editingProject.name} 
                  onChange={e => setEditingProject({...editingProject, name: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea 
                  rows={3} 
                  value={editingProject.description || ''} 
                  onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                  className="rounded-xl resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

