import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attachments, activityLogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await db.select().from(attachments).where(eq(attachments.taskId, params.id)).orderBy(desc(attachments.createdAt));
    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 });
    
    const [newAttachment] = await db.insert(attachments).values({
      fileName: file.name, fileUrl: URL.createObjectURL(file),
      fileSize: file.size, fileType: file.type,
      taskId: params.id, uploaderId: 'system',
    }).returning();

    await db.insert(activityLogs).values({
      action: 'attachment_added', entityType: 'attachment',
      entityId: newAttachment.id, userId: 'system',
      metadata: { taskId: params.id, fileName: file.name },
    });

    return NextResponse.json(newAttachment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
