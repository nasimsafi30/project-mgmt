import { NextRequest, NextResponse } from 'next/server';

let projects: any[] = [];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    projects = projects.map(p => p.id === params.id ? { ...p, ...body } : p);
    const updated = projects.find(p => p.id === params.id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  projects = projects.filter(p => p.id !== params.id);
  return NextResponse.json({ success: true });
}