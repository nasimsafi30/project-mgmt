import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, count, and, gte, sql, not, lte } from 'drizzle-orm';
import { subDays } from 'date-fns';

/**
 * GET /api/projects/[id]/statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('days') || '30');

    const startDate = subDays(new Date(), period);

    // Overall stats
    const [totalTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.projectId, params.id));
    const [completedTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.projectId, params.id), eq(tasks.status, 'done')));
    const [inProgressTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.projectId, params.id), eq(tasks.status, 'in_progress')));
    const [overdueTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.projectId, params.id), not(eq(tasks.status, 'done')), lte(tasks.dueDate, new Date())));

    // Daily task creation/completion
    const dailyStats = await db.select({
      date: sql<string>`DATE(created_at)`,
      created: count(),
    }).from(tasks).where(and(eq(tasks.projectId, params.id), gte(tasks.createdAt, startDate))).groupBy(sql`DATE(created_at)`).orderBy(sql`DATE(created_at)`);

    // Priority distribution
    const priorityDist = await db.select({ priority: tasks.priority, count: count() }).from(tasks).where(eq(tasks.projectId, params.id)).groupBy(tasks.priority);

    // Status distribution
    const statusDist = await db.select({ status: tasks.status, count: count() }).from(tasks).where(eq(tasks.projectId, params.id)).groupBy(tasks.status);

    // Assignee workload
    const assigneeWorkload = await db.select({ assigneeId: tasks.assigneeId, count: count() }).from(tasks).where(and(eq(tasks.projectId, params.id), not(eq(tasks.status, 'done')))).groupBy(tasks.assigneeId);

    // Average completion time
    const avgCompletionTime = await db.select({ avgDays: sql<number>`AVG(EXTRACT(DAY FROM (updated_at - created_at)))` }).from(tasks).where(and(eq(tasks.projectId, params.id), eq(tasks.status, 'done')));

    return NextResponse.json({
      overview: {
        total: totalTasks.count,
        completed: completedTasks.count,
        inProgress: inProgressTasks.count,
        overdue: overdueTasks.count,
        completionRate: totalTasks.count > 0 ? Math.round((completedTasks.count / totalTasks.count) * 100) : 0,
        avgCompletionDays: Math.round(avgCompletionTime[0]?.avgDays || 0),
      },
      daily: dailyStats,
      priorityDistribution: priorityDist,
      statusDistribution: statusDist,
      assigneeWorkload,
      period: { days: period, startDate, endDate: new Date() },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
