import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, activityLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const [updated] = await db.update(comments).set({ content: body.content, updatedAt: new Date() }).where(eq(comments.id, params.id)).returning();
    if (!updated) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [deleted] = await db.delete(comments).where(eq(comments.id, params.id)).returning();
    if (!deleted) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    await db.insert(activityLogs).values({ action: 'comment_deleted', entityType: 'comment', entityId: params.id, userId: 'system' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
