import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, teams, projects, tasks } from '@/db/schema';
import { count, eq, sql } from 'drizzle-orm';

// GET /api/admin - System overview
export async function GET(request: NextRequest) {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [teamCount] = await db.select({ count: count() }).from(teams);
    const [projectCount] = await db.select({ count: count() }).from(projects);
    const [taskCount] = await db.select({ count: count() }).from(tasks);
    
    const taskStatuses = await db.select({
      status: tasks.status,
      count: count(),
    }).from(tasks).groupBy(tasks.status);

    return NextResponse.json({
      stats: {
        users: userCount.count,
        teams: teamCount.count,
        projects: projectCount.count,
        tasks: taskCount.count,
      },
      taskStatuses,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

// PATCH /api/admin - Update system settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    // Update system settings
    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
