
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const columns = await sql`SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public'`;
    console.log("Users columns:", JSON.stringify(columns, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkSchema();
