'use client';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { GitCommit, MessageSquare, Paperclip, UserPlus, Flag, CheckCircle, Edit, Trash2 } from 'lucide-react';

interface Activity { id: string; action: string; user: { name: string }; entityName?: string; createdAt: string; }
const icons: Record<string, any> = { task_created: GitCommit, task_updated: Edit, task_deleted: Trash2, comment_added: MessageSquare, attachment_added: Paperclip, member_added: UserPlus, priority_changed: Flag, status_changed: CheckCircle };
const colors: Record<string, string> = { task_created: 'bg-blue-100 text-blue-600', task_updated: 'bg-yellow-100 text-yellow-600', task_deleted: 'bg-red-100 text-red-600', comment_added: 'bg-green-100 text-green-600', attachment_added: 'bg-purple-100 text-purple-600', member_added: 'bg-indigo-100 text-indigo-600' };
const actions: Record<string, string> = { task_created: 'created', task_updated: 'updated', task_deleted: 'deleted', comment_added: 'commented on', member_added: 'joined' };

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) return <div className="text-center py-8 text-gray-400">No recent activity</div>;
  return (
    <div className="space-y-4">
      {activities.map((a, i) => {
        const Icon = icons[a.action] || GitCommit;
        return (
          <div key={a.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', colors[a.action] || 'bg-gray-100 text-gray-600')}><Icon className="w-4 h-4" /></div>
              {i < activities.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(a.user.name)}</AvatarFallback></Avatar>
                <span className="font-medium text-sm">{a.user.name}</span>
                <span className="text-sm text-gray-600">{actions[a.action] || a.action}</span>
                {a.entityName && <span className="text-sm font-medium text-blue-600">{a.entityName}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatDate(a.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}