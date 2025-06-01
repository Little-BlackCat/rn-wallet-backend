console.log('Starting Expense Tracker API...');
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rate_limiter.js';

import transactionsRoute from './routes/transactions.route.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(rateLimiter);
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Welcome to the Expense Tracker API');
})

app.use('/api/v1/transactions', transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})