'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';

interface KanbanCardProps {
  task: any;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn('cursor-grab active:cursor-grabbing', isDragging && 'opacity-50')}>
      <Card className="p-4 hover:shadow-md transition-shadow duration-200 task-card">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <Badge className={cn('text-xs', priorityColors[task.priority] || '')}>{task.priority}</Badge>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{task.assigneeId ? getInitials('User') : '?'}</AvatarFallback>
          </Avatar>

          <div className="flex items-center space-x-3 text-gray-400">
            {task.dueDate && (
              <div className="flex items-center text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
