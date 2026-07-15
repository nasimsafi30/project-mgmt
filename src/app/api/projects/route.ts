import { NextRequest, NextResponse } from 'next/server';

let projects: any[] = [
  { id: '1', name: 'Website Redesign', description: 'Complete website overhaul', status: 'active', color: '#3B82F6', created_at: new Date().toISOString() },
  { id: '2', name: 'Mobile App', description: 'iOS and Android app', status: 'active', color: '#10B981', created_at: new Date().toISOString() },
  { id: '3', name: 'API Development', description: 'Backend API', status: 'active', color: '#8B5CF6', created_at: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({ data: projects, total: projects.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProject = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description || '',
      status: 'active',
      color: ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444'][Math.floor(Math.random()*5)],
      created_at: new Date().toISOString(),
    };
    projects.unshift(newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
