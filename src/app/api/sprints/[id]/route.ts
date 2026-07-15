import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    if (body.status === 'active') {
      await sql`UPDATE sprints SET status = 'active', started_at = NOW() WHERE id = ${params.id}`;
    } else if (body.status === 'completed') {
      await sql`UPDATE sprints SET status = 'completed', completed_at = NOW(), completed_points = total_points WHERE id = ${params.id}`;
    } else {
      await sql`UPDATE sprints SET name = ${body.name}, goal = ${body.goal} WHERE id = ${params.id}`;
    }
    const result = await sql`SELECT * FROM sprints WHERE id = ${params.id}`;
    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM sprints WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}