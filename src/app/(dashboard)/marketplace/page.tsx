'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Download, Shield, Check, X, Plus, Search, Edit, Trash2, Sparkles, TrendingUp, Zap, ArrowUpRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const defaultPlugins = [
  { id: '1', name: 'GitHub Sync', desc: 'Two-way sync with GitHub repositories and issues', author: 'ProjectHub', version: '2.1.0', category: 'integration', price: 0, rating: 4.8, downloads: 12000, verified: true, icon: '🐙' },
  { id: '2', name: 'Slack', desc: 'Real-time Slack notifications and updates', author: 'ProjectHub', version: '1.5.2', category: 'integration', price: 0, rating: 4.6, downloads: 8500, verified: true, icon: '💬' },
  { id: '3', name: 'Gantt Pro', desc: 'Advanced Gantt charts with dependencies', author: 'ThirdParty', version: '3.0.1', category: 'visualization', price: 49, rating: 4.9, downloads: 5200, verified: true, icon: '📊' },
  { id: '4', name: 'AI Assistant', desc: 'AI-powered task breakdown and estimation', author: 'AI Labs', version: '1.2.0', category: 'automation', price: 99, rating: 4.7, downloads: 3200, verified: false, icon: '🤖' },
  { id: '5', name: 'Dark Theme', desc: 'Beautiful customizable dark theme', author: 'DesignHub', version: '1.0.0', category: 'theme', price: 0, rating: 4.4, downloads: 15000, verified: true, icon: '🌙' },
  { id: '6', name: 'Time Reports', desc: 'Advanced time tracking and reports', author: 'DataViz', version: '2.3.0', category: 'reporting', price: 29, rating: 4.5, downloads: 6800, verified: true, icon: '⏱️' },
  { id: '7', name: 'Figma', desc: 'Import designs directly from Figma', author: 'DesignTools', version: '1.8.0', category: 'integration', price: 19, rating: 4.3, downloads: 4100, verified: true, icon: '🎨' },
  { id: '8', name: 'Bulk Editor', desc: 'Edit multiple tasks simultaneously', author: 'Community', version: '1.0.0', category: 'utility', price: 0, rating: 4.3, downloads: 2100, verified: false, icon: '✏️' },
  { id: '9', name: 'Jira Migration', desc: 'Seamless migration from Jira', author: 'MigrationPro', version: '2.0.0', category: 'utility', price: 79, rating: 4.6, downloads: 3400, verified: true, icon: '🔄' },
];

const categories = ['all', 'integration', 'automation', 'visualization', 'reporting', 'theme', 'utility'];

