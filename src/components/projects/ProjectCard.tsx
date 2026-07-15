'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps { project: any; onClick?: () => void; }

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{backgroundColor:project.color||'#3B82F6'}}>{(project.name||'P')[0]}</div>
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description||'No description'}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/>{project.memberCount||0}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{project.createdAt?formatDate(project.createdAt):'N/A'}</span>
          </div>
          {project.stats && (
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>{project.stats.completionRate||0}%</span></div>
              <Progress value={project.stats.completionRate||0} className="h-1.5" />
            </div>
          )}
          <Badge variant="outline">{project.status||'active'}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}