import express from 'express';
import {
    createTransaction,
    deleteTransaction, 
    getTransactionsByuserid, 
    getTransactionSummary
} from '../controllers/transactions.controller.js';

const router = express.Router();

router.get('/:userId', getTransactionsByuserid)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)
router.get('/summary/:userId', getTransactionSummary)

export default router;