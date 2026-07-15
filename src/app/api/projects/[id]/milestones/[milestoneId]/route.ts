import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/projects/[id]/milestones/[milestoneId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  return NextResponse.json({
    id: params.milestoneId,
    projectId: params.id,
    name: 'Milestone',
    status: 'in_progress',
    progress: 50,
  });
}

/**
 * PATCH /api/projects/[id]/milestones/[milestoneId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      id: params.milestoneId,
      projectId: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/[id]/milestones/[milestoneId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  return NextResponse.json({ success: true, message: 'Milestone deleted' });
}
