import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Create a SQL connection using the Neon database URL from environment variables
export const sql = neon(process.env.DATABASE_URL);

// Check if the connection is successful
export const initDB = async () => {
    try {
        console.log('Initializing database...');
        await sql`CREATE TABLE IF NOT EXISTS transactions
            (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE,
                updated_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}