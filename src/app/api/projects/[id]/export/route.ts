import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, tasks, comments, attachments } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * GET /api/projects/[id]/export
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeTasks = searchParams.get('includeTasks') !== 'false';
    const includeComments = searchParams.get('includeComments') === 'true';

    const [project] = await db.select().from(projects).where(eq(projects.id, params.id)).limit(1);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const exportData: any = {
      project,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    if (includeTasks) {
      const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, params.id));
      exportData.tasks = projectTasks;
      exportData.taskCount = projectTasks.length;
    }

    if (includeComments && includeTasks) {
      const taskIds = exportData.tasks?.map((t: any) => t.id) || [];
      if (taskIds.length > 0) {
        const projectComments = await db.select().from(comments).where(inArray(comments.taskId, taskIds));
        exportData.comments = projectComments;
      }
    }

    if (format === 'csv') {
      const csvData = convertToCSV(exportData.tasks || []);
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${project.name}-export.csv"`,
        },
      });
    }

    return NextResponse.json(exportData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export project' }, { status: 500 });
  }
}

function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
