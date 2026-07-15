import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, projects } from '@/db/schema';
import { count, eq, sql, gte } from 'drizzle-orm';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const projectId = searchParams.get('projectId');

    const [totalTasks] = await db.select({ count: count() }).from(tasks);
    const [completedTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.status, 'done'));
    const [totalProjects] = await db.select({ count: count() }).from(projects);

    const statusDistribution = await db.select({ status: tasks.status, count: count() }).from(tasks).groupBy(tasks.status);
    const priorityDistribution = await db.select({ priority: tasks.priority, count: count() }).from(tasks).groupBy(tasks.priority);

    return NextResponse.json({
      type,
      generatedAt: new Date().toISOString(),
      summary: {
        totalTasks: totalTasks.count,
        completedTasks: completedTasks.count,
        completionRate: totalTasks.count > 0 ? Math.round((completedTasks.count / totalTasks.count) * 100) : 0,
        totalProjects: totalProjects.count,
      },
      statusDistribution,
      priorityDistribution,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
