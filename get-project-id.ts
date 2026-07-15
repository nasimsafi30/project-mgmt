import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function main() {
  const projects = await sql`SELECT id FROM projects LIMIT 1`;
  if (projects.length > 0) {
    console.log(projects[0].id);
  } else {
    const teams = await sql`SELECT id FROM teams LIMIT 1`;
    if (teams.length === 0) {
      await sql`INSERT INTO teams (name) VALUES ('Default')`;
    }
    const t = await sql`SELECT id FROM teams LIMIT 1`;
    const result = await sql`INSERT INTO projects (name, team_id) VALUES ('Default', ${t[0].id}) RETURNING id`;
    console.log(result[0].id);
  }
}
main();
