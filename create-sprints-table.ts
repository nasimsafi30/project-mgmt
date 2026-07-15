import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function setup() {
  await sql`
    CREATE TABLE IF NOT EXISTS sprints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      goal TEXT,
      status TEXT DEFAULT 'planning',
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      total_points INTEGER DEFAULT 0,
      completed_points INTEGER DEFAULT 0,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✅ Sprints table ready');
}
setup().catch(e => console.error(e.message));
