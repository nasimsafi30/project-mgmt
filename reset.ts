import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function reset() {
  await sql`DROP TABLE IF EXISTS tasks CASCADE`;
  await sql`
    CREATE TABLE tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'backlog',
      priority TEXT DEFAULT 'medium',
      project_id TEXT,
      assignee_id TEXT,
      creator_id TEXT,
      due_date TIMESTAMP,
      position INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`INSERT INTO tasks (title, status, priority) VALUES ('Welcome Task', 'backlog', 'medium')`;
  console.log('✅ Done');
}
reset().catch(e => console.error(e.message));
