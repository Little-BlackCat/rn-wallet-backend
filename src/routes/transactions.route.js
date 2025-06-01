import express from 'express';
import {
    createTransaction,
    deleteTransaction, 
    getTransactionsByUserid, 
    getTransactionSummary
} from '../controllers/transactions.controller.js';

const router = express.Router();

router.get('/:userId', getTransactionsByUserid)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)
router.get('/summary/:userId', getTransactionSummary)

export default router;