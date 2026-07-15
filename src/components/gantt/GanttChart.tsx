'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, eachDayOfInterval, differenceInDays, addWeeks, subWeeks } from 'date-fns';

interface GanttTask { id: string; title: string; startDate: Date; endDate: Date; progress: number; color: string; }
const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];

export function GanttChart({ tasks }: { tasks: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState<'week'|'month'>('week');
  const start = startOfWeek(currentDate);
  const end = zoom==='week' ? addWeeks(start, 4) : addWeeks(start, 12);
  const days = eachDayOfInterval({ start, end });
  const totalDays = days.length;

  const ganttTasks: GanttTask[] = tasks.filter(t=>t.dueDate).map((t,i)=>({
    id: t.id, title: t.title,
    startDate: new Date(t.createdAt||Date.now()),
    endDate: new Date(t.dueDate||Date.now()),
    progress: t.status==='done'?100:t.status==='in_progress'?50:20,
    color: colors[i%colors.length],
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gantt Chart</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={()=>setCurrentDate(subWeeks(currentDate,zoom==='week'?4:12))}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={()=>setCurrentDate(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={()=>setCurrentDate(addWeeks(currentDate,zoom==='week'?4:12))}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={()=>setZoom(zoom==='week'?'month':'week')}>{zoom==='week'?<ZoomIn className="w-4 h-4"/>:<ZoomOut className="w-4 h-4"/>}</Button>
        </div>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto"><div className="min-w-[800px]">
            <div className="flex border-b bg-gray-50">
              <div className="w-48 min-w-[192px] border-r p-3 font-semibold text-sm">Task</div>
              <div className="flex-1 flex">{days.map((d,i)=><div key={i} className="flex-1 text-center text-[10px] p-2 border-r">{format(d,'d')}<br/>{format(d,'EEE')}</div>)}</div>
            </div>
            {ganttTasks.map(t=>{
              const left = Math.max(0, differenceInDays(t.startDate, start));
              const width = Math.max(1, differenceInDays(t.endDate, t.startDate)+1);
              return (
                <div key={t.id} className="flex border-b hover:bg-gray-50">
                  <div className="w-48 min-w-[192px] border-r p-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor:t.color}}/>
                    <span className="text-sm truncate">{t.title}</span>
                  </div>
                  <div className="flex-1 relative py-2">
                    <div className="absolute top-2 h-6 rounded-lg opacity-80 hover:opacity-100 transition-all cursor-pointer" style={{left:`${(left/totalDays)*100}%`,width:`${(width/totalDays)*100}%`,backgroundColor:t.color}}>
                      <div className="h-full rounded-lg" style={{width:`${t.progress}%`,backgroundColor:t.color,filter:'brightness(0.7)'}}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div></div>
        </CardContent>
      </Card>
    </div>
  );
}