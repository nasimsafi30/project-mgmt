import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function setup() {
  await sql`DROP TABLE IF EXISTS time_entries CASCADE`;
  await sql`
    CREATE TABLE time_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_title TEXT NOT NULL,
      description TEXT DEFAULT '',
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ,
      duration INTEGER DEFAULT 0,
      billable BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ Time entries table ready');
}
setup().catch(e => console.error(e.message));
