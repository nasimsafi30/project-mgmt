'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Puzzle, Plus, Settings, Trash2, Check, X, Download, RefreshCw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function PluginManagerUI() {
  const [plugins, setPlugins] = useState([
    { id: '1', name: 'GitHub Sync', version: '2.1.0', description: 'Sync with GitHub', author: 'ProjectHub', enabled: true, icon: '🐙' },
    { id: '2', name: 'Slack', version: '1.5.2', description: 'Slack notifications', author: 'ProjectHub', enabled: true, icon: '💬' },
    { id: '3', name: 'Dark Theme', version: '1.0.0', description: 'Dark theme', author: 'DesignHub', enabled: false, icon: '🌙' },
  ]);

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    toast.success('Plugin updated');
  };

  const uninstallPlugin = (id: string) => {
    setPlugins(prev => prev.filter(p => p.id !== id));
    toast.success('Uninstalled');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Plugin Manager</h1><p className="text-sm text-gray-500">Manage installed plugins</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Install</Button>
          <Button size="sm"><span className="mr-2">🛒</span>Marketplace</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map(plugin => (
          <Card key={plugin.id} className={cn('hover:shadow-lg transition-all', plugin.enabled && 'border-green-200 bg-green-50/30')}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{plugin.icon}</span>
                  <div>
                    <div className="flex items-center gap-2"><CardTitle className="text-lg">{plugin.name}</CardTitle><Badge variant="outline" className="text-xs">v{plugin.version}</Badge></div>
                    <CardDescription>{plugin.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={plugin.enabled} onCheckedChange={() => togglePlugin(plugin.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">By {plugin.author}</span>
                <Badge className={plugin.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>{plugin.enabled ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}{plugin.enabled ? 'Active' : 'Disabled'}</Badge>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1"><Settings className="w-4 h-4 mr-2" />Settings</Button>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => uninstallPlugin(plugin.id)}><Trash2 className="w-4 h-4 mr-2" />Uninstall</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
