'use client';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, getInitials } from '@/lib/utils';

interface Comment { id: string; content: string; author: { name: string; avatar?: string }; createdAt: string; }

export function CommentList({ comments }: { comments: Comment[] }) {
  if (!comments.length) return <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>;
  return (
    <div className="space-y-3">
      {comments.map(c => (
        <div key={c.id} className="flex gap-3">
          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(c.author.name)}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1"><span className="font-medium text-sm">{c.author.name}</span><span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span></div>
              <p className="text-sm text-gray-700">{c.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}