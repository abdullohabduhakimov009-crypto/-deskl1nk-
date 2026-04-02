
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
  const sql = neon(process.env.DATABASE_URL!);
  const email = 'abdulloh123abdu123hakimov009@gmail.com';
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    console.log("Users found:", JSON.stringify(result, null, 2));
    
    const allUsers = await sql`SELECT email FROM users LIMIT 10`;
    console.log("Sample users:", JSON.stringify(allUsers, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkUser();
