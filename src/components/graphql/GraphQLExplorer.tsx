'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, BookOpen, Code2 } from 'lucide-react';

const schemaDocs = {
  types: [
    { name: 'Task', fields: ['id', 'title', 'description', 'status', 'priority', 'project', 'assignee', 'comments', 'attachments', 'dueDate'] },
    { name: 'Project', fields: ['id', 'name', 'description', 'status', 'team', 'tasks', 'taskCount'] },
    { name: 'User', fields: ['id', 'name', 'email', 'avatarUrl', 'role', 'tasks', 'teams'] },
    { name: 'Team', fields: ['id', 'name', 'description', 'members', 'projects'] },
    { name: 'Comment', fields: ['id', 'content', 'author', 'taskId', 'createdAt'] },
    { name: 'Attachment', fields: ['id', 'fileName', 'fileUrl', 'fileSize', 'fileType', 'uploader'] },
  ],
  queries: [
    { name: 'tasks', args: 'projectId, status, priority, search, limit', returns: '[Task]' },
    { name: 'task', args: 'id', returns: 'Task' },
    { name: 'projects', args: 'teamId, status, limit', returns: '[Project]' },
    { name: 'project', args: 'id', returns: 'Project' },
    { name: 'teams', args: '', returns: '[Team]' },
    { name: 'users', args: 'search, limit', returns: '[User]' },
    { name: 'comments', args: 'taskId', returns: '[Comment]' },
    { name: 'search', args: 'query, limit', returns: '[SearchResult]' },
    { name: 'dashboardStats', args: '', returns: 'JSON' },
    { name: 'me', args: '', returns: 'User' },
  ],
  mutations: [
    { name: 'createTask', args: 'input: TaskCreateInput!', returns: 'Task' },
    { name: 'updateTask', args: 'id: String!, input: TaskUpdateInput!', returns: 'Task' },
    { name: 'deleteTask', args: 'id: String!', returns: 'Boolean' },
    { name: 'createProject', args: 'input: ProjectCreateInput!', returns: 'Project' },
    { name: 'updateProject', args: 'id: String!, input: ProjectCreateInput!', returns: 'Project' },
    { name: 'addComment', args: 'input: CommentCreateInput!', returns: 'Comment' },
  ],
};

export function GraphQLExplorer() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Schema Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Types */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Types</h3>
            <div className="space-y-1">
              {schemaDocs.types.map(t => (
                <button key={t.name}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left"
                  onClick={() => setSelectedType(selectedType === t.name ? null : t.name)}>
                  <span className="font-medium text-sm">{t.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Queries */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-500" />Queries
            </h3>
            <div className="space-y-1">
              {schemaDocs.queries.map(q => (
                <div key={q.name} className="p-2 rounded-lg hover:bg-gray-50">
                  <p className="font-medium text-sm text-blue-600">{q.name}</p>
                  <p className="text-xs text-gray-400">{q.args || 'No args'} → {q.returns}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mutations */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-500" />Mutations
            </h3>
            <div className="space-y-1">
              {schemaDocs.mutations.map(m => (
                <div key={m.name} className="p-2 rounded-lg hover:bg-gray-50">
                  <p className="font-medium text-sm text-orange-600">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.args} → {m.returns}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}