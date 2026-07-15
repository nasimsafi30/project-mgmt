import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const sprints = await sql`SELECT * FROM sprints ORDER BY created_at DESC`;
    return NextResponse.json({ data: sprints, total: sprints.length });
  } catch (error) {
    return NextResponse.json({ data: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const result = await sql`
      INSERT INTO sprints (name, goal, start_date, end_date, total_points, completed_points, status)
      VALUES (${body.name}, ${body.goal || ''}, ${body.startDate}, ${body.endDate}, ${body.totalPoints || 0}, 0, 'planning')
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
