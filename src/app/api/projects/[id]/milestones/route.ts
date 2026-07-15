import { NextRequest, NextResponse } from 'next/server';

let milestones: any[] = [
  { id: '1', projectId: 'proj1', name: 'MVP Release', description: 'Minimum viable product launch', dueDate: '2024-03-01', status: 'in_progress', progress: 65 },
  { id: '2', projectId: 'proj1', name: 'Beta Testing', description: 'Internal beta testing phase', dueDate: '2024-02-15', status: 'completed', progress: 100 },
  { id: '3', projectId: 'proj1', name: 'v1.0 Launch', description: 'Public release', dueDate: '2024-04-01', status: 'pending', progress: 0 },
];

/**
 * GET /api/projects/[id]/milestones
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let result = milestones.filter(m => m.projectId === params.id);
  if (status) result = result.filter(m => m.status === status);
  
  return NextResponse.json({ data: result, total: result.length });
}

/**
 * POST /api/projects/[id]/milestones
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'Milestone name is required' }, { status: 400 });

    const newMilestone = {
      id: crypto.randomUUID(),
      projectId: params.id,
      name: body.name,
      description: body.description || '',
      dueDate: body.dueDate || null,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    milestones.push(newMilestone);
    return NextResponse.json(newMilestone, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
