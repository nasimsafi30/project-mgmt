import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attachments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    let query = db.select().from(attachments).$dynamic();
    if (taskId) query = query.where(eq(attachments.taskId, taskId));
    
    const result = await query.orderBy(desc(attachments.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('taskId') as string;
    const uploaderId = formData.get('uploaderId') as string;
    
    if (!file || !taskId) {
      return NextResponse.json({ error: 'File and taskId are required' }, { status: 400 });
    }
    
    // In production, upload to S3/UploadThing
    const fileUrl = URL.createObjectURL(file);
    
    const [newAttachment] = await db.insert(attachments).values({
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      fileType: file.type,
      taskId,
      uploaderId: uploaderId || 'system',
    }).returning();
    
    return NextResponse.json(newAttachment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload attachment' }, { status: 500 });
  }
}
