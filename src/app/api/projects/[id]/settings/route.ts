import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, activityLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/projects/[id]/settings
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db
      .select({ settings: projects.settings })
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      settings: project.settings || {
        defaultView: 'kanban',
        allowComments: true,
        autoAssign: false,
        notifyOnChanges: true,
        requireApproval: false,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/[id]/settings
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const [updated] = await db
      .update(projects)
      .set({ settings: body, updatedAt: new Date() })
      .where(eq(projects.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await db.insert(activityLogs).values({
      action: 'project_settings_updated',
      entityType: 'project',
      entityId: params.id,
      userId: body.updatedBy || 'system',
      metadata: { changes: body },
    });

    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
