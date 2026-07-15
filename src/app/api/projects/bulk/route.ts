import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, activityLogs } from '@/db/schema';
import { inArray } from 'drizzle-orm';

/**
 * PATCH /api/projects/bulk
 * Bulk update projects
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectIds, action, data } = body;

    if (!projectIds?.length || !action) {
      return NextResponse.json(
        { error: 'projectIds and action are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'archive':
        await db.update(projects)
          .set({ status: 'archived', archivedAt: new Date() })
          .where(inArray(projects.id, projectIds));
        break;
      case 'restore':
        await db.update(projects)
          .set({ status: 'active', archivedAt: null })
          .where(inArray(projects.id, projectIds));
        break;
      case 'delete':
        await db.delete(projects).where(inArray(projects.id, projectIds));
        break;
      case 'update':
        if (data) {
          await db.update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(inArray(projects.id, projectIds));
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.insert(activityLogs).values({
      action: `projects_bulk_${action}`,
      entityType: 'project',
      entityId: 'bulk',
      userId: body.updatedBy || 'system',
      metadata: { projectIds, count: projectIds.length, action },
    });

    return NextResponse.json({
      success: true,
      affectedCount: projectIds.length,
      action,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process bulk action' },
      { status: 500 }
    );
  }
}
