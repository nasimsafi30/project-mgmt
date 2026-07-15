'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, MessageSquare, Figma, Cloud, Zap, Check, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const integrations = [
  { id: 'github', name: 'GitHub', desc: 'Sync issues and PRs', icon: Github, category: 'dev', connected: true, popular: true },
  { id: 'slack', name: 'Slack', desc: 'Send notifications', icon: MessageSquare, category: 'comm', connected: false, popular: true },
  { id: 'figma', name: 'Figma', desc: 'Embed designs', icon: Figma, category: 'design', connected: false, popular: true },
  { id: 'gdrive', name: 'Google Drive', desc: 'Attach files', icon: Cloud, category: 'storage', connected: true, popular: false },
];

export function IntegrationsHub() {
  const [conns, setConns] = useState<Set<string>>(new Set(['github','gdrive']));
  const toggle = (id: string) => {
    setConns(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    toast.success(conns.has(id) ? 'Disconnected' : 'Connected');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Integrations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(i => {
          const connected = conns.has(i.id);
          return (
            <Card key={i.id} className={cn('hover:shadow-lg transition-all', connected && 'border-green-200 bg-green-50/30')}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', connected?'bg-green-100':'bg-gray-100')}><i.icon className="w-6 h-6" /></div>
                    <div>
                      <div className="flex items-center gap-2"><CardTitle className="text-lg">{i.name}</CardTitle>{i.popular&&<Badge className="bg-yellow-100 text-yellow-700 text-xs"><Zap className="w-3 h-3 mr-1"/>Popular</Badge>}</div>
                      <CardDescription>{i.desc}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={connected?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}>
                    {connected ? <><Check className="w-3 h-3 mr-1"/>Connected</> : <><X className="w-3 h-3 mr-1"/>Disconnected</>}
                  </Badge>
                  <Button variant={connected?'destructive':'default'} size="sm" onClick={()=>toggle(i.id)}>
                    {connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}