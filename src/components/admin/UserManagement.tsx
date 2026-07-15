'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreHorizontal, Shield, User, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', tasks: 45 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', status: 'active', tasks: 32 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'member', status: 'inactive', tasks: 0 },
];

const roleIcons: Record<string, any> = { admin: Shield, owner: Crown, member: User };

export function UserManagement() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" /></div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Tasks</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(u => {
              const Icon = roleIcons[u.role] || User;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback>{u.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                      <div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="gap-1"><Icon className="w-3 h-3" />{u.role}</Badge></TableCell>
                  <TableCell><Badge className={u.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}>{u.status}</Badge></TableCell>
                  <TableCell>{u.tasks}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}