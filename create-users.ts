import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function setup() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ Users table ready');
}
setup().catch(e => console.error(e.message));
