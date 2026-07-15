import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function update() {
  await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS project_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS task_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6'`;
  await sql`UPDATE teams SET member_count = 5, project_count = 3, task_count = 12`;
  console.log('✅ Teams table updated with stats');
}
update().catch(e => console.error(e.message));
