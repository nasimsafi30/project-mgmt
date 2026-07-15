'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ListTodo } from 'lucide-react';
import { useKanbanStore } from '@/store';

export function RecentTasks() {
  const { tasks } = useKanbanStore();
  const recent = tasks.slice(0, 5);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Recent Tasks</CardTitle><Button variant="outline" size="sm">All <ChevronRight className="w-4 h-4 ml-1" /></Button></CardHeader>
      <CardContent>
        {!recent.length ? <div className="text-center py-8 text-gray-400"><ListTodo className="w-12 h-12 mx-auto mb-3" /><p>No tasks</p></div> :
          <div className="space-y-3">{recent.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
              <div className={cn('w-2 h-2 rounded-full', t.priority==='urgent'?'bg-red-500':t.priority==='high'?'bg-orange-500':'bg-blue-500')} />
              <div className="flex-1"><p className="font-medium text-sm">{t.title}</p><p className="text-xs text-gray-400">{t.status?.replace('_',' ')}</p></div>
              <Badge variant="outline" className="text-xs">{t.priority}</Badge>
            </div>
          ))}</div>}
      </CardContent>
    </Card>
  );
}