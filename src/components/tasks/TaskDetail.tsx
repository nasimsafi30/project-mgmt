'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommentSection } from '@/components/comments/CommentSection';
import { Calendar, Flag, Edit, Trash2, Check, X } from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export function TaskDetail({ task, open, onOpenChange, onDelete, onUpdate }: { task: any; open: boolean; onOpenChange: (o:boolean)=>void; onDelete?: (id:string)=>void; onUpdate?: (id:string, u:any)=>void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task?.title||'');
  if (!task) return null;

  const pc: Record<string,string> = { urgent:'bg-red-100 text-red-700', high:'bg-orange-100 text-orange-700', medium:'bg-blue-100 text-blue-700', low:'bg-green-100 text-green-700' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editing ? <div className="flex gap-2"><input value={title} onChange={e=>setTitle(e.target.value)} className="text-xl font-bold border-b-2 border-blue-500 outline-none flex-1" autoFocus /><Button size="icon" variant="ghost" onClick={()=>{onUpdate?.(task.id,{title});setEditing(false);toast.success('Updated');}}><Check className="w-4 h-4 text-green-500"/></Button><Button size="icon" variant="ghost" onClick={()=>setEditing(false)}><X className="w-4 h-4 text-red-500"/></Button></div>
                : <DialogTitle className="text-2xl">{task.title}</DialogTitle>}
              <div className="flex gap-2 mt-2"><Badge className={pc[task.priority]}><Flag className="w-3 h-3 mr-1"/>{task.priority}</Badge><Badge variant="outline">{task.status?.replace('_',' ')}</Badge></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={()=>setEditing(!editing)}><Edit className="w-4 h-4"/></Button>
              {onDelete && <Button variant="ghost" size="icon" className="text-red-500" onClick={()=>{onDelete(task.id);onOpenChange(false);}}><Trash2 className="w-4 h-4"/></Button>}
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="details" className="mt-4">
          <TabsList><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="comments">Comments</TabsTrigger></TabsList>
          <TabsContent value="details" className="space-y-4 mt-4">
            <div><Label>Description</Label><p className="text-sm text-gray-600 mt-1">{task.description||'No description'}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Status</Label><Select value={task.status} onValueChange={v=>onUpdate?.(task.id,{status:v})}><SelectTrigger className="mt-1"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="backlog">Backlog</SelectItem><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="in_review">In Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent></Select></div>
              <div><Label>Assignee</Label><div className="flex items-center gap-2 mt-1"><Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{task.assigneeId?getInitials('User'):'?'}</AvatarFallback></Avatar><span className="text-sm">{task.assigneeId?'Assigned':'Unassigned'}</span></div></div>
              <div><Label>Due Date</Label><p className="text-sm mt-1">{task.dueDate?formatDate(task.dueDate):'No due date'}</p></div>
            </div>
          </TabsContent>
          <TabsContent value="comments" className="mt-4"><CommentSection taskId={task.id}/></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}