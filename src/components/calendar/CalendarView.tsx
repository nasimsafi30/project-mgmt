'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useKanbanStore } from '@/store';

export function CalendarView() {
  const { tasks } = useKanbanStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedTasks = selectedDate ? tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)) : [];
  const priorityColors: Record<string, string> = { urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-blue-500', low: 'bg-green-500' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate,1))}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate,1))}><ChevronRight className="w-4 h-4" /></Button>
          <Button size="sm" className="gap-1"><Plus className="w-4 h-4" />Event</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <div key={i} onClick={() => setSelectedDate(day)}
                    className={cn('min-h-[80px] p-2 rounded-lg border cursor-pointer hover:shadow-md transition-all text-xs',
                      isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50/50',
                      isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100',
                      isToday(day) && 'ring-2 ring-blue-200')}>
                    <span className={cn('font-medium w-6 h-6 flex items-center justify-center rounded-full', isToday(day) && 'bg-blue-500 text-white')}>{format(day, 'd')}</span>
                    <div className="space-y-0.5 mt-1">
                      {dayTasks.slice(0,2).map(t => <div key={t.id} className={cn('px-1 py-0.5 rounded truncate text-white text-[10px]', priorityColors[t.priority] || 'bg-gray-400')}>{t.title}</div>)}
                      {dayTasks.length > 2 && <p className="text-[10px] text-gray-400">+{dayTasks.length-2}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Tasks'}</CardTitle></CardHeader>
          <CardContent>
            {selectedTasks.length === 0 ? <p className="text-sm text-gray-400 text-center py-6">No tasks</p> :
              selectedTasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <div className={cn('w-2 h-2 rounded-full', priorityColors[t.priority])} />
                  <div className="flex-1"><p className="text-sm font-medium truncate">{t.title}</p></div>
                  <Badge className="text-[10px]">{t.priority}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}