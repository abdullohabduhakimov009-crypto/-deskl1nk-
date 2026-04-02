
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function testSql() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const result = await (sql as any)('SELECT $1 as test', ['hello']);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testSql();
