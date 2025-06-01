import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rate_limiter.js';
import job from './config/cron.js';

import transactionsRoute from './routes/transactions.route.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
})

if(process.env.NODE_ENV === 'production') job.start(); // Start the cron job only in production

// Middleware
app.use(rateLimiter);
app.use(express.json());

app.use('/api/v1/transactions', transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})