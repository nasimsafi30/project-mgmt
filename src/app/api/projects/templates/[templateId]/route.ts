import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/projects/templates/[templateId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  return NextResponse.json({
    id: params.templateId,
    name: 'Template',
    description: 'Project template',
    settings: {},
    tasks: [],
  });
}

/**
 * POST /api/projects/templates/[templateId]
 * Create a project from this template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Project created from template',
      templateId: params.templateId,
      projectName: body.name || 'New Project',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create from template' }, { status: 500 });
  }
}
