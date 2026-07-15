import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function setup() {
  // Drop if exists to recreate cleanly
  await sql`DROP TABLE IF EXISTS sprints CASCADE`;
  await sql`
    CREATE TABLE sprints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      goal TEXT DEFAULT '',
      status TEXT DEFAULT 'planning',
      start_date TIMESTAMPTZ NOT NULL,
      end_date TIMESTAMPTZ NOT NULL,
      total_points INTEGER DEFAULT 0,
      completed_points INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Insert a test sprint
  await sql`
    INSERT INTO sprints (name, goal, start_date, end_date, total_points)
    VALUES ('Test Sprint', 'Test goal', NOW(), NOW() + INTERVAL '14 days', 30)
  `;
  console.log('✅ Sprints table created with test data');
}
setup().catch(e => console.error(e.message));
