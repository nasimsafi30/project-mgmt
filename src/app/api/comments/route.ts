import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, activityLogs } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const authorId = searchParams.get('authorId');
    
    let query = db.select().from(comments).$dynamic();
    if (taskId) query = query.where(eq(comments.taskId, taskId));
    if (authorId) query = query.where(eq(comments.authorId, authorId));
    
    const result = await query.orderBy(desc(comments.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
