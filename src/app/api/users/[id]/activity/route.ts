import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activityLogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activities = await db.select().from(activityLogs).where(eq(activityLogs.userId, params.id)).orderBy(desc(activityLogs.createdAt)).limit(20);
    return NextResponse.json({ userId: params.id, activities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
