'use client';
import React, { useState, useEffect } from 'react';
import { ActivityTimeline } from './ActivityTimeline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ActivityFeed({ projectId }: { projectId?: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const url = projectId ? `/api/activity?entityType=project&entityId=${projectId}` : '/api/activity';
      const res = await fetch(url);
      if (res.ok) setActivities(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchActivities(); }, [projectId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activity</h3>
        <Button variant="ghost" size="sm" onClick={fetchActivities} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />Refresh
        </Button>
      </div>
      <ActivityTimeline activities={activities} />
    </div>
  );
}

