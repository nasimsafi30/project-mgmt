import { NextRequest, NextResponse } from 'next/server';

const defaultLabels = [
  { id: '1', name: 'bug', color: '#EF4444', description: 'Something is broken' },
  { id: '2', name: 'feature', color: '#3B82F6', description: 'New feature request' },
  { id: '3', name: 'improvement', color: '#10B981', description: 'Enhancement to existing feature' },
  { id: '4', name: 'documentation', color: '#8B5CF6', description: 'Documentation updates' },
  { id: '5', name: 'design', color: '#F59E0B', description: 'Design related tasks' },
  { id: '6', name: 'urgent', color: '#DC2626', description: 'Needs immediate attention' },
  { id: '7', name: 'help-wanted', color: '#06B6D4', description: 'Extra attention needed' },
  { id: '8', name: 'question', color: '#EC4899', description: 'Further information needed' },
];

/**
 * GET /api/projects/[id]/labels
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    projectId: params.id,
    labels: defaultLabels,
    total: defaultLabels.length,
  });
}

/**
 * POST /api/projects/[id]/labels
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'Label name is required' }, { status: 400 });

    const newLabel = {
      id: crypto.randomUUID(),
      name: body.name,
      color: body.color || '#6B7280',
      description: body.description || '',
    };

    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}
