'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, CheckSquare, Activity, Target, Zap } from 'lucide-react';

interface StatCardProps { title: string; value: string|number; change: string; trend: 'up'|'down'; icon: any; color: string; bg: string; }
function StatCard({ title, value, change, trend, icon: Icon, color, bg }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={cn('p-2.5 rounded-xl', bg)}><Icon className={cn('w-5 h-5', color)} /></div>
          <div className={cn('flex items-center gap-1 text-xs font-medium', trend==='up'?'text-green-600':'text-red-600')}>{trend==='up'?<ArrowUp className="w-3 h-3"/>:<ArrowDown className="w-3 h-3"/>}{change}</div>
        </div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Tasks" value={156} change="+12.5%" trend="up" icon={CheckSquare} color="text-blue-600" bg="bg-blue-50" />
      <StatCard title="In Progress" value={34} change="+8.2%" trend="up" icon={Activity} color="text-amber-600" bg="bg-amber-50" />
      <StatCard title="Completed" value={89} change="+23.1%" trend="up" icon={Target} color="text-green-600" bg="bg-green-50" />
      <StatCard title="Velocity" value="34 pts" change="+5.3%" trend="up" icon={Zap} color="text-purple-600" bg="bg-purple-50" />
    </div>
  );
}