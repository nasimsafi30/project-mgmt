'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Users, Loader2, RefreshCw, Edit, Trash2, Calendar, Mail, Shield, Clock, Briefcase, CheckSquare, Sparkles, ArrowUpRight, UserPlus, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<any>(null);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', color: '#3B82F6' });

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      setTeams(data.data || data || []);
    } catch (err) { console.error('Fetch failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const handleCreate = async () => {
    if (!newTeam.name.trim()) { toast.error('Name required'); return; }
    try {
      await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTeam) });
      toast.success('Team created!');
      setNewTeam({ name: '', description: '', color: '#3B82F6' });
      setOpen(false);
      fetchTeams();
    } catch { toast.error('Failed'); }
  };

  const handleEdit = (team: any) => { setEditingTeam({ ...team }); setEditOpen(true); };
  const handleUpdate = async () => {
    if (!editingTeam) return;
    try {
      await fetch(`/api/teams/${editingTeam.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editingTeam.name, description: editingTeam.description }) });
      toast.success('Updated!');
      setEditOpen(false);
      fetchTeams();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete team?')) return;
    try { await fetch(`/api/teams/${id}`, { method: 'DELETE' }); toast.success('Deleted!'); fetchTeams(); }
    catch { toast.error('Failed'); }
  };

  const viewTeam = (team: any) => { setViewingTeam(team); setViewOpen(true); };
  const filtered = teams.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const teamColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Teams</h1>
              <p className="text-purple-100 mt-1">{teams.length} teams • Collaborate together</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search teams..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-10 w-56 bg-white/10 border-white/20 text-white placeholder:text-purple-200 rounded-xl focus:bg-white/20 transition-all duration-200" 
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchTeams} 
              className="text-white hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-purple-600 hover:bg-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Sparkles className="w-4 h-4" />Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Create New Team
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name *</Label>
                    <Input 
                      value={newTeam.name} 
                      onChange={e => setNewTeam({...newTeam, name: e.target.value})} 
                      placeholder="e.g. Engineering Team"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Input 
                      value={newTeam.description} 
                      onChange={e => setNewTeam({...newTeam, description: e.target.value})} 
                      placeholder="What does this team do?"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Team Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {teamColors.map(c => (
                        <button
                          key={c} 
                          onClick={() => setNewTeam({...newTeam, color: c})} 
                          className={cn(
                            'w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-110',
                            newTeam.color === c 
                              ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110 shadow-lg' 
                              : 'hover:shadow-md'
                          )} 
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Create Team</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((team, index) => (
          <Card 
            key={team.id} 
            className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer dark:bg-gray-900 dark:border-gray-800"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => viewTeam(team)}
          >
            {/* Team color accent */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: team.color || '#3B82F6' }}
            />
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: team.color || '#3B82F6' }}
                  >
                    {team.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {team.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-1 mt-1">
                      {team.description || 'No description'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-center group/stat hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit mx-auto mb-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{team.member_count || 0}</p>
                    <p className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">Members</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 text-center group/stat hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 w-fit mx-auto mb-2">
                      <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{team.project_count || 0}</p>
                    <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Projects</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 text-center group/stat hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-2">
                      <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{team.task_count || 0}</p>
                    <p className="text-[10px] text-purple-500 dark:text-purple-400 font-medium">Tasks</p>
                  </div>
                </div>
                
                {/* Creation Date */}
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created {team.created_at ? format(new Date(team.created_at), 'MMM d, yyyy') : 'Recently'}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors" 
                    onClick={() => handleEdit(team)}
                  >
                    <Edit className="w-4 h-4 mr-2" />Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" 
                    onClick={() => handleDelete(team.id)}
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
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
                <Users className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium text-lg">No teams found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try a different search term' : 'Create your first team to get started'}
            </p>
            {!search && (
              <Button 
                className="mt-4 gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setOpen(true)}
              >
                <Sparkles className="w-4 h-4" />Create Your First Team
              </Button>
            )}
          </div>
        )}
      </div>

      {/* View Team Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {viewingTeam?.name}
            </DialogTitle>
          </DialogHeader>
          {viewingTeam && (
            <div className="space-y-6 mt-4">
              {/* Team Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                  style={{ backgroundColor: viewingTeam.color || '#3B82F6' }}
                >
                  {viewingTeam.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">{viewingTeam.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{viewingTeam.description || 'No description'}</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label:'Members', value:viewingTeam.member_count||0, icon:Users, color:'text-blue-600 dark:text-blue-400', bg:'bg-blue-50 dark:bg-blue-950/30' },
                  { label:'Projects', value:viewingTeam.project_count||0, icon:Briefcase, color:'text-emerald-600 dark:text-emerald-400', bg:'bg-emerald-50 dark:bg-emerald-950/30' },
                  { label:'Tasks', value:viewingTeam.task_count||0, icon:CheckSquare, color:'text-purple-600 dark:text-purple-400', bg:'bg-purple-50 dark:bg-purple-950/30' },
                  { label:'Created', value:viewingTeam.created_at?format(new Date(viewingTeam.created_at),'MMM d'):'N/A', icon:Calendar, color:'text-amber-600 dark:text-amber-400', bg:'bg-amber-50 dark:bg-amber-950/30' },
                ].map(s => (
                  <div key={s.label} className={cn('rounded-xl p-4 text-center hover:shadow-md transition-all duration-200', s.bg)}>
                    <s.icon className={cn('w-6 h-6 mx-auto mb-2', s.color)} />
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button 
                  variant="outline" 
                  onClick={() => { setViewOpen(false); handleEdit(viewingTeam); }}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />Edit Team
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => { setViewOpen(false); handleDelete(viewingTeam.id); }}
                  className="rounded-xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" />Delete Team
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Team
            </DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input 
                  value={editingTeam.name} 
                  onChange={e => setEditingTeam({...editingTeam, name: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Input 
                  value={editingTeam.description || ''} 
                  onChange={e => setEditingTeam({...editingTeam, description: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

