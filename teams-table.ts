import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function setup() {
  await sql`DROP TABLE IF EXISTS teams CASCADE`;
  await sql`
    CREATE TABLE teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`INSERT INTO teams (name, description) VALUES ('Engineering', 'Dev team'), ('Design', 'UI/UX team')`;
  console.log('✅ Teams table ready');
}
setup().catch(e => console.error(e.message));
