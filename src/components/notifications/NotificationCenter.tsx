'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Check, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification { id: string; title: string; message: string; type: 'info'|'success'|'warning'|'error'; read: boolean; time: string; }
const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: X };

export function NotificationCenter() {
  const [notifs, setNotifs] = useState<Notification[]>([
    { id:'1', title:'Task Assigned', message:'You have been assigned to "Design Homepage"', type:'info', read:false, time:'5m ago' },
    { id:'2', title:'Comment Added', message:'Jane commented on "API"', type:'info', read:false, time:'15m ago' },
    { id:'3', title:'Deadline Soon', message:'"Testing" due in 2 days', type:'warning', read:true, time:'1h ago' },
  ]);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter(n=>!n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unread>0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">{unread}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unread>0 && <Button variant="ghost" size="sm" className="text-xs" onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))}>Mark all read</Button>}
        </div>
        <ScrollArea className="h-80">
          {notifs.map(n=>{
            const Icon = icons[n.type];
            return (
              <div key={n.id} className={cn('p-4 border-b hover:bg-gray-50 cursor-pointer',!n.read&&'bg-blue-50/50')} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
                <div className="flex items-start gap-3">
                  <Icon className={cn('w-4 h-4 mt-0.5',n.type==='info'?'text-blue-500':n.type==='success'?'text-green-500':n.type==='warning'?'text-amber-500':'text-red-500')} />
                  <div className="flex-1"><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-gray-500 mt-1">{n.message}</p><p className="text-xs text-gray-400 mt-2">{n.time}</p></div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
