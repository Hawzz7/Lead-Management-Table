import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';

const { Pool } = pkg;

console.log("DATABASE_URL in db.js:", process.env.DATABASE_URL);
console.log("JWT_SECREt in db.js:", process.env.JWT_SECRET);


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;
