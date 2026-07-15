import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    return NextResponse.json({ data: tasks, total: tasks.length });
  } catch {
    return NextResponse.json({ data: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const result = await sql`
      INSERT INTO tasks (title, description, status, priority, due_date, position)
      VALUES (${body.title}, ${body.description || null}, ${body.status || 'backlog'}, ${body.priority || 'medium'}, ${body.dueDate ? new Date(body.dueDate) : null}, 0)
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}