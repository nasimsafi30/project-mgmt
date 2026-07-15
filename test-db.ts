import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('🔌 Testing Neon database connection...\n');
  console.log('Current directory:', process.cwd());
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found!');
    console.log('Environment variables:', Object.keys(process.env).filter(k => k.includes('DATA')));
    return;
  }
  
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connected successfully!');
    console.log('   Server time:', result[0].current_time);
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
