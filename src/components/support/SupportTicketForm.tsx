'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

export function SupportTicketForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [data, setData] = useState({ subject:'', description:'', priority:'medium', category:'general' });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(data); setData({ subject:'', description:'', priority:'medium', category:'general' }); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Subject</Label><Input required value={data.subject} onChange={e=>setData({...data,subject:e.target.value})} placeholder="Brief description" /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea required value={data.description} onChange={e=>setData({...data,description:e.target.value})} rows={4} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Priority</Label><Select value={data.priority} onValueChange={v=>setData({...data,priority:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label>Category</Label><Select value={data.category} onValueChange={v=>setData({...data,category:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="billing">Billing</SelectItem><SelectItem value="technical">Technical</SelectItem><SelectItem value="feature">Feature Request</SelectItem></SelectContent></Select></div>
      </div>
      <Button type="submit" className="w-full"><Send className="w-4 h-4 mr-2"/>Submit Ticket</Button>
    </form>
  );
}