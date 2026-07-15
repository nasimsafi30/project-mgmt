'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function TaskCreateForm({ onSubmit, defaultStatus='backlog' }: { onSubmit: (t:any)=>void; defaultStatus?: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState(defaultStatus);

  const handle = () => {
    if(!title.trim()){toast.error('Title required');return;}
    onSubmit({title,description:desc,priority,status});setTitle('');setDesc('');setOpen(false);toast.success('Task created');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4"/>New Task</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title"/></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Priority</Label><Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="backlog">Backlog</SelectItem><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="in_review">In Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent></Select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t"><Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={handle}>Create Task</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}