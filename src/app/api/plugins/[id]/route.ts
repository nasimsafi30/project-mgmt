import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, name: 'Plugin', version: '1.0.0', enabled: true });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ id: params.id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plugin' }, { status: 500 });
  }
}
