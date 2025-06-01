import express from 'express';
import dotenv, { parse } from 'dotenv';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rate_limiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(rateLimiter);
app.use(express.json());

const initDB = async () => {
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

app.get('/api/v1/transactions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId}
            ORDER BY created_at DESC
        ;`;
        console.log('Transactions retrieved:', transactions);
        return res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/v1/transactions', async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;
        if (!title || !amount || !category || !user_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const transactions = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        ;`;
        console.log('Transaction created:', transactions);
        return res.status(201).json(transactions[0]);

    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/api/v1/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Invalid transaction ID' });
        }

        if (!id) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *
        ;`;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        console.log('Transaction deleted successfully');
        return res.status(200).json({ message: 'Transaction deleted successfully'});

    } catch (error) {
        console.error('Error deleting transaction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/api/v1/transactions/summary/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const balanceReault = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        ;`

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        ;`

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        ;`

        let response = {
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
            balance: balanceReault[0].balance,
        };

        console.log('Transaction summary retrieved:', response);
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching transaction summary:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})