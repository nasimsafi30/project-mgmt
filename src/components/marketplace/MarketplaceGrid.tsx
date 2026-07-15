'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Download, Heart, Shield, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const plugins = [
  { id: '1', name: 'GitHub Sync', desc: 'Two-way sync with GitHub', author: 'Official', version: '2.1.0', category: 'integration', price: 0, rating: 4.8, downloads: 12000, verified: true, icon: '🐙' },
  { id: '2', name: 'Slack Notifications', desc: 'Real-time Slack updates', author: 'Official', version: '1.5.2', category: 'integration', price: 0, rating: 4.6, downloads: 8500, verified: true, icon: '💬' },
  { id: '3', name: 'Gantt Pro', desc: 'Advanced Gantt charts', author: 'ThirdParty', version: '3.0.1', category: 'visualization', price: 49, rating: 4.9, downloads: 5200, verified: true, icon: '📊' },
  { id: '4', name: 'AI Assistant', desc: 'AI-powered task management', author: 'AI Labs', version: '1.2.0', category: 'automation', price: 99, rating: 4.7, downloads: 3200, verified: false, icon: '🤖' },
  { id: '5', name: 'Dark Theme', desc: 'Beautiful dark theme', author: 'DesignHub', version: '1.0.0', category: 'theme', price: 0, rating: 4.4, downloads: 15000, verified: true, icon: '🌙' },
];

export function MarketplaceGrid() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [installed, setInstalled] = useState<Set<string>>(new Set(['1','2']));

  const filtered = plugins.filter(p => 
    (category==='all'||p.category===category) && 
    (!search||p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const install = (id: string) => {
    setInstalled(p => { const n = new Set(p); n.add(id); return n; });
    toast.success('Installed!');
  };
  const uninstall = (id: string) => {
    setInstalled(p => { const n = new Set(p); n.delete(id); return n; });
    toast.success('Uninstalled');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Marketplace</h2>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search plugins..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 w-64" /></div>
      </div>
      <div className="flex gap-2">
        {['all','integration','automation','visualization','theme'].map(c => (
          <Button key={c} variant={category===c?'default':'outline'} size="sm" onClick={()=>setCategory(c)} className="capitalize">{c}</Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-1"><CardTitle className="text-base">{p.name}</CardTitle>{p.verified&&<Badge className="bg-blue-100 text-blue-700 text-[10px]"><Shield className="w-3 h-3 mr-0.5"/>Verified</Badge>}</div>
                    <p className="text-xs text-gray-400">{p.author} • v{p.version}</p>
                  </div>
                </div>
                <Badge className={p.price===0?'bg-green-100 text-green-700':'bg-purple-100 text-purple-700'}>{p.price===0?'Free':'$'+p.price}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.desc}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400"/>{p.rating}</span>
                <span><Download className="w-4 h-4 inline mr-1"/>{p.downloads.toLocaleString()}</span>
              </div>
              {installed.has(p.id) ? (
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline" size="sm"><Check className="w-4 h-4 mr-2"/>Installed</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={()=>uninstall(p.id)}><X className="w-4 h-4"/></Button>
                </div>
              ) : (
                <Button className="w-full" size="sm" onClick={()=>install(p.id)}><Download className="w-4 h-4 mr-2"/>{p.price===0?'Install':'Buy'}</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}