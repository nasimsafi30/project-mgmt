import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attachments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [attachment] = await db.select().from(attachments).where(eq(attachments.id, params.id)).limit(1);
    if (!attachment) return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    return NextResponse.json(attachment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attachment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(attachments).where(eq(attachments.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }
}
