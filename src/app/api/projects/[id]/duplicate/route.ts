import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const [original] = await db.select().from(projects).where(eq(projects.id, params.id)).limit(1);
    if (!original) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const [newProject] = await db.insert(projects).values({
      name: body.name || `${original.name} (Copy)`,
      description: original.description,
      teamId: original.teamId,
    }).returning();

    const originalTasks = await db.select().from(tasks).where(eq(tasks.projectId, params.id));
    for (const task of originalTasks) {
      await db.insert(tasks).values({
        title: task.title,
        description: task.description,
        status: task.status === 'done' ? 'backlog' : task.status,
        priority: task.priority,
        projectId: newProject.id,
        position: task.position || 0,
        creatorId: task.creatorId || '00000000-0000-0000-0000-000000000001',
      });
    }

    return NextResponse.json({ ...newProject, duplicatedTasks: originalTasks.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}