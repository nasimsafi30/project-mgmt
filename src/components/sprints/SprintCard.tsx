'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, Timer, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

interface Sprint { id: string; name: string; goal: string; startDate: Date; endDate: Date; status: string; totalPoints: number; completedPoints: number; }

export function SprintCard({ sprint, onStart, onComplete }: { sprint: Sprint; onStart?: (id:string)=>void; onComplete?: (id:string)=>void }) {
  const progress = sprint.totalPoints>0 ? Math.round((sprint.completedPoints/sprint.totalPoints)*100) : 0;
  const daysLeft = differenceInDays(sprint.endDate, new Date());
  const statusColors: Record<string,string> = { planning:'bg-blue-100 text-blue-700', active:'bg-green-100 text-green-700', completed:'bg-gray-100 text-gray-700' };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2"><CardTitle className="text-lg">{sprint.name}</CardTitle><Badge className={statusColors[sprint.status]}>{sprint.status}</Badge></div>
            <p className="text-sm text-gray-500 mt-1">{sprint.goal}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{progress}%</span></div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Points:</span> <span className="font-medium">{sprint.completedPoints}/{sprint.totalPoints}</span></div>
          <div><span className="text-gray-500">Days left:</span> <span className={cn('font-medium', daysLeft<0?'text-red-600':'text-green-600')}>{Math.abs(daysLeft)}</span></div>
        </div>
        <div className="text-xs text-gray-400">{format(sprint.startDate,'MMM d')} - {format(sprint.endDate,'MMM d')}</div>
        <div className="flex gap-2 pt-2 border-t">
          {sprint.status==='planning' && onStart && <Button size="sm" className="flex-1" onClick={()=>onStart(sprint.id)}><Play className="w-4 h-4 mr-2"/>Start</Button>}
          {sprint.status==='active' && onComplete && <Button size="sm" className="flex-1" onClick={()=>onComplete(sprint.id)}><CheckCircle2 className="w-4 h-4 mr-2"/>Complete</Button>}
        </div>
      </CardContent>
    </Card>
  );
}