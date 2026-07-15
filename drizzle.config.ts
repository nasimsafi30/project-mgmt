import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_ojHVpYvtwI90@ep-solitary-glitter-at7zobxe-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require',
  },
});
