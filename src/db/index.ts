import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/dummy';

let sql: any;
let db: any;

try {
  sql = neon(connectionString);
  db = drizzle(sql, { schema });
} catch {
  // Fallback for builds without database
  sql = null;
  db = null;
}

export { db, sql };
export * from './schema';
