import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, activityLogs } from '@/db/schema';
import { count, eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const days = parseInt(period.replace('d', '')) || 30;
    const startDate = subDays(new Date(), days);

    // Task statistics
    const [totalTasks] = await db.select({ count: count() }).from(tasks);
    const [completedTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.status, 'done'));
    const [inProgressTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.status, 'in_progress'));

    // Tasks created per day
    const dailyTasks = await db.select({
      date: sql<string>`DATE(created_at)`,
      count: count(),
    }).from(tasks).where(gte(tasks.createdAt, startDate)).groupBy(sql`DATE(created_at)`).orderBy(sql`DATE(created_at)`);

    // Priority distribution
    const priorityDistribution = await db.select({
      priority: tasks.priority,
      count: count(),
    }).from(tasks).groupBy(tasks.priority);

    // Recent activity
    const recentActivity = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(10);

    return NextResponse.json({
      overview: {
        totalTasks: totalTasks.count,
        completedTasks: completedTasks.count,
        inProgressTasks: inProgressTasks.count,
        completionRate: totalTasks.count > 0 ? Math.round((completedTasks.count / totalTasks.count) * 100) : 0,
      },
      dailyTasks,
      priorityDistribution,
      recentActivity,
      period: { start: startDate, end: new Date() },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

