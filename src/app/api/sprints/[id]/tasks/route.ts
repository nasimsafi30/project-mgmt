import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ sprintId: params.id, tasks: [] });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ sprintId: params.id, task: body, message: 'Task added to sprint' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add task to sprint' }, { status: 500 });
  }
}
