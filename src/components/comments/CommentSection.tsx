'use client';
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';

interface Comment { id: string; content: string; author: { name: string }; createdAt: string; likes: number; }

export function CommentSection({ taskId, comments: initial = [] }: { taskId: string; comments?: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setComments([{ id: crypto.randomUUID(), content: newComment, author: { name: 'You' }, createdAt: new Date().toISOString(), likes: 0 }, ...comments]);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5" />Comments ({comments.length})</h3>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">ME</AvatarFallback></Avatar>
        <div className="flex-1 space-y-2">
          <Textarea placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="min-h-[60px]" onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); handleSubmit(); } }} />
          <div className="flex justify-end"><Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}><Send className="w-4 h-4 mr-2" />Comment</Button></div>
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(c.author.name)}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1"><span className="font-medium text-sm">{c.author.name}</span><span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span></div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
              <button className="text-xs text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{c.likes||''}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}