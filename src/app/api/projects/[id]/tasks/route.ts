import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, activityLogs } from '@/db/schema';
import { eq, and, or, like, desc, asc, count, inArray } from 'drizzle-orm';

/**
 * GET /api/projects/[id]/tasks
 * Get all tasks for a project with filtering and sorting
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'position';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const groupBy = searchParams.get('groupBy'); // status, priority, assignee

    // Build query
    let query = db.select().from(tasks)
      .where(eq(tasks.projectId, params.id))
      .$dynamic();

    // Apply filters
    if (status) {
      const statuses = status.split(',');
      query = query.where(inArray(tasks.status, statuses as any));
    }
    if (priority) {
      const priorities = priority.split(',');
      query = query.where(inArray(tasks.priority, priorities as any));
    }
    if (assigneeId) {
      query = query.where(eq(tasks.assigneeId, assigneeId));
    }
    if (search) {
      query = query.where(
        or(
          like(tasks.title, `%${search}%`),
          like(tasks.description || '', `%${search}%`)
        )
      );
    }

    // Apply sorting
    const orderFn = sortOrder === 'asc' ? asc : desc;
    query = query.orderBy(orderFn(tasks.position));

    // Get total count
    const [totalCount] = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.projectId, params.id));

    // Execute query
    const taskList = await query.limit(limit).offset(offset);

    // Group if requested
    if (groupBy) {
      const grouped: Record<string, any[]> = {};
      for (const task of taskList) {
        const key = (task as any)[groupBy] || 'unknown';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(task);
      }
      return NextResponse.json({
        data: grouped,
        groupedBy: groupBy,
        total: totalCount.count,
      });
    }

    return NextResponse.json({
      data: taskList,
      total: totalCount.count,
      pagination: { limit, offset, hasMore: (offset + limit) < totalCount.count },
    });
  } catch (error) {
    console.error('Failed to fetch project tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/tasks
 * Create a new task in the project
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    // Get the highest position for the status
    const [lastTask] = await db
      .select()
      .from(tasks)
      .where(and(
        eq(tasks.projectId, params.id),
        eq(tasks.status, body.status || 'backlog')
      ))
      .orderBy(desc(tasks.position))
      .limit(1);

    const [newTask] = await db.insert(tasks).values({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      status: body.status || 'backlog',
      priority: body.priority || 'medium',
      projectId: params.id,
      assigneeId: body.assigneeId || null,
      creatorId: body.creatorId || 'system',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      position: (lastTask?.position || 0) + 1,
      labels: body.labels || [],
      storyPoints: body.storyPoints || null,
      sprintId: body.sprintId || null,
    }).returning();

    // Log activity
    await db.insert(activityLogs).values({
      action: 'task_created',
      entityType: 'task',
      entityId: newTask.id,
      userId: body.creatorId || 'system',
      metadata: {
        projectId: params.id,
        title: newTask.title,
        status: newTask.status,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]/tasks
 * Batch update tasks (reorder, bulk status change, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { taskIds, updates } = body;

    if (!taskIds?.length || !updates) {
      return NextResponse.json(
        { error: 'taskIds and updates are required' },
        { status: 400 }
      );
    }

    // Bulk update
    for (const taskId of taskIds) {
      await db.update(tasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(tasks.id, taskId), eq(tasks.projectId, params.id)));
    }

    await db.insert(activityLogs).values({
      action: 'tasks_bulk_updated',
      entityType: 'task',
      entityId: params.id,
      userId: body.updatedBy || 'system',
      metadata: {
        taskIds,
        updates,
        count: taskIds.length,
      },
    });

    return NextResponse.json({
      success: true,
      updatedCount: taskIds.length,
    });
  } catch (error) {
    console.error('Failed to batch update tasks:', error);
    return NextResponse.json(
      { error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
}
