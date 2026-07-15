import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, activityLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/projects/[id]/archive
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db
      .update(projects)
      .set({ status: 'archived', archivedAt: new Date() })
      .where(eq(projects.id, params.id))
      .returning();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await db.insert(activityLogs).values({
      action: 'project_archived',
      entityType: 'project',
      entityId: params.id,
      userId: 'system',
    });

    return NextResponse.json({ success: true, status: 'archived' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive project' }, { status: 500 });
  }
}
