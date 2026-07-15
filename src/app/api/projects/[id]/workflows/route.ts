import { NextRequest, NextResponse } from 'next/server';

const defaultWorkflow = {
  columns: [
    { id: 'backlog', name: 'Backlog', color: '#6B7280', wipLimit: null },
    { id: 'todo', name: 'To Do', color: '#3B82F6', wipLimit: null },
    { id: 'in_progress', name: 'In Progress', color: '#F59E0B', wipLimit: 5 },
    { id: 'in_review', name: 'In Review', color: '#8B5CF6', wipLimit: 3 },
    { id: 'done', name: 'Done', color: '#10B981', wipLimit: null },
  ],
  transitions: [
    { from: 'backlog', to: 'todo' },
    { from: 'todo', to: 'in_progress' },
    { from: 'in_progress', to: 'in_review' },
    { from: 'in_review', to: 'done' },
    { from: 'in_review', to: 'in_progress' },
    { from: 'done', to: 'in_progress' },
  ],
};

/**
 * GET /api/projects/[id]/workflows
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    projectId: params.id,
    workflow: defaultWorkflow,
  });
}

/**
 * PATCH /api/projects/[id]/workflows
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      projectId: params.id,
      workflow: body,
      message: 'Workflow updated successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}
