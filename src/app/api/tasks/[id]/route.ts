import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    if (body.status) {
      await sql`UPDATE tasks SET status = ${body.status}, updated_at = NOW() WHERE id = ${params.id}`;
    }
    const result = await sql`SELECT * FROM tasks WHERE id = ${params.id}`;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM tasks WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}