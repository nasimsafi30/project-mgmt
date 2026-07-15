import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const entries = await sql`SELECT * FROM time_entries ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json({ data: entries, total: entries.length });
  } catch (error) {
    return NextResponse.json({ data: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    
    const result = await sql`
      INSERT INTO time_entries (task_title, description, start_time, end_time, duration, billable)
      VALUES (${body.taskTitle}, ${body.description || ''}, NOW(), NOW(), ${body.duration || 0}, true)
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
