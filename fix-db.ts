import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function fix() {
  // 1. Create team
  const teamExists = await sql`SELECT id FROM teams LIMIT 1`;
  let teamId;
  if (teamExists.length === 0) {
    await sql`INSERT INTO teams (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Default Team')`;
    teamId = '00000000-0000-0000-0000-000000000001';
  } else {
    teamId = teamExists[0].id;
  }
  console.log('Team ID:', teamId);

  // 2. Create user
  const userExists = await sql`SELECT id FROM users WHERE id = '00000000-0000-0000-0000-000000000001'`;
  if (userExists.length === 0) {
    await sql`INSERT INTO users (id, clerk_id, email, name) VALUES ('00000000-0000-0000-0000-000000000001', 'system', 'system@projecthub.com', 'System')`;
  }
  console.log('User created');

  // 3. Create project
  const projectExists = await sql`SELECT id FROM projects WHERE id = '00000000-0000-0000-0000-000000000001'`;
  if (projectExists.length === 0) {
    await sql`INSERT INTO projects (id, name, team_id) VALUES ('00000000-0000-0000-0000-000000000001', 'Default Project', ${teamId})`;
  }
  console.log('Project created');

  // 4. Test insert
  const task = await sql`
    INSERT INTO tasks (title, status, priority, project_id, creator_id, position)
    VALUES ('Test Task', 'backlog', 'medium', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 0)
    RETURNING *
  `;
  console.log('✅ Test task created:', task[0].id);
}

fix().catch(err => console.error(err.message));
