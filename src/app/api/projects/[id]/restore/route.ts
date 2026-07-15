import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, activityLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/projects/[id]/restore
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db
      .update(projects)
      .set({ status: 'active', archivedAt: null, restoredAt: new Date() })
      .where(eq(projects.id, params.id))
      .returning();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await db.insert(activityLogs).values({
      action: 'project_restored',
      entityType: 'project',
      entityId: params.id,
      userId: 'system',
    });

    return NextResponse.json({ success: true, status: 'active' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore project' }, { status: 500 });
  }
}
