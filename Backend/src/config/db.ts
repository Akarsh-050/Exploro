import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Create a reusable connection pool using our Neon URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// A helper function to test the connection on startup
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to the Neon PostgreSQL database!');
    const res = await client.query('SELECT NOW()');
    console.log(`🕒 Database timestamp verified: ${res.rows[0].now}`);
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); 
  }
};

// Export the pool so our repositories can import it to execute SQL queries
export default pool;