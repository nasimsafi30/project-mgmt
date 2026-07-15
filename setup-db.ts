import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function setup() {
  // Check for existing projects
  let projects = await sql`SELECT * FROM projects LIMIT 1`;
  
  if (projects.length === 0) {
    // Check if teams exist
    let teams = await sql`SELECT * FROM teams LIMIT 1`;
    
    if (teams.length === 0) {
      // Create a default team
      await sql`INSERT INTO teams (name, description) VALUES ('Default Team', 'Auto-created default team')`;
      teams = await sql`SELECT * FROM teams LIMIT 1`;
      console.log('Created team:', teams[0].id);
    }
    
    // Create a default project
    const result = await sql`
      INSERT INTO projects (name, description, team_id) 
      VALUES ('Default Project', 'Auto-created default project', ${teams[0].id})
      RETURNING id, name
    `;
    console.log('Created project:', result[0].id, result[0].name);
    projects = result;
  }
  
  console.log('Project ID to use:', projects[0].id);
  
  // Update the API to use this real project ID
  console.log('\n✅ Run this command to update the API:');
  console.log(`Copy this ID: ${projects[0].id}`);
}

setup();
