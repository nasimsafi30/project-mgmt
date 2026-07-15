'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Copy, Download, History, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QueryHistory {
  id: string;
  query: string;
  variables: string;
  timestamp: Date;
  duration: number;
}

const sampleQueries = [
  {
    name: 'Get All Tasks',
    query: `query GetTasks {
  tasks(limit: 10) {
    id
    title
    status
    priority
    project {
      name
    }
    assignee {
      name
    }
    createdAt
  }
}`,
  },
  {
    name: 'Get Project with Tasks',
    query: `query GetProject($id: String!) {
  project(id: $id) {
    id
    name
    description
    tasks {
      id
      title
      status
      priority
      comments {
        content
        author {
          name
        }
      }
    }
  }
}`,
    variables: `{ "id": "project-1" }`,
  },
  {
    name: 'Dashboard Stats',
    query: `query DashboardStats {
  dashboardStats
}`,
  },
  {
    name: 'Create Task',
    query: `mutation CreateTask($input: TaskCreateInput!) {
  createTask(input: $input) {
    id
    title
    status
  }
}`,
    variables: `{
  "input": {
    "title": "New Task",
    "projectId": "project-1",
    "priority": "high"
  }
}`,
  },
];

export function GraphQLPlayground() {
  const [query, setQuery] = useState(sampleQueries[0].query);
  const [variables, setVariables] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [selectedSample, setSelectedSample] = useState('Get All Tasks');

  const executeQuery = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: variables ? JSON.parse(variables) : undefined,
        }),
      });
      const data = await res.json();
      setResponse(data);
      
      setHistory([{
        id: crypto.randomUUID(),
        query,
        variables,
        timestamp: new Date(),
        duration: Date.now() - startTime,
      }, ...history.slice(0, 9)]);
    } catch (error: any) {
      setResponse({ errors: [{ message: error.message }] });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    toast.success('Copied to clipboard');
  };

  const formatJSON = (str: string) => {
    try { return JSON.stringify(JSON.parse(str), null, 2); }
    catch { return str; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">GraphQL Playground</h1>
          <p className="text-gray-500 text-sm">Explore and test the GraphQL API</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSample} onValueChange={(v) => {
            setSelectedSample(v);
            const sample = sampleQueries.find(s => s.name === v);
            if (sample) { setQuery(sample.query); setVariables(sample.variables || ''); }
          }}>
            <SelectTrigger className="w-48"><BookOpen className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {sampleQueries.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={executeQuery} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Execute
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Query Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm">Query</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="min-h-[300px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
                placeholder="Enter GraphQL query..."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm">Variables (JSON)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={variables}
                onChange={e => setVariables(e.target.value)}
                className="min-h-[100px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
                placeholder='{ "key": "value" }'
              />
            </CardContent>
          </Card>
        </div>

        {/* Response */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm">Response</CardTitle>
            <div className="flex items-center gap-2">
              {response && (
                <>
                  <Badge className={response.errors ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                    {response.errors ? 'Error' : 'Success'}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="w-4 h-4" /></Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <pre className="min-h-[400px] max-h-[600px] overflow-auto bg-gray-50 rounded-lg p-4 text-sm font-mono">
              {response ? JSON.stringify(response, null, 2) : '// Click Execute to run query'}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Query History */}
      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5" />Recent Queries</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(0, 5).map(h => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setQuery(h.query); setVariables(h.variables); }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate">{h.query.split('\n')[0]}</p>
                    <p className="text-xs text-gray-400">{h.timestamp.toLocaleTimeString()} • {h.duration}ms</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}