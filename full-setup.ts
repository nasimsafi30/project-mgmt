import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function setup() {
  // Create user if not exists
  let users = await sql`SELECT id FROM users LIMIT 1`;
  if (users.length === 0) {
    await sql`INSERT INTO users (clerk_id, email, name) VALUES ('system', 'system@projecthub.com', 'System')`;
    users = await sql`SELECT id FROM users LIMIT 1`;
  }
  const userId = users[0].id;
  
  // Create team if not exists
  let teams = await sql`SELECT id FROM teams LIMIT 1`;
  if (teams.length === 0) {
    await sql`INSERT INTO teams (name) VALUES ('Default Team')`;
    teams = await sql`SELECT id FROM teams LIMIT 1`;
  }
  const teamId = teams[0].id;
  
  // Create project if not exists
  let projects = await sql`SELECT id FROM projects LIMIT 1`;
  if (projects.length === 0) {
    const result = await sql`INSERT INTO projects (name, team_id) VALUES ('Default Project', ${teamId}) RETURNING id`;
    projects = result;
  }
  const projectId = projects[0].id;
  
  console.log('userId:', userId);
  console.log('teamId:', teamId);
  console.log('projectId:', projectId);
  
  // Test insert a task
  const task = await sql`
    INSERT INTO tasks (title, status, priority, project_id, creator_id, position)
    VALUES ('Test Task', 'backlog', 'medium', ${projectId}, ${userId}, 0)
    RETURNING *
  `;
  console.log('✅ Test task created:', task[0].id, task[0].title);
}

setup().catch(err => console.error('Setup failed:', err.message));
