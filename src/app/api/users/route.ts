import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { action, name, email, password } = body;

    if (action === 'register') {
      // Check if user exists
      const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      // Create user
      const result = await sql`
        INSERT INTO users (clerk_id, email, name)
        VALUES (${email}, ${email}, ${name})
        RETURNING *
      `;
      return NextResponse.json({ user: result[0], message: 'Registered successfully' });
    }

    if (action === 'login') {
      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user: users[0], message: 'Login successful' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
