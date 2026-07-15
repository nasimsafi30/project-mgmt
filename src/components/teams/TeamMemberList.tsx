'use client';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Crown, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member { id: string; name: string; email: string; role: string; online?: boolean; }

const icons: Record<string,any> = { owner: Crown, admin: Shield, member: User };
const colors: Record<string,string> = { owner:'text-amber-500', admin:'text-blue-500', member:'text-gray-400' };

export function TeamMemberList({ members }: { members: Member[] }) {
  return (
    <div className="space-y-2">
      {members.map(m => {
        const Icon = icons[m.role] || User;
        return (
          <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9"><AvatarFallback>{m.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"/>}
              </div>
              <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1"><Icon className={cn('w-3 h-3',colors[m.role])}/>{m.role}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4"/></Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}