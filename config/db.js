import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Create a SQL connection using the Neon database URL from environment variables
export const sql = neon(process.env.DATABASE_URL);