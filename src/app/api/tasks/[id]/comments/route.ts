import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, activityLogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskComments = await db.select().from(comments).where(eq(comments.taskId, params.id)).orderBy(desc(comments.createdAt));
    return NextResponse.json(taskComments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.content?.trim()) return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    const [newComment] = await db.insert(comments).values({ content: body.content.trim(), taskId: params.id, authorId: body.authorId || 'system' }).returning();
    await db.insert(activityLogs).values({ action: 'comment_added', entityType: 'comment', entityId: newComment.id, userId: body.authorId || 'system', metadata: { taskId: params.id } });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
