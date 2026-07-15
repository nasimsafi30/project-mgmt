import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activityLogs, tasks } from '@/db/schema';
import { eq, desc, or, and, inArray, count } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const projectTasks = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(eq(tasks.projectId, params.id));

    const taskIds = projectTasks.map(t => t.id);

    const query = db.select().from(activityLogs).where(
      or(
        and(eq(activityLogs.entityType, 'project'), eq(activityLogs.entityId, params.id)),
        and(eq(activityLogs.entityType, 'task'), inArray(activityLogs.entityId, taskIds))
      )
    );

    const activities = await query.orderBy(desc(activityLogs.createdAt)).limit(limit);

    return NextResponse.json({ data: activities, total: activities.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}