export default function MarketplacePage() {
  const [plugins, setPlugins] = useState(defaultPlugins);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [installed, setInstalled] = useState<Set<string>>(new Set(['1', '2', '5']));
  const [showSubmit, setShowSubmit] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', desc: '', category: 'integration', price: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('marketplacePlugins');
      if (saved) setPlugins(JSON.parse(saved));
      const savedInstalled = localStorage.getItem('installedPlugins');
      if (savedInstalled) setInstalled(new Set(JSON.parse(savedInstalled)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) localStorage.setItem('marketplacePlugins', JSON.stringify(plugins)); }, [plugins, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem('installedPlugins', JSON.stringify([...installed])); }, [installed, loaded]);

  const filtered = plugins.filter(p => 
    (category === 'all' || p.category === category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleInstall = (id: string) => {
    setInstalled(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success('Uninstalled'); }
      else { next.add(id); toast.success('Installed!'); }
      return next;
    });
  };

  // CREATE
  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    setSubmitting(true);
    setTimeout(() => {
      setPlugins(prev => [{
        id: String(Date.now()), name: form.name, desc: form.desc || 'No description',
        author: 'You', version: '1.0.0', category: form.category, price: form.price,
        rating: 0, downloads: 1, verified: false, icon: '🔌',
      }, ...prev]);
      toast.success('Plugin submitted!');
      setForm({ name: '', desc: '', category: 'integration', price: 0 });
      setShowSubmit(false); setSubmitting(false);
    }, 500);
  };

  // OPEN EDIT
  const openEdit = (plugin: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlugin({ ...plugin });
    setShowEdit(true);
  };

  // UPDATE
  const handleUpdate = () => {
    if (!editingPlugin) return;
    setPlugins(prev => prev.map(p => p.id === editingPlugin.id ? editingPlugin : p));
    toast.success('Plugin updated!');
    setShowEdit(false); setEditingPlugin(null);
  };

  // DELETE
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this plugin?')) return;
    setPlugins(prev => prev.filter(p => p.id !== id));
    setInstalled(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast.success('Plugin deleted!');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'integration': return 'from-blue-500 to-cyan-500';
      case 'automation': return 'from-purple-500 to-pink-500';
      case 'visualization': return 'from-orange-500 to-red-500';
      case 'reporting': return 'from-green-500 to-emerald-500';
      case 'theme': return 'from-violet-500 to-purple-500';
      case 'utility': return 'from-gray-500 to-slate-500';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Marketplace</h1>
              <p className="text-purple-100 mt-1">Discover and install powerful plugins</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <TrendingUp className="w-4 h-4 text-purple-200" />
              <span className="text-white font-medium">{plugins.length} Plugins</span>
            </div>
            <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-purple-600 hover:bg-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  <Sparkles className="w-4 h-4" />Submit Plugin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Submit New Plugin
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name *</Label>
                    <Input 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Enter plugin name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea 
                      rows={3} 
                      value={form.desc} 
                      onChange={e => setForm({...form, desc: e.target.value})}
                      placeholder="Describe your plugin..."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c=>c!=='all').map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Price ($)</Label>
                      <Input 
                        type="number" 
                        value={form.price} 
                        onChange={e => setForm({...form, price: parseInt(e.target.value)||0})}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={() => setShowSubmit(false)} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                      {submitting ? 'Submitting...' : 'Submit Plugin'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search plugins..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <Button 
              key={c} 
              variant={category===c ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCategory(c)} 
              className={cn(
                'capitalize rounded-xl transition-all duration-200',
                category === c 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'dark:border-gray-700 dark:text-gray-300 hover:border-violet-200 dark:hover:border-violet-900/30'
              )}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, index) => (
          <Card 
            key={p.id} 
            className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-800"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent top */}
            <div className={cn(
              'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
              getCategoryColor(p.category)
            )} />
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {p.name}
                      </CardTitle>
                      {p.verified && (
                        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-0 text-[10px]">
                          <Shield className="w-3 h-3 mr-0.5"/>Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{p.author} • v{p.version}</p>
                  </div>
                </div>
                <Badge className={cn(
                  'border-0 font-semibold',
                  p.price === 0 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                    : 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                )}>
                  {p.price === 0 ? 'Free' : `$${p.price}`}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {p.desc}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{p.downloads.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                {installed.has(p.id) ? (
                  <Button 
                    className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50 border-0 rounded-xl transition-all duration-200"
                    size="sm"
                  >
                    <Check className="w-4 h-4 mr-2" />Installed
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200"
                    size="sm" 
                    onClick={() => toggleInstall(p.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {p.price === 0 ? 'Install' : 'Buy Now'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" 
                  onClick={(e) => openEdit(p, e)}
                >
                  <Edit className="w-3.5 h-3.5 text-blue-500" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" 
                  onClick={(e) => handleDelete(p.id, e)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
              <Search className="w-3 h-3 text-white" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">No plugins found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Edit Plugin
            </DialogTitle>
          </DialogHeader>
          {editingPlugin && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input 
                  value={editingPlugin.name} 
                  onChange={e => setEditingPlugin({...editingPlugin, name: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea 
                  rows={3} 
                  value={editingPlugin.desc} 
                  onChange={e => setEditingPlugin({...editingPlugin, desc: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={editingPlugin.category} onValueChange={v => setEditingPlugin({...editingPlugin, category: v})}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c=>c!=='all').map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price ($)</Label>
                  <Input 
                    type="number" 
                    value={editingPlugin.price} 
                    onChange={e => setEditingPlugin({...editingPlugin, price: parseInt(e.target.value)||0})}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={()=>setShowEdit(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

