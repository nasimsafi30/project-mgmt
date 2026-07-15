'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Cpu, HardDrive, Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const services = [
  { name: 'API Server', status: 'healthy', uptime: 99.99, latency: 45 },
  { name: 'Database', status: 'healthy', uptime: 99.95, latency: 12 },
  { name: 'Redis Cache', status: 'healthy', uptime: 99.98, latency: 3 },
  { name: 'File Storage', status: 'degraded', uptime: 99.50, latency: 89 },
  { name: 'Email Service', status: 'healthy', uptime: 99.97, latency: 120 },
];

const statusIcons = { healthy: CheckCircle2, degraded: AlertTriangle, down: XCircle };
const statusColors = { healthy: 'text-green-500', degraded: 'text-yellow-500', down: 'text-red-500' };

export function SystemHealth() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: '45%', icon: Cpu, color: 'text-blue-600' },
          { label: 'Memory', value: '62%', icon: HardDrive, color: 'text-purple-600' },
          { label: 'Requests/min', value: '1,234', icon: Activity, color: 'text-green-600' },
          { label: 'Uptime', value: '99.9%', icon: Server, color: 'text-orange-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
                <s.icon className={cn('w-8 h-8', s.color)} />
              </div>
              <Progress value={parseInt(s.value)} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Services Status</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map(s => {
              const Icon = statusIcons[s.status as keyof typeof statusIcons];
              return (
                <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-5 h-5', statusColors[s.status as keyof typeof statusColors])} />
                    <div><p className="font-medium">{s.name}</p><p className="text-xs text-gray-400">{s.uptime}% uptime â€¢ {s.latency}ms</p></div>
                  </div>
                  <Badge className={s.status === 'healthy' ? 'bg-green-100 text-green-700' : s.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>{s.status}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


