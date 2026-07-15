import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function rollback() {
  console.log('⚠️ Rolling back database...');
  
  // Drop tables in reverse order
  const tables = [
    'webhook_logs', 'webhooks', 'milestones', 'project_labels',
    'integrations', 'notifications', 'time_entries', 'activity_logs',
    'attachments', 'comments', 'tasks', 'sprints',
    'projects', 'team_members', 'teams', 'users'
  ];

  for (const table of tables) {
    try {
      await sql`DROP TABLE IF EXISTS ${sql(table)} CASCADE`;
      console.log(`  ✓ Dropped ${table}`);
    } catch (error) {
      console.log(`  ⚠ Could not drop ${table}`);
    }
  }

  // Drop enums
  const enums = ['priority', 'status', 'project_status', 'member_role', 'sprint_status'];
  for (const e of enums) {
    try {
      await sql`DROP TYPE IF EXISTS ${sql(e)}`;
      console.log(`  ✓ Dropped enum ${e}`);
    } catch (error) {
      console.log(`  ⚠ Could not drop enum ${e}`);
    }
  }

  console.log('✅ Rollback complete');
}

rollback().catch(console.error).finally(() => process.exit(0